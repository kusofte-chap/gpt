import axios, { InternalAxiosRequestConfig } from "axios";
import qs from "qs";
import { handleLogout } from "../until";

const request = axios.create({
    baseURL: `http://47.89.155.63:8089`
});

// 请求拦截器
request.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    config.headers!['Authorization'] = localStorage.getItem('gpt_token')
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
