'use client'

import React, { useMemo, useState } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom';
import PageHeader from '@/component/PageHeader';
import { SelfChatItem } from '@/component/ChatItem';
import ChatTemplate from '@/component/ChatTemplate';
import TypingMarkdown from '@/component/TypingMarkdown';

export default function ChatContent() {
    return (
        <div className='flex-1'>
            {/* <ScrollToBottom className='h-full'> */}
            <div className='p-0'>
                <div className='flex flex-col text-sm pb-9'>
                    <PageHeader />
                    <SelfChatItem />
                    <TypingMarkdown />
                </div>
            </div>
            {/* </ScrollToBottom> */}
        </div>
    )
}
