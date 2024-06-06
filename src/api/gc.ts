import request from "./request"

// 查询生成图片的记录
export const getImageList = async ()=>{
    try {
        return await request.get(`/api/images`)  as any
    } catch (error) {
        console.error(`getImageList error: ${error}`)
        return new Error(error as any)
    }
}

// 查询生成图片的记录
export const getOriginUrl = async (id:string)=>{
    try {
        return await request.get(`/api/images/${id}`)  as any
    } catch (error) {
        console.error(`getOriginImage error: ${error}`) 
        return new Error(error as any)
    }
}