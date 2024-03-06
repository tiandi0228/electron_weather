import React, { useEffect, useState, useMemo } from 'react'
import data from '@renderer/utils/cities.json'
import useDexieLiveState from '@renderer/hooks/useDexieLiveState'
import { LocationProps } from '@renderer/types/location'
import { db } from '@renderer/db'
import Icon from '@renderer/components/Icon'

type CityProps = {
    onChange: (isVisible: boolean) => void
}

interface CityIF {
    id: string
    name: string
    lng?: string
    lat?: string
}

const City: React.FC<CityProps> = (props) => {
    const { onChange } = props

    const hot = useMemo(() => [...data.indexCities.pos, ...data.indexCities.hot], [])
    const [cursorKeys, setCursorKeys] = useState<string[]>([])
    const [location, setLocation] = useDexieLiveState<LocationProps>(
        db.simpleStructSaveSTate,
        'location-key',
        {
            location: {}
        }
    )

    useEffect(() => {
        const cursor = Object.keys(data.indexCities).map((secKey) => secKey)
        setCursorKeys(cursor.splice(2))
    }, [])

    useEffect(() => {
        if (location.location?.city) {
            hot.splice(0, 1, {
                id: '0',
                name: location.location.city || ''
            })
        }
    }, [location.location?.city])

    // H5新api锚点
    const scrollToAnchor = (anchorName: string) => {
        if (anchorName) {
            let anchorElement = document.getElementById(anchorName)
            if (anchorElement) {
                anchorElement.scrollIntoView()
            }
        }
    }

    return (
        <div className="relative">
            <div
                className="text-white flex items-center cursor-pointer"
                onClick={() => onChange(false)}
            >
                <Icon name="back" />
                <span>返回</span>
            </div>
            <div className="fixed top-1/2 right-2 -translate-y-1/2">
                {cursorKeys.map((key, index) => {
                    return (
                        <div
                            key={index}
                            className="px-2 flex items-center justify-center text-white text-xs cursor-pointer"
                            onClick={() => scrollToAnchor(key)}
                        >
                            {key}
                        </div>
                    )
                })}
            </div>
            <div className="pt-2 grid grid-cols-3 gap-2">
                {hot.map((city: CityIF, index: number) => {
                    return (
                        <div
                            key={index}
                            className={`${index === 0 ? 'bg-blue-300 text-blue-600 ' : 'bg-white text-black '} py-1 flex items-center justify-center text-xs cursor-pointer`}
                            onClick={() => {
                                setLocation({
                                    location: location.location,
                                    select: {
                                        city: city.name || ''
                                    }
                                })
                                onChange(false)
                            }}
                        >
                            {index === 0 && (
                                <Icon className='mr-1' name="location" />
                            )}
                            <span>{city.name}</span>
                        </div>
                    )
                })}
            </div>
            <div className="pt-2">
                {cursorKeys.map((item, index) => {
                    return (
                        <div key={index} className="px-2 text-white ">
                            <div
                                id={item}
                                className="h-10 mb-2 flex items-center font-bold border-b-[1px] border-b-[#353A42]"
                            >
                                {item}
                            </div>
                            {data.indexCities[item].map((city: CityIF, i: number) => {
                                return (
                                    <div
                                        key={i}
                                        className="h-10 flex items-center border-b-[1px] border-b-[#353A42] cursor-pointer"
                                        onClick={() => {
                                            setLocation({
                                                location: location.location,
                                                select: {
                                                    city: city.name
                                                }
                                            })
                                            onChange(false)
                                        }}
                                    >
                                        {city.name}
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default City
