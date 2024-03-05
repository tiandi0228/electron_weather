import React, { useState } from 'react'
import { ModalProps } from './interface'

const Modal: React.FC<ModalProps> = (props) => {
    const { onOk, options } = props
    const { title = '提示', content } = options

    const [visible, setVisible] = useState<boolean>(true)

    return (
        <>
            {visible ? (
                <>
                    <div className="bg-black opacity-50 fixed top-0 left-0 w-full h-full"></div>
                    <div className="w-3/4 min-h-28 bg-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md shadow">
                        <div className="text-black text-sm p-4">{title}</div>
                        <div className="px-4 text-sm">{content}</div>
                        <div className="flex justify-end">
                            <div
                                className="text-black text-sm p-4 cursor-pointer"
                                onClick={() => {
                                    onOk?.()
                                    setVisible(false)
                                }}
                            >
                                确定
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </>
    )
}

export default Modal
