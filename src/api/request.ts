import axios, { InternalAxiosRequestConfig } from "axios";
import qs from "qs";
import { handleLogout } from "../until";

const request = axios.create({
    baseURL: `http://47.89.155.63:8089`
});

// const token ='eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIwMTRkZDQ1NjFlZmM0ODRlYjM1MjdhZDljMzc0ZTNmZiIsInVzZXIiOiJ0ZXN0MjAyNCIsInN1YiI6InRlc3QyMDI0In0.-z49oqY7EaCmqdJV1wsb4Q03PesWImizotG2ZFGXo7jwWG_rllxivpnz_feqDqyrmEhx6ztyVZASnE882IU_vQ'
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
