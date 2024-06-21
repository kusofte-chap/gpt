'use client'

import cn from 'classnames'
import { ChangeEvent, useContext, useMemo, useRef, useState } from "react"
import { deleteConversation, renameConversation } from '@/api/gpt'
import MoreIcon from '@/assets/icons/icon-more.svg'
import { IHistoryItem } from "@/interface/history"
import { ClickAwayListener, Portal } from '@mui/material'
import { PopoverProvider, PopoverContext } from "./context"
import IconRename from '@/assets/icons/icon-rename.svg'
import IconDelete from '@/assets/icons/icon-delete.svg'
import { useRequest } from 'ahooks'
import { IGroupListItem } from '@/interface/gpts'
import { asyncGptsUsed } from '@/api/gpts'
import IconGptsLogo from '@/assets/icons/icon-gpts-logo.svg'
import _groupBy from 'lodash/groupBy'
import Link from 'next/link'
import toast from '@/until/message'
import Spinning from '../Spinning'
import {
    CSSTransition,
    TransitionGroup,
} from 'react-transition-group';

function ChartItem({ data, onDelete }: { data: IHistoryItem, onDelete: (id: string) => void }) {
    const { activeItemId, setActiveItemId } = useContext(PopoverContext)
    const [openPopup, setOpenPopup] = useState(false)
    const [renameValue, setRenameValue] = useState('')
    const [isEditing, setIsEditing] = useState(false)

    const anchorEl = useRef<HTMLButtonElement | null>(null)
    const [coord, setCoord] = useState<{ x: number, y: number } | null>(null)

    const handleIconButton = (event: any) => {
        setOpenPopup((prev) => !prev);
        setActiveItemId(data.conversation_id)
        if (anchorEl.current) {
            const { height, x, y } = anchorEl.current.getBoundingClientRect()
            setCoord({ x: x, y: height + y })
        }
    }

    const handleItemClick = () => {
        setActiveItemId(data.conversation_id)
    };

    const handleOnClickRename = () => {
        setIsEditing(true)
        setOpenPopup(false)
    }

    const handleOnBlurRename = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.trim()
        setIsEditing(false)
        let isLoading = false
        if (inputValue && inputValue.length < 50) {
            if (isLoading) {
                return
            }
            isLoading = true
            renameConversation(data.conversation_id, inputValue).then((rst) => {
                setRenameValue(inputValue)
            }).catch((error) => {
                toast.error("重命名失败")
            }).finally(() => {
                isLoading = false
            })
        }
    }

    const handleDelete = () => {
        setIsEditing(false)
        onDelete(data.conversation_id)
    }

    const isActive = useMemo(() => {
        return data.conversation_id === activeItemId
    }, [activeItemId])

    return (
        <li
            ref={data.nodeRef}
            className={cn('group relative rounded-lg cursor-pointer', {
                'active:opacity-90 hover:bg-token-sidebar-surface-secondary': !isActive,
                'opacity-90 bg-token-sidebar-surface-secondary': isActive
            })}>
            {
                isEditing ? <div className='gap-2 p-2'>
                    <input
                        autoFocus
                        maxLength={50}
                        defaultValue={renameValue || data.title}
                        onBlur={handleOnBlurRename}
                    />
                </div> : <Link href={`/chat/${data.conversation_id}`} className="flex items-center gap-2 p-2" onClick={handleItemClick}>
                    <div className='relative grow overflow-hidden whitespace-nowrap'>
                        {data.title}
                        <div className={cn('absolute bottom-0 right-0 top-0 bg-gradient-to-l to-transparent from-token-sidebar-surface-primary  w-10 from-0% ', {
                            'group-hover:from-token-sidebar-surface-secondary group-hover:w-20 group-hover:from-60%': !isActive,
                            'from-token-sidebar-surface-secondary w-20 from-60%': isActive
                        })} />
                    </div>
                </Link>
            }
            <div className={cn('absolute bottom-0 right-0 top-0 items-center pr-2', { 'hidden group-hover:flex': !isActive, 'flex': isActive })} >
                <ClickAwayListener onClickAway={() => setOpenPopup(false)}>
                    <button
                        ref={anchorEl}
                        type='button'
                        onClick={handleIconButton}
                        className='chat-title-btn flex items-center justify-center border-none bg-transparent outline-none text-[#0d0d0d]'
                    >
                        <MoreIcon />
                    </button>
                </ClickAwayListener>
                {
                    openPopup && coord && < Portal container={document.body}>
                        <div
                            style={{ top: coord.y, left: coord.x }}
                            className='absolute top-[18px] left-[18px] z-10 max-w-xs rounded-lg popover bg-token-main-surface-primary shadow-lg will-change-[opacity,transform] border border-token-border-light'>
                            <button
                                onClick={handleOnClickRename}
                                className='flex w-[90px] gap-2 items-center m-1.5 rounded p-2.5 text-sm cursor-pointer focus-visible:outline-0 hover:bg-token-main-surface-secondary focus-visible:bg-token-main-surface-secondary group relative'>
                                <IconRename />
                                重命名
                            </button>
                            <button
                                onClick={handleDelete}
                                className='flex w-[90px] gap-2 items-center m-1.5 rounded p-2.5 text-sm cursor-pointer focus-visible:outline-0 hover:bg-token-main-surface-secondary focus-visible:bg-token-main-surface-secondary group relative text-token-text-error'>
                                <IconDelete />
                                删除
                            </button>
                        </div>
                    </Portal>
                }
            </div>
        </li >
    )
}

