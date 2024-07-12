'use client'

import React, { Suspense, useMemo } from 'react'
import LeftSideBar from '@/component/SideBar'
import { ModelSelect } from '@/component/PageHeader'
import IconEdit from '@/assets/icons/icon-edit.svg'
import { RecoilRoot } from 'recoil'
import Updated from '@/component/Updated'
import { SnackbarProvider } from 'notistack';
import MobileIconMenu from '@/component/ Drawer'
import { CHAT_MODEL_CONVERTER } from '@/interface/common'
import { usePathname } from 'next/navigation'
import { Stack, Typography } from '@mui/material'


const Loading = () => {
    return (<div className='w-screen h-screen flex items-center justify-center text-token-text-primary text-sm'>Application is loading...</div>)
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
    const asPathName = usePathname()

    const modelMenuList = useMemo(() => {
        if (asPathName.startsWith('/chat')) {
            return CHAT_MODEL_CONVERTER
        }
        if (asPathName === '/gc') {
            return []
        }
        return []
    }, [asPathName])

    const isGpts = useMemo(() => {
        if (asPathName.startsWith('/gpts')) {
            return true
        }
        return false
    }, [asPathName])


    return (
        <Suspense fallback={<Loading />}>
            <RecoilRoot>
                <Updated />
                <div className='h-screen w-full overflow-hidden flex relative z-0'>
                    <div className='flex-shrink-0 overflow-x-hidden bg-[#f9f9f9] hidden md:block'>
                        <LeftSideBar />
                    </div>
                    <div className='relative flex-1 flex flex-col h-full max-w-full overflow-hidden'>
                        <div className='w-full min-h-[40px] sticky top-0 left-0 flex items-center justify-center border-b border-token-border-medium md:hidden'>
                            <MobileIconMenu />
                            {modelMenuList.length > 0 && <ModelSelect modeList={modelMenuList} />}
                            {!isGpts && <button className='absolute bottom-0 right-0 top-0 flex items-center'>
                                <span className='px-3'>
                                    <IconEdit />
                                </span>
                            </button>}
                        </div>
                        <main className='relative h-full w-full flex-1 overflow-auto transition-width'>
                            {children}
                        </main>
                    </div>
                </div>
                <SnackbarProvider maxSnack={1} />
            </RecoilRoot>
        </Suspense>
    )
}
