import React from 'react'
import IconGlobal from '@/assets/icons/icon-global.svg'
import IconPlus from '@/assets/icons/icon-plus.svg'

import SearchInput from './SearchInput'
import MainSearchInput from './MainSearchInput'
import IconLoading from '@/assets/icons/icon-loading.svg'
import Spinning from '@/component/Spinning'

function GptModelGroup({ title, subTitle, list }: { title: string, subTitle: string, list: any[] }) {

    return (
        <div className='h-fit scroll-mt-28 last:min-h-[calc(100vh-8rem)]'>
            <div className='text-xl font-semibold md:text-2xl'>{title}</div>
            <div className='text-sm text-token-text-tertiary md:text-base'>{subTitle}</div>
            <div className='mb-10 mt-4'>
                <div className='grid grid-cols-1 gap-x-1.5 gap-y-1 md:gap-x-2 md:gap-y-1.5 lg:grid-cols-2 lg:gap-x-3 lg:gap-y-2.5'>
                    {
                        list.map((item, index) => (
                            <a type='button' className='gizmo-link cursor-pointer group flex h-[104px] items-center gap-2.5 overflow-hidden rounded-xl px-1 py-4 hover:bg-token-main-surface-secondary md:px-3 md:py-4 lg:px-3'>
                                <div className='text-md flex w-8 shrink-0 items-center justify-center font-semibold'>{index + 1}</div>
                                <div className='flex w-full flex-grow items-center gap-4 overflow-hidden'>
                                    <div className='h-12 w-12 flex-shrink-0'>
                                        <div className='gizmo-shadow-stroke overflow-hidden rounded-full'>
                                            <img src='/gpts-de-2.png' className='h-full w-full bg-token-main-surface-secondary' width={80} height={80} />
                                        </div>
                                    </div>
                                    <div className='overflow-hidden text-ellipsis break-words'>
                                        <span className='line-clamp-2 text-sm font-semibold leading-tight'>
                                            SQL Expert
                                        </span>
                                        <span className='line-clamp-3 text-xs'>A GPT specialized in generating and refining images with a mix of professional and friendly tone.image generator</span>
                                        <div className='mt-1 line-clamp-1 flex justify-start gap-1 text-xs text-token-text-tertiary'>
                                            <div className='mt-1 flex flex-row items-center space-x-1'>
                                                <div className='text-token-text-tertiary text-xs'>创建者：Dmitry Khanukov</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))
                    }
                </div>
                <button className='btn relative btn-secondary w-full mt-2 md:mt-3 hover:bg-[#f9f9f9]'>
                    <div className='flex items-center justify-center gap-1'>
                        查看更多
                        {/* <Spinning /> */}
                    </div>
                </button>
            </div>
        </div>
    )
}


