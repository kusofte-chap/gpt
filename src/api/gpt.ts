import request from "./request"

export const getDefaultPrompts = async ()=>{
    try {
        return await request.get(`prompt_library`) as any
    } catch (error) {
        console.error(`getDefaultPrompts error: ${error}`)
    }
}