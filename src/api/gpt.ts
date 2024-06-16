import request from "./request"

// 获取推荐的prompts
export const getDefaultPrompts = async ()=>{
    try {
        return await request.get(`/api/prompt_library`) as any
    } catch (error) {
        console.error(`getDefaultPrompts error: ${error}`)
        return new Error(error as any)
    }
}

// 获取历史对话
export const getHistoryList = async (page:number)=>{
    try {
        return await request.get(`/api/conversations`,{params:{page,size:50}}) as any
    } catch (error) {
        console.error(`getHistoryList error: ${error}`)
        return new Error(error as any)
    }
}


// 查询对话记录
export const getHistoryDetail = async (conversationId:string)=>{
    try {
        return await request.get(`/api/conversations/${conversationId}`)  as any
    } catch (error) {
        console.error(`getHistoryDetail error: ${error}`)
        return new Error(error as any)
    }
}

// 重命名对话名称
export const renameConversation = async (conversationId:string,title:string)=>{
    try {
        return await request.patch(`/api/conversation/${conversationId}`,{
            title
        })  as any
    } catch (error) {
        console.error(`renameConversation error: ${error}`)
        return new Error(error as any)
    }
}

// 删除对话
export const deleteConversation = async (conversationId:string)=>{
    try {
        return await request.patch(`/api/conversation/${conversationId}`,{
            is_visible:false
        })  as any
    } catch (error) {
        console.error(`deleteConversation error: ${error}`)
        return new Error(error as any)
    }
}


// 生成图片
export const generateImage = async (params: {
    model: string,
    prompt:string
})=>{
    try {
        return await request.post(`/api/images/generations`,params)  as any
    } catch (error) {
        console.error(`generateImage error: ${error}`)
        return new Error(error as any)
    }
}