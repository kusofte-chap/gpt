'use client'

import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import IconSearch from '@/assets/icons/icon-search.svg'
import IconChat from '@/assets/icons/icon-chat.svg'
import { useSpring, animated } from '@react-spring/web'
import { useRequest } from 'ahooks'
import { asyncSearch } from '@/api/gpts'
import Spinning from '@/component/Spinning'
import { IGroupListItem } from '@/interface/gpts'

interface IPopoverPanelProps {
    isSearching: boolean
    isSearchEmpty: boolean
    data: IGroupListItem[]
}

export function PopoverPanel({ isSearching, isSearchEmpty, data }: IPopoverPanelProps) {

    return (
        <div className='absolute top-[calc(100%-10px)] w-full max-h-[530px] overflow-y-auto rounded-lg rounded-t-none border border-t-0 border-token-border-light bg-token-main-surface-primary px-3 py-2 opacity-100 translate-y-0'>
            <div className='flex flex-col'>
                <div className='px-3 pb-2 text-xs text-token-text-tertiary font-semibold '>
                    {isSearching ? <div className='flex justify-center'><Spinning /></div> : isSearchEmpty ? "没有符合的搜索结果" : "全部"}
                </div>
                {
                    data?.map((item) => {
                        return (
                            <a type='button' className='gizmo-link cursor-pointer group mx-2 flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/10'>
                                <div className='h-8 w-8 shrink-0'>
                                    <div className='gizmo-shadow-stroke overflow-hidden rounded-full'>
                                        <img src={item.profile_picture_name} className='h-full w-full bg-token-main-surface-secondary' width={80} height={80} />
                                    </div>
                                </div>
                                <div className='flex flex-col space-y-1 truncate'>
                                    <div className='flex flex-row items-end space-x-2'>
                                        <span className='shrink-0 truncate text-sm font-semibold'>{item.title}</span>
                                    </div>
                                    <span className='max-w-md truncate text-xs text-token-text-tertiary'>{item.description}</span>
                                    <div className='flex gap-2'>
                                        <div className="-mt-1">
                                            <div className="mt-1 flex flex-row items-center space-x-1">
                                                <div className="truncate text-xs text-token-text-tertiary">
                                                    {` 创建者：${item.author?.name}`}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 font-semibold text-token-text-tertiary">
                                            <IconChat className='icon-sx' />
                                            <span className='line-clamp-1 text-xs'>10K+</span>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default function MainSearchInput() {
    const [openPopoverPanel, setOpenPopoverPanel] = useState(false)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [searchRstList, setSearchRstList] = useState<IGroupListItem[]>([])
    const [isSearchEmpty, setIsSearchEmpty] = useState(false)

    const searchApi = useRequest<IGroupListItem[], any>(asyncSearch, {
        manual: true,
        debounceWait: 100,
        onSuccess: (rst) => {
            setSearchRstList(rst ? rst : [])
            setIsSearchEmpty(rst ? false : true)
        }
    })

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        setIsSearchEmpty(false)
        const value = event.target.value.trim().slice(0, 20)
        searchApi.run(value)
    }

    const handleOnBlur = () => {
        setOpenPopoverPanel(false)
        inputRef.current!.value = ''
    }

    const handleOnFocus = () => {
        setOpenPopoverPanel(true)
        searchApi.run('')
    }

    return (
        <div className="group relative rounded-xl z-20 mb-6 mt-2 flex-grow shadow-[0px_10px_10px_-6px_rgba(0,0,0,0.04)]" id='main-search'>
            <div className='absolute w-[18px] left-4 h-full flex items-center justify-center'>
                <IconSearch className='text-token-text-tertiary' />
            </div>
            <input className='z-10 w-full rounded-xl border border-token-border-light bg-token-main-surface-primary py-2 pr-3 font-normal outline-0 delay-100 md:h-14 h-12 text-base pl-12'
                ref={inputRef}
                placeholder='搜索 GPT'
                onFocus={handleOnFocus}
                onBlur={handleOnBlur}
                onChange={handleSearch}
            />
            {
                openPopoverPanel && <PopoverPanel
                    isSearching={searchApi.loading}
                    data={searchRstList}
                    isSearchEmpty={isSearchEmpty}
                />
            }
        </div>
    )
}
