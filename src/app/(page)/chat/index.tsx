'use client'

import React, { useMemo, useState } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom';
import PageHeader from '@/component/PageHeader';
import ChatItem from '@/component/ChatItem';
import ChatTemplate from '@/component/ChatTemplate';
import { useRequest } from 'ahooks';
import { getDefaultPrompts } from '@/api/gpt';




function ChatContentTemplate() {
    return (
        <ScrollToBottom className='h-full'>
            <div className='p-0'>
                <div className='flex flex-col text-sm pb-9'>
                    <PageHeader />
                    <ChatItem />
                </div>
            </div>
        </ScrollToBottom>
    )
}

function InitTemplate() {
    return (
        <div className='p-0 h-full'>
            <div className='absolute top-0 left-0 right-0 z-10'>
                <PageHeader />
            </div>
            <ChatTemplate />
        </div>
    )
}

export default function Presentation() {
    const [isInitChat, setIsInitChat] = useState(0)

    // const { data, loading } = useRequest(getDefaultPrompts)
    // console.log('data', data)

    const Template = useMemo(() => {
        return [InitTemplate, ChatContentTemplate][0]
    }, [isInitChat])

    return (
        <div className='flex-1 overflow-hidden'>
            <Template />
        </div>
    )
}
