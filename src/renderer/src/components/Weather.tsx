import React, { useEffect, useState } from 'react'
import NowWeather from '@renderer/components/Weather/Now'
import HoursWeather from '@renderer/components/Weather/Hours'
import WeekWeather from '@renderer/components/Weather/Week'
import useDexieLiveState from '@renderer/hooks/useDexieLiveState'
import { LocationProps } from '@renderer/types/location'
import { db } from '@renderer/db'
import Icon from '@renderer/components/Icon'

type WeatherProps = {
    onChange: (isVisible: boolean) => void
    onChangeCity: (isVisible: boolean) => void
    isRefreshData?: boolean
}

const Weather: React.FC<WeatherProps> = (props) => {
    const { onChange, onChangeCity, isRefreshData } = props

    const [isRefresh, setIsRefresh] = useState<boolean>(false)

    const [location] = useDexieLiveState<LocationProps>(
        db.simpleStructSaveSTate,
        'location-key',
        {}
    )

    useEffect(() => {
        window.electron.ipcRenderer.on('refresh', () => {
            setIsRefresh(true)
        })
        return () => {
            setIsRefresh(false)
            window.electron.ipcRenderer.removeAllListeners('refresh')
        }
    }, [])

    useEffect(() => {
        if (!isRefreshData) return
        setIsRefresh(true)
    }, [isRefreshData])

    return (
        <>
            <div className="w-full flex items-center justify-between">
                <div
                    className="bg-[#31353E] px-3 py-1 rounded-md cursor-pointer"
                    onClick={() => {
                        window.electron.ipcRenderer.send('quit')
                    }}
                >
                    <Icon name="quit" size={20} />
                </div>
                <div
                    className="bg-[#31353E] px-3 py-1 rounded-md cursor-pointer"
                    onClick={() => onChange(true)}
                >
                    <Icon name="setting" size={20} />
                </div>
            </div>
            <NowWeather
                isRefresh={isRefresh}
                location={location}
                onChange={onChange}
                onChangeCity={() => onChangeCity(true)}
            />
            <HoursWeather isRefresh={isRefresh} location={location} />
            <WeekWeather isRefresh={isRefresh} location={location} />
        </>
    )
}

export default Weather
