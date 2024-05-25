
import React from 'react'
import Logo from '@/assets/logo.svg'

export default function Home() {
    return (
        <div className='w-full h-full flex flex-col items-center justify-center'>
            <div className='relative'>
                <div className='mb-3 h-11 w-11'>
                    <div className='flex h-full items-center justify-center rounded-full border-token-border-light border text-token-text-primary'>
                        <div className='flex items-center justify-center shrink-0'>
                            <Logo className='w-10 h-10' />
                        </div>
                    </div>
                </div>
            </div>
            <div className='mb-5 text-2xl font-semibold'>今天能帮您些什么？</div>
        </div>
    )
}
