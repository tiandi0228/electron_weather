import React, { useEffect, useState } from 'react'
import { db } from '@renderer/db'
import useDexieLiveState from '@renderer/hooks/useDexieLiveState'
import Icon from '@renderer/components/Icon'

type SetUpProps = { onChange: (isVisible: boolean) => void }

const SetUp: React.FC<SetUpProps> = (props) => {
    const { onChange } = props
    const [key, setKey] = useDexieLiveState<string>(db.simpleStructSaveSTate, 'key', '')
    const [str, setStr] = useState<string>('')
    const [ipKey, setIpKey] = useDexieLiveState<string>(db.simpleStructSaveSTate, 'ip-key', '')
    const [ipKeyStr, setIpKeyStr] = useState<string>('')

    useEffect(() => {
        setStr(key)
    }, [key])

    useEffect(() => {
        setIpKeyStr(ipKey)
    }, [ipKey])

    return (
        <>
            <div
                className="text-white flex items-center cursor-pointer"
                onClick={() => {
                    onChange(false)
                }}
            >
                <Icon name="back" />
                <span>返回</span>
            </div>
            <div className="mt-4 flex items-center">
                <input
                    className="flex-1 h-10 px-2 rounded-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    placeholder="请输入和风天气key"
                    value={str}
                    onChange={(e) => setStr(e.target.value)}
                />
                <div
                    className="ml-2 text-xs text-blue-400 cursor-pointer"
                    onClick={() => window.electron.ipcRenderer.send('open-weather')}
                >
                    点我获取
                </div>
            </div>
            <div className="mt-4 flex items-center">
                <input
                    className="flex-1 h-10 px-2 rounded-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    placeholder="请输入获取ip的key"
                    value={ipKeyStr}
                    onChange={(e) => setIpKeyStr(e.target.value)}
                />
                <div
                    className="ml-2 text-xs text-blue-400 cursor-pointer"
                    onClick={() => window.electron.ipcRenderer.send('open-ip')}
                >
                    点我获取
                </div>
            </div>
            <div className="mt-4">
                <button
                    className="w-full h-10 rounded-sm bg-blue-400 hover:bg-blue-500 text-white"
                    onClick={() => {
                        setKey(str)
                        setIpKey(ipKeyStr)
                        localStorage.setItem('key', str)
                        localStorage.setItem('api-key', ipKey)
                        onChange(false)
                    }}
                >
                    保存
                </button>
            </div>
        </>
    )
}

export default SetUp
