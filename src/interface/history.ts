import { Dispatch } from "react"

export interface IHistoryItem {
    conversation_id: string,
    createTime: string,
    model: string,
    title: string,
    updateTime: string
    dateKey: string
    nodeRef: React.RefObject<HTMLLIElement>
}

export interface IHistoryGroup{
    id:string
    title:string,
    list:IHistoryItem[]
}

export interface IHistoryList {
    total: number
    size:number
    number:number
    items: IHistoryItem[]
}

export interface IPopoverContext {
    openItemId: string | null,
    activeItemId: string | null,
    anchorEl: HTMLElement | null,
    setAnchorEl: Dispatch<React.SetStateAction<HTMLElement | null>>,
    setOpenItemId: Dispatch<React.SetStateAction<string | null>>,
    setActiveItemId: Dispatch<React.SetStateAction<string | null>>
}