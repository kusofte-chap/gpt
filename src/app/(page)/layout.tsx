import React from 'react'
import LeftSideBar from '@/component/LeftSideBar'
import MinCloseBar from '@/component/MinCloseBar'

export default function PageLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='h-screen w-full overflow-hidden flex relative z-0'>
            <div className='flex-shrink-0 overflow-x-hidden bg-[#f9f9f9]'>
                <LeftSideBar />
            </div>
            <div className='relative flex-1 flex-col h-full max-w-full overflow-hidden'>
                <main className='relative h-full w-full flex-1 flex-col'>
                    <MinCloseBar />
                    {children}
                </main>
            </div>
        </div>
    )
}
