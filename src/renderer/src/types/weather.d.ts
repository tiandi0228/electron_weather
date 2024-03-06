export interface NowProps {
    text?: string
    updateTime?: string
    windDir?: string
    windScale?: string
    windSpeed?: string
    humidity?: string
    pressure?: string
    temp?: string
    category?: string
    level?: string
    uvIndex?: string
}

export interface HoursProps {
    text?: string
    fxTime?: string
    temp?: string
    icon?: string
}

export interface WeekProps {
    fxDate?: string
    tempMax?: string
    tempMin?: string
    iconDay?: string
    iconNight?: string
    humidity?: string
}
