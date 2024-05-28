import request from "./request"

export const getDefaultPrompts = async ()=>{
    try {
        return await request.get(`/api/prompt_library`) as any
    } catch (error) {
        console.error(`getDefaultPrompts error: ${error}`)
    }
}


export const getHistoryList = async (params:{ page:number,size:number})=>{
    try {
        return await request.get(`/api/conversations`) as any
    } catch (error) {
        console.error(`getHistoryList error: ${error}`)
    }
}