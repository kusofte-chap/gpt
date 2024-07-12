'use client'

import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { useRequest } from 'ahooks';
import moment from 'moment';
import cn from 'classnames'
import { faker } from '@faker-js/faker';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { SelfChatItem, GptChatItem } from '@/component/ChatItem';
import mdParser from '@/until/mdit';
import GlobalInputForm from '@/component/Footer';
import { EventSourceMessage, EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source';
import { CHAT_ROLE, IStreamItem, MESSAGE_TYPE } from '@/interface/chat';
import { asyncGetGptsInfo } from '@/api/gpts';
import { IGroupListItem } from '@/interface/gpts';
import { newConversationState, refreshAsstList, userInfoState } from '@/store/atom';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Spinning from '@/component/Spinning';
import ScrollBottomWrapper from '@/component/ScrollBottomWrapper';
import { FatalError, RetriableError } from '@/api/request';
import IconMenuDown from '@/assets/icons/icon-menu.svg';
import HistoryRecordChat from '@/component/HistoryRecordChat';
import StyledTooltip from '@/component/StyledTooltip';
import IconCloseMenu from '@/assets/icons/icon-close-menu.svg'
import { useToggleSideBar } from '@/hooks/index';
import { Menu, MenuItem, useMediaQuery } from '@mui/material';
import IconEdit from '@/assets/icons/icon-edit.svg'
import IconInfo from '@/assets/icons/icon-info.svg'
import IconHide from '@/assets/icons/icon-hide.svg'
import RoleModal from '../ roleModal';
import { settingAsstSidebar } from '@/api/gpt';
import toast from '@/until/message';

export function AsstPageHeader({ data, }: { data: IGroupListItem, }) {
    const isDesktop = useMediaQuery('(min-width: 768px)')
    const { openSidebar, toggleCloseSideBar } = useToggleSideBar()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openRoleModal, setOpenRoleModal] = useState(false)
    const router = useRouter()
    const setRefresh = useSetRecoilState(refreshAsstList)
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const deleteApi = useRequest(settingAsstSidebar, {
        manual: true,
        onSuccess: () => {
            setRefresh(prev => !prev)
        },
        onError: (error: any) => {
            toast.error("删除失败")
        }
    })
    const open = Boolean(anchorEl);

    const placement = useMemo(() => {
        if (isDesktop) {
            return {
                transformOrigin: { horizontal: 'left', vertical: 'top' },
                anchorOrigin: { horizontal: 'left', vertical: 'bottom' }
            }
        }
        return {
            transformOrigin: { horizontal: 'center', vertical: 'top' },
            anchorOrigin: { horizontal: 'center', vertical: 'bottom' }
        }
    }, [isDesktop])

    return (
        <>
            <div className='sticky top-0 mb-1.5 flex items-center gap-2 z-10 h-14 p-2 font-semibold bg-token-main-surface-primary'>
                {isDesktop && !openSidebar && <div className='flex items-center gap-2 overflow-hidden'>
                    <StyledTooltip title='关闭侧栏' placement='bottom' arrow>
                        <button
                            onClick={toggleCloseSideBar}
                            className={cn('h-10 rounded-lg px-2 text-token-text-secondary focus-visible:outline-0 hover:bg-token-sidebar-surface-secondary focus-visible:bg-token-sidebar-surface-secondary', { 'hidden': openSidebar })}>
                            <IconCloseMenu />
                        </button>
                    </StyledTooltip>
                </div>}
                <div className='flex items-center gap-2 overflow-hidden'>
                    <button
                        onClick={handleClick}
                        aria-controls={open ? 'gpt-modal-select-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        className='group flex cursor-pointer items-center gap-1 rounded-xl py-2 px-3 text-lg font-semibold hover:bg-token-main-surface-secondary text-token-text-secondary juice:rounded-lg overflow-hidden whitespace-nowrap'>
                        {`${data?.name}`}
                        <IconMenuDown />
                    </button>
                </div>
                <Menu
                    anchorEl={anchorEl}
                    id="gpt-modal-select-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    slotProps={{
                        paper: {
                            elevation: 0,
                            sx: {
                                p: 0,
                                width: 138,
                                mt: '4px',
                                py: 1,
                                borderRadius: '8px',
                                border: '1px solid #e0e0e0',
                                overflow: 'visible',
                                boxShadow: '0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1)'
                            },
                        },
                    }}
                    MenuListProps={{
                        sx: {
                            p: 0,
                            '.MuiMenuItem-root': {
                                p: 0,
                                bgcolor: 'transparent',
                                ':hover': {
                                    bgcolor: 'unset'
                                }
                            }
                        }
                    }}
                    {...placement as any}
                >
                    <MenuItem onClick={() => {
                        router.replace(`/gpts/${data.id}`)
                    }} >
                        <div className='flex-1 flex gap-2.5 items-center  mx-1.5 rounded p-2.5 text-sm text-token-text-secondary cursor-pointer focus-visible:outline-0 hover:bg-token-main-surface-secondary focus-visible:bg-token-main-surface-secondary radix-disabled:opacity-50 group relative !pr-3 !opacity-100'>
                            <div className='flex-shrink-0 w-5 h-5 flex items-center justify-center'>
                                <IconEdit />
                            </div>
                            新聊天
                        </div>
                    </MenuItem>
                    <MenuItem onClick={() => setOpenRoleModal(true)} >
                        <div className='flex-1 flex gap-2.5 items-center   mx-1.5 rounded p-2.5 text-sm text-token-text-secondary cursor-pointer focus-visible:outline-0 hover:bg-token-main-surface-secondary focus-visible:bg-token-main-surface-secondary radix-disabled:opacity-50 group relative !pr-3 !opacity-100'>
                            <div className='flex-shrink-0 w-5 h-5 flex items-center justify-center'>
                                <IconInfo />
                            </div>
                            关于
                        </div>
                    </MenuItem>
                    <MenuItem onClick={() => {
                        deleteApi.run(data?.id, 'hide')
                    }}>
                        <div className='flex-1 flex gap-2.5 items-center  mx-1.5 rounded p-2.5 text-sm text-token-text-secondary cursor-pointer focus-visible:outline-0 hover:bg-token-main-surface-secondary focus-visible:bg-token-main-surface-secondary radix-disabled:opacity-50 group relative !pr-3 !opacity-100'>
                            <div className='flex-shrink-0 w-5 h-5 flex items-center justify-center'>
                                <IconHide />
                            </div>
                            从边栏隐藏
                        </div>
                    </MenuItem>
                </Menu>
            </div >
            <RoleModal data={data} open={openRoleModal} onClose={() => setOpenRoleModal(false)} />
        </>
    )
}

