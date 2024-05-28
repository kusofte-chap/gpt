
import React from 'react'
import GptAvatar from '@/assets/logo.svg'

function Avatar() {
    return (
        <div className='flex-shrink-0 flex flex-col relative items-end'>
            <div>
                <div className='pt-0.5'>
                    <div className='flex h-6 w-6 items-center justify-center overflow-hidden rounded-full'>
                        <div className='relative flex'>
                            <img src='https://i2.wp.com/cdn.auth0.com/avatars/ru.png?ssl=1' width='24' height='24' className='text-opacity-0' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ChatContent() {
    return (
        <div className='relative flex w-full min-w-0 flex-col'>
            <div className='font-semibold select-none'>您</div>
            <div className='flex-col gap-1 md:gap-3'>
                <div className='flex flex-grow flex-col max-w-full'>
                    <div className='min-h-[20px] text-message flex flex-col items-start whitespace-pre-wrap break-words [.text-message+&]:mt-5 juice:w-full overflow-x-auto gap-3'>
                        <div className='relative max-w-[70%]'>
                            在浏览器中打开A页面，在新开一个tab页面B，让A页面闲置一段时间再切换到A页面，A页面需要字段刷新，这个需要怎么实现？
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function SelfChatItem() {
    return (
        <div className='w-full text-token-text-primary'>
            <div className='py-2 px-3 text-base m-auto md:px-5 lg:px-1 xl:px-5'>
                <div className='mx-auto flex flex-1 gap-3 text-base md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]'>
                    <div className='flex-shrink-0 flex flex-col relative items-end'>
                        <div>
                            <div className='pt-0.5'>
                                <div className='flex h-6 w-6 items-center justify-center overflow-hidden rounded-full'>
                                    <div className='relative flex'>
                                        <img src='https://i2.wp.com/cdn.auth0.com/avatars/ru.png?ssl=1' width='24' height='24' className='text-opacity-0' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='relative flex w-full min-w-0 flex-col'>
                        <div className='font-semibold select-none'>您</div>
                        <div className='flex-col gap-1 md:gap-3'>
                            <div className='flex flex-grow flex-col max-w-full'>
                                <div className='min-h-[20px] text-message flex flex-col items-start whitespace-pre-wrap break-words [.text-message+&]:mt-5 juice:w-full overflow-x-auto gap-3'>
                                    <div className='relative max-w-[70%]'>
                                        在浏览器中打开A页面，在新开一个tab页面B，让A页面闲置一段时间再切换到A页面，A页面需要字段刷新，这个需要怎么实现？
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export function GptChatItem() {
    return (
        <div className='w-full text-token-text-primary'>
            <div className='py-2 px-3 text-base m-auto md:px-5 lg:px-1 xl:px-5'>
                <div className='mx-auto flex flex-1 gap-3 text-base md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]'>
                    <div className='flex-shrink-0 flex flex-col relative items-end'>
                        <div>
                            <div className='pt-0.5'>
                                <div className='flex h-6 w-6 items-center justify-center overflow-hidden rounded-full'>
                                    <div className='relative flex'>
                                        <GptAvatar />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='relative flex w-full min-w-0 flex-col'>
                        <div className='font-semibold select-none'>您</div>
                        <div className='flex-col gap-1 md:gap-3'>
                            <div className='flex flex-grow flex-col max-w-full'>
                                <div className='min-h-[20px] text-message flex flex-col items-start whitespace-pre-wrap break-words [.text-message+&]:mt-5 juice:w-full overflow-x-auto gap-3'>
                                    <div className='relative max-w-[70%]'>
                                        在浏览器中打开A页面，在新开一个tab页面B，让A页面闲置一段时间再切换到A页面，A页面需要字段刷新，这个需要怎么实现？
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}