import { Request } from '@renderer/utils/server'

const request = new Request({})

// 获取实时天气
export const getWeather = (options) => {
    return new Promise((resolve, reject) => {
        request.get(`now?lng=${options.lng}&lat=${options.lat}`).then((res) => {
            if (res.data.code === 0) {
                resolve(res.data.data)
            } else {
                reject(res.data)
            }
        })
    })
}

// 根据ip获取城市
export const getLocation = () => {
    return new Promise((resolve, reject) => {
        request.get('location').then((res) => {
            if (res.data.code === 0) {
                resolve(res.data.data)
            } else {
                reject(res.data)
            }
        })
    })
}

// 获取城市经纬度
export const getGeo = (location: string) => {
    return new Promise((resolve, reject) => {
        request.get(`geo?location=${location}`).then((res) => {
            if (res.data.code === 0) {
                resolve(res.data.data)
            } else {
                reject(res.data)
            }
        })
    })
}

// 获取24小时天气
export const getHours = (options) => {
    return new Promise((resolve, reject) => {
        request.get(`24h?lng=${options.lng}&lat=${options.lat}`).then((res) => {
            if (res.data.code === 0) {
                resolve(res.data.data)
            } else {
                reject(res.data)
            }
        })
    })
}

// 获取7天天气
export const getWeek = (options) => {
    return new Promise((resolve, reject) => {
        request.get(`7d?lng=${options.lng}&lat=${options.lat}`).then((res) => {
            if (res.data.code === 0) {
                resolve(res.data.data)
            } else {
                reject(res.data)
            }
        })
    })
}
