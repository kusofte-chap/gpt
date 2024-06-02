'use client'

import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import ScrollToBottom, { useScrollToBottom, useSticky } from 'react-scroll-to-bottom';
import PageHeader from '@/component/PageHeader';
import { SelfChatItem, GptChatItem } from '@/component/ChatItem';
import mdParser from '@/until/mdit';
import GlobalInputForm from '@/component/Footer';
import { EventSourceMessage, EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source';
import { CHAT_ROLE, IStreamItem } from '@/interface/chat';

import 'highlight.js/styles/atom-one-dark.css';
import { useMediaQuery } from '@mui/material';
import { css } from '@emotion/css'
import { IMAGE_MODE_CONVERTER } from '@/interface/common';
import { useRecoilValue } from 'recoil';
import { currentChatModelState } from '@/store/atom';

class RetriableError extends Error { }

class FatalError extends Error { }

const scrollBottomRoot = css({
    position: 'relative',
    height: '100%',
    '& > .react-scroll-to-bottom': {
        width: '100%',
        height: '100%',
        overflowY: 'auto'
    }
})

const streamData: any[] = []
export default function AiGcWindow() {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const [chatList, setChatList] = useState<any[]>([])
    const messageQueue = useRef<IStreamItem[]>([])
    const currentChatModel = useRecoilValue(currentChatModelState)

    const messageBuffer = useRef<string>('')
    const cacheNode = useRef<HTMLDivElement | null>(null)
    const ctrRef = useRef<AbortController | null>(null)

    const [isStreaming, setIsStreaming] = useState(false)
    const currentChatIndex = useRef<number>(0)
    const hstRecordLength = useRef<number>(0)

    const updateCacheNode = (htmlContent: string, msg_id: string) => {
        if (cacheNode.current) {
            cacheNode.current.innerHTML = htmlContent;
        } else {
            cacheNode.current = document.createElement('div');
            cacheNode.current.setAttribute('class', 'result-streaming markdown prose w-full break-words');
            cacheNode.current.setAttribute('data-message-id', msg_id);
            const mdParent = document.querySelector(`[data-gpt-index="${currentChatIndex.current}"] div[data-role="assistant"]`);
            mdParent?.appendChild(cacheNode.current);
            cacheNode.current.innerHTML = htmlContent;
        }
    };

    const renderRoleChat = (data: IStreamItem) => {
        if (data.message.role === CHAT_ROLE.USER) {
            setChatList((old) => {
                const newChatList = [...old, {
                    id: data.message.message_id,
                    content: data.message.content.parts[0],
                }]
                currentChatIndex.current = newChatList.length + hstRecordLength.current + 1
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
                    }
                }
            } catch (error) {
                console.error('error', 11);
            } finally {

            }
        }, 50)
    }


    const onSend = (inputPrompt: string) => {
        const ctl = new AbortController();
        ctrRef.current = ctl
        setIsStreaming(true)
        fetchEventSource(`http://47.89.155.63:8089/api/images/generations`, {
            method: "POST",
            signal: ctl.signal,
            headers: {
                Authorization: `Bearer ${localStorage.getItem("gpt_token")}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "prompt": inputPrompt,
                "model": currentChatModel
            }),
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
                console.log(event.data)
                streamData.push(JSON.parse(event.data))

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


    return (
        <div className="flex h-full flex-col focus-visible:outline-0" role='presentation'>
            <div className='flex-1 overflow-hidden'>
                <ScrollToBottom
                    className={scrollBottomRoot}
                    followButtonClassName='anchor-follow-button'
                    initialScrollBehavior='smooth'
                >
                    <div className='flex flex-col text-sm pb-9'>
                        {isDesktop && <PageHeader
                            modeList={IMAGE_MODE_CONVERTER}
                        />}
                        {
                            chatList.map((item, index) => {
                                const numId = hstRecordLength.current + index * 2 + 1
                                return (
                                    <Fragment key={numId}>
                                        <SelfChatItem content={item.content} index={numId} id={item.id} />
                                        <GptChatItem index={numId + 1} />
                                    </Fragment>
                                )
                            })
                        }

                    </div>
                </ScrollToBottom>

            </div>
            <GlobalInputForm
                displayPrompts={false}
                isStreaming={isStreaming}
                onSend={onSend}
                onStop={onStop}
            />
        </div>
    )
}
