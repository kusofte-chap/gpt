'use client'

import { Drawer } from '@mui/material'
import React from 'react'
import IconMobileMenu from '@/assets/icons/icon-mobile-menu.svg'
import LeftSideBar from '@/component/SideBar'
import { useRecoilState, } from 'recoil'
import { mobileDrawerState } from '@/store/atom'

export default function MobileIconMenu() {
    const [openSidebar, setOpenSidebar] = useRecoilState(mobileDrawerState)
    return (
        <>
            <button onClick={() => setOpenSidebar(prev => !prev)} className='absolute bottom-0 left-0 top-0 inline-flex items-center justify-center rounded-md px-3'>
                <IconMobileMenu />
            </button>
            <Drawer
                keepMounted
                open={openSidebar}
                onClose={() => setOpenSidebar(false)}>
                <div className='w-[320px] h-full bg-[#f9f9f9]'>
                    <LeftSideBar />
                </div>
            </Drawer>
        </>
    )
}
