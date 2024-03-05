export interface ModalOption {
    title?: React.ReactNode
    content?: React.ReactNode
}

export interface ModalProps {
    onOk?: () => void
    options: ModalOption
}
