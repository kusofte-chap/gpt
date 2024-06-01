'use client'

import cn from 'classnames'
import { useContext, useEffect, useMemo, useState } from "react"
import MoreIcon from '@/assets/icons/icon-more.svg'
import { IHistoryItem } from "@/interface/history"
import { Grow, ListItemIcon, Menu, MenuItem, Popper } from '@mui/material'
import { PopoverProvider, PopoverContext } from "./context"
import IconRename from '@/assets/icons/icon-rename.svg'
import IconDelete from '@/assets/icons/icon-delete.svg'
import { useRequest } from 'ahooks'
import { getHistoryList } from '@/api/gpt'
import moment from 'moment'
import _groupBy from 'lodash/groupBy'
import IconLoading from '@/assets/icons/icon-loading.svg'
import Link from 'next/link'

function ChartItem({ data }: { data: IHistoryItem }) {
    const { activeItemId, anchorEl, setActiveItemId, setAnchorEl } = useContext(PopoverContext)
    const isActive = useMemo(() => {
        return data.conversation_id === activeItemId
    }, [activeItemId])


    const handleItemClick = () => {
        setActiveItemId(data.conversation_id)
        setAnchorEl(prev => {
            if (prev) {
                return null
            }
            return prev
        })
    };

    const onToggleOpen = async (event: React.MouseEvent<HTMLElement>) => {
        const target = event.currentTarget

        if (anchorEl && anchorEl === event.currentTarget) {
            setAnchorEl(null);
        } else {
            setAnchorEl(null);
            setTimeout(() => {
                setAnchorEl(target)
            }, 0)
        }
    }

    return (
        <>
            <li
                className={cn('group relative rounded-lg cursor-pointer', {
                    'active:opacity-90 hover:bg-token-sidebar-surface-secondary': !isActive,
                    'opacity-90 bg-token-sidebar-surface-secondary': isActive
                })}>
                <Link href={`/chat/${data.conversation_id}`} className="flex items-center gap-2 p-2" onClick={handleItemClick} data-state={isActive ? 'open' : 'closed'}>
                    <div className='relative grow overflow-hidden whitespace-nowrap'>
                        {data.title}
                        <div className={cn('absolute bottom-0 right-0 top-0 bg-gradient-to-l to-transparent from-token-sidebar-surface-primary  w-10 from-0% ', {
                            'group-hover:from-token-sidebar-surface-secondary group-hover:w-20 group-hover:from-60%': !isActive,
                            'from-token-sidebar-surface-secondary w-20 from-60%': isActive
                        })} />
                    </div>
                </Link>
                <div className={cn('absolute bottom-0 right-0 top-0 items-center pr-2', { 'hidden group-hover:flex': !isActive, 'flex': isActive })}>
                    <button
                        type='button'
                        onClick={onToggleOpen}
                        className='flex items-center justify-center border-none bg-transparent outline-none text-[#0d0d0d]'
                    >
                        <MoreIcon />
                    </button>
                </div>
            </li >

        </>
    )
}

function HistoryGroup({ chatList, title }: { chatList: IHistoryItem[], title: string }) {
    return (
        <div className='relative mt-5 empty:mt-0 empty:hidden first:mt-0 last:mb-5'>
            <div className='bg-token-sidebar-surface-primary'>
                <div className='flex items-center h-9'>
                    <h3 className='pb-2 pt-3 px-2 text-xs font-medium text-ellipsis overflow-hidden break-all text-token-text-secondary'>{title}</h3>
                </div>
            </div>
            <ol>
                {
                    chatList.map((chart) => <ChartItem key={chart.conversation_id} data={chart} />)
                }
            </ol>
        </div>
    )
}


function List() {
    const { anchorEl } = useContext(PopoverContext)
    const historyApi = useRequest(getHistoryList, {
        defaultParams: [{ page: 1, size: 10 }],
    })

    const genGroupKey = (date: string) => {
        const diff = moment().diff(date, 'days')
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

    const list = useMemo(() => {
        const _list = historyApi.data?.items.map((item: IHistoryItem) => {
            return {
                ...item,
                dateKey: genGroupKey(item.createTime),
            }
        })
        return _groupBy(_list, 'dateKey')
    }, [historyApi.data?.items])

    return (
        <>
            <div className='flex flex-col gap-2 pb-2 text-token-text-primary text-sm'>
                <div className='empty:hidden'>
                    {
                        Object.entries(list).map((gItem) => (
                            <HistoryGroup key={gItem[0]} title={gItem[0]} chatList={gItem[1]} />
                        ))
                    }
                </div>
            </div>
            <div className={cn('w-full items-center justify-center flex-1', { 'hidden': !historyApi.loading, flex: historyApi.loading })}>
                <span className='w-5 h-5 flex-shrink-0 animate-spin'>
                    <img src='/loading.png' />
                </span>
            </div>
            {Boolean(anchorEl) && <Popper
                open
                anchorEl={anchorEl}
                placement='bottom-start'
                transition
                sx={{
                    zIndex: 102,
                    transformOrigin: 'center',
                }}
            >
                {({ TransitionProps }) => (
                    <Grow {...TransitionProps} timeout={200} >
                        <div className='max-w-xs rounded-lg popover bg-token-main-surface-primary shadow-lg will-change-[opacity,transform] border border-token-border-light'>
                            <button className='flex w-[90px] gap-2 items-center m-1.5 rounded p-2.5 text-sm cursor-pointer focus-visible:outline-0 hover:bg-token-main-surface-secondary focus-visible:bg-token-main-surface-secondary group relative'>
                                <IconRename />
                                重命名
                            </button>
                            <button className='flex w-[90px] gap-2 items-center m-1.5 rounded p-2.5 text-sm cursor-pointer focus-visible:outline-0 hover:bg-token-main-surface-secondary focus-visible:bg-token-main-surface-secondary group relative text-token-text-error'>
                                <IconDelete />
                                删除
                            </button>
                        </div>
                    </Grow>
                )}
            </Popper>}
        </>
    )
}

export function HistoryList() {
    return (
        <PopoverProvider>
            <List />
        </PopoverProvider>
    )
}