import { app, BrowserWindow, ipcMain, Menu, shell, Tray } from 'electron'
import { join } from 'path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { initTray } from './tray'
import { fork } from 'child_process'

let tray: Tray
let mainWindow: BrowserWindow
let serverProcess

function createWindow(): void {
    // Create the browser window.
    mainWindow = new BrowserWindow({
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

    // mainWindow.webContents.openDevTools()

    // 保持置顶
    // mainWindow.setAlwaysOnTop(true)
    // 无任务栏图标
    mainWindow.setSkipTaskbar(true)

    mainWindow.on('ready-to-show', () => {
        Menu.setApplicationMenu(null)
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
            // 每次打开窗口时，发送消息到react，让其重新获取天气信息
            mainWindow.webContents.send('refresh')
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

    // 打开获取定位apikey
    ipcMain.on('open-ip', () => {
        shell.openExternal('https://geo.ipify.org/')
    })

    // 打开获取和风天气key
    ipcMain.on('open-weather', () => {
        shell.openExternal('https://dev.qweather.com/')
    })

    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// 启动服务用来做api接口处理
function createBackgroundProcess() {
    serverProcess = fork(__dirname + '/server.js', ['args'])
    serverProcess.on('message', (msg) => {
        console.log('child_process message: ', msg)
    })
}

app.on('ready', () => {
    // 隐藏dock
    app.dock.hide()

    createBackgroundProcess()

    // 退出app
    ipcMain.on('quit', () => {
        app.quit()
    })
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
    if (serverProcess) {
        serverProcess.kill()
        serverProcess = null
    }
})

// 失去焦点隐藏
app.on('browser-window-blur', () => {
    app.hide()
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
