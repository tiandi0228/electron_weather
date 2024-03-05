import { createRoot } from 'react-dom/client'
import Modal from './Modal'
import { createElement } from 'react'
import { ModalOption } from './interface'

export const modal = (options: ModalOption) => {
    return new Promise((resolve) => {
        const container = document.createElement('div')
        document.body.appendChild(container)
        const root = createRoot(container)

        const onOk = () => {
            root.unmount()
            document.body.removeChild(container)
            resolve(true)
        }

        root.render(createElement(Modal, { onOk, options }))
    })
}
