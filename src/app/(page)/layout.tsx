'use client'

import React from 'react'
import LeftSideBar from '@/component/LeftSideBar'
import MinCloseBar from '@/component/MinCloseBar'
import PageFooter from '@/component/PageFooter'
import PageHeader, { ModelSelect } from '@/component/PageHeader'
import { useMediaQuery } from '@mui/material'

import IconMobileMenu from '@/assets/icons/icon-mobile-menu.svg'
import IconEdit from '@/assets/icons/icon-edit.svg'

export default function PageLayout({ children }: { children: React.ReactNode }) {
    const isDesktop = useMediaQuery('(min-width: 768px)');

    return (
        <div className='h-screen w-full overflow-hidden flex relative z-0'>
            {isDesktop && <div className='flex-shrink-0 overflow-x-hidden bg-[#f9f9f9]'>
                <LeftSideBar />
            </div>}
            <div className='relative flex-1 flex flex-col h-full max-w-full overflow-hidden'>
                <div className='w-full min-h-[40px] sticky top-0 left-0 flex items-center justify-center border-b border-token-border-medium md:hidden'>
                    <button className='absolute bottom-0 left-0 top-0 inline-flex items-center justify-center rounded-md px-3'>
                        <IconMobileMenu />
                    </button>
                    <ModelSelect />
                    <button className='absolute bottom-0 right-0 top-0 flex items-center'>
                        <span className='px-3'><IconEdit /></span>
                    </button>
                </div>
                <main className='relative h-full w-full flex-1 overflow-auto transition-width'>
                    {isDesktop && <MinCloseBar />}
                    <div className="flex h-full flex-col focus-visible:outline-0" role='presentation'>
                        <div className='flex-1 overflow-hidden'>
                            <div className='p-0 h-full'>
                                <div className='absolute top-0 left-0 right-0 z-10 hidden'>
                                    <PageHeader />
                                </div>
                                {children}
                            </div>
                        </div>
                        <PageFooter />
                    </div>
                </main>
            </div>
        </div>
    )
}
