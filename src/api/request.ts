import axios, { InternalAxiosRequestConfig } from "axios";
import qs from "qs";

//api接口還未確定後期可能會修改響應攔截器
const request = axios.create({
    baseURL: `http://47.89.155.63:8089/api/`
});

const token = 'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJhN2QyZTc3YjhkZDE0Mjk2YmZjMjBlZWQ5ZGQ5MDYyZiIsInVzZXIiOiJhZG1pbiIsInN1YiI6ImFkbWluIn0.Bpaos8kIv8hJAvyJ148zBCJep1by--02oMx6lUx3hzGhJYeNXtprJTiLkYv9dwqtMMY7fwvJrpq10mzgVMW48w'

const requestInterceptor = async (config: InternalAxiosRequestConfig) => {
    config.headers!['Authorization'] = `Bearer ${token}`;
    config.paramsSerializer = {
        serialize: (params) => qs.stringify(params),
    };
    return config;
};

request.interceptors.request.use(requestInterceptor, (error) =>
    Promise.reject(error)
);

request.interceptors.response.use(
    (response) => {
        return Promise.resolve(response.data);
    },
    (error) => {
        return Promise.reject(error?.response?.data);
    }
);
export default request;
