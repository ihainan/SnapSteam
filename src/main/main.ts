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

interface SteamUser {
  id: number;
  name: string;
  avatar: string | null;
}

interface SteamGame {
  id: number;
  name: string;
  coverUrl: string;
  favorite: boolean;
  userId: number;
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
ipcMain.handle('set-store-value', (_: any, { key, value }: { key: keyof AppSettings; value: AppSettings[keyof AppSettings] }) => {
  store.set(key, value);
  return true;
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

// 获取 Steam 用户列表
ipcMain.handle('get-steam-users', async () => {
  try {
    const steamPath = store.get('steamPath') as string;
    const userDataPath = path.join(steamPath, 'userdata');
    
    if (!fs.existsSync(userDataPath)) {
      return [];
    }

    const users: SteamUser[] = [];
    const userDirs = fs.readdirSync(userDataPath);
    
    for (const userId of userDirs) {
      if (!/^\d+$/.test(userId)) continue;
      
      const userConfigPath = path.join(userDataPath, userId, 'config', 'localconfig.vdf');
      if (!fs.existsSync(userConfigPath)) continue;
      
      // 读取用户配置
      const configContent = fs.readFileSync(userConfigPath, 'utf-8');
      const nameMatch = configContent.match(/PersonaName"\s+"([^"]+)"/);
      const avatarMatch = configContent.match(/avatar"\s+"([^"]+)"/);
      
      // 尝试获取头像 URL
      let avatarUrl = null;
      if (avatarMatch) {
        const avatarHash = avatarMatch[1];
        avatarUrl = `https://avatars.steamstatic.com/${avatarHash}_full.jpg`;
      }
      
      users.push({
        id: parseInt(userId),
        name: nameMatch ? nameMatch[1] : `用户 ${userId}`,
        avatar: avatarUrl
      });
    }
    
    return users;
  } catch (error) {
    console.error('Error getting Steam users:', error);
    return [];
  }
});

// 获取用户的游戏库
ipcMain.handle('get-user-games', async (_: any, userId: number) => {
  try {
    const steamPath = store.get('steamPath') as string;
    const userDataPath = path.join(steamPath, 'userdata', userId.toString());
    const games: SteamGame[] = [];
    
    // 读取游戏库文件
    const libraryFoldersPath = path.join(steamPath, 'steamapps', 'libraryfolders.vdf');
    if (!fs.existsSync(libraryFoldersPath)) return [];
    
    const libraryContent = fs.readFileSync(libraryFoldersPath, 'utf-8');
    const libraryPaths = libraryContent.match(/path"\s+"([^"]+)"/g)?.map((match: string) => 
      match.match(/path"\s+"([^"]+)"/)?.[1]
    ) || [];
    
    // 读取每个库文件夹中的游戏
    for (const libraryPath of libraryPaths) {
      if (!libraryPath) continue;
      
      const appManifestPath = path.join(libraryPath, 'steamapps');
      if (!fs.existsSync(appManifestPath)) continue;
      
      const appManifests = fs.readdirSync(appManifestPath)
        .filter((file: string) => file.startsWith('appmanifest_') && file.endsWith('.acf'));
      
      for (const manifest of appManifests) {
        const manifestPath = path.join(appManifestPath, manifest);
        const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
        
        const appIdMatch = manifestContent.match(/appid"\s+"(\d+)"/);
        const nameMatch = manifestContent.match(/name"\s+"([^"]+)"/);
        
        if (appIdMatch && nameMatch) {
          const appId = parseInt(appIdMatch[1]);
          const name = nameMatch[1];
          
          // 检查游戏是否在收藏夹中
          const favoritesPath = path.join(userDataPath, 'config', 'shortcuts.vdf');
          let isFavorite = false;
          
          if (fs.existsSync(favoritesPath)) {
            const favoritesContent = fs.readFileSync(favoritesPath, 'utf-8');
            isFavorite = favoritesContent.includes(`appid=${appId}`);
          }
          
          games.push({
            id: appId,
            name,
            coverUrl: `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`,
            favorite: isFavorite,
            userId
          });
        }
      }
    }
    
    return games;
  } catch (error) {
    console.error('Error getting user games:', error);
    return [];
  }
});

// 获取游戏的截图
ipcMain.handle('get-game-screenshots', async (_: any, gameId: number, userId: number) => {
  try {
    const steamPath = store.get('steamPath') as string;
    const screenshotsPath = path.join(steamPath, 'userdata', userId.toString(), '760', 'remote', gameId.toString(), 'screenshots');
    
    console.log('Looking for screenshots in:', screenshotsPath);
    
    if (!fs.existsSync(screenshotsPath)) {
      console.log('Screenshots directory does not exist');
      return [];
    }

    const screenshots: any[] = [];
    const files = fs.readdirSync(screenshotsPath);
    
    console.log('Found files:', files);
    
    for (const file of files) {
      if (file.endsWith('.jpg')) {
        const filePath = path.join(screenshotsPath, file);
        const stats = fs.statSync(filePath);
        
        // 检查文件是否可读
        try {
          fs.accessSync(filePath, fs.constants.R_OK);
          screenshots.push({
            id: file,
            url: `file://${filePath}`,
            timestamp: stats.mtime.toISOString()
          });
        } catch (error) {
          console.error(`Cannot read file ${filePath}:`, error);
        }
      }
    }
    
    console.log('Found screenshots:', screenshots.length);
    return screenshots;
  } catch (error) {
    console.error('Error getting game screenshots:', error);
    return [];
  }
});

// 更新 Steam 的 screenshots.vdf 文件
function updateScreenshotsVdf(steamPath: string, userId: number, gameId: number, newScreenshots: { id: string, timestamp: string }[]) {
  try {
    const vdfPath = path.join(steamPath, 'userdata', userId.toString(), '760', 'remote', gameId.toString(), 'screenshots.vdf');
    console.log('Updating VDF file at:', vdfPath);
    
    // 生成新的 VDF 内容
    let newVdfContent = '"screenshots"\n{\n';
    
    // 添加新的截图
    for (const screenshot of newScreenshots) {
      const id = screenshot.id.split('_')[0]; // 使用时间戳作为 ID
      const unixTimestamp = Math.floor(new Date(screenshot.timestamp).getTime() / 1000).toString();
      const newFileName = screenshot.id.replace('.jpeg', '.jpg');
      
      console.log('Adding new screenshot:', id, screenshot);
      
      newVdfContent += `\t"${id}"\n\t{\n`;
      newVdfContent += `\t\t"type"\t\t"1"\n`;
      newVdfContent += `\t\t"filename"\t\t"${newFileName}"\n`;
      newVdfContent += `\t\t"thumbnail"\t\t"${newFileName}"\n`;  // 使用原图作为缩略图
      newVdfContent += `\t\t"vrfilename"\t\t""\n`;
      newVdfContent += `\t\t"imported"\t\t"1"\n`;
      newVdfContent += `\t\t"width"\t\t"1920"\n`;
      newVdfContent += `\t\t"height"\t\t"1080"\n`;
      newVdfContent += `\t\t"gameid"\t\t"${gameId}"\n`;
      newVdfContent += `\t\t"creation"\t\t"${unixTimestamp}"\n`;
      newVdfContent += `\t\t"caption"\t\t""\n`;
      newVdfContent += `\t\t"Permissions"\t\t"2"\n`;
      newVdfContent += `\t\t"hscreenshot"\t\t"0"\n`;
      newVdfContent += '\t}\n';
    }
    
    newVdfContent += '}\n';

    console.log('New VDF content:', newVdfContent);

    // 写入文件
    fs.writeFileSync(vdfPath, newVdfContent);
    console.log('VDF file updated successfully');
  } catch (error) {
    console.error('Error updating screenshots.vdf:', error);
    throw error;
  }
}

// 修改导入图片到 Steam 目录的函数
ipcMain.handle('import-screenshots', async (_: any, { gameId, userId, files }: { gameId: number, userId: number, files: string[] }) => {
  try {
    const steamPath = store.get('steamPath') as string;
    console.log('Steam path:', steamPath);
    
    const screenshotsPath = path.join(steamPath, 'userdata', userId.toString(), '760', 'remote', gameId.toString(), 'screenshots');
    console.log('Screenshots path:', screenshotsPath);
    
    // 确保截图目录存在
    if (!fs.existsSync(screenshotsPath)) {
      console.log('Creating screenshots directory');
      fs.mkdirSync(screenshotsPath, { recursive: true });
    }

    const importedFiles = [];
    
    for (const file of files) {
      const fileName = path.basename(file);
      const timestamp = new Date().getTime();
      const newFileName = `${timestamp}_${fileName.replace('.jpeg', '.jpg')}`;
      const targetPath = path.join(screenshotsPath, newFileName);
      
      console.log('Copying file:', file, 'to:', targetPath);
      
      // 复制文件到 Steam 截图目录
      fs.copyFileSync(file, targetPath);
      
      // 设置文件权限
      try {
        fs.chmodSync(targetPath, 0o644);
      } catch (error) {
        console.error('Error setting file permissions:', error);
      }
      
      importedFiles.push({
        id: newFileName,
        url: `file://${targetPath}`,
        timestamp: new Date().toISOString()
      });
    }

    // 更新 screenshots.vdf 文件
    updateScreenshotsVdf(steamPath, userId, gameId, importedFiles);
    
    return importedFiles;
  } catch (error) {
    console.error('Error importing screenshots:', error);
    throw error;
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