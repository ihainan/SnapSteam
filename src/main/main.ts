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
const logger = require('./logger').default;

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
      ? `${os.homedir()}/Library/Application Support/Steam`
      : process.platform === 'win32'
        ? 'C:\\Program Files (x86)\\Steam'
        : `${os.homedir()}/.local/share/Steam`,
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
  logger.info('正在创建主窗口...');
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
    logger.error(`渲染进程崩溃: ${details.reason}, 退出代码: ${details.exitCode}`);
  });

  mainWindow.webContents.on('crashed', () => {
    logger.error('Renderer process crashed');
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
  logger.info(`[Config] Setting ${key} to ${value}`);
  store.set(key, value);
  logger.info(`[Config] Current config:`, store.store);
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
    // 解析 ~ 符号为用户的 home 目录
    const resolvedPath = steamPath.replace('~', os.homedir());
    logger.info(`[Steam Path Validation] 开始验证路径: ${resolvedPath}`);
    
    // 检查路径是否存在
    if (!fs.existsSync(resolvedPath)) {
      logger.info(`[Steam Path Validation] 路径不存在: ${resolvedPath}`);
      return false;
    }

    const platform = process.platform;
    
    if (platform === 'darwin') {
      // macOS 上的验证逻辑
      const userdataExists = fs.existsSync(path.join(resolvedPath, 'userdata'));
      const steamappsExists = fs.existsSync(path.join(resolvedPath, 'steamapps'));
      
      logger.info(`[Steam Path Validation] userdata 目录存在: ${userdataExists}`);
      logger.info(`[Steam Path Validation] steamapps 目录存在: ${steamappsExists}`);
      
      const isDataDir = userdataExists && steamappsExists;
      logger.info(`[Steam Path Validation] 验证结果: ${isDataDir}`);
      
      return isDataDir;
    } else {
      // Windows 和 Linux 上的验证逻辑
      // 检查是否是 userdata 目录
      const isUserDataDir = fs.existsSync(path.join(resolvedPath, 'userdata')) ||
                          (fs.existsSync(resolvedPath) && 
                           fs.readdirSync(resolvedPath).some((dir: string) => 
                             fs.statSync(path.join(resolvedPath, dir)).isDirectory() && 
                             /^\d+$/.test(dir)
                           ));
      
      return isUserDataDir;
    }
  } catch (error) {
    logger.error('Error validating Steam path:', error);
    return false;
  }
});

// 获取 Steam 用户列表
ipcMain.handle('get-steam-users', async () => {
  try {
    const steamPath = store.get('steamPath') as string;
    // 解析 ~ 符号为用户的 home 目录
    const resolvedPath = steamPath.replace('~', os.homedir());
    logger.info(`[Steam Users] 开始获取 Steam 用户列表，Steam 路径: ${resolvedPath}`);
    
    const userDataPath = path.join(resolvedPath, 'userdata');
    logger.info(`[Steam Users] 用户数据目录: ${userDataPath}`);
    
    if (!fs.existsSync(userDataPath)) {
      logger.info(`[Steam Users] 用户数据目录不存在: ${userDataPath}`);
      return [];
    }

    const users: SteamUser[] = [];
    const userDirs = fs.readdirSync(userDataPath);
    logger.info(`[Steam Users] 找到 ${userDirs.length} 个用户目录:`, userDirs);
    
    for (const userId of userDirs) {
      if (!/^\d+$/.test(userId)) {
        logger.info(`[Steam Users] 跳过非数字用户目录: ${userId}`);
        continue;
      }
      
      const userConfigPath = path.join(userDataPath, userId, 'config', 'localconfig.vdf');
      logger.info(`[Steam Users] 检查用户配置文件: ${userConfigPath}`);
      
      if (!fs.existsSync(userConfigPath)) {
        logger.info(`[Steam Users] 用户配置文件不存在: ${userConfigPath}`);
        continue;
      }
      
      // 读取用户配置
      const configContent = fs.readFileSync(userConfigPath, 'utf-8');
      const nameMatch = configContent.match(/PersonaName"\s+"([^"]+)"/);
      const avatarMatch = configContent.match(/avatar"\s+"([^"]+)"/);
      
      if (!nameMatch) {
        logger.info(`[Steam Users] 无法找到用户名称: ${userId}`);
        continue;
      }
      
      // 尝试获取头像 URL
      let avatarUrl = null;
      if (avatarMatch) {
        const avatarHash = avatarMatch[1];
        avatarUrl = `https://avatars.steamstatic.com/${avatarHash}_full.jpg`;
        logger.info(`[Steam Users] 找到用户头像: ${avatarUrl}`);
      }
      
      const user = {
        id: parseInt(userId),
        name: nameMatch[1],
        avatar: avatarUrl
      };
      
      logger.info(`[Steam Users] 添加用户: ${user.name} (${user.id})`);
      users.push(user);
    }
    
    logger.info(`[Steam Users] 成功获取 ${users.length} 个用户`);
    return users;
  } catch (error) {
    logger.error('Error getting Steam users:', error);
    return [];
  }
});

// 获取用户的游戏库
ipcMain.handle('get-user-games', async (_: any, userId: number) => {
  try {
    logger.info(`[Game Library] 开始加载用户 ${userId} 的游戏库`);
    const steamPath = store.get('steamPath') as string;
    // 解析 ~ 符号为用户的 home 目录
    const resolvedPath = steamPath.replace('~', os.homedir());
    logger.info(`[Game Library] Steam 路径: ${resolvedPath}`);
    
    const userDataPath = path.join(resolvedPath, 'userdata', userId.toString());
    logger.info(`[Game Library] 用户数据路径: ${userDataPath}`);
    
    if (!fs.existsSync(userDataPath)) {
      logger.info(`[Game Library] 用户数据目录不存在: ${userDataPath}`);
      return [];
    }
    
    const games: Game[] = [];
    
    // 读取用户的本地配置
    const localConfigPath = path.join(userDataPath, 'config', 'localconfig.vdf');
    logger.info(`[Game Library] 本地配置文件路径: ${localConfigPath}`);
    
    if (!fs.existsSync(localConfigPath)) {
      logger.info(`[Game Library] 本地配置文件不存在: ${localConfigPath}`);
      return [];
    }
    
    const localConfigContent = fs.readFileSync(localConfigPath, 'utf-8');
    logger.info(`[Game Library] 成功读取本地配置文件，文件大小: ${localConfigContent.length} 字节`);
    
    // 读取游戏库文件
    const libraryFoldersPath = path.join(resolvedPath, 'steamapps', 'libraryfolders.vdf');
    logger.info(`[Game Library] 游戏库文件路径: ${libraryFoldersPath}`);
    
    if (!fs.existsSync(libraryFoldersPath)) {
      logger.info(`[Game Library] 游戏库文件不存在: ${libraryFoldersPath}`);
      return [];
    }
    
    const libraryContent = fs.readFileSync(libraryFoldersPath, 'utf-8');
    logger.info(`[Game Library] 成功读取游戏库文件，文件大小: ${libraryContent.length} 字节`);
    
    const libraryPaths = libraryContent.match(/path"\s+"([^"]+)"/g)?.map((match: string) => 
      match.match(/path"\s+"([^"]+)"/)?.[1]
    ) || [];
    
    logger.info(`[Game Library] 找到 ${libraryPaths.length} 个游戏库路径:`, libraryPaths);
    
    // 读取每个库文件夹中的游戏
    for (const libraryPath of libraryPaths) {
      if (!libraryPath) continue;
      
      const appManifestPath = path.join(libraryPath, 'steamapps');
      logger.info(`[Game Library] 检查游戏库路径: ${appManifestPath}`);
      
      if (!fs.existsSync(appManifestPath)) {
        logger.info(`[Game Library] 游戏库路径不存在: ${appManifestPath}`);
        continue;
      }
      
      const appManifests = fs.readdirSync(appManifestPath)
        .filter((file: string) => file.startsWith('appmanifest_') && file.endsWith('.acf'));
      
      logger.info(`[Game Library] 找到 ${appManifests.length} 个游戏清单文件`);
      
      for (const manifest of appManifests) {
        const manifestPath = path.join(appManifestPath, manifest);
        const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
        
        const appIdMatch = manifestContent.match(/appid"\s+"(\d+)"/);
        const nameMatch = manifestContent.match(/name"\s+"([^"]+)"/);
        
        if (appIdMatch && nameMatch) {
          const appId = parseInt(appIdMatch[1]);
          const name = nameMatch[1];
          
          logger.info(`[Game Library] 处理游戏: ${name} (${appId})`);
          
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
              
              logger.info(`[Game Library] 游戏 ${appId} (${name}) 封面状态: ${isCached ? '已缓存' : '未缓存'}`);
              
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
    
    logger.info(`[Game Library] 成功加载用户 ${userId} 的游戏库，共 ${games.length} 个游戏`);
    return games;
  } catch (error) {
    logger.error('Error getting user games:', error);
    return [];
  }
});

// 获取游戏的截图
ipcMain.handle('get-game-screenshots', async (_: any, gameId: number, userId: number) => {
  try {
    const steamPath = store.get('steamPath') as string;
    // 解析 ~ 符号为用户的 home 目录
    const resolvedPath = steamPath.replace('~', os.homedir());
    const screenshotsPath = path.join(resolvedPath, 'userdata', userId.toString(), '760', 'remote', gameId.toString(), 'screenshots');
    
    logger.info('Looking for screenshots in:', screenshotsPath);
    
    if (!fs.existsSync(screenshotsPath)) {
      logger.info('Screenshots directory does not exist');
      return [];
    }

    const screenshots: any[] = [];
    const files = fs.readdirSync(screenshotsPath);
    
    logger.info('Found files:', files);
    
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
          logger.error(`Cannot read file ${filePath}:`, error);
        }
      }
    }
    
    logger.info('Found screenshots:', screenshots.length);
    return screenshots;
  } catch (error) {
    logger.error('Error getting game screenshots:', error);
    return [];
  }
});

// 修改导入图片到 Steam 目录的函数
ipcMain.handle('import-screenshots', async (_: any, { gameId, userId, files }: { gameId: number, userId: number, files: string[] }) => {
  try {
    const steamPath = store.get('steamPath') as string;
    // 解析 ~ 符号为用户的 home 目录
    const resolvedPath = steamPath.replace('~', os.homedir());
    logger.info('Steam path:', resolvedPath);
    
    const screenshotsPath = path.join(resolvedPath, 'userdata', userId.toString(), '760', 'remote', gameId.toString(), 'screenshots');
    const thumbnailsPath = path.join(screenshotsPath, 'thumbnails');
    logger.info('Screenshots path:', screenshotsPath);
    logger.info('Thumbnails path:', thumbnailsPath);
    
    // 确保截图目录和缩略图目录存在
    if (!fs.existsSync(screenshotsPath)) {
      logger.info('Creating screenshots directory');
      fs.mkdirSync(screenshotsPath, { recursive: true });
    }
    if (!fs.existsSync(thumbnailsPath)) {
      logger.info('Creating thumbnails directory');
      fs.mkdirSync(thumbnailsPath, { recursive: true });
    }

    const importedFiles = [];
    // 使用本地时间生成时间戳
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const newFileName = `${timestamp}_${i + 1}.jpg`;
      const targetPath = path.join(screenshotsPath, newFileName);
      const thumbnailPath = path.join(thumbnailsPath, newFileName);
      
      logger.info('Processing file:', file);
      
      try {
        // 使用 jimp 处理图片
        const image = await Jimp.read(file);
        
        // 保存原图
        await image.writeAsync(targetPath);
        
        // 生成缩略图（Steam 缩略图通常是 200x112）
        const thumbnail = image.clone();
        await thumbnail
          .resize(200, 112, Jimp.RESIZE_BEZIER)
          .quality(90)
          .writeAsync(thumbnailPath);
        
        importedFiles.push({
          id: newFileName,
          url: `file://${targetPath}`,
          timestamp: now.toISOString()
        });
      } catch (error) {
        logger.error(`Error processing file ${file}:`, error);
        throw error;
      }
    }
    
    return importedFiles;
  } catch (error) {
    logger.error('Error importing screenshots:', error);
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
    logger.info(`[Cover Cache] 开始下载游戏 ${gameId} 的封面`);
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const cachePath = getCachedCoverPath(gameId);
    await fs.promises.writeFile(cachePath, response.data);
    logger.info(`[Cover Cache] 成功缓存游戏 ${gameId} 的封面到: ${cachePath}`);
    return `file://${cachePath}`;
  } catch (error) {
    logger.error(`[Cover Cache] 缓存游戏 ${gameId} 的封面失败:`, error);
    return imageUrl;
  }
}

// 获取游戏封面（优先使用缓存）
ipcMain.handle('get-game-cover', async (_: any, gameId: number, coverUrl: string) => {
  try {
    if (isCoverCached(gameId)) {
      logger.info(`[Cover Cache] 从缓存加载游戏 ${gameId} 的封面`);
      return `file://${getCachedCoverPath(gameId)}`;
    }
    logger.info(`[Cover Cache] 从网络下载游戏 ${gameId} 的封面: ${coverUrl}`);
    return await cacheCover(gameId, coverUrl);
  } catch (error) {
    logger.error('Error getting game cover:', error);
    return coverUrl;
  }
});

// 清理封面缓存
ipcMain.handle('clear-cover-cache', async () => {
  try {
    const cacheDir = getCoverCacheDir();
    logger.info(`[Cache] 开始清理缓存目录: ${cacheDir}`);
    
    if (fs.existsSync(cacheDir)) {
      const files = fs.readdirSync(cacheDir);
      logger.info(`[Cache] 找到 ${files.length} 个缓存文件`);
      
      for (const file of files) {
        const filePath = path.join(cacheDir, file);
        try {
          fs.unlinkSync(filePath);
          logger.info(`[Cache] 已删除缓存文件: ${file}`);
        } catch (error) {
          logger.error(`[Cache] 删除缓存文件失败 ${file}:`, error);
        }
      }
      
      logger.info(`[Cache] 缓存清理完成`);
      return true;
    }
    
    logger.info(`[Cache] 缓存目录不存在`);
    return false;
  } catch (error) {
    logger.error('[Cache] 清理缓存失败:', error);
    return false;
  }
});

// 重启 Steam 客户端
ipcMain.handle('restart-steam', async () => {
  try {
    const platform = process.platform;
    logger.info('正在尝试重启 Steam，当前系统:', platform);
    
    if (platform === 'darwin') {
      // macOS
      logger.info('正在关闭 Steam...');
      exec('osascript -e \'quit app "Steam"\'', (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
          logger.info('Steam 可能已经关闭');
        } else {
          logger.info('Steam 已成功关闭');
        }
      });
      
      // 等待 5 秒确保 Steam 完全关闭
      logger.info('等待 Steam 完全关闭...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // 重新打开 Steam
      logger.info('正在启动 Steam...');
      exec('open -a Steam', (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
          logger.error('启动 Steam 失败:', error);
        } else {
          logger.info('Steam 已成功启动');
        }
      });
      
      return true;
    } else if (platform === 'win32') {
      // Windows
      const steamPath = store.get('steamPath') as string;
      const steamExePath = path.join(steamPath, 'steam.exe');
      if (fs.existsSync(steamExePath)) {
        logger.info('正在关闭 Steam...');
        exec('taskkill /F /IM steam.exe', (error: Error | null, stdout: string, stderr: string) => {
          if (error) {
            logger.info('Steam 可能已经关闭');
          } else {
            logger.info('Steam 已成功关闭');
          }
        });
        
        // 等待 5 秒确保 Steam 完全关闭
        logger.info('等待 Steam 完全关闭...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // 重新打开 Steam
        logger.info('正在启动 Steam...');
        exec(`start "" "${steamExePath}"`, (error: Error | null, stdout: string, stderr: string) => {
          if (error) {
            logger.error('启动 Steam 失败:', error);
          } else {
            logger.info('Steam 已成功启动');
          }
        });
      }
    } else {
      // Linux
      const steamPath = store.get('steamPath') as string;
      const steamBinPath = path.join(steamPath, 'steam');
      if (fs.existsSync(steamBinPath)) {
        logger.info('正在关闭 Steam...');
        exec('pkill steam', (error: Error | null, stdout: string, stderr: string) => {
          if (error) {
            logger.info('Steam 可能已经关闭');
          } else {
            logger.info('Steam 已成功关闭');
          }
        });
        
        // 等待 5 秒确保 Steam 完全关闭
        logger.info('等待 Steam 完全关闭...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // 重新打开 Steam
        logger.info('正在启动 Steam...');
        exec(`"${steamBinPath}"`, (error: Error | null, stdout: string, stderr: string) => {
          if (error) {
            logger.error('启动 Steam 失败:', error);
          } else {
            logger.info('Steam 已成功启动');
          }
        });
      }
    }
    return true;
  } catch (error) {
    logger.error('重启 Steam 时发生错误:', error);
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

// 检查更新
ipcMain.handle('check-update', async () => {
  try {
    const currentVersion = app.getVersion();
    const response = await axios.get('https://api.github.com/repos/ihainan/SnapSteam/releases/latest');
    const latestVersion = response.data.tag_name.replace('v', '');
    
    if (latestVersion > currentVersion) {
      return {
        hasUpdate: true,
        latestVersion,
        releaseUrl: response.data.html_url
      };
    }
    
    return {
      hasUpdate: false,
      currentVersion
    };
  } catch (error) {
    logger.error('Error checking for updates:', error);
    return {
      hasUpdate: false,
      error: true
    };
  }
});

// 在应用启动时记录日志
app.whenReady().then(() => {
  logger.info('应用程序启动');
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 在应用关闭时记录日志
app.on('window-all-closed', () => {
  logger.info('所有窗口已关闭，应用程序即将退出');
  if (process.platform !== 'darwin') {
    app.quit();
  }
}); 