'use client'

import cn from 'classnames'
import { ChangeEvent, Fragment, useContext, useEffect, useMemo, useRef, useState } from "react"
import MoreIcon from '@/assets/icons/icon-more.svg'
import { IHistoryItem } from "@/interface/history"
import { ClickAwayListener, Grow, ListItemIcon, Menu, MenuItem, Popper, Portal } from '@mui/material'
import { PopoverProvider, PopoverContext } from "./context"
import IconRename from '@/assets/icons/icon-rename.svg'
import IconDelete from '@/assets/icons/icon-delete.svg'
import { useRequest } from 'ahooks'
import { deleteConversation, getHistoryList, renameConversation } from '@/api/gpt'
import moment from 'moment'
import _groupBy from 'lodash/groupBy'
import Link from 'next/link'
import toast from '@/until/message'

const genGroupKey = (date: string) => {
    const diff = moment().startOf('day').diff(moment(date).startOf('day'), 'days')
    if (diff === 0) {
        return '今天'
    }
    if (diff === 1) {
        return '昨天'
    }
    if (diff < 8) {
        return `近7天`
    }
    if (diff < 30) {
        return `近30天`
    }
    if (diff < 365) {
        return `${moment(date).format('M月')}`
    }
    return moment(date).format('YYYY年')
}

function ChartItem({ data, updateList }: { data: IHistoryItem, updateList: () => void }) {
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
        let isLoading = false
        if (isLoading) {
            return
        }
        isLoading = true
        deleteConversation(data.conversation_id).then((rst) => {
            updateList()
        }).catch((error) => {
            toast.error("删除失败")
        }).finally(() => {
            isLoading = false
        })
    }

    const isActive = useMemo(() => {
        return data.conversation_id === activeItemId
    }, [activeItemId])

    return (
        <>
            <li
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
        </>
    )
}

function HistoryGroup({ chatList, title, updateList }: {
    chatList: IHistoryItem[],
    title: string,
    updateList: () => void
}) {
    return (
        <div className='relative mt-5 empty:mt-0 empty:hidden first:mt-0 last:mb-5'>
            <div className='bg-token-sidebar-surface-primary'>
                <div className='flex items-center h-9'>
                    <h3 className='pb-2 pt-3 px-2 text-xs font-medium text-ellipsis overflow-hidden break-all text-token-text-secondary'>{title}</h3>
                </div>
            </div>
            <ol>
                {
                    chatList.map((chart) => (
                        <ChartItem
                            key={chart.conversation_id}
                            data={chart}
                            updateList={updateList}
                        />
                    ))
                }
            </ol>
        </div>
    )
}


function List() {
    const { anchorEl } = useContext(PopoverContext)
    const [list, setList] = useState<{ [key: string]: IHistoryItem[] }>()
    const page = useRef(1)
    const totalPages = useRef(-1)

    const historyApi = useRequest(getHistoryList, {
        defaultParams: [page.current],
        onSuccess: (rst: { items: any[], totalPage: number }) => {
            if (rst.items) {
                const newList = rst.items.map(item => {
                    return {
                        ...item,
                        dateKey: genGroupKey(item.createTime),
                    }
                })
                const groupByList = _groupBy(newList, 'dateKey')
                if (page.current === 1) {
                    setList(groupByList)
                } else {
                    setList(prev => ({
                        ...prev,
                        ...groupByList
                    }))
                }
            }
            totalPages.current = rst.totalPage
        }
    })

    const updateList = () => {
        historyApi.run(page.current)
    }

    return (
        <Fragment>
            <div className='flex flex-col gap-2 pb-2 text-token-text-primary text-sm'>
                <div className='empty:hidden'>
                    {
                        list && Object.entries(list).map((gItem) => (
                            <HistoryGroup key={gItem[0]} title={gItem[0]} chatList={gItem[1]} updateList={updateList} />
                        ))
                    }
                </div>
            </div>
            <div className={cn('w-full items-center justify-center flex-1', { 'hidden': !historyApi.loading, flex: historyApi.loading })}>
                <span className='w-5 h-5 flex-shrink-0 animate-spin'>
                    <img src='/loading.png' />
                </span>
            </div>
        </Fragment>
    )
}

export function HistoryList() {
    return (
        <PopoverProvider>
            <List />
        </PopoverProvider>
    )
}