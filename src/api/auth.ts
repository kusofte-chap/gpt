
import request from "./request"

export const getCodeAndUid = async ()=>{
    try {
        return await request.get(`/auth/code`) as any
    } catch (error) {
        console.error(`getCodeAndUid error: ${error}`)
    }
}

export const login = async (params:any)=>{
    try {
        return await request.post(`/auth/login`, {...params}) as any
    } catch (error) {
        console.error(`login error: ${error}`)
    }
}

export const queryUserInfo = async ()=>{
    try {
        return await request.get(`/api/users/info`) as any
    } catch (error) {
        console.error(`queryUserInfo error: ${error}`)
    }
}