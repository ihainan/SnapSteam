const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const Store = require('electron-store');
const Jimp = require('jimp');
const { exec } = require('child_process');
const { promisify } = require('util');
const axios = require('axios');
const { createHash } = require('crypto');

interface AppSettings {
  themeMode: 'light' | 'dark' | 'system';
  language: 'zh' | 'en';
  steamPath: string;
  currentUserId: number;
  windowBounds: {
    width: number;
    height: number;
    x: number;
    y: number;
    isMaximized: boolean;
  };
}

interface SteamUser {
  id: number;
  name: string;
  avatar: string | null;
}

interface Game {
  id: number;
  name: string;
  coverUrl: string;
  cachedCoverUrl?: string;
  favorite: boolean;
  userId: number;
  lastPlayed?: number;  // 添加最后游玩时间字段
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
    currentUserId: 1,  // 默认选择第一个用户
    windowBounds: {
      width: 1200,
      height: 800,
      x: undefined,
      y: undefined,
      isMaximized: false
    }
  }
});

function createWindow() {
  // 获取保存的窗口位置和大小
  const windowBounds = store.get('windowBounds') as AppSettings['windowBounds'];
  
  const mainWindow = new BrowserWindow({
    width: windowBounds.width,
    height: windowBounds.height,
    x: windowBounds.x,
    y: windowBounds.y,
    icon: process.platform === 'win32' 
      ? path.join(__dirname, '../../icons/win_icon.png')
      : path.join(__dirname, '../../icons/mac-icon.png'),
    frame: process.platform === 'darwin',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'hidden',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  // 如果上次是最大化状态，则最大化窗口
  if (windowBounds.isMaximized) {
    mainWindow.maximize();
  }

  // 移除菜单栏
  mainWindow.setMenuBarVisibility(false);

  mainWindow.loadFile(path.join(__dirname, '../index.html'));
  
  // 监听渲染进程错误
  mainWindow.webContents.on('render-process-gone', (event: Electron.Event, details: RenderProcessGoneDetails) => {
    console.error('Renderer process gone:', details);
  });

  mainWindow.webContents.on('crashed', () => {
    console.error('Renderer process crashed');
  });

  // 处理窗口控制命令
  ipcMain.on('window-control', (_: Electron.IpcMainEvent, command: string) => {
    switch (command) {
      case 'minimize':
        mainWindow.minimize();
        break;
      case 'maximize':
        if (mainWindow.isMaximized()) {
          mainWindow.unmaximize();
        } else {
          mainWindow.maximize();
        }
        break;
      case 'close':
        mainWindow.close();
        break;
    }
  });

  // 处理窗口状态查询
  ipcMain.handle('is-maximized', () => {
    return mainWindow.isMaximized();
  });

  // 监听窗口最大化状态变化
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window-state-changed');
    const bounds = mainWindow.getBounds();
    store.set('windowBounds', {
      ...bounds,
      isMaximized: true
    });
  });

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window-state-changed');
    const bounds = mainWindow.getBounds();
    store.set('windowBounds', {
      ...bounds,
      isMaximized: false
    });
  });

  // 保存窗口位置和大小
  mainWindow.on('close', () => {
    const bounds = mainWindow.getBounds();
    store.set('windowBounds', {
      width: bounds.width,
      height: bounds.height,
      x: bounds.x,
      y: bounds.y,
      isMaximized: mainWindow.isMaximized()
    });
  });

  // 添加窗口移动和调整大小时的监听器
  mainWindow.on('move', () => {
    if (!mainWindow.isMaximized()) {
      const bounds = mainWindow.getBounds();
      store.set('windowBounds', {
        ...bounds,
        isMaximized: false
      });
    }
  });

  mainWindow.on('resize', () => {
    if (!mainWindow.isMaximized()) {
      const bounds = mainWindow.getBounds();
      store.set('windowBounds', {
        ...bounds,
        isMaximized: false
      });
    }
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
    console.log(`[Game Library] 开始加载用户 ${userId} 的游戏库`);
    const steamPath = store.get('steamPath') as string;
    const userDataPath = path.join(steamPath, 'userdata', userId.toString());
    const games: Game[] = [];
    
    // 读取用户的本地配置
    const localConfigPath = path.join(userDataPath, 'config', 'localconfig.vdf');
    if (!fs.existsSync(localConfigPath)) return [];
    
    const localConfigContent = fs.readFileSync(localConfigPath, 'utf-8');
    
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
          
          // 使用更精确的方式解析最后游玩时间
          const lastPlayedPattern = new RegExp(`"${appId}"\\s*{[^}]*"LastPlayed"\\s*"(\\d+)"[^}]*}`, 'g');
          const lastPlayedMatches = localConfigContent.match(lastPlayedPattern);
          
          if (lastPlayedMatches && lastPlayedMatches.length > 0) {
            const lastPlayedMatch = lastPlayedMatches[0].match(/"LastPlayed"\s*"(\d+)"/);
            const lastPlayed = lastPlayedMatch ? parseInt(lastPlayedMatch[1]) : 0;
            
            if (lastPlayed > 0) {
              // 检查游戏是否在收藏夹中
              const favoritesPath = path.join(userDataPath, 'config', 'shortcuts.vdf');
              let isFavorite = false;
              
              if (fs.existsSync(favoritesPath)) {
                const favoritesContent = fs.readFileSync(favoritesPath, 'utf-8');
                isFavorite = favoritesContent.includes(`appid=${appId}`);
              }
              
              const coverUrl = `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;
              const cachedCoverPath = getCachedCoverPath(appId);
              const isCached = fs.existsSync(cachedCoverPath);
              
              console.log(`[Game Library] 游戏 ${appId} (${name}) 封面状态: ${isCached ? '已缓存' : '未缓存'}`);
              
              games.push({
                id: appId,
                name,
                coverUrl,
                cachedCoverUrl: isCached ? `file://${cachedCoverPath}` : undefined,
                favorite: isFavorite,
                userId,
                lastPlayed
              });
            }
          }
        }
      }
    }
    
    console.log(`[Game Library] 成功加载用户 ${userId} 的游戏库，共 ${games.length} 个游戏`);
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
    
    // 读取现有的 VDF 文件内容
    let existingContent = '';
    if (fs.existsSync(vdfPath)) {
      existingContent = fs.readFileSync(vdfPath, 'utf-8');
    }
    
    // 解析现有的截图信息
    const existingScreenshots = new Map<string, string>();
    const screenshotRegex = /"(\d+)"\s*{([^}]*)}/g;
    let match;
    
    while ((match = screenshotRegex.exec(existingContent)) !== null) {
      const id = match[1];
      const content = match[2];
      existingScreenshots.set(id, content);
    }
    
    // 生成新的 VDF 内容
    let newVdfContent = '"screenshots"\n{\n';
    
    // 添加现有的截图
    for (const [id, content] of existingScreenshots) {
      newVdfContent += `\t"${id}"\n\t{\n${content}\n\t}\n`;
    }
    
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
      
      console.log('Processing file:', file);
      
      try {
        // 使用 jimp 处理图片
        const image = await Jimp.read(file);
        const metadata = {
          width: image.bitmap.width,
          height: image.bitmap.height
        };
        
        // Steam 截图的最大尺寸和文件大小限制
        const MAX_WIDTH = 3840;
        const MAX_HEIGHT = 2160;
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
        
        // 如果图片尺寸超过限制，进行缩放
        if (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT) {
          image.resize(
            Math.min(metadata.width, MAX_WIDTH),
            Math.min(metadata.height, MAX_HEIGHT),
            Jimp.RESIZE_BEZIER
          );
        }
        
        // 如果文件大小超过限制，进行压缩
        let quality = 90;
        let buffer = await image.quality(quality).getBufferAsync(Jimp.MIME_JPEG);
        
        while (buffer.length > MAX_FILE_SIZE && quality > 10) {
          quality -= 10;
          buffer = await image.quality(quality).getBufferAsync(Jimp.MIME_JPEG);
        }
        
        // 保存处理后的图片
        await fs.promises.writeFile(targetPath, buffer);
        
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
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
        // 如果处理失败，尝试直接复制原文件
        try {
          fs.copyFileSync(file, targetPath);
          importedFiles.push({
            id: newFileName,
            url: `file://${targetPath}`,
            timestamp: new Date().toISOString()
          });
        } catch (copyError) {
          console.error(`Error copying file ${file}:`, copyError);
        }
      }
    }

    // 更新 screenshots.vdf 文件
    updateScreenshotsVdf(steamPath, userId, gameId, importedFiles);
    
    return importedFiles;
  } catch (error) {
    console.error('Error importing screenshots:', error);
    throw error;
  }
});

// 获取应用版本
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

// 获取游戏封面缓存目录
function getCoverCacheDir() {
  const cacheDir = path.join(app.getPath('userData'), 'covers');
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  return cacheDir;
}

// 获取缓存的封面图片路径
function getCachedCoverPath(gameId: number) {
  return path.join(getCoverCacheDir(), `${gameId}.jpg`);
}

// 检查封面是否已缓存
function isCoverCached(gameId: number) {
  const cachePath = getCachedCoverPath(gameId);
  return fs.existsSync(cachePath);
}

// 缓存封面图片
async function cacheCover(gameId: number, imageUrl: string) {
  try {
    console.log(`[Cover Cache] 开始下载游戏 ${gameId} 的封面`);
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const cachePath = getCachedCoverPath(gameId);
    await fs.promises.writeFile(cachePath, response.data);
    console.log(`[Cover Cache] 成功缓存游戏 ${gameId} 的封面到: ${cachePath}`);
    return `file://${cachePath}`;
  } catch (error) {
    console.error(`[Cover Cache] 缓存游戏 ${gameId} 的封面失败:`, error);
    return imageUrl;
  }
}

// 获取游戏封面（优先使用缓存）
ipcMain.handle('get-game-cover', async (_: any, gameId: number, coverUrl: string) => {
  try {
    if (isCoverCached(gameId)) {
      console.log(`[Cover Cache] 从缓存加载游戏 ${gameId} 的封面`);
      return `file://${getCachedCoverPath(gameId)}`;
    }
    console.log(`[Cover Cache] 从网络下载游戏 ${gameId} 的封面: ${coverUrl}`);
    return await cacheCover(gameId, coverUrl);
  } catch (error) {
    console.error('Error getting game cover:', error);
    return coverUrl;
  }
});

// 清理封面缓存
ipcMain.handle('clear-cover-cache', async () => {
  try {
    const cacheDir = getCoverCacheDir();
    console.log(`[Cache] 开始清理缓存目录: ${cacheDir}`);
    
    if (fs.existsSync(cacheDir)) {
      const files = fs.readdirSync(cacheDir);
      console.log(`[Cache] 找到 ${files.length} 个缓存文件`);
      
      for (const file of files) {
        const filePath = path.join(cacheDir, file);
        try {
          fs.unlinkSync(filePath);
          console.log(`[Cache] 已删除缓存文件: ${file}`);
        } catch (error) {
          console.error(`[Cache] 删除缓存文件失败 ${file}:`, error);
        }
      }
      
      console.log(`[Cache] 缓存清理完成`);
      return true;
    }
    
    console.log(`[Cache] 缓存目录不存在`);
    return false;
  } catch (error) {
    console.error('[Cache] 清理缓存失败:', error);
    return false;
  }
});

// 重启 Steam 客户端
ipcMain.handle('restart-steam', async () => {
  try {
    const platform = process.platform;
    console.log('正在尝试重启 Steam，当前系统:', platform);
    
    if (platform === 'darwin') {
      // macOS
      console.log('正在关闭 Steam...');
      exec('osascript -e \'quit app "Steam"\'', (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
          console.log('Steam 可能已经关闭');
        } else {
          console.log('Steam 已成功关闭');
        }
      });
      
      // 等待 5 秒确保 Steam 完全关闭
      console.log('等待 Steam 完全关闭...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // 重新打开 Steam
      console.log('正在启动 Steam...');
      exec('open -a Steam', (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
          console.error('启动 Steam 失败:', error);
        } else {
          console.log('Steam 已成功启动');
        }
      });
      
      return true;
    } else if (platform === 'win32') {
      // Windows
      const steamPath = store.get('steamPath') as string;
      const steamExePath = path.join(steamPath, 'steam.exe');
      if (fs.existsSync(steamExePath)) {
        console.log('正在关闭 Steam...');
        exec('taskkill /F /IM steam.exe', (error: Error | null, stdout: string, stderr: string) => {
          if (error) {
            console.log('Steam 可能已经关闭');
          } else {
            console.log('Steam 已成功关闭');
          }
        });
        
        // 等待 5 秒确保 Steam 完全关闭
        console.log('等待 Steam 完全关闭...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // 重新打开 Steam
        console.log('正在启动 Steam...');
        exec(`start "" "${steamExePath}"`, (error: Error | null, stdout: string, stderr: string) => {
          if (error) {
            console.error('启动 Steam 失败:', error);
          } else {
            console.log('Steam 已成功启动');
          }
        });
      }
    } else {
      // Linux
      const steamPath = store.get('steamPath') as string;
      const steamBinPath = path.join(steamPath, 'steam');
      if (fs.existsSync(steamBinPath)) {
        console.log('正在关闭 Steam...');
        exec('pkill steam', (error: Error | null, stdout: string, stderr: string) => {
          if (error) {
            console.log('Steam 可能已经关闭');
          } else {
            console.log('Steam 已成功关闭');
          }
        });
        
        // 等待 5 秒确保 Steam 完全关闭
        console.log('等待 Steam 完全关闭...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // 重新打开 Steam
        console.log('正在启动 Steam...');
        exec(`"${steamBinPath}"`, (error: Error | null, stdout: string, stderr: string) => {
          if (error) {
            console.error('启动 Steam 失败:', error);
          } else {
            console.log('Steam 已成功启动');
          }
        });
      }
    }
    return true;
  } catch (error) {
    console.error('重启 Steam 时发生错误:', error);
    return false;
  }
});

// 显示确认对话框
ipcMain.handle('show-confirm-dialog', async (_: any, { title, message, buttons }: { title: string, message: string, buttons: string[] }) => {
  const result = await dialog.showMessageBox({
    type: 'warning',
    title,
    message,
    buttons,
    defaultId: 1,
    cancelId: 0
  });
  return result.response === 1;
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