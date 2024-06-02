import React from 'react';
import { HistoryList } from './historyItem';
import Footer from './footer';
import Link from 'next/link';
import LogoSvg from '@/assets/logo.svg'
import EditIcon from '@/assets/icons/icon-edit.svg'
import IconGptsLogo from '@/assets/icons/icon-gpts-logo.svg'

function SideBarHeader() {
    return (
        <div className='sticky z-20 left-0 top-0 right-0 bg-[#f9f9f9] pt-3.5'>
            <div className='pb-0.5 last:pb-0'>
                <Link
                    href='/'
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
                </Link >
            </div>
        </div>
    )
}

function FixedModalRoles() {
    return (
        <div>
            <Link href='/gpts'>
                <button className='flex h-10 w-full items-center gap-2 rounded-lg px-2 font-medium text-token-text-primary hover:bg-token-sidebar-surface-secondary juice:gap-2.5 juice:font-normal'>
                    <div className='flex items-center justify-center text-token-text-secondary h-7 w-7'>
                        <IconGptsLogo />
                    </div>
                    <span className='text-sm'>探索 GPT</span>
                </button>
            </Link>
            <Link href='/gc'>
                <button className='flex h-10 w-full items-center gap-2 rounded-lg px-2 font-medium text-token-text-primary hover:bg-token-sidebar-surface-secondary juice:gap-2.5 juice:font-normal'>
                    <div className='flex items-center justify-center text-token-text-secondary h-7 w-7'>
                        <IconGptsLogo />
                    </div>
                    <span className='text-sm'>图片助手</span>
                </button>
            </Link>
        </div>
    )
}


export default function SideBar() {
    return (
        <div className='max-w-sx md:w-[260px] h-full' id='gpt-sidebar'>
            <div className='flex flex-col h-full'>
                <div className="flex flex-col h-full min-h-0">
                    <nav className='flex w-full h-full flex-col px-3 pb-3.5'>
                        <div className='flex-1 flex flex-col transition-opacity duration-500 -mr-2 pr-2 overflow-y-auto'>
                            <SideBarHeader />
                            <FixedModalRoles />
                            <HistoryList />
                        </div>
                        <Footer />
                    </nav>
                </div>
            </div>
        </div>
    )
}
