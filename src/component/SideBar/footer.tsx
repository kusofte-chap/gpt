'use client'

import { useRef, useState } from "react"
import cn from 'classnames'
import { useRecoilValue } from "recoil"
import { userInfoState } from "@/store/atom"
import { Avatar, ClickAwayListener, Portal } from "@mui/material"
import SettingPanel, { EditPersonInfoDialog } from "./editModal"
import { handleLogout } from "@/until/index"

export default function Footer() {
    const userInfo = useRecoilValue(userInfoState)
    const [openSetting, setOpenSetting] = useState(false)
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [coord, setCoord] = useState<{ x: number, y: number, width: number } | null>(null)

    const anchorEl = useRef<HTMLButtonElement | null>(null)

    const handleIconButton = () => {
        setOpenSetting((prev) => !prev);
        if (anchorEl.current) {
            const { x, y, width } = anchorEl.current.getBoundingClientRect()
            setCoord({ x: x, y: y - 10, width })
        }
    }

    if (!userInfo) {
        return null
    }

    return (
        <>
            <div className='pt-2 empty:hidden relative'>
                <div className='w-full flex-col max-w-[100%]'>
                    <ClickAwayListener onClickAway={() => setOpenSetting(false)}>
                        <button
                            ref={anchorEl}
                            className={cn('w-full flex p-2 items-center gap-2 rounded-lg  active:bg-[#ececec] hover:bg-[#ececec]', {
                                'bg-[#ececec]': openSetting,
                                'bg-[#f9f9f9]': !openSetting
                            })}
                            onClick={handleIconButton}
                        >
                            <div className='flex-shrink-0 flex items-center justify-center overflow-hidden rounded-full'>
                                <Avatar src="" sx={{ width: 32, height: 32 }} >{userInfo?.user?.username.slice(0, 1)?.toUpperCase()}</Avatar>
                            </div>
                            <div className='relative -top-px grow -space-y-px truncate text-left text-token-text-primary'>
                                <span>{userInfo?.user?.username || '-'}</span>
                            </div>
                        </button>
                    </ClickAwayListener>
                </div>
            </div>
            <EditPersonInfoDialog
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
            />
            {openSetting && coord &&
                <Portal>
                    <div className="fixed top-0 left-0 z-20" style={{ top: coord.y, left: coord.x, width: coord.width }}>
                        <SettingPanel
                            onSetting={() => {
                                setOpenEditDialog(true)
                                setOpenSetting(false)
                            }}
                            onLogout={handleLogout}
                        />
                    </div>
                </Portal>
            }
        </>
    )
}