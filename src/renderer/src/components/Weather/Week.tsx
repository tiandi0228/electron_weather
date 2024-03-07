import { getWeek } from '@renderer/api'
import { LocationProps } from '@renderer/types/location'
import { WeekProps } from '@renderer/types/weather'
import moment from 'moment'
import 'moment/dist/locale/zh-cn'
import { useEffect, useState } from 'react'
import Icon from '@renderer/components/Icon'

type WeekWeatherProps = {
    location?: LocationProps
    isRefresh?: boolean
}

const WeekWeather: React.FC<WeekWeatherProps> = (props) => {
    const { isRefresh, location } = props

    const [list, setList] = useState<WeekProps[]>([])

    useEffect(() => {
        window.electron.ipcRenderer.on('refresh', () => {
            getWeekWeather()
        })
        return () => {
            window.electron.ipcRenderer.removeAllListeners('refresh')
        }
    }, [location?.select?.city, location?.location?.city])

    useEffect(() => {
        if (!isRefresh) return
        getWeekWeather()
    }, [isRefresh, location?.select?.lng])

    const getWeekWeather = () => {
        const lng = location?.select?.lng ? location.select?.lng : location?.location?.lng ?? ''
        const lat = location?.select?.lat ? location.select?.lat : location?.location?.lat ?? ''

        if (!lng && !lat) return
        getWeek({ lng, lat }).then((res: any) => {
            setList(res)
        })
    }

    return (
        <div className="h-52 bg-[#31353E] p-3 mt-4 rounded-lg">
            <div className="text-gray-400 text-xs">7天预报</div>
            <div className="overflow-y-auto">
                <div className="w-[18rem] h-40 pt-2">
                    {list.map((item: WeekProps, index: number) => (
                        <div
                            className="flex items-center h-10 border-b-[1px] border-b-[#353A42]"
                            key={index}
                        >
                            <div className="w-9 text-white text-xs text-center">
                                {moment().format('YYYY-MM-DD') ===
                                moment(item.fxDate).format('YYYY-MM-DD')
                                    ? '今天'
                                    : moment(item.fxDate).format('dddd')}
                            </div>
                            <div className="text-white text-xs mx-2 text-center">
                                <div>{item.humidity}%</div>
                                <div className="w-6 h-[2px] bg-amber-400"></div>
                            </div>
                            <div className="m-auto w-3">
                                <Icon name={item.iconDay ?? ''} />
                            </div>
                            <div className="flex flex-1 items-center mx-2">
                                <div className="text-xs text-white">{item.tempMax}°</div>
                                <div className="w-full h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mx-1"></div>
                                <div className="text-xs text-white">{item.tempMin}°</div>
                            </div>
                            <div className="m-auto w-3">
                                <Icon name={item.iconNight ?? ''} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default WeekWeather
