export interface CityProps {
    id?: string
    city?: string
    lat?: string
    lng?: string
}

export interface LocationProps {
    location?: CityProps
    select?: CityProps
}
