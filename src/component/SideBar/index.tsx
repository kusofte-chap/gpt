import React, { createRef, useContext, useEffect, useMemo, useRef } from 'react';
import { HistoryGroup, UsedAsstGPTs } from './components';
import Footer from './footer';
import EditIcon from '@/assets/icons/icon-edit.svg'
import { IHistoryItem } from '@/interface/history';
import { useInfiniteScroll, useRequest } from 'ahooks';
import { deleteConversation, getHistoryList } from '@/api/gpt';
import moment from 'moment';
import _groupBy from 'lodash/groupBy'
import toast from '@/until/message';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { keepAsstListState, mobileDrawerState, newConversationState, refreshAsstList } from '@/store/atom';
import { PopoverContext, PopoverProvider } from './context';
import Spinning from '../Spinning';
import cn from 'classnames'
import { useParams, useRouter } from 'next/navigation';
import IconCloseMenu from '@/assets/icons/icon-close-menu.svg'
import StyledTooltip from '../StyledTooltip';
import { useToggleSideBar } from '@/hooks/index';
import { useMediaQuery } from '@mui/material';
import { IGroupListItem } from '@/interface/gpts';
import { asyncGptsUsed } from '@/api/gpts';

interface Result {
    list: IHistoryItem[];
    number: number;
    totalPages: number;
}

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

async function getLoadMoreList(nextPage: number = 0): Promise<Result> {
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
            number: 0,
            totalPages: 1
        })
    })
}

function SideBarContent() {
    const router = useRouter()
    const params = useParams()
    const isMobile = useMediaQuery('(max-width: 768px)');
    const setMobileSideBar = useSetRecoilState(mobileDrawerState)
    const newConversation = useRecoilValue(newConversationState)
    const scrollRef = useRef<HTMLDivElement>(null)
    const refreshAssts = useRecoilValue(refreshAsstList)
    const setKeepAsstList = useSetRecoilState(keepAsstListState)

    const { setActiveItemId } = useContext(PopoverContext)
    const { toggleCloseSideBar } = useToggleSideBar()

    const { data, loading, loadingMore, mutate } = useInfiniteScroll(
        (d) => getLoadMoreList(d?.number),
        {
            target: scrollRef,
            isNoMore: (d) => {
                if (d?.number >= d?.totalPages) {
                    return true
                }
                return false
            }
        },
    );

    const asstListApi = useRequest<IGroupListItem[], any>(asyncGptsUsed, {
        refreshDeps: [refreshAssts],
        onSuccess: (data) => {
            if (data) {
                setKeepAsstList(data.filter(item => item.id).map(item => item.id))
            }
        }
    })

    const deleteApi = useRequest(deleteConversation, {
        manual: true,
        onSuccess: (_, [id]) => {
            if (data) {
                const index = data.list.findIndex((item) => item.conversation_id === id);
                data?.list.splice(index, 1);
                mutate({ ...data });
                if (location.pathname !== '/') {
                    router.push('/')
                }
            }
        },
        onError: (error: any) => {
            toast.error("删除失败")
        }
    })

    useEffect(() => {
        if (params?.chat_id || params.thread_id) {
            setActiveItemId((params.chat_id || params.thread_id || '') as string)
        }
    }, [params])

    useEffect(() => {
        if (newConversation) {
            data?.list.unshift(newConversation)
            mutate({ ...data as any })
            setActiveItemId(newConversation.conversation_id)
        }
    }, [newConversation])

    const list = useMemo(() => {
        const listByTagDateKey = data?.list.map(item => ({
            ...item,
            dateKey: genGroupKey(item.createTime),
            nodeRef: createRef()
        }))
        const groupList = _groupBy(listByTagDateKey?.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime()), 'dateKey')
        return Object.entries(groupList)
    }, [data])

    const isLoading = loading || loadingMore

    return (
        <div className='max-w-sx md:w-[260px] h-full' id='gpt-sidebar'>
            <div className='flex flex-col h-full'>
                <div className="flex flex-col h-full min-h-0">
                    <nav className='flex w-full h-full flex-col px-3 pb-3.5'>
                        <div className='bg-[#f9f9f9]'>
                            <div className='pb-0.5 last:pb-0'>
                                <div className='flex justify-between h-14 items-center'>
                                    <StyledTooltip title='关闭侧栏' placement='bottom' arrow>
                                        <button
                                            onClick={toggleCloseSideBar}
                                            className='h-10 rounded-lg px-2 text-token-text-secondary focus-visible:outline-0 hover:bg-token-sidebar-surface-secondary focus-visible:bg-token-sidebar-surface-secondary'>
                                            <IconCloseMenu />
                                        </button>
                                    </StyledTooltip>
                                    <StyledTooltip title='新聊天' placement='bottom' arrow>
                                        <button
                                            onClick={() => {
                                                if (isMobile) {
                                                    setMobileSideBar(false)
                                                }
                                                router.push('/')
                                            }}
                                            className='h-10 rounded-lg px-2 text-token-text-secondary focus-visible:outline-0 hover:bg-token-sidebar-surface-secondary focus-visible:bg-token-sidebar-surface-secondary'>
                                            <EditIcon />
                                        </button>
                                    </StyledTooltip>
                                </div >
                            </div>
                        </div>
                        <div className='flex-1 flex flex-col transition-opacity duration-500 -mr-2 pr-2 overflow-y-auto' ref={scrollRef}>
                            <div>
                                <div className='flex flex-col gap-2 pb-2 text-token-text-primary text-sm'>
                                    <UsedAsstGPTs asstsList={asstListApi.data || []} />
                                    <div className='empty:hidden'>
                                        {
                                            list?.map((gItem, index) => (
                                                <HistoryGroup
                                                    key={index}
                                                    title={gItem[0]}
                                                    chatList={gItem[1]}
                                                    onDelete={deleteApi.run}
                                                />
                                            ))
                                        }
                                    </div>
                                </div>
                                <div className={cn('w-full items-center justify-center flex-1', [isLoading ? 'flex' : 'hidden'])}>
                                    <Spinning />
                                </div>
                            </div>
                        </div>
                        <Footer />
                    </nav>
                </div>
            </div >
        </div >
    )
}

export default function SideBar() {
    return (
        <PopoverProvider>
            <SideBarContent />
        </PopoverProvider>
    )
}