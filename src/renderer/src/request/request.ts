import axios from 'axios'
const baseURL = import.meta.env.VITE_API_BASE_URL;
// 创建axios实例
const request = axios.create({
    baseURL: baseURL || '/api',// 所有的请求地址前缀部分(没有后端请求不用写)
    timeout: 60000, // 请求超时时间(毫秒)
    withCredentials: true,// 异步请求携带cookie
})
 
// request拦截器
request.interceptors.request.use(
    config => {
        // 如果你要去localStor获取token
        // let token = localStorage.getItem("x-auth-token");
        // if (token) {
        //     config.headers = {"x-auth-token": token}
        // }
        return config
    },
    error => {
        // 对请求错误做些什么
        Promise.reject(error)
    }
)
 
// response 拦截器
request.interceptors.response.use(
    response => {
        // 对响应数据做点什么
        return response
    },
    error => {  
        // 对响应错误做点什么
        return Promise.reject(error)
    }
)
export default request