import React from 'react'
import Logo from '@/assets/logo.svg'

export default function ChatTemplate() {
    return (
        <div className='w-full h-full flex flex-col items-center justify-center'>
            <div className='relative'>
                <div className='mb-3 h-12 w-12'>
                    <div className='gizmo-shadow-stroke relative flex h-full items-center justify-center rounded-full bg-token-main-surface-primary text-token-text-primary'>
                        <Logo />
                    </div>
                </div>
            </div>
            <div className='mb-5 text-2xl font-semibold'>今天能帮您些什么？</div>
        </div>
    )
}
