import axios, { InternalAxiosRequestConfig } from "axios";
import qs from "qs";
import { handleLogout } from "../until";
// http://47.89.155.63:8089/api/prompt_library
// `http://93.127.216.22:8089`
const request = axios.create({
    baseURL: `http://93.127.216.22:8089`
});

// 请求拦截器
request.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (localStorage.getItem('gpt_token')?.trim() && config.url?.startsWith('/api')) {
        config.headers['Authorization'] = `Bearer ${localStorage.getItem('gpt_token')?.trim()}`
    }
    config.paramsSerializer = {
        serialize: (params) => qs.stringify(params),
    };
    return config;
}, (error) =>
    Promise.reject(error)
);


// 响应拦截拦截器
request.interceptors.response.use(
    response => {
        if (response.data.status === 401) {
            handleLogout()
        }
        return response.data
    },
    error => {
        if (error.response.data.status === 401) {
            handleLogout()
        }
        return Promise.reject(error)
    }
)

export default request;


export class RetriableError extends Error { }

export class FatalError extends Error { }