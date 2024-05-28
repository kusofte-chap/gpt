'use client'

import { useState } from "react"
import cn from 'classnames'
import { useRecoilValue } from "recoil"
import { userInfoState } from "@/store/atom"
import { Avatar } from "@mui/material"
import SettingPanel, { EditPersonInfoDialog } from "./editModal"
import { handleLogout } from "@/until/index"

export default function Footer() {
    const [openSetting, setOpenSetting] = useState(false)
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const userInfo = useRecoilValue(userInfoState)

    if (!userInfo) {
        return null
    }

    return (
        <div className='pt-2 empty:hidden relative'>
            <div className='w-full flex-col max-w-[100%]'>
                <button
                    className={cn('w-full flex p-2 items-center gap-2 rounded-lg bg-[#f9f9f9] hover:bg-[#ececec]', { 'bg-[#ececec]': openSetting })}
                    onClick={() => setOpenSetting(!openSetting)}
                >
                    <div className='flex-shrink-0 flex items-center justify-center overflow-hidden rounded-full'>
                        <Avatar src="" sx={{ width: 32, height: 32 }} >{userInfo?.user?.username.slice(0, 1)?.toUpperCase()}</Avatar>
                    </div>
                    <div className='relative -top-px grow -space-y-px truncate text-left text-token-text-primary'>
                        <span>{userInfo?.user?.username || '-'}</span>
                    </div>
                </button>
                {openSetting && <SettingPanel
                    onSetting={() => {
                        setOpenEditDialog(true)
                        setOpenSetting(false)
                    }}
                    onLogout={handleLogout}
                />
                }
                <EditPersonInfoDialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} />
            </div>
        </div>
    )
}