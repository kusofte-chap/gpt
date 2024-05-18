'use client'

import { IPopoverContext } from "@/interface/history"
import { ReactNode, createContext, useMemo, useState } from "react"

export const PopoverContext = createContext({
    openItemId: null,
    activeItemId: null,
    anchorEl: null
} as IPopoverContext)


export function PopoverProvider({ children }: { children: ReactNode }) {
    const [openItemId, setOpenItemId] = useState(null)
    const [activeItemId, setActiveItemId] = useState(null)
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

    const value = useMemo(() => ({
        openItemId,
        activeItemId,
        anchorEl,
        setOpenItemId,
        setActiveItemId,
        setAnchorEl
    }), [openItemId, activeItemId, anchorEl, setOpenItemId, setActiveItemId, setAnchorEl])

    return (
        <PopoverContext.Provider value={value as any}>
            {children}
        </PopoverContext.Provider>
    )
}