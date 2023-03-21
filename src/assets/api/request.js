/*
 * @Author: your name
 * @Date: 2020-03-20 14:17:34
 * @LastEditTime: 2020-03-26 11:27:50
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: 。。。。。。。。。。
 */
import axios from 'axios'
import QS from 'qs'; // 引入qs模块
 
const token ='你自己的token'
// create an axios instance
 
axios.defaults.baseURL = 'http://localhost:9090'
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
// request interceptor
axios.interceptors.request.use(

  config => {
    // Do something before request is sent
    // if (token) {
    //   // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    //   config.headers.Authorization = token 
      
    // }
    return config
  },
  error => {
    // Do something with request error
    // console.log("出错啦",error) // for debug
    Promise.reject(error)
  }
)
 
// response interceptor
axios.interceptors.response.use(
    response => {
        response
    },
    error => {
        console.log('err' + error) // for debug
        return Promise.reject(error)
    }
)

export default axios

export function get(url, params){    
    return new Promise((resolve, reject) =>{        
        axios.get(url, {            
            params: params        
        }).then(res => {
            resolve(res.data);
        }).catch(err =>{
            reject(err.data)        
    })    
});}

export function post(url, params) {
    return new Promise((resolve, reject) => {
         axios.post(url, params)
        .then(res => {
            resolve(res.data);
        })
        .catch(err =>{
            reject(err.data)
        })
    });
}