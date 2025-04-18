import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

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
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

// 处理打开文件夹对话框的请求
ipcMain.handle('open-directory-dialog', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    title: '选择 Steam 安装路径',
    buttonLabel: '选择'
  });
  return result;
});

// 验证 Steam 安装路径
ipcMain.handle('validate-steam-path', async (_, steamPath: string) => {
  try {
    // 检查路径是否存在
    if (!fs.existsSync(steamPath)) {
      return false;
    }

    // 检查是否是 Steam 安装路径
    const platform = process.platform;
    
    if (platform === 'darwin') {
      // macOS 上的验证逻辑
      // 检查是否是 Steam 数据目录
      const isDataDir = fs.existsSync(path.join(steamPath, 'steamapps')) &&
                       fs.existsSync(path.join(steamPath, 'userdata'));
      
      // 检查是否是 Steam 应用程序
      const isAppDir = steamPath.endsWith('Steam.app') && 
                      fs.existsSync(path.join(steamPath, 'Contents', 'MacOS', 'steam'));
      
      return isDataDir || isAppDir;
    } else {
      // Windows 和 Linux 的验证逻辑
      const requiredFiles = {
        win32: ['steam.exe', 'steamapps'],
        linux: ['steam', 'steamapps']
      };

      const files = requiredFiles[platform as keyof typeof requiredFiles];
      if (!files) return false;

      // 检查所有必需的文件/文件夹是否存在
      return files.every(file => {
        const fullPath = path.join(steamPath, file);
        return fs.existsSync(fullPath);
      });
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