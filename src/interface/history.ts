import { Dispatch } from "react"


export interface IChartItem {
    id: string,
    title: string
}

export interface IHistoryGroup {
    id: string,
    title: string,
    list: IChartItem[]
}

export interface IPopoverContext {
    openItemId: string | null,
    activeItemId: string | null,
    anchorEl: HTMLElement | null,
    setAnchorEl: Dispatch<React.SetStateAction<HTMLElement | null>>,
    setOpenItemId: Dispatch<React.SetStateAction<string | null>>,
    setActiveItemId: Dispatch<React.SetStateAction<string | null>>
}