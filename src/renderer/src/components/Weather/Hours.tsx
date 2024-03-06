import { getHours } from '@renderer/api'
import { LocationProps } from '@renderer/types/location'
import { HoursProps } from '@renderer/types/weather'
import moment from 'moment'
import { useEffect, useState } from 'react'
import Icon from '@renderer/components/Icon'

type HoursWeatherProps = {
    isRefresh?: boolean
    location?: LocationProps
}

const HoursWeather: React.FC<HoursWeatherProps> = (props) => {
    const { isRefresh, location } = props

    const [list, setList] = useState<HoursProps[]>([])

    useEffect(() => {
        window.electron.ipcRenderer.on('refresh', () => {
            getHoursWeather()
        })
        return () => {
            window.electron.ipcRenderer.removeAllListeners('refresh')
        }
    }, [location?.select?.city, location?.location?.city])

    useEffect(() => {
        if (!isRefresh) return
        getHoursWeather()
    }, [isRefresh, location?.select?.lng])

    const getHoursWeather = () => {
        const lng = location?.select?.lng ? location.select?.lng : location?.location?.lng ?? ''
        const lat = location?.select?.lat ? location.select?.lat : location?.location?.lat ?? ''
        if (!lng && !lat) return
        getHours({ lng, lat }).then((res: any) => {
            setList(res)
        })
    }

    return (
        <div className="h-52 bg-[#31353E] p-3 mt-4 rounded-lg">
            <div className="text-gray-400 text-xs">24小时预报</div>
            <div className="overflow-x-auto">
                <div
                    style={{ gridTemplateColumns: ' repeat(24, minmax(0, 1fr))' }}
                    className="w-[50rem] h-40 mt-2 grid gap-4 text-center"
                >
                    {list.map((item: HoursProps, index: number) => (
                        <div className="w-[2.5rem] h-40 flex items-end" key={index}>
                            <div>
                                <div className="text-white text-xs mb-1">{item.temp}°</div>
                                <div
                                    style={{ height: parseInt(item.temp ?? '0') * 3 }}
                                    className={`m-auto w-2 ${parseInt(item.temp ?? '0') < 0 ? 'bg-blue-400' : 'bg-amber-400'} rounded-md`}
                                ></div>
                                <div className="m-auto w-3 mt-1">
                                    <Icon name={item.icon ?? ''} />
                                </div>
                                <div className="text-gray-400 text-[10px] mt-1">
                                    {moment(item.fxTime).format('HH')} 时
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default HoursWeather