export default function GPTs() {
    return (
        <div className='h-full overflow-y-auto'>
            <div className='sticky top-0  mb-1.5 items-center h-14 p-2 font-semibold bg-token-main-surface-primary z-30 mx-auto flex w-full justify-between gap-2 whitespace-nowrap pt-[1.125rem]'>
                <div className='w-[calc(100% - 768px)/2] flex items-center justify-start'>
                    <button className='btn relative btn-ghost'>
                        <div className='flex flex-col items-center justify-center flex-shrink-0'>
                            <IconGlobal />
                        </div>
                    </button>
                </div>
                <SearchInput />
                <div className='w-[calc(100% - 768px)/2] flex items-center justify-end'>
                    <button className='btn relative btn-ghost bg-[#10a37f] opacity-50'>
                        <div className='flex w-full items-center justify-center gap-1.5 text-white'>
                            <IconPlus />
                            创建
                        </div>
                    </button>
                </div>
            </div>
            <div className='mx-auto max-w-3xl overflow-x-clip px-4'>
                <div className='mb-6'>
                    <div className='my-2 text-center text-3xl font-bold md:my-4 md:text-5xl'>
                        GPT
                    </div>
                    <div className='mx-auto w-full text-center text-sm text-token-text-secondary md:text-lg md:leading-tight'>
                        探索并创建结合了指令、额外知识和任何技能组合的自定义版本的 ChatGPT。
                    </div>
                </div>
                <MainSearchInput />
                <div className='sticky top-14 z-10 -ml-4 mb-12 w-screen bg-token-main-surface-primary py-2 text-sm md:ml-0 md:w-full md:pb-0'>
                    <div className='no-scrollbar flex scroll-m-5 gap-1.5 overflow-x-auto md:overflow-hidden'>
                        <div className='cursor-pointer scroll-mx-5 whitespace-nowrap rounded-3xl px-3 py-2 first:ml-4 last:mr-4 md:px-2 md:first:ml-0 md:last:mr-0 border-token-text-primary bg-black text-token-main-surface-primary md:rounded-none md:border-b-2 md:bg-transparent md:text-token-text-primary'>
                            精选推荐
                        </div>
                        <div className='cursor-pointer scroll-mx-5 whitespace-nowrap rounded-3xl px-3 py-2 first:ml-4 last:mr-4 md:px-2 md:first:ml-0 md:last:mr-0 bg-token-main-surface-secondary hover:bg-gray-100 hover:text-token-text-primary dark:hover:bg-white/20 md:rounded-lg md:bg-transparent md:text-token-text-tertiary md:hover:bg-gray-50 dark:md:bg-transparent dark:md:hover:bg-gray-700'>
                            写作
                        </div>
                        <div className='cursor-pointer scroll-mx-5 whitespace-nowrap rounded-3xl px-3 py-2 first:ml-4 last:mr-4 md:px-2 md:first:ml-0 md:last:mr-0 bg-token-main-surface-secondary hover:bg-gray-100 hover:text-token-text-primary dark:hover:bg-white/20 md:rounded-lg md:bg-transparent md:text-token-text-tertiary md:hover:bg-gray-50 dark:md:bg-transparent dark:md:hover:bg-gray-700'>
                            生产力
                        </div>
                        <div className='cursor-pointer scroll-mx-5 whitespace-nowrap rounded-3xl px-3 py-2 first:ml-4 last:mr-4 md:px-2 md:first:ml-0 md:last:mr-0 bg-token-main-surface-secondary hover:bg-gray-100 hover:text-token-text-primary dark:hover:bg-white/20 md:rounded-lg md:bg-transparent md:text-token-text-tertiary md:hover:bg-gray-50 dark:md:bg-transparent dark:md:hover:bg-gray-700'>
                            研究与分析
                        </div>
                        <div className='cursor-pointer scroll-mx-5 whitespace-nowrap rounded-3xl px-3 py-2 first:ml-4 last:mr-4 md:px-2 md:first:ml-0 md:last:mr-0 bg-token-main-surface-secondary hover:bg-gray-100 hover:text-token-text-primary dark:hover:bg-white/20 md:rounded-lg md:bg-transparent md:text-token-text-tertiary md:hover:bg-gray-50 dark:md:bg-transparent dark:md:hover:bg-gray-700'>
                            教育
                        </div>
                        <div className='cursor-pointer scroll-mx-5 whitespace-nowrap rounded-3xl px-3 py-2 first:ml-4 last:mr-4 md:px-2 md:first:ml-0 md:last:mr-0 bg-token-main-surface-secondary hover:bg-gray-100 hover:text-token-text-primary dark:hover:bg-white/20 md:rounded-lg md:bg-transparent md:text-token-text-tertiary md:hover:bg-gray-50 dark:md:bg-transparent dark:md:hover:bg-gray-700'>
                            生活方式
                        </div>
                        <div className='cursor-pointer scroll-mx-5 whitespace-nowrap rounded-3xl px-3 py-2 first:ml-4 last:mr-4 md:px-2 md:first:ml-0 md:last:mr-0 bg-token-main-surface-secondary hover:bg-gray-100 hover:text-token-text-primary dark:hover:bg-white/20 md:rounded-lg md:bg-transparent md:text-token-text-tertiary md:hover:bg-gray-50 dark:md:bg-transparent dark:md:hover:bg-gray-700'>
                            编程
                        </div>
                    </div>
                </div>
                <div className='h-fit scroll-mt-28 last:min-h-[calc(100vh-8rem)]'>
                    <div className='text-xl font-semibold md:text-2xl'>精选</div>
                    <div className='text-sm text-token-text-tertiary md:text-base'>本周的精选推荐</div>
                    <div className='mb-10 mt-4'>
                        <div className='grid grid-cols-1 gap-x-1.5 gap-y-1 md:gap-x-2 md:gap-y-1.5 lg:grid-cols-2 lg:gap-x-3 lg:gap-y-2.5'>
                            {
                                [1, 3, 4, 5].map(item => (
                                    <a type='button' className='cursor-pointer group flex h-24 items-center gap-5 overflow-hidden rounded-xl bg-gray-50 px-7 py-8 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-white/10 md:h-32 lg:h-36'>
                                        <div className='h-16 w-16 flex-shrink-0 md:h-24 md:w-24'>
                                            <div className='gizmo-shadow-stroke overflow-hidden rounded-full'>
                                                <img src='/gpts-de-2.png' className='h-full w-full bg-token-main-surface-secondary' width={80} height={80} />
                                            </div>
                                        </div>
                                        <div className='flex flex-col'>
                                            <div className='line-clamp-2 font-semibold md:text-lg'>
                                                SQL Expert
                                            </div>
                                            <span className='line-clamp-2 text-xs md:line-clamp-3'>SQL expert for optimization and queries.</span>
                                            <div className='mt-1 line-clamp-1 flex justify-start gap-1 text-xs text-token-text-tertiary'>
                                                <div className='mt-1 flex flex-row items-center space-x-1'>
                                                    <div className='text-token-text-tertiary text-xs'>创建者：Dmitry Khanukov</div>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <GptModelGroup title='热门趋势' subTitle='我们社区中最受欢迎的 GPT 模型' list={[1, 2, 3, 4, 5, 6]} />
                <GptModelGroup title='由 ChatGPT 提供支持' subTitle='由 ChatGPT 团队创建的 GPT 模型' list={[1, 2, 3, 4, 5, 6]} />
                <GptModelGroup title='Writing' subTitle='Enhance your writing with tools for creation, editing, and style refinement' list={[1, 2, 3, 4, 5, 6]} />
            </div>

        </div>
    )
}
