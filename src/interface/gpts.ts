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
    profile_picture_path: string
    prompt_starters: string[]
    tools: {type:TOOLS_ENUM}[]
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

export enum TOOLS_ENUM {
    CODE_INTERPRETER = 'code_interpreter'
}

export const TOOLS_TO_CONVERTS = {
    [TOOLS_ENUM.CODE_INTERPRETER]: '代码解译器'
}