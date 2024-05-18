'use client'

import { useState } from "react"
import cn from 'classnames'
import SettingPanel, { EditPersonInfoDialog } from "./editModal"

export default function Footer() {
    const [openSetting, setOpenSetting] = useState(false)
    const [openEditDialog, setOpenEditDialog] = useState(false)

    return (
        <div className='pt-2 empty:hidden relative'>
            <div className='w-full flex-col max-w-[100%]'>
                <button className={cn('w-full flex p-2 items-center gap-2 rounded-lg bg-[#f9f9f9] hover:bg-[#ececec]', { 'bg-[#ececec]': openSetting })}
                    onClick={() => setOpenSetting(!openSetting)}
                >
                    <div className='flex-shrink-0 flex items-center justify-center overflow-hidden rounded-full'>
                        <img src='https://i2.wp.com/cdn.auth0.com/avatars/ru.png?ssl=1' width='32' height='32' className='rounded-sm' />
                    </div>
                    <div className='relative -top-px grow -space-y-px truncate text-left text-token-text-primary'>
                        <span>rui yang</span>
                    </div>
                </button>
                {openSetting && <SettingPanel
                    onSetting={() => {
                        setOpenEditDialog(true)
                        setOpenSetting(false)
                    }}
                    onLogout={() => { }}
                />
                }
                <EditPersonInfoDialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} />
            </div>
        </div>
    )
}