'use client'

import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom';
import PageHeader from '@/component/PageHeader';
import { SelfChatItem, GptChatItem } from '@/component/ChatItem';
import mdParser from '@/until/mdit';
import GlobalInputForm from '@/component/Footer';
import { EventSourceMessage, EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source';
import { CHAT_ROLE, IStreamItem, MESSAGE_TYPE } from '@/interface/chat';
import HistoryChatList from './HistoryChatList';
import 'highlight.js/styles/atom-one-dark.css';
import { useMediaQuery } from '@mui/material';
import { css } from '@emotion/css'
import { CHAT_MODEL_CONVERTER } from '@/interface/common';
import Welcome from '@/component/Welcome';


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

interface IContentProps {
    conversationId?: string
    isNewChat: boolean
}

export default function ChatGptWindow({ conversationId, isNewChat }: IContentProps) {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const [chatList, setChatList] = useState<any[]>([])
    const [isDirty, setIsDirty] = useState(false)
    const [startWrite, setStartWrite] = useState(false)
    const messageQueue = useRef<IStreamItem[]>([])

    const messageBuffer = useRef<string>('')
    const cacheNode = useRef<HTMLDivElement | null>(null)
    const ctrRef = useRef<AbortController | null>(null)

    const [isStreaming, setIsStreaming] = useState(false)
    const currentChatIndex = useRef(0)
    const hstRecordLength = useRef(0)

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
            setChatList((old) => {
                const newChatList = [...old, {
                    id: data.message.message_id,
                    content: data.message.content.parts[0],
                    conversationId: data.conversation_id,
                }]
                currentChatIndex.current = (newChatList.length + hstRecordLength.current) * 2
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
                    if (dataStream.message.content.parts[0]) {
                        messageBuffer.current += dataStream.message.content.parts[0]
                    }

                    if (dataStream.message.status === 'in_progress') {
                        updateCacheNode(mdParser.render(messageBuffer.current), dataStream.message.message_id);
                    } else if (dataStream.message.status === 'finished_successfully' || dataStream.message.status === 'finished') {
                        messageBuffer.current = '';
                        if (cacheNode.current) {
                            cacheNode.current.classList.remove("result-streaming");
                        }
                        cacheNode.current = null;
                        processingQueue = false
                    }
                }
            } catch (error) {
                console.error('error update', error);
                setStartWrite(false)
                setIsStreaming(false)
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
            "messages": {
                "content": inputPrompt.trim()
            },
            "model": "gpt-3.5-turbo",
            "conversation_mode": {
                "kind": "primary_assistant"
            }
        }

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
                    setIsStreaming(false)
                    setStartWrite(false)
                    return
                } else {
                    const dataStream = JSON.parse(event.data);
                    if (dataStream?.type == MESSAGE_TYPE.TITLE_GENERATION) {
                        history.pushState({}, "", `/chat/${dataStream.conversation_id}`);
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

    const getRecordLength = (len: number) => {
        hstRecordLength.current = len
    }

    return (
        <div className="flex h-full flex-col focus-visible:outline-0" role='presentation'>
            {
                isNewChat && !isDirty ? <Welcome /> : <div className='flex-1 overflow-hidden'>
                    <ScrollToBottom
                        className={scrollBottomRoot}
                        initialScrollBehavior='smooth'
                        followButtonClassName="scroll-bottom-anchor"
                    >
                        <div className='flex flex-col text-sm pb-9'>
                            {isDesktop && <PageHeader modeList={CHAT_MODEL_CONVERTER} />}
                            {!isNewChat && <HistoryChatList getRecordLength={getRecordLength} />}
                            {
                                chatList.map((item, index) => {
                                    const numId = hstRecordLength.current + index * 2 + 1
                                    return (
                                        <Fragment key={numId}>
                                            <SelfChatItem content={item.content} index={numId} id={item.id} chatId={item.conversationId} />
                                            <GptChatItem index={numId + 1} chatId={item.conversationId} />
                                        </Fragment>
                                    )
                                })
                            }
                        </div>
                    </ScrollToBottom>
                </div>
            }
            <GlobalInputForm
                displayPrompts={isNewChat && !isDirty}
                isStreaming={isStreaming}
                onSend={onSend}
                onStop={onStop}
            />
        </div>
    )
}
