import { useEffect, useState } from 'react'
import { NowProps } from '@renderer/types/weather'
import useDexieLiveState from '@renderer/hooks/useDexieLiveState'
import { db } from '@renderer/db'
import { LocationProps } from '@renderer/types/location'
import { modal } from '../Modal'
import { getGeo, getWeather } from '@renderer/api'
import moment from 'moment'
import Icon from '@renderer/components/Icon'

type NowWeatherProps = {
    onChange?: (isVisible: boolean) => void
    onChangeCity?: (isVisible: boolean) => void
    isRefresh?: boolean
    location?: LocationProps
}

const NowWeather: React.FC<NowWeatherProps> = (props) => {
    const { onChange, onChangeCity, isRefresh, location } = props

    const [now, setNow] = useState<NowProps>({
        text: '',
        updateTime: '',
        windDir: '',
        windScale: '',
        windSpeed: '',
        humidity: '',
        pressure: '',
        level: ''
    })
    const [key] = useDexieLiveState<string>(db.simpleStructSaveSTate, 'key', '')
    const [_location, setLocation] = useDexieLiveState<LocationProps>(
        db.simpleStructSaveSTate,
        'location-key',
        {}
    )

    // 空气质量
    const air = {
        '1': 'border-green-300  text-green-300',
        '2': 'border-amber-100  text-amber-100',
        '3': 'border-amber-300  text-amber-300',
        '4': 'border-amber-500  text-amber-500',
        '5': 'border-amber-600  text-amber-600',
        '6': 'border-amber-900  text-amber-900'
    }

    // 紫外线强度
    const uvIndex = (val: string) => {
        const num = parseInt(val)
        if (num <= 2) {
            return '最弱'
        } else if (num > 2 && num <= 4) {
            return '较弱'
        } else if (num > 4 && num <= 6) {
            return '中等'
        } else if (num > 6 && num <= 9) {
            return '强'
        } else {
            return '极强'
        }
    }
    useEffect(() => {
        window.electron.ipcRenderer.on('refresh', () => {
            getLocation()
        })
        return () => {
            window.electron.ipcRenderer.removeAllListeners('refresh')
        }
    }, [location?.select?.city, location?.location?.city])

    useEffect(() => {
        if (!isRefresh) return
        getLocation()
    }, [isRefresh, location?.select?.city])

    // 获取城市经纬度
    const getLocation = () => {
        if (location?.select?.city) {
            getGeo(location.select?.city ?? '').then((res: any) => {
                const _location: LocationProps = {
                    location: location.location,
                    select: {
                        id: res.id,
                        lng: res.lng,
                        lat: res.lat,
                        city: res.city
                    }
                }
                setLocation(_location)
                getNowWeather(res.lng, res.lat)
            })
        } else {
            getNowWeather(location?.location?.lng ?? '', location?.location?.lat ?? '')
        }
    }

    // 获取实时天气数据
    const getNowWeather = (lng: string, lat: string) => {
        if (key && lng && lat) {
            getWeather({ lng, lat })
                .then((res: any) => {
                    setNow({
                        text: res.text,
                        updateTime: moment(res.updateTime).format('HH:mm'),
                        windDir: res.windDir,
                        windScale: res.windScale,
                        windSpeed: res.windSpeed,
                        humidity: res.humidity,
                        pressure: res.pressure,
                        temp: res.temp,
                        category: res.category,
                        level: res.level
                    })
                })
                .catch(() => {
                    modal({
                        content: '请配置你的ApiKey'
                    }).then((res) => {
                        if (res) {
                            onChange?.(true)
                        }
                    })
                })
        }
    }

    return (
        <div className="bg-[#31353E] p-3 mt-4 rounded-lg">
            <div className="flex justify-between">
                <div className="text-gray-400 text-xs">
                    <span className="text-white">
                        {location?.select?.city
                            ? location?.select?.city
                            : location?.location?.city ?? ''}
                    </span>
                    <span className="pl-1 cursor-pointer" onClick={() => onChangeCity?.(true)}>
                        切换
                    </span>
                </div>
                <div className="text-gray-400 text-xs flex items-center">
                    <span>{now.updateTime} 更新</span>
                </div>
            </div>
            <div className="py-4 flex items-center">
                <div className="text-white text-5xl">{now.temp}°</div>
                <div className="pl-2">
                    <div className="text-white text-xs">{now.text}</div>
                    <div className="text-xs flex items-center pt-1">
                        <div className={`border px-1 mr-1 ${air[now.level ?? '']}`}>
                            AQI {now.category}
                        </div>
                        <div className="text-white">
                            {now.windDir} {now.windScale}级
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-between">
                <div className="text-xs">
                    <span className="text-gray-400 pr-1">湿度</span>
                    <span className="text-white">{now.humidity}%</span>
                </div>
                <div className="text-xs">
                    <span className="text-gray-400 pr-1">紫外线</span>
                    <span className="text-white">{uvIndex(now.uvIndex ?? '0')}</span>
                </div>
                <div className="text-xs">
                    <span className="text-gray-400 pr-1">大气压</span>
                    <span className="text-white">{now.pressure}Hpa</span>
                </div>
            </div>
        </div>
    )
}

export default NowWeather