function HistoryGroup({ chatList, onDelete, title, }: {
    chatList: IHistoryItem[],
    title: string,
    onDelete: (id: string) => void
}) {
    return (
        <div className='relative mt-5 empty:mt-0 empty:hidden first:mt-0 last:mb-5'>
            <div className='bg-token-sidebar-surface-primary'>
                <div className='flex items-center h-9'>
                    <h3 className='pb-2 pt-3 px-2 text-xs font-medium text-ellipsis overflow-hidden break-all text-token-text-secondary'>{title}</h3>
                </div>
            </div>
            <TransitionGroup component='ol'>
                {
                    chatList.map((chart) => (
                        <CSSTransition key={chart.conversation_id} timeout={300} nodeRef={chart.nodeRef} classNames='chat-item'>
                            <ChartItem
                                key={chart.conversation_id}
                                data={chart}
                                onDelete={onDelete}
                            />
                        </CSSTransition>
                    ))
                }
            </TransitionGroup>
        </div>
    )
}

function UsedAsstGPTs() {
    const asstListApi = useRequest<IGroupListItem[], any>(asyncGptsUsed)
    if (asstListApi.loading) {
        return null
    }
    return (
        <div>
            {
                asstListApi.data?.map((item) => {
                    return (
                        <Link href={`/gpts/${item.id}`}>
                            <button className='flex h-10 w-full items-center gap-2 rounded-lg px-2 font-medium text-token-text-primary hover:bg-token-sidebar-surface-secondary'>
                                <div className='h-6 w-6 flex-shrink-0'>
                                    <div className='gizmo-shadow-stroke overflow-hidden rounded-full'>
                                        <img src={item?.profile_picture_path} alt={item?.name} className='h-full w-full' width={80} height={80} />
                                    </div>
                                </div>
                                <span className='text-sm truncate'>{item?.name || item.description}</span>
                            </button>
                        </Link>
                    )
                })
            }
            <Link href='/gpts'>
                <button className='flex h-10 w-full items-center gap-2 rounded-lg px-2 font-medium text-token-text-primary hover:bg-token-sidebar-surface-secondary'>
                    <div className='flex items-center justify-center text-token-text-secondary h-7 w-7'>
                        <IconGptsLogo />
                    </div>
                    <span className='text-sm'>探索 GPT</span>
                </button>
            </Link>
            <Link href='/gc'>
                <button className='flex h-10 w-full items-center gap-2 rounded-lg px-2 font-medium text-token-text-primary hover:bg-token-sidebar-surface-secondary'>
                    <div className='flex items-center justify-center text-token-text-secondary h-7 w-7'>
                        <IconGptsLogo />
                    </div>
                    <span className='text-sm'>图片助手</span>
                </button>
            </Link>
        </div>
    )
}

export function HistoryList({ list, loading, onDelete }: {
    list: any[],
    loading: boolean,
    onDelete: (id: string) => void
}) {
    return (
        <PopoverProvider>
            <div>
                <div className='flex flex-col gap-2 pb-2 text-token-text-primary text-sm'>
                    <UsedAsstGPTs />
                    <div className='empty:hidden'>
                        {
                            list?.map((gItem, index) => (
                                <HistoryGroup
                                    key={index}
                                    title={gItem[0]}
                                    chatList={gItem[1]}
                                    onDelete={onDelete}
                                />
                            ))
                        }
                    </div>
                </div>
                <div className={cn('w-full items-center justify-center flex-1', { 'hidden': !loading, flex: loading })}>
                    <Spinning />
                </div>
            </div>
        </PopoverProvider>
    )
}