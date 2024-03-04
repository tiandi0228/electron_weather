import { nativeTheme, nativeImage, Tray } from 'electron'
import { TRAY_ICON_DARK, TRAY_ICON_LIGHT } from './consts'

export function initTray(): Tray {
  const image = nativeImage.createFromPath(nativeTheme.shouldUseDarkColors ? TRAY_ICON_LIGHT : TRAY_ICON_DARK)
  image.isMacTemplateImage = true
  const tray = new Tray(image)
  tray.setToolTip('天气')

  return tray
}
