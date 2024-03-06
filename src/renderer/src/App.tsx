import { ReactElement, useEffect, useState } from 'react'
import { City, SetUp, Weather } from '@renderer/components/'
import useDexieLiveState from '@renderer/hooks/useDexieLiveState'
import { db } from '@renderer/db'
import { modal } from '@renderer/components/Modal'
import { LocationProps } from '@renderer/types/location'
import { getLocation } from '@renderer/api'

function App(): ReactElement {
    const [isVisible, setIsVisible] = useState(false)
    const [isVisibleCity, setIsVisibleCity] = useState(false)
    const [key] = useDexieLiveState<string>(db.simpleStructSaveSTate, 'key', '')
    const [ipKey] = useDexieLiveState<string>(db.simpleStructSaveSTate, 'ip-key', '')
    const [location, setLocation] = useDexieLiveState<LocationProps>(
        db.simpleStructSaveSTate,
        'location-key',
        {
            location: {}
        }
    )
    const [isRefresh, setIsRefresh] = useState<boolean>(false)

    useEffect(() => {
        if (key && ipKey) {
            if (location.location?.city && location.location?.lat && location.location?.lng) return
            getLocation()
                .then((res: any) => {
                    setLocation({
                        location: res,
                        select: location.select
                    })
                })
                .catch(() => {
                    modal({
                        content: '请配置你的ApiKey'
                    }).then((res) => {
                        if (res) {
                            setIsVisible(true)
                        }
                    })
                })
        }
    }, [key, ipKey])

    return (
        <div className="h-screen bg-[#1B1B1D] p-4 select-none overflow-x-hidden overflow-y-auto">
            {!isVisible && !isVisibleCity ? (
                <Weather
                    isRefreshData={isRefresh}
                    onChange={(isVisible) => setIsVisible(isVisible)}
                    onChangeCity={(isVisibleCity) => setIsVisibleCity(isVisibleCity)}
                />
            ) : null}
            {isVisible ? <SetUp onChange={(isVisible) => setIsVisible(isVisible)} /> : null}
            {isVisibleCity ? (
                <City
                    onChange={(isVisibleCity) => {
                        setIsVisibleCity(isVisibleCity)
                        setIsRefresh(true)
                    }}
                />
            ) : null}
        </div>
    )
}

export default App
