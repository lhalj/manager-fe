/**
 * api管理
 */
import request from './../utils/request'
export default {
    //登录
    login(params){
       return request({
            url:'/users/login',
            method:'post',
            data:params,
            mock:false
        })
    },
    noticeCount(params){
        return request({
             url:'/leave/count',
             method:'get',
             data:{},
             mock:true
         })
     },
     getMenuList(params){
         return request({
              url:'/menu/list',
              method:'get',
              data:{},
              mock:true
          })
      }
}