'use client'


import { getHistoryDetail } from '@/api/gpt'
import { GptChatItem, SelfChatItem } from '@/component/ChatItem'
import { CHAT_ROLE, IRecordStreamItem, IStreamItem } from '@/interface/chat'
import { useRequest } from 'ahooks'
import { useParams } from 'next/navigation'
import React, { Dispatch, Fragment } from 'react'



export default function HistoryChatList({ getRecordLength }: {
    getRecordLength: (len: number) => void
}) {

    const { id } = useParams()
    const recordApi = useRequest(getHistoryDetail, {
        defaultParams: [id as string],
        loadingDelay: 200,
        onSuccess: (rst: { messages: IRecordStreamItem[], title: string }) => {
            if (rst.messages.length) {
                getRecordLength(rst.messages.length)
                document.title = rst.title
            }
        }
    })

    if (recordApi.loading) {
        return (
            <div className="w-full h-full bg-token-bg" />
        )
    }
    console.log(recordApi.data?.messages[0])
    return recordApi.data?.messages.map((item, index) => (
        <Fragment key={index}>
            {item.role === CHAT_ROLE.USER ? <SelfChatItem index={index + 1} content={item.content.parts[0]} id={item.message_id} /> :
                <GptChatItem md={item.content.parts[0]} index={index + 1} msgId={item.message_id} selfRender />}
        </Fragment>
    ))
}
