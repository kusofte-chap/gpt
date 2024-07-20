'use client'

import React, { Fragment, useEffect, useRef, useState } from 'react'
import { faker } from '@faker-js/faker';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import moment from 'moment';
import mdParser from '@/until/mdit';
import PageHeader from '@/component/PageHeader';
import { SelfChatItem, GptChatItem } from '@/component/ChatItem';
import GlobalInputForm from '@/component/Footer';
import { EventSourceMessage, EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source';
import { CHAT_ROLE, IStreamItem, MESSAGE_TYPE } from '@/interface/chat';
import { CHAT_MODEL, CHAT_MODEL_CONVERTER } from '@/interface/common';
import Welcome from '@/component/Welcome';
import { newConversationState, userInfoState } from '@/store/atom';
import { FatalError, RetriableError } from '@/api/request';
import ScrollBottomWrapper from '@/component/ScrollBottomWrapper';
import HistoryRecordChat from '@/component/HistoryRecordChat';
import { useSearchParams } from 'next/navigation';

interface IContentProps {
    conversationId?: string
    isNewChat: boolean
}

export default function ChatGptWindow({ conversationId, isNewChat }: IContentProps) {
    const [chatList, setChatList] = useState<any[]>([])
    const [isDirty, setIsDirty] = useState(false)
    const [startWrite, setStartWrite] = useState(false)
    const [isStreaming, setIsStreaming] = useState(false)
    const searchParams = useSearchParams()
    const [chatModel, setChatModel] = useState(searchParams.get('model') || CHAT_MODEL.GPT_4o)

    const messageQueue = useRef<IStreamItem[]>([])
    const messageBuffer = useRef<string>('')
    const cacheNode = useRef<HTMLDivElement | null>(null)
    const ctrRef = useRef<AbortController | null>(null)

    const currentChatIndex = useRef(0)
    const hstRecordLength = useRef(0)
    const newConversationId = useRef('')

    const userInfo = useRecoilValue(userInfoState)
    const setNewConversation = useSetRecoilState(newConversationState)

    const typingTimer = useRef<any>()

    const startTyping = () => {
        let processingQueue = true
        typingTimer.current = setInterval(() => {
            if (messageQueue.current.length === 0) {
                return
            };

            if (!processingQueue) {
                clearInterval(typingTimer.current);
                return
            }
            const dataStream = messageQueue.current.shift() as IStreamItem;
            try {
                if (dataStream.message && dataStream.message.content) {
                    const buffer = dataStream.message.content.parts?.[0].toString()
                    if (buffer) {
                        messageBuffer.current += buffer
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
                        setIsStreaming(false)
                        setStartWrite(false)
                    }
                }
            } catch (error) {
                setStartWrite(false)
                setIsStreaming(false)
                typingTimer.current = null

            } finally {

            }
        }, 30)
    }

    useEffect(() => {
        if (startWrite) {
            startTyping()
        }
    }, [startWrite])

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
                const newChatList = [...old]
                newChatList[newChatList.length - 1] = {
                    id: data.message.message_id,
                    content: data.message.content.parts[0],
                    conversationId: data.conversation_id,
                }
                return newChatList
            });
            const t = setTimeout(() => {
                clearTimeout(t)
                setStartWrite(true)
            }, 200)
        } else if (data.message?.role === CHAT_ROLE.ASSISTANT) {
            messageQueue.current.push(data);
        }
    }

    const preRenderRole = (content: string) => {
        setChatList((old) => {
            const newChatList = old.concat([
                {
                    id: `faker_${faker.string.uuid()}`,
                    content,
                    conversationId: `faker_${faker.string.uuid()}`,
                }
            ])
            currentChatIndex.current = 2 * newChatList.length + hstRecordLength.current
            return newChatList
        });
    }

    const onSend = (inputPrompt: string) => {
        const payload: any = {
            "messages": {
                "content": inputPrompt.trim()
            },
            "model": chatModel,
            "conversation_mode": {
                "kind": "primary_assistant"
            }
        }

        if (conversationId || newConversationId.current) {
            payload.conversation_id = conversationId || newConversationId.current
        }

        if (!isDirty) {
            setIsDirty(true)
        }

        ctrRef.current = new AbortController();

        setIsStreaming(true)
        preRenderRole(inputPrompt.trim())

        fetchEventSource(process.env.NEXT_PUBLIC_API_CHAT_URL as string, {
            method: "POST",
            signal: ctrRef.current.signal,
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
                    ctrRef.current?.abort();
                } else {
                    const dataStream = JSON.parse(event.data);
                    if (dataStream?.type == MESSAGE_TYPE.TITLE_GENERATION) {
                        history.pushState({}, "", `/chat/${dataStream.conversation_id}`);
                        newConversationId.current = dataStream.conversation_id
                        setNewConversation({
                            conversation_id: dataStream.conversation_id,
                            createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                            model: 'gpt-4o',
                            title: dataStream.title,
                            updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                            type: 'chat',
                        })
                    } else {
                        renderRoleChat(dataStream);
                    }
                }
            },
            onclose() {
                ctrRef.current?.abort();
            },
            onerror: (event: any) => {
                ctrRef.current?.abort();
                setIsStreaming(false)
            }
        });
    }

    const onStop = () => {
        if (ctrRef.current) {
            ctrRef.current.abort()
        }

        if (typingTimer.current) {
            clearInterval(typingTimer.current);
        }
        setIsStreaming(false)
        setStartWrite(false)
    }

    const getRecordLength = (len: number) => {
        hstRecordLength.current = len
    }

    return (
        <div className="flex h-full flex-col focus-visible:outline-0" role='presentation'>
            <div className='hidden md:block'>
                <PageHeader modeList={CHAT_MODEL_CONVERTER} onChangeModel={setChatModel} />
            </div>
            {
                isNewChat && !isDirty ? <Welcome /> : <div className='flex-1 overflow-hidden'>
                    <ScrollBottomWrapper >
                        <div className='flex flex-col text-sm pb-9'>
                            {!isNewChat && <HistoryRecordChat conversationId={conversationId as string} getRecordLength={getRecordLength} />}
                            {
                                chatList.map((item, index) => {
                                    const numId = hstRecordLength.current + index * 2 + 1
                                    return (
                                        <Fragment key={numId}>
                                            <SelfChatItem
                                                content={item.content}
                                                index={numId}
                                                id={item.id}
                                                chatId={item.conversationId}
                                                avatar={userInfo?.user?.avatarUrl}
                                            />
                                            <GptChatItem index={numId + 1} chatId={item.conversationId} />
                                        </Fragment>
                                    )
                                })
                            }
                        </div>
                    </ScrollBottomWrapper>
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
