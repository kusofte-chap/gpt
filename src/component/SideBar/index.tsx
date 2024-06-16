import React, { createRef, useMemo, useRef, useState } from 'react';
import { HistoryList } from './historyList';
import Footer from './footer';
import Link from 'next/link';
import LogoSvg from '@/assets/logo.svg'
import EditIcon from '@/assets/icons/icon-edit.svg'
import { IHistoryItem } from '@/interface/history';
import { useInfiniteScroll, useRequest } from 'ahooks';
import { deleteConversation, getHistoryList } from '@/api/gpt';
import moment from 'moment';
import _groupBy from 'lodash/groupBy'
import toast from '@/until/message';

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


interface Result {
    list: IHistoryItem[];
    number: number;
    totalPages: number;
}

async function getLoadMoreList(nextPage: number = 1): Promise<Result> {
    const rst = await getHistoryList(nextPage)
    if (rst) {
        return new Promise((resolve) => {
            resolve({
                list: rst.items,
                number: rst.number + 1,
                totalPages: rst.totalPages
            })
        })
    }
    return new Promise((resolve) => {
        resolve({
            list: [],
            number: 1,
            totalPages: 1
        })
    })
}

export default function SideBar() {
    const scrollRef = useRef<HTMLDivElement>(null)
    const { data, loading, loadingMore, mutate } = useInfiniteScroll(
        (d) => getLoadMoreList(d?.number),
        {
            target: scrollRef,
            isNoMore: (d) => {
                if (d?.number > d?.totalPages) {
                    return true
                }
                return false
            }
        },
    );

    const deleteApi = useRequest(deleteConversation, {
        manual: true,
        onSuccess: (_, [id]) => {
            if (data) {
                const index = data.list.findIndex((item) => item.conversation_id === id);
                data?.list.splice(index, 1);
                mutate({ ...data });
            }
        },
        onError: (error: any) => {
            toast.error("删除失败")
        }
    })

    const list = useMemo(() => {
        const listByTagDateKey = data?.list.map(item => ({
            ...item,
            dateKey: genGroupKey(item.createTime),
            nodeRef: createRef()
        }))
        return Object.entries(_groupBy(listByTagDateKey, 'dateKey'))
    }, [data])


    return (
        <div className='max-w-sx md:w-[260px] h-full' id='gpt-sidebar'>
            <div className='flex flex-col h-full'>
                <div className="flex flex-col h-full min-h-0">
                    <nav className='flex w-full h-full flex-col px-3 pb-3.5'>
                        <div className='flex-1 flex flex-col transition-opacity duration-500 -mr-2 pr-2 overflow-y-auto' ref={scrollRef}>
                            <div className='sticky z-20 left-0 top-0 right-0 bg-[#f9f9f9] pt-3.5'>
                                <div className='pb-0.5 last:pb-0'>
                                    <Link
                                        href='/'
                                        type='button'
                                        className='group flex h-10 items-center gap-2 rounded-lg bg-[#f9f9f9] hover:bg-[#ececec] px-2 font-medium cursor-pointer'
                                    >
                                        <div className='w-7 h-7 flex-shrink-0 rounded-full bg-white border border-token-border-light'>
                                            <div className='h-full  flex items-center justify-center position-relative'>
                                                <LogoSvg className='w-2/3 h-2/3' />
                                            </div>
                                        </div>
                                        <div className='grow overflow-hidden text-ellipsis whitespace-nowrap text-sm text-token-text-primary'>
                                            新聊天
                                        </div>
                                        <button className='flex flex-shrink-0 items-center justify-center w-5 h-5 border-none bg-transparent outline-none text-token-text-primary'>
                                            <EditIcon />
                                        </button>
                                    </Link >
                                </div>
                            </div>
                            <HistoryList
                                list={list}
                                onDelete={deleteApi.run}
                                loading={loading || loadingMore}
                            />
                        </div>
                        <Footer />
                    </nav>
                </div>
            </div>
        </div>
    )
}
