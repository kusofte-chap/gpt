import React from 'react'
import IconSearch from '@/assets/icons/icon-search.svg'

export default function SearchInput() {
    return (
        <div className='group relative rounded-xl max-w-3xl flex-grow opacity-0'>
            <div className='absolute w-[18px] left-4 h-full flex items-center justify-center'>
                <IconSearch className='text-token-text-tertiary' />
            </div>
            <input className='z-10 w-full rounded-xl border border-token-border-light bg-token-main-surface-primary py-2 pr-3 font-normal outline-0 delay-100 h-10 text-sm pl-9'
                placeholder='搜索 GPT'
            />
        </div>
    )
}
