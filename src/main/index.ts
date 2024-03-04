import { app, shell, BrowserWindow, ipcMain, Tray } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { initTray } from './tray'

let tray: Tray

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 350,
    height: 470,
    show: false,
    frame: false,
    autoHideMenuBar: true,
    resizable: false,
    skipTaskbar: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.setAlwaysOnTop(true) // 保持置顶
  mainWindow.setSkipTaskbar(true) // 无任务栏图标

  mainWindow.on('ready-to-show', () => {
    mainWindow.hide()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  console.log('加载tray')
  tray = initTray()
  tray.on('click', () => {
    // 设置窗口位置
    const dx = tray.getBounds().x - (mainWindow.getBounds().width - tray.getBounds().width) / 2
    const dy = tray.getBounds().y
    mainWindow.setPosition(dx, dy)
    const isVisible = mainWindow.isVisible()
    if (!isVisible) {
      mainWindow.show()
    } else {
      mainWindow.focus()
    }
  })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('ready', () => {
  // 隐藏dock
  app.dock.hide()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  if (process.platform === 'win32') {
    tray.destroy()
  }
})

// 失去焦点隐藏
app.on('browser-window-blur', () => {
  app.hide()
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.