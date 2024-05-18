'use client'

import React from 'react'
import ScrollToBottom from 'react-scroll-to-bottom';
import PageHeader from '@/component/PageHeader';


export default function Presentation() {
    return (
        <div className='flex-1 overflow-hidden'>
            <ScrollToBottom className='h-full'>
                <div className='p-0'>
                    <PageHeader />
                </div>
            </ScrollToBottom>
        </div>
    )
}
