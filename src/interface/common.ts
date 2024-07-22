
export interface IErrorRst {
    status:number
    message:string
}

export enum CHAT_MODEL {
    GPT_3_5_TURBO = 'gpt-4o-mini',
    GPT_4o = 'gpt-4o',
    GPT_4_TURBO = 'gpt-4-turbo',
}

export enum IMAGE_MODEL {
    DALL_E_3 = 'dall-e-3',
    DALL_E_2 = 'dall-e-2'
}

export const MODEL_CONVERTER_TEXT: Record<CHAT_MODEL|string, string> = {
    [CHAT_MODEL.GPT_3_5_TURBO]: 'GPT-4o mini',
    [CHAT_MODEL.GPT_4o]: 'GPT-4o',
    [CHAT_MODEL.GPT_4_TURBO]: 'GPT-4'
}


export interface IModelOption {
    name:string
    mode:CHAT_MODEL
    description:string
}

export  const CHAT_MODEL_CONVERTER: IModelOption[] = [
    {name:'GPT-4o mini',mode:CHAT_MODEL.GPT_3_5_TURBO,description:"非常适合用于日常任务" },
    {name:'GPT-4o',mode:CHAT_MODEL.GPT_4o,'description':'我们最智能的模型和更多内容'},
    {name:'GPT-4',mode:CHAT_MODEL.GPT_4_TURBO,description:"更强智能的模型" },
]

// export const IMAGE_MODE_CONVERTER: IModelOption[] = [
//     {mode:IMAGE_MODEL.DALL_E_3,description:"AI生成图片的模型" },
//     {mode:IMAGE_MODEL.DALL_E_2,description:"普通图片生成模型" },
// ]