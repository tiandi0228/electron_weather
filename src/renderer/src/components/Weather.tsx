import React, { useState } from 'react'
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
}

const Weather: React.FC<WeatherProps> = (props) => {
    const { onChange, onChangeCity } = props

    const [isRefresh, setIsRefresh] = useState<boolean>(false)

    const [location] = useDexieLiveState<LocationProps>(
        db.simpleStructSaveSTate,
        'location-key',
        {}
    )
    const [key] = useDexieLiveState<string>(db.simpleStructSaveSTate, 'key', '')

    return (
        <>
            <div className="w-full flex justify-end">
                <div
                    className="bg-[#31353E] px-3 py-1 rounded-md cursor-pointer"
                    onClick={() => onChange(true)}
                >
                    <Icon name="setting" size={20} />
                </div>
            </div>
            <NowWeather
                onChange={onChange}
                onChangeCity={() => {
                    onChangeCity(true)
                    setIsRefresh(true)
                }}
            />
            <HoursWeather isRefresh={isRefresh} />
            <WeekWeather apiKey={key} location={location} />
        </>
    )
}

export default Weather