function AsstWelcome({ data, onClickPrompt }: { data: IGroupListItem, onClickPrompt: (prompt: string) => void }) {
    return (
        <div className='relative h-full'>
            <AsstPageHeader data={data} />
            <div className='flex h-full flex-col items-center justify-center text-[rgba(103,103,103)]'>
                <div className='mb-3 h-20 w-20'>
                    <div className='gizmo-shadow-stroke overflow-hidden rounded-full'>
                        <img src={data?.profile_picture_path} alt={data?.name} className='h-full w-full bg-token-main-surface-secondary' width={80} height={80} />
                    </div>
                </div>
                <div className='flex flex-col items-center gap-2'>
                    <div className='text-center text-2xl font-semibold text-[#0d0d0d]'>{data?.name}</div>
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
                                        <div className='line-clamp-3 text-balance text-[rgba(103,103,103)] break-word'>{prompt}</div>
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
                                        <div className='line-clamp-3 text-balance text-[rgba(103,103,103)] break-word'>{prompt}</div>
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

export default function AsstChatWindow({ isInitGptInfoPage = true }: { isInitGptInfoPage?: boolean }) {
    const { asst_id, thread_id } = useParams()
    const searchParams = useSearchParams()
    const startChatPrompt = searchParams.get('start_chat') || ''

    const userInfo = useRecoilValue(userInfoState)
    const setNewConversation = useSetRecoilState(newConversationState)

    const [chatList, setChatList] = useState<any[]>([])
    const [isDirty, setIsDirty] = useState(false)


    const messageQueue = useRef<IStreamItem[]>([])
    const messageBuffer = useRef<string>('')

    const currentChatIndex = useRef<number>(0)
    const cacheNode = useRef<HTMLDivElement | null>(null)
    const ctrRef = useRef<AbortController | null>(null)
    const timer = useRef<any>()
    const firstLoading = useRef(true)
    const hstRecordLength = useRef(0)

    const [isStreaming, setIsStreaming] = useState(false)
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
        if (asst_id) {
            asstApi.run(asst_id)
        }
    }, [asst_id])

    useEffect(() => {
        if (startChatPrompt && firstLoading.current && isInitGptInfoPage) {
            firstLoading.current = false
            history.pushState({}, "", `/gpts/${asst_id}`);
            onSend(startChatPrompt)
        }
    }, [isInitGptInfoPage])

    const startTyping = () => {
        let processingQueue = true
        timer.current = setInterval(() => {
            if (messageQueue.current.length === 0) {
                return
            };

            if (!processingQueue) {
                clearInterval(timer.current);
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
            messages: {
                content: inputPrompt.trim()
            },
            conversation_mode: {
                kind: "gizmo_interaction",
                assistant_id: asst_id
            },
        }

        // 继续上次会话
        if (thread_id) {
            payload.conversation_id = thread_id
        }

        setIsDirty(true)

        ctrRef.current = new AbortController();

        setIsStreaming(true)
        preRenderRole(inputPrompt.trim())

        fetchEventSource(process.env.NEXT_PUBLIC_API_CHAT_URL as string, {
            method: "POST",
            signal: ctrRef.current?.signal,
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
                    return
                } else {
                    const dataStream = JSON.parse(event.data);
                    if (dataStream?.type == MESSAGE_TYPE.TITLE_GENERATION) {
                        history.pushState({}, "", `/gpts/${asst_id}c/${dataStream.conversation_id}`);
                        setNewConversation({
                            conversation_id: dataStream.conversation_id,
                            createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                            model: '_',
                            title: dataStream.title,
                            updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                            type: 'gpt',
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
        if (timer.current) {
            clearInterval(timer.current);
        }
    }

    const handleClickPrompt = (prompt: string) => {
        onSend(prompt)
    }

    const getRecordLength = (len: number) => {
        hstRecordLength.current = len
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
                    (isInitGptInfoPage && !isDirty) ? <AsstWelcome data={asstDetail} onClickPrompt={handleClickPrompt} /> :
                        <ScrollBottomWrapper>
                            <div className='flex flex-col text-sm pb-9'>
                                <AsstPageHeader data={asstDetail} />
                                {!isInitGptInfoPage &&
                                    <HistoryRecordChat
                                        asstId={asst_id as string}
                                        conversationId={thread_id as string}
                                        getRecordLength={getRecordLength}
                                    />
                                }
                                {
                                    chatList.map((item, index) => {
                                        const numId = hstRecordLength.current + index * 2 + 1
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
                                                    avatar={asstDetail?.profile_picture_path}
                                                />
                                            </Fragment>
                                        )
                                    })
                                }
                            </div>
                        </ScrollBottomWrapper>
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
