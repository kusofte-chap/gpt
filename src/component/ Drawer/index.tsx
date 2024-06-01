'use client'

import { Drawer } from '@mui/material'
import React, { useState } from 'react'
import IconMobileMenu from '@/assets/icons/icon-mobile-menu.svg'
import LeftSideBar from '@/component/SideBar'

export default function MobileIconMenu() {
    const [openMobileDrawer, setOpenMobileDrawer] = useState(false)

    return (
        <>
            <button onClick={() => setOpenMobileDrawer(true)} className='absolute bottom-0 left-0 top-0 inline-flex items-center justify-center rounded-md px-3'>
                <IconMobileMenu />
            </button>
            <Drawer
                keepMounted
                open={openMobileDrawer}
                onClose={() => setOpenMobileDrawer(false)}>
                <div className='w-[320px] h-full bg-[#f9f9f9]'>
                    <LeftSideBar />
                </div>
            </Drawer>
        </>
    )
}
