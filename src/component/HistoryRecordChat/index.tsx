'use client'

import { getHistoryDetail } from '@/api/gpt'
import { asyncGetGptsInfo } from '@/api/gpts'
import { GptChatItem, SelfChatItem } from '@/component/ChatItem'
import Spinning from '@/component/Spinning'
import { CHAT_ROLE, IRecordStreamItem } from '@/interface/chat'
import { IGroupListItem } from '@/interface/gpts'
import { userInfoState } from '@/store/atom'
import { useRequest } from 'ahooks'
import React, { Fragment, useEffect } from 'react'
import { useRecoilValue } from 'recoil'

export default function HistoryRecordChat({
    getRecordLength,
    conversationId,
    asstId
}: {
    asstId?: string
    conversationId: string
    getRecordLength: (len: number) => void
}) {

    const userInfo = useRecoilValue(userInfoState)
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

    const asstApi = useRequest<IGroupListItem, any>(asyncGetGptsInfo, {
        manual: true,
    })

    useEffect(() => {
        if (asstId) {
            asstApi.run(asstId)
        }
    }, [asstId])

    useEffect(() => {
        if (conversationId) {
            recordApi.run(conversationId)
        }
    }, [conversationId])

    if (recordApi.loading) {
        return (
            <div className="w-full h-[50vh] bg-token-bg flex items-center justify-center" >
                <Spinning />
            </div>
        )
    }

    return (
        <Fragment>
            {
                recordApi.data?.messages?.map((item, index) => {
                    return item.role === CHAT_ROLE.USER ? <SelfChatItem
                        index={index + 1}
                        chatId={conversationId}
                        content={item.content.parts[0]}
                        id={item.message_id}
                        key={index}
                        avatar={userInfo?.user?.avatarUrl}
                        userName={userInfo?.user?.username}
                    /> : <GptChatItem
                        md={item.content.parts[0]}
                        index={index + 1}
                        chatId={conversationId}
                        msgId={item.message_id}
                        key={index}
                        avatar={asstApi.data?.profile_picture_path}
                        selfRender
                    />
                })
            }
        </Fragment>
    )
}
