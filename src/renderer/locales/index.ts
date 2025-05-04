export const translations = {
  zh: {
    settings: {
      title: '设置',
      appearance: '外观',
      theme: '主题',
      themeOptions: {
        system: '跟随系统',
        light: '亮色',
        dark: '暗色'
      },
      language: '语言',
      languageOptions: {
        zh: '中文',
        en: 'English'
      },
      steamPath: 'Steam 数据目录',
      browse: '浏览',
      pathWarning: '请设置有效的 Steam 用户数据目录以使用游戏库功能',
      pathError: '选择的路径不是有效的 Steam 用户数据目录',
      dialogError: '打开文件夹对话框时出错',
      pathHelper: '请选择 Steam 用户数据目录（通常包含 userdata 文件夹）',
      about: '关于',
      aboutContent: {
        version: '版本',
        author: '作者',
        github: 'GitHub',
        checkUpdate: '检查更新',
        checkingUpdate: '检查更新中...',
        updateAvailable: '发现新版本',
        updateMessage: '发现新版本 {version}，是否前往下载？',
        downloadUpdate: '下载更新'
      },
      close: '关闭',
      cache: {
        title: '缓存管理',
        clear: '清理游戏封面缓存',
        clearing: '清理中...',
        confirm: {
          title: '清理缓存',
          message: '确定要清理所有游戏封面缓存吗？清理后需要重新下载封面图片。',
          cancel: '取消',
          confirm: '确定'
        }
      }
    },
    navigation: {
      gameLibrary: '游戏库',
      settings: '设置'
    },
    library: {
      favorites: '收藏夹',
      allGames: '已安装游戏',
      recentlyPlayed: '最近游玩',
      emptyFavorites: '收藏夹还是空的呢\n点击游戏卡片右上角的收藏图标，将喜欢的游戏添加到这里吧',
      refresh: '刷新游戏库',
      searchPlaceholder: '搜索游戏...'
    },
    screenshotManager: {
      addScreenshot: '导入截图',
      dragAndDrop: '拖拽图片到这里',
      orClick: '或者点击选择图片',
      cancel: '取消',
      import: '导入截图',
      uploading: '上传中...',
      title: '截图',
      restartSteam: '截图已成功导入，正在重启 Steam...',
      restartSteamFailed: '截图已成功导入，但重启 Steam 失败，请手动重启 Steam',
      confirmTitle: '确认重启 Steam',
      confirmMessage: '请确保没有游戏或应用正在运行。重启 Steam 将关闭所有正在运行的游戏和应用程序。',
      confirm: '确定',
      restartNow: '现在重启 Steam',
      restartLater: '稍后自行重启',
      importSuccess: '截图已成功导入！需要重启 Steam 客户端才能使截图在 Steam 中显示。\n\n请注意：重启 Steam 将关闭所有正在运行的游戏和应用程序，请确保已保存所有进度。'
    }
  },
  en: {
    settings: {
      title: 'Settings',
      appearance: 'Appearance',
      theme: 'Theme',
      themeOptions: {
        system: 'System',
        light: 'Light',
        dark: 'Dark'
      },
      language: 'Language',
      languageOptions: {
        zh: '中文',
        en: 'English'
      },
      steamPath: 'Steam Data Directory',
      browse: 'Browse',
      pathWarning: 'Please set a valid Steam user data directory to use the game library feature',
      pathError: 'The selected path is not a valid Steam user data directory',
      dialogError: 'Error opening directory dialog',
      pathHelper: 'Please select Steam user data directory (usually contains userdata folder)',
      about: 'About',
      aboutContent: {
        version: 'Version',
        author: 'Author',
        github: 'GitHub',
        checkUpdate: 'Check for Updates',
        checkingUpdate: 'Checking for Updates...',
        updateAvailable: 'New Version Available',
        updateMessage: 'New version {version} is available. Would you like to download it?',
        downloadUpdate: 'Download Update'
      },
      close: 'Close',
      cache: {
        title: 'Cache Management',
        clear: 'Clear Game Cover Cache',
        clearing: 'Clearing...',
        confirm: {
          title: 'Clear Cache',
          message: 'Are you sure you want to clear all game cover cache? Covers will need to be downloaded again.',
          cancel: 'Cancel',
          confirm: 'Confirm'
        }
      }
    },
    navigation: {
      gameLibrary: 'Game Library',
      settings: 'Settings'
    },
    library: {
      favorites: 'Favorites',
      allGames: 'Installed Games',
      recentlyPlayed: 'Recently Played',
      emptyFavorites: 'Your favorites list is empty\nClick the favorite icon on the top right of game cards to add games here',
      refresh: 'Refresh Library',
      searchPlaceholder: 'Search games...'
    },
    screenshotManager: {
      addScreenshot: 'Import Screenshot',
      dragAndDrop: 'Drag and drop images here',
      orClick: 'or click to select images',
      cancel: 'Cancel',
      import: 'Import Screenshots',
      uploading: 'Uploading...',
      title: 'Screenshots',
      restartSteam: 'Screenshots imported successfully, restarting Steam...',
      restartSteamFailed: 'Screenshots imported successfully, but failed to restart Steam. Please restart Steam manually.',
      confirmTitle: 'Confirm Restart Steam',
      confirmMessage: 'Please make sure no games or applications are running. Restarting Steam will close all running games and applications.',
      confirm: 'Confirm',
      restartNow: 'Restart Steam Now',
      restartLater: 'Restart Later',
      importSuccess: 'Screenshots imported successfully! You need to restart Steam client to see the screenshots in Steam.\n\nNote: Restarting Steam will close all running games and applications. Please make sure you have saved all progress.'
    }
  }
}; 