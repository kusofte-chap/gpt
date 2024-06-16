'use client'

import React, { Fragment, useEffect, useRef, useState } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom';
import { SelfChatItem, GptChatItem } from '@/component/ChatItem';
import mdParser from '@/until/mdit';
import GlobalInputForm from '@/component/Footer';
import { EventSourceMessage, EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source';
import { CHAT_ROLE, IStreamItem, MESSAGE_TYPE } from '@/interface/chat';
import 'highlight.js/styles/atom-one-dark.css';
import { css } from '@emotion/css'
import { useRequest } from 'ahooks';
import { asyncGetGptsInfo } from '@/api/gpts';
import { IGroupListItem } from '@/interface/gpts';
import IconMenuDown from '@/assets/icons/icon-menu.svg';
import { useRecoilValue } from 'recoil';
import { userInfoState } from '@/store/atom';
import { useParams } from 'next/navigation';
import Spinning from '@/component/Spinning';

class RetriableError extends Error { }

class FatalError extends Error { }

const scrollBottomRoot = css({
    width: '100%',
    height: '100%',
    '&>div': {
        width: '100%',
        height: '100%',
        overflowY: 'auto'
    }
})

function AsstPageHeader({ id, asstName }: { id: string, asstName: string }) {
    // const userInfo = useRecoilValue(userInfoState)
    return (
        <div className='sticky top-0 juice:p-3 mb-1.5 flex items-center justify-between z-10 h-14 p-2 font-semibold bg-token-main-surface-primary'>
            <div className='flex items-center gap-2 overflow-hidden'>
                <button className='group flex cursor-pointer items-center gap-1 rounded-xl py-2 px-3 text-lg font-semibold hover:bg-token-main-surface-secondary text-token-text-secondary juice:rounded-lg overflow-hidden whitespace-nowrap'>
                    {asstName}
                    <IconMenuDown />
                </button>
            </div>
            {/* <div className='flex gap-2 pr-1'>
                <button className='flex h-10 w-10 items-center justify-center rounded-full hover:bg-token-main-surface-secondary focus-visible:bg-token-main-surface-secondary focus-visible:outline-0'>
                    <div className='flex items-center justify-center overflow-hidden rounded-full'>
                        <div className='relative flex'>
                            <img alt="User" loading="lazy" className="object-cover object-center rounded-sm w-8 h-8" src={userInfo?.user?.avatarUrl} />
                        </div>
                    </div>
                </button> */}
            {/* </div> */}
        </div >
    )
}

function AsstWelcome({ data, onClickPrompt }: { data: IGroupListItem, onClickPrompt: (prompt: string) => void }) {
    return (
        <div className='relative h-full'>
            <AsstPageHeader id='asst_CGNeqJSMpeLm1vum47MFzVVL' asstName='校对员' />
            <div className='flex h-full flex-col items-center justify-center text-token-text-primary'>
                <div className='mb-3 h-20 w-20'>
                    <div className='gizmo-shadow-stroke overflow-hidden rounded-full'>
                        <img src={data?.profile_picture_name} alt={data?.name} className='h-full w-full bg-token-main-surface-secondary' width={80} height={80} />
                    </div>
                </div>
                <div className='flex flex-col items-center gap-2'>
                    <div className='text-center text-2xl font-semibold'>{data?.name}</div>
                    <div className='text-sm text-token-text-tertiary'>{`创建者：${data?.author.name}`}</div>
                    <div className='max-w-md text-center text-sm font-normal text-token-text-primary'>
                        {data?.description}
                    </div>
                </div>
                <div className='mx-3 mt-12 flex max-w-3xl flex-wrap items-stretch justify-center gap-4'>
                    <div className='flex max-w-3xl flex-wrap items-stretch justify-center gap-4'>
                        {
                            data.prompt_starters.slice(0, 2).map((prompt) => {
                                return (
                                    <button
                                        onClick={() => onClickPrompt(prompt)}
                                        className='relative flex w-40 flex-col gap-2 rounded-2xl border border-token-border-light px-3 pb-4 pt-3 text-start align-top text-[15px] shadow-[0_0_2px_0_rgba(0,0,0,0.05),0_4px_6px_0_rgba(0,0,0,0.02)] transition hover:bg-token-main-surface-secondary' key={prompt}>
                                        <div className='line-clamp-3 text-balance text-gray-600 dark:text-gray-500 break-word'>{prompt}</div>
                                    </button>
                                )
                            })
                        }
                    </div>
                    <div className='flex max-w-3xl flex-wrap items-stretch justify-center gap-4'>
                        {
                            data.prompt_starters.slice(2).map((prompt) => {
                                return (
                                    <button
                                        onClick={() => onClickPrompt(prompt)}
                                        className='relative flex w-40 flex-col gap-2 rounded-2xl border border-token-border-light px-3 pb-4 pt-3 text-start align-top text-[15px] shadow-[0_0_2px_0_rgba(0,0,0,0.05),0_4px_6px_0_rgba(0,0,0,0.02)] transition hover:bg-token-main-surface-secondary' key={prompt}>
                                        <div className='line-clamp-3 text-balance text-gray-600 dark:text-gray-500 break-word'>{prompt}</div>
                                    </button>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ChatGptsWindow() {
    const params = useParams()
    const userInfo = useRecoilValue(userInfoState)
    const [chatList, setChatList] = useState<any[]>([])

    const [isDirty, setIsDirty] = useState(false)
    const messageQueue = useRef<IStreamItem[]>([])
    const messageBuffer = useRef<string>('')

    const cacheNode = useRef<HTMLDivElement | null>(null)
    const ctrRef = useRef<AbortController | null>(null)

    const [isStreaming, setIsStreaming] = useState(false)
    const currentChatIndex = useRef<number>(0)

    const [conversationId, setConversationId] = useState<string>()

    const [asstDetail, setAsstDetail] = useState<IGroupListItem>()

    const [startWrite, setStartWrite] = useState(false)

    const asstApi = useRequest<IGroupListItem, any>(asyncGetGptsInfo, {
        manual: true,
        onSuccess: (data) => {
            if (data) {
                setAsstDetail(data)
            }
        }
    })

    useEffect(() => {
        if (params.id) {
            asstApi.run(params.id)
        }
    }, [params.id])


    const updateCacheNode = (htmlContent: string, msgId: string) => {
        if (cacheNode.current) {
            cacheNode.current.innerHTML = htmlContent;
        } else {
            cacheNode.current = document.createElement('div');
            cacheNode.current.setAttribute('class', 'result-streaming markdown prose w-full break-words');
            cacheNode.current.setAttribute('data-message-id', msgId);
            const mdParent = document.querySelector(`div[data-gpt-index="${currentChatIndex.current}"] div[data-role="assistant"]`);
            mdParent?.appendChild(cacheNode.current);
            cacheNode.current.innerHTML = htmlContent;
        }
    };

    const renderRoleChat = (data: IStreamItem) => {
        if (data.message.role === CHAT_ROLE.USER) {
            setStartWrite(true)
            setChatList((old) => {
                const newChatList = [...old, {
                    id: data.message.message_id,
                    content: data.message.content.parts[0],
                    conversationId: data.conversation_id,
                    //[1] 1-> 2
                    //[1,2] 2-> 4
                    //[1,2,3] 3-> 6
                }]
                currentChatIndex.current = 2 * newChatList.length
                setConversationId(data.conversation_id)
                return newChatList
            });
        } else if (data.message?.role === CHAT_ROLE.ASSISTANT) {
            messageQueue.current.push(data);
        }
    }

    const startTyping = () => {
        let processingQueue = true
        const timer = setInterval(() => {
            if (messageQueue.current.length === 0) {
                return
            };

            if (!processingQueue) {
                clearInterval(timer);
                return
            }
            const dataStream = messageQueue.current.shift() as IStreamItem;
            try {
                if (dataStream.message && dataStream.message.content && dataStream.message.content.parts) {
                    messageBuffer.current += dataStream.message.content.parts[0];
                    if (dataStream.message.status === 'in_progress') {
                        updateCacheNode(mdParser.render(messageBuffer.current), dataStream.message.message_id);
                    } else if (dataStream.message.status === 'finished_successfully' || dataStream.message.status === 'finished') {
                        messageBuffer.current = '';
                        if (cacheNode.current) {
                            cacheNode.current.classList.remove("result-streaming");
                        }
                        cacheNode.current = null;
                        processingQueue = false
                        setIsStreaming(false)
                        setStartWrite(false)
                    }
                }
            } catch (error) {
                console.error('error update', error);
            } finally {

            }
        }, 50)
    }


    useEffect(() => {
        if (startWrite) {
            startTyping()
        }
    }, [startWrite])

    const onSend = (inputPrompt: string) => {
        const payload: any = {
            messages: {
                content: inputPrompt.trim()
            },
            conversation_mode: {
                kind: "gizmo_interaction",
                assistant_id: asstDetail?.id
            },
        }

        // 继续上次会话
        if (conversationId) {
            payload.conversation_id = conversationId
        }

        if (!isDirty) {
            setIsDirty(true)
        }

        const ctl = new AbortController();
        ctrRef.current = ctl
        setIsStreaming(true)
        fetchEventSource(`http://93.127.216.22:8089/api/conversation`, {
            method: "POST",
            signal: ctl.signal,
            headers: {
                Authorization: `Bearer ${localStorage.getItem("gpt_token")}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            async onopen(response) {
                if (response.ok && response.headers.get('content-type') === EventStreamContentType) {
                    return
                } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
                    throw new FatalError();
                } else {
                    throw new RetriableError();
                }
            },
            onmessage: (event: EventSourceMessage) => {
                if (event.data == "[DONE]") {
                    ctl.abort();
                    return
                } else {
                    const dataStream = JSON.parse(event.data);
                    if (dataStream?.type == MESSAGE_TYPE.TITLE_GENERATION) {
                        // history.pushState({}, "", `/gpts/${asstDetail?.id}/c/${dataStream.conversation_id}`);
                    } else {
                        renderRoleChat(dataStream);
                    }
                }
            },
            onclose() {
                ctl.abort();
            },
            onerror: (event: any) => {
                ctl.abort();
                setIsStreaming(false)
            }
        });
    }

    const onStop = () => {
        if (ctrRef.current) {
            ctrRef.current.abort()
        }
    }

    const handleClickPrompt = (prompt: string) => {
        onSend(prompt)
    }

    if (!asstDetail) {
        return (
            <div className='flex h-full flex-col items-center justify-center'>
                <Spinning />
            </div>
        )
    }

    return (
        <div className="flex h-full flex-col focus-visible:outline-0" role='presentation'>
            <div className='flex-1 overflow-hidden'>
                {
                    !conversationId ? <AsstWelcome data={asstDetail} onClickPrompt={handleClickPrompt} /> :
                        <ScrollToBottom
                            className={scrollBottomRoot}
                            initialScrollBehavior='smooth'
                            followButtonClassName="scroll-bottom-anchor"
                        >
                            <div className='flex flex-col text-sm pb-9'>
                                <AsstPageHeader asstName={asstDetail?.name} id={asstDetail?.id} />
                                {
                                    chatList.map((item, index) => {
                                        const numId = index * 2 + 1
                                        return (
                                            <Fragment key={numId}>
                                                <SelfChatItem
                                                    index={numId}
                                                    id={item.id}
                                                    content={item.content}
                                                    chatId={item.conversationId}
                                                    avatar={userInfo?.user?.avatarUrl}
                                                    userName={userInfo?.user?.username}
                                                />
                                                <GptChatItem
                                                    index={numId + 1}
                                                    name={asstDetail?.name}
                                                    chatId={item.conversationId}
                                                    avatar={asstDetail?.profile_picture_name}
                                                />
                                            </Fragment>
                                        )
                                    })
                                }
                            </div>
                        </ScrollToBottom>
                }
            </div>
            <GlobalInputForm
                displayPrompts={false}
                isStreaming={isStreaming}
                placeHolder={asstDetail ? `给“${asstDetail.name}” 发送消息` : undefined}
                onSend={onSend}
                onStop={onStop}
            />
        </div>
    )
}
