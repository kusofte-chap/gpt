'use client'

import { debounce } from 'lodash'
import classNames from 'classnames'
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import IconSearch from '@/assets/icons/icon-search.svg'
import { PopoverPanel } from './MainSearchInput'
import { useRequest } from 'ahooks'
import { asyncSearch } from '@/api/gpts'
import { IGroupListItem } from '@/interface/gpts'

export default function SearchInput() {
    const [showMediumInput, setShowMediumInput] = useState(false)
    const [openPopoverPanel, setOpenPopoverPanel] = useState(false)
    const [searchRstList, setSearchRstList] = useState<IGroupListItem[]>([])
    const [isSearchEmpty, setIsSearchEmpty] = useState(false)
    const inputRef = useRef<HTMLInputElement | null>(null)

    const searchApi = useRequest<IGroupListItem[], any>(asyncSearch, {
        manual: true,
        debounceWait: 100,
        onSuccess: (rst) => {
            setSearchRstList(rst ? rst : [])
            setIsSearchEmpty(rst ? false : true)
        }
    })

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
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

    useEffect(() => {
        // main-search
        const handleScroll = debounce(() => {
            const mainSearch = document.getElementById('main-search')
            const react = mainSearch!.getBoundingClientRect()
            setShowMediumInput(react.top <= 0)
        }, 100)

        document.querySelector('#gpts-content')?.addEventListener('scroll', handleScroll, false)
        return () => {
            document.querySelector('#gpts-content')?.removeEventListener('scroll', handleScroll, false)
        }

    }, [])

    const inputClassName = useMemo(() => {
        return classNames('z-10 w-full rounded-xl border border-token-border-light bg-token-main-surface-primary py-2 pr-3 font-normal outline-0 delay-100 h-10 text-sm pl-9', {
            'hidden': !showMediumInput
        })
    }, [showMediumInput])

    return (
        <div className={classNames('group relative rounded-xl max-w-3xl flex-grow', { 'opacity-0': !showMediumInput })}>
            <div className='absolute w-[18px] left-4 h-full flex items-center justify-center'>
                <IconSearch className='text-token-text-tertiary' />
            </div>
            <input
                className={inputClassName}
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
