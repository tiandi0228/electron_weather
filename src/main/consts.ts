import { app } from 'electron'
import path from 'path'

/** 应用名称 */
export const APP_NAME = app.name

/** 应用版本 */
export const APP_VERSION = app.getVersion()

/** 亮色风格托盘图标 标准尺寸 16*16, 系统会自动载入 @2x 和 @3x */
export const TRAY_ICON_LIGHT = path.join(
  path.join(app.getAppPath(), 'assets'),
  'tray/tray_light.png'
)

/** 暗色风格托盘图标 (仅 macOS) */
export const TRAY_ICON_DARK = path.join(path.join(app.getAppPath(), 'assets'), 'tray/tray_dark.png')
