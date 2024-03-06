const express = require('express')
const axios = require('axios')

const app = express()
app.use(express.static('./'))

const instance = axios.create({
    baseURL: 'https://devapi.qweather.com/v7/',
    timeout: 6000
})

app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Content-Length, Accept,X-Requested-With, Key, Api-Key'
    )
    res.setHeader('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    next()
})

// 根据ip获取城市
app.get('/api/location', (req, res) => {
    axios.get('https://icanhazip.com/').then((res1) => {
        const apiKey = req.get('Api-Key')
        const key = req.get('Key')
        const ip = res1.data.trim()
        axios
            .get(
                `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=
        ${ip}`
            )
            .then((res2) => {
                if (res2.data.code) {
                    res.end(
                        JSON.stringify({
                            code: -1,
                            data: null,
                            message: 'error'
                        })
                    )
                } else {
                    axios
                        .get(
                            `https://geoapi.qweather.com/v2/city/lookup?location=${res2.data.location.lng},${res2.data.location.lat}&key=${key}`
                        )
                        .then((res3) => {
                            if (res3.data.code === '200') {
                                const location = {
                                    id: res3.data.location[0].id || '',
                                    city: res3.data.location[0].name || '',
                                    lng: res3.data.location[0].lon || '',
                                    lat: res3.data.location[0].lat || ''
                                }
                                res.send(
                                    JSON.stringify({
                                        code: 0,
                                        data: location,
                                        message: 'success'
                                    })
                                )
                            }
                        })
                }
            })
    })
})

// 获取实时天气
app.get('/api/now', (req, res) => {
    res.setHeader('Content-Type', 'text/plain;charset=utf8')
    const key = req.get('Key')
    const lng = req.query.lng
    const lat = req.query.lat

    axios
        .all([
            instance.get(`weather/now?location=${lng},${lat}&key=${key}`),
            instance.get(`air/now?location=${lng},${lat}&key=${key}`),
            instance.get(`weather/3d?location=${lng},${lat}&key=${key}`)
        ])
        .then(
            axios.spread((res1, res2, res3) => {
                if (
                    res1.data.code === '200' &&
                    res2.data.code === '200' &&
                    res3.data.code === '200'
                ) {
                    const weather = {
                        updateTime: res1.data.updateTime ?? '',
                        text: res1.data.now.text ?? '',
                        windDir: res1.data.now.windDir ?? '',
                        windScale: res1.data.now.windScale ?? '',
                        windSpeed: res1.data.now.windSpeed ?? '',
                        humidity: res1.data.now.humidity ?? '',
                        pressure: res1.data.now.pressure ?? '',
                        temp: res1.data.now.temp ?? '',
                        category: res2.data.now.category ?? '',
                        level: res2.data.now.level ?? '',
                        uvIndex: res3.data.daily[0].uvIndex ?? ''
                    }

                    res.end(
                        JSON.stringify({
                            code: 0,
                            data: weather,
                            message: 'success'
                        })
                    )
                } else if (res1.data.code === '402') {
                    res.send(
                        JSON.stringify({
                            code: 402,
                            data: null,
                            message: '天气接口超过访问次数或余额不足以支持继续访问服务。'
                        })
                    )
                } else if (res1.data.code === '401') {
                    res.send(
                        JSON.stringify({
                            code: 401,
                            data: null,
                            message: '天气接口认证失败，可能使用了错误的KEY、数字签名错误、KEY的类型错误'
                        })
                    )
                }
            })
        )
})

// 获取城市经纬度
app.get('/api/geo', (req, res) => {
    res.setHeader('Content-Type', 'text/plain;charset=utf8')
    const location = req.query.location
    const key = req.get('Key')
    axios
        .get(`https://geoapi.qweather.com/v2/city/lookup?location=${location}&key=${key}`)
        .then((res1) => {
            if (res1.data.code === '200') {
                const location = {
                    id: res1.data.location[0].id || '',
                    city: res1.data.location[0].name || '',
                    lng: res1.data.location[0].lon || '',
                    lat: res1.data.location[0].lat || ''
                }
                res.send(
                    JSON.stringify({
                        code: 0,
                        data: location,
                        message: 'success'
                    })
                )
            } else if (res1.data.code === '402') {
                res.send(
                    JSON.stringify({
                        code: 402,
                        data: null,
                        message: '天气接口超过访问次数或余额不足以支持继续访问服务。'
                    })
                )
            } else if (res1.data.code === '401') {
                res.send(
                    JSON.stringify({
                        code: 401,
                        data: null,
                        message: '天气接口认证失败，可能使用了错误的KEY、数字签名错误、KEY的类型错误'
                    })
                )
            }
        })
})

// 获取24小时天气
app.get('/api/24h', (req, res) => {
    res.setHeader('Content-Type', 'text/plain;charset=utf8')
    const key = req.get('Key')
    const lng = req.query.lng
    const lat = req.query.lat
    instance.get(`weather/24h?location=${lng},${lat}&key=${key}`).then((res1) => {
        if (res1.data.code === '200') {
            let arr: any[] = []
            res1.data.hourly.forEach((item) => {
                arr.push({
                    text: item.text,
                    fxTime: item.fxTime,
                    temp: item.temp,
                    icon: item.icon
                })
            })
            res.send(
                JSON.stringify({
                    code: 0,
                    data: arr,
                    message: 'success'
                })
            )
        } else if (res1.data.code === '402') {
            res.send(
                JSON.stringify({
                    code: 402,
                    data: null,
                    message: '天气接口超过访问次数或余额不足以支持继续访问服务。'
                })
            )
        } else if (res1.data.code === '401') {
            res.send(
                JSON.stringify({
                    code: 401,
                    data: null,
                    message: '天气接口认证失败，可能使用了错误的KEY、数字签名错误、KEY的类型错误'
                })
            )
        }
    })
})

// 获取7天天气
app.get('/api/7d', (req, res) => {
    res.setHeader('Content-Type', 'text/plain;charset=utf8')
    const key = req.get('Key')
    const lng = req.query.lng
    const lat = req.query.lat
    instance.get(`weather/7d?location=${lng},${lat}&key=${key}`).then((res1) => {
        if (res1.data.code === '200') {
            let arr: any[] = []
            res1.data.daily.forEach((item) => {
                arr.push({
                    fxDate: item.fxDate,
                    tempMax: item.tempMax,
                    tempMin: item.tempMin,
                    iconDay: item.iconDay,
                    iconNight: item.iconNight,
                    humidity: item.humidity
                })
            })
            res.send(
                JSON.stringify({
                    code: 0,
                    data: arr,
                    message: 'success'
                })
            )
        } else if (res1.data.code === '402') {
            res.send(
                JSON.stringify({
                    code: 402,
                    data: null,
                    message: '天气接口超过访问次数或余额不足以支持继续访问服务。'
                })
            )
        } else if (res1.data.code === '401') {
            res.send(
                JSON.stringify({
                    code: 401,
                    data: null,
                    message: '天气接口认证失败，可能使用了错误的KEY、数字签名错误、KEY的类型错误'
                })
            )
        }
    })
})

app.listen(8888)
