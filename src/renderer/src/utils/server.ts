import { modal } from '@renderer/components/Modal'
import axios from 'axios'
import type {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios'

type Result<T> = {
    code: number
    message: string
    data: T
}

let instance: AxiosInstance

let baseConfig: AxiosRequestConfig = { baseURL: 'http://127.0.0.1:8888/api/', timeout: 60000 }

export class Request {
    constructor(config: AxiosRequestConfig) {
        instance = axios.create(Object.assign(baseConfig, config))
        instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const key = localStorage.getItem('key') as string
                const apiKey = localStorage.getItem('api-key') as string
                if (key && apiKey) {
                    config.headers = {
                        ...config.headers,
                        'Key': key,
                        'Api-Key': apiKey
                    }
                    // config.headers!.ApiKey = apiKey
                    // config.headers!.Key = key
                }

                return config
            },
            (err: any) => {
                return Promise.reject(err)
            }
        )
        instance.interceptors.response.use(
            (res: AxiosResponse) => {
                if (res.data.code === 402) {
                    modal({
                        content: res.data.message
                    })
                    return Promise.reject(res.data)
                }
                return res
            },
            (err: any) => {
                return Promise.reject(err.response)
            }
        )
    }

    public request(config: AxiosRequestConfig): Promise<AxiosResponse> {
        return instance.request(config)
    }

    public get<T = any>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<Result<T>>> {
        return instance.get(url, config)
    }
}

export default new Request({})
