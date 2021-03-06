/**
 * axios二次封装
 */
import axios from "axios";
import config from "../config";
import router from './../router'
import storage from './storage'
import { ElMessage } from "element-plus";



const TOKEN_INVALID = 'Token认证失败，请重新登录'
const NETWORK_ERROR = '网络请求异常，请稍后重试'

//创建axios实例对象 添加全局配置
const service = axios.create({
    baseURL: config.baseApi,
    timeout: 8000, //超时时间
}) 



//请求拦截
service.interceptors.request.use((req)=>{
    //TO-DO
    const headers = req.headers;
    const { token } = storage.getItem("userInfo")
    if(!headers.Authorization) headers.Authorization = 'Bearer' + token;
   
    return req;
})


//响应拦截
service.interceptors.response.use((res)=>{
    const { code, data, msg} = res.data;
    if(code === 200 || code === 0){
        // return date;
        return data;
    }else if (code === 500001) {
        ElMessage.error(TOKEN_INVALID)
        setTimeout(() => {
            router.push('/login')
        }, 1500)
        return Promise.reject(TOKEN_INVALID)
    } else {
        ElMessage.error(msg || NETWORK_ERROR)
        return Promise.reject(msg || NETWORK_ERROR)
    }

})

/**
 * 请求核心函数
 * @param {*} 请求配置
 */
function request(options){

    options.method = options.method || 'get';

    if(options.method.toLowerCase() === 'get'){
        options.params = options.data;
    }
    if(typeof options.mock !='undefined'){
        config.mock = options.mock;
    }


 

    //判断环境加url
    if(config.env === 'prod'){
        service.defaults.baseURL = config.baseApi;
    }else{
        service.defaults.baseURL = config.mock ? config.mockApi:config.baseApi;
    }
    if(config.mock==true){
        service.defaults.baseURL = config.mock ? config.mockApi:config.baseApi;
    }
  
   return service(options)
}

['get','post','put','delete','patch'].forEach((item)=>{
    request[item] = (url,data,options)=>{
        return request({
            url,
            data,
            method:item,
            ...options
        })
    }
})

export default request;