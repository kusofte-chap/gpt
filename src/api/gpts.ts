import request from "./request"

// 搜索
export const asyncSearch =  (keyword?:string)=>{
   return request.get(`/api/assistans/search`,{params:{q:keyword}}) as any
}

// (GPT)获取所有的分类和gpts
export const asyncGetGPTList =  ()=>{
    return request.get(`/api/assistans/discovery_anon`) as any
}


export const asyncGetGPTListMore = (code:string,page:number)=>{
    return request.get(`/api/assistans/discovery/${code}`,{params:{page,size:6}}) as any
}