
import {post} from '@/assets/api/request.js'
// 获取你要的数据
// export function getLogin(data) {
// 	return request({
// 		url: '/api/login',//自己的接口地址
// 		method: 'POST',//请求方法
//         data //需要携带的参数
// 	})
// }
export const getLogin = param => post('/api/login', param);
export const getReset = param => post('/api/reset', param);
 
