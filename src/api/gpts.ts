import request from "./request"

// 搜索
export const asyncSearch =  (keyword?:string)=>{
   return request.get(`/api/assistans/search`,{params:{q:keyword}}) as any
}

// (GPT)获取所有的分类和gpts
export const asyncGetGPTList =  ()=>{
    return request.get(`/api/assistans/discovery_anon`) as any
}

// 加载GPTs具体的模块列表
export const asyncGetGPTListMore = (code:string,page:number)=>{
    return request.get(`/api/assistans/discovery/${code}`,{params:{page,size:6}}) as any
}

// 获取具体的gpts详情
export const asyncGetGptsInfo = (asstId:string)=>{
    return request.get(`/api/assistans/${asstId}`) as any
}

// 获取已使用的gpts助手
export const asyncGptsUsed = ()=>{
    return request.get(`/api/assistans/bootstrap`,{params:{limit:3}}) as any
}