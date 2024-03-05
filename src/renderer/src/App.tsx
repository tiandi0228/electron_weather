import { ReactElement, useEffect, useState } from 'react'
import { City, SetUp, Weather } from '@renderer/components/'
import useDexieLiveState from '@renderer/hooks/useDexieLiveState'
import { db } from '@renderer/db'
import { modal } from '@renderer/components/Modal'
import { LocationProps } from '@renderer/types/location'

function App(): ReactElement {
    const [isVisible, setIsVisible] = useState(false)
    const [isVisibleCity, setIsVisibleCity] = useState(false)
    const [Key] = useDexieLiveState<string>(db.simpleStructSaveSTate, 'key', '')
    const [ipKey] = useDexieLiveState<string>(db.simpleStructSaveSTate, 'ip-key', '')
    const [location] = useDexieLiveState<LocationProps>(
        db.simpleStructSaveSTate,
        'location-key',
        {
            location: {}
        }
    )

    useEffect(() => {
        if (Key && ipKey) {
            console.log('ipKey: ', `${Key + '|' + ipKey}`)
            if (location.location?.city && location.location?.lat && location.location?.lng) return
            // 发送api-key
            window.electron.ipcRenderer.send('api-key', `${Key + '|' + ipKey}`)
            // 接口返回错误做处理
            window.electron.ipcRenderer.on('ip-code-error', () => {
                console.log(`接口返回错误`)
                modal({
                    content: '请配置你的ApiKey'
                }).then((res) => {
                    if (res) {
                        setIsVisible(true)
                    }
                })
            })
        }
    }, [Key, ipKey])

    return (
        <div className="h-screen bg-[#1B1B1D] p-4 select-none overflow-x-hidden overflow-y-auto">
            {!isVisible && !isVisibleCity ? (
                <Weather
                    onChange={(isVisible) => setIsVisible(isVisible)}
                    onChangeCity={(isVisibleCity) => setIsVisibleCity(isVisibleCity)}
                />
            ) : null}
            {isVisible ? <SetUp onChange={(isVisible) => setIsVisible(isVisible)} /> : null}
            {isVisibleCity ? (
                <City onChange={(isVisibleCity) => setIsVisibleCity(isVisibleCity)} />
            ) : null}
        </div>
    )
}

export default App
