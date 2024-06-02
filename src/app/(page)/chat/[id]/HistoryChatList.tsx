'use client'

import { getHistoryDetail } from '@/api/gpt'
import { GptChatItem, SelfChatItem } from '@/component/ChatItem'
import { CHAT_ROLE, IRecordStreamItem } from '@/interface/chat'
import { useRequest } from 'ahooks'
import { useParams } from 'next/navigation'
import React, { Fragment, useEffect } from 'react'

export default function HistoryChatList({ getRecordLength }: {
    getRecordLength: (len: number) => void
}) {

    const { id } = useParams()
    const recordApi = useRequest(getHistoryDetail, {
        manual: true,
        loadingDelay: 200,
        onSuccess: (rst: { messages: IRecordStreamItem[], title: string }) => {
            if (rst.messages.length) {
                getRecordLength(rst.messages.length)
                document.title = rst.title
            }
        }
    })

    useEffect(() => {
        if (id) {
            recordApi.run(id as string)
        }
    }, [id])

    if (recordApi.loading && !id) {
        return (
            <div className="w-full h-full bg-token-bg" />
        )
    }

    return (
        <Fragment>
            {
                recordApi.data?.messages.map((item, index) => {
                    return item.role === CHAT_ROLE.USER ? <SelfChatItem
                        index={index + 1}
                        chatId={id as string}
                        content={item.content.parts[0]}
                        id={item.message_id}
                        key={index}
                    /> : <GptChatItem
                        md={item.content.parts[0]}
                        index={index + 1}
                        chatId={id as string}
                        msgId={item.message_id}
                        key={index}
                        selfRender
                    />
                })
            }
        </Fragment>
    )
}
