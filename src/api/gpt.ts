import request from "./request"

// 获取推荐的prompts
export const getDefaultPrompts = async ()=>{
    try {
        return await request.get(`/api/prompt_library`) as any
    } catch (error) {
        console.error(`getDefaultPrompts error: ${error}`)
    }
}

// 获取历史对话
export const getHistoryList = async (params:{ page:number,size:number})=>{
    try {
        return await request.get(`/api/conversations`) as any
    } catch (error) {
        console.error(`getHistoryList error: ${error}`)
    }
}


// 查询对话记录
export const getHistoryDetail = async (conversationId:string)=>{
    try {
        return await request.get(`/api/conversations/${conversationId}`)  as any
    } catch (error) {
        console.error(`getHistoryDetail error: ${error}`)
    }
}