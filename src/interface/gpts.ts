import { CHAT_MODEL } from "./common"

export interface IGroupListItem {
    id: string
    title: string
    author: {
        name:string
    }
    categories: string[]
    description: string
    model: CHAT_MODEL
    profile_picture_name: string
    prompt_starters: string[]
    tools: string[]
    name: string
    updateTime: string
}

export interface IItemList {
    items: IGroupListItem[]
    totalPages: number
    size: number
    number: number
}

export interface IGptInfo {
    code: string
    description: string
    title:string
}

export interface IGroupGptItem {
    info: IGptInfo
    list:IItemList
}
