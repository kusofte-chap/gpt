
import request from "./request"

// 获取登录验证码
export const getCodeAndUid = async ()=>{
    try {
        return await request.get(`/auth/code`) as any
    } catch (error) {
        console.error(`getCodeAndUid error: ${error}`)
    }
}

// 登录
export const login =  (params:any)=>{
   return request.post(`/auth/login`, {...params}) as any
}


// 查询用户信息
export const queryUserInfo = async ()=>{
    try {
        return await request.get(`/api/users/info`) as any
    } catch (error) {
        console.error(`queryUserInfo error: ${error}`)
        return new Error(error as any)
    }
}

// 修改密码
export const updatePassword =  (params:{oldPass:string,newPass:string})=>{
    return request.post(`/api/users/updatePass`,params) as any
}


export const uploadAvatar =  (file: File): Promise<{ url: string } | undefined> => {
    const formData = new FormData()
    formData.append('avatar', file)
    return  request.post('/api/users/updateAvatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
    })
}