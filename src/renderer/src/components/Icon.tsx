import React, { useMemo } from 'react'

type IconProps = {
    size?: string | number
    color?: string
    prefix?: string
    name: string
    className?: string
}

const Icon: React.FC<IconProps> = (props) => {
    const { color, name, size = 16, prefix = 'icon', className } = props
    const symbolId = useMemo(() => `#${prefix}-${name}`, [prefix, name])
    return (
        <svg aria-hidden="true" className={className} width={size} height={size} fill={color}>
            <use href={symbolId} fill={color} />
        </svg>
    )
}

export default Icon
