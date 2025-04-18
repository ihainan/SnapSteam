const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const Store = require('electron-store');

interface AppSettings {
  themeMode: 'light' | 'dark' | 'system';
  language: 'zh' | 'en';
  steamPath: string;
  currentUserId: number;
}

interface RenderProcessGoneDetails {
  reason: string;
  exitCode: number;
}

// 创建配置存储实例
const store = new Store({
  defaults: {
    themeMode: 'system',
    language: 'en',
    steamPath: process.platform === 'darwin'
      ? '~/Library/Application Support/Steam'
      : process.platform === 'win32'
        ? 'C:\\Program Files (x86)\\Steam'
        : '~/.local/share/Steam',
    currentUserId: 1  // 默认选择第一个用户
  }
});

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, '../../logo.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  mainWindow.loadFile(path.join(__dirname, '../index.html'));
  
  // 开发环境下打开开发者工具
  mainWindow.webContents.openDevTools();

  // 监听渲染进程错误
  mainWindow.webContents.on('render-process-gone', (event: Electron.Event, details: RenderProcessGoneDetails) => {
    console.error('Renderer process gone:', details);
  });

  mainWindow.webContents.on('crashed', () => {
    console.error('Renderer process crashed');
  });
}

// 获取配置值
ipcMain.handle('get-store-value', (_: any, key: keyof AppSettings) => {
  if (key === 'language') {
    const language = store.get(key);
    // 确保返回的语言值是 'zh' 或 'en'
    if (typeof language === 'string') {
      return language.startsWith('zh') ? 'zh' : 'en';
    }
    return 'en';
  }
  return store.get(key);
});

// 设置配置值
ipcMain.on('set-store-value', (_: any, { key, value }: { key: keyof AppSettings; value: AppSettings[keyof AppSettings] }) => {
  store.set(key, value);
});

// 处理打开文件夹对话框的请求
ipcMain.handle('open-directory-dialog', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    title: '选择 Steam 安装路径',
    buttonLabel: '选择'
  });
  return result;
});

// 验证 Steam 用户数据目录
ipcMain.handle('validate-steam-path', async (_: any, steamPath: string) => {
  try {
    // 检查路径是否存在
    if (!fs.existsSync(steamPath)) {
      return false;
    }

    const platform = process.platform;
    
    if (platform === 'darwin') {
      // macOS 上的验证逻辑
      // 检查是否是 Steam 数据目录
      const isDataDir = fs.existsSync(path.join(steamPath, 'userdata')) &&
                       fs.existsSync(path.join(steamPath, 'steamapps'));
      
      return isDataDir;
    } else {
      // Windows 和 Linux 上的验证逻辑
      // 检查是否是 userdata 目录
      const isUserDataDir = fs.existsSync(path.join(steamPath, 'userdata')) ||
                          (fs.existsSync(steamPath) && 
                           fs.readdirSync(steamPath).some((dir: string) => 
                             fs.statSync(path.join(steamPath, dir)).isDirectory() && 
                             /^\d+$/.test(dir)
                           ));
      
      return isUserDataDir;
    }
  } catch (error) {
    console.error('Error validating Steam path:', error);
    return false;
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
}); 