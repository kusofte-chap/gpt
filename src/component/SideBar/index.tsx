import React from 'react';
import { HistoryList } from './historyItem';
import Footer from './footer';
import LogoSvg from '@/assets/logo.svg'
import EditIcon from '@/assets/icons/icon-edit.svg'

function SideBarHeader() {
    return (
        <div className='sticky z-20 left-0 top-0 right-0 bg-[#f9f9f9] pt-3.5'>
            <div className='pb-0.5 last:pb-0'>
                <a
                    type='button'
                    className='group flex h-10 items-center gap-2 rounded-lg bg-[#f9f9f9] hover:bg-[#ececec] px-2 font-medium cursor-pointer'
                >
                    <div className='w-7 h-7 flex-shrink-0 rounded-full bg-white border border-token-border-light'>
                        <div className='h-full  flex items-center justify-center position-relative'>
                            <LogoSvg className='w-2/3 h-2/3' />
                        </div>
                    </div>
                    <div className='grow overflow-hidden text-ellipsis whitespace-nowrap text-sm text-token-text-primary'>
                        新聊天
                    </div>
                    <button className='flex flex-shrink-0 items-center justify-center w-5 h-5 border-none bg-transparent outline-none text-token-text-primary'>
                        <EditIcon />
                    </button>
                </a>
            </div>
        </div>
    )
}


export default function SideBar() {
    return (
        <div className='w-[260px] h-full' id='gpt-sidebar'>
            <div className='flex flex-col h-full'>
                <div className="flex flex-col h-full min-h-0">
                    <nav className='flex w-full h-full flex-col px-3 pb-3.5'>
                        <div className='flex-col flex-1 transition-opacity duration-500 -mr-2 pr-2 overflow-y-auto'>
                            <SideBarHeader />
                            <HistoryList />
                        </div>
                        <Footer />
                    </nav>
                </div>
            </div>
        </div>
    )
}
