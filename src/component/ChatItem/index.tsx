
import React, { useEffect, useRef } from 'react'
import GptAvatar from '@/assets/logo.svg'

import IconAudio from '@/assets/icons/icon-audio.svg'
import IconCopy from '@/assets/icons/icon-copy.svg'
import IconUnagree from '@/assets/icons/icon-unagree.svg'
import IconRestart from '@/assets/icons/icon-restart.svg'
import IconModel from '@/assets/icons/icon-model.svg'
import mdParser from '@/until/mdit'

interface ISelfChatItemProps {
    id: string
    index: number
    content: string
    avatar?: string
    userName?: string
    chatId?: string
}

interface IGptChatItemProps {
    index: number
    name?: string
    msgId?: string
    chatId?: string
    md?: string
    avatar?: string
    selfRender?: boolean
}

export function SelfChatItem({ id, index, content, chatId, avatar, userName }: ISelfChatItemProps) {
    return (
        <div className='w-full text-token-text-primary' data-user-index={index} data-chat-id={chatId}>
            <div className='py-2 px-3 text-base m-auto md:px-5 lg:px-1 xl:px-5'>
                <div className='mx-auto flex flex-1 gap-3 text-base md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]'>
                    <div className='flex-shrink-0 flex flex-col relative items-end'>
                        <div>
                            <div className='pt-0.5'>
                                <div className='flex h-6 w-6 items-center justify-center overflow-hidden rounded-full'>
                                    <div className='relative flex'>
                                        {avatar ? <img src={avatar} width='24' height='24' className='text-opacity-0' /> : userName?.charAt(0)?.toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='relative flex w-full min-w-0 flex-col'>
                        <div className='font-semibold select-none'>您</div>
                        <div className='flex-col gap-1 md:gap-3'>
                            <div className='flex flex-grow flex-col max-w-full' data-message-id={id} data-role='user'>
                                <div className='min-h-[20px] text-message flex flex-col items-start whitespace-pre-wrap break-words [.text-message+&]:mt-5 overflow-x-auto gap-3'>
                                    <div className='relative max-w-[70%]'>
                                        {content}
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

export function GptChatItem(props: IGptChatItemProps) {
    const { index, md, chatId, avatar, name = 'ChatGPT', selfRender = false, msgId = '' } = props
    const isRender = useRef(false)

    useEffect(() => {
        if (selfRender && msgId && md && !isRender.current) {
            const el = document.querySelector(`[data-message-id="${msgId}"]`)
            if (el) {
                el.innerHTML = mdParser.render(md)
            }
        }
    }, [selfRender, msgId, md])

    return (
        <div className='w-full text-token-text-primary' data-gpt-index={index} data-chat-id={chatId}>
            <div className='py-2 px-3 text-base m-auto md:px-5 lg:px-1 xl:px-5'>
                <div className='mx-auto flex flex-1 gap-3 text-base md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]'>
                    <div className='flex-shrink-0 flex flex-col relative items-end'>
                        <div>
                            <div className='pt-0.5'>
                                <div className='flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border'>
                                    <div className='relative flex items-center justify-center'>
                                        {avatar ? <img src={avatar} width='24' height='24' className='text-opacity-0' /> : <GptAvatar />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='relative flex w-full min-w-0 flex-col'>
                        <div className='font-semibold select-none'>{name}</div>
                        <div className='flex-col gap-1 md:gap-3 group'>
                            <div className='flex flex-grow flex-col max-w-full'>
                                <div className='min-h-[20px] flex flex-col items-start break-words overflow-x-auto gap-3' data-role='assistant' >
                                    {selfRender && <div className='markdown prose w-full break-words' data-message-id={msgId} />}
                                </div>
                            </div>
                            <div className='mt-1 flex gap-3 empty:hidden opacity-0 group-hover:opacity-100'>
                                <div className="-ml-1 mt-0 flex h-7 items-center justify-center gap-[2px] self-end text-gray-400 lg:justify-start lg:self-center visible">
                                    <button className='rounded-md p-1 text-token-text-tertiary hover:text-token-text-primary'>
                                        <IconAudio />
                                    </button>
                                    <button className='rounded-md p-1 text-token-text-tertiary hover:text-token-text-primary'>
                                        <IconCopy />
                                    </button>
                                    <button className='rounded-md p-1 text-token-text-tertiary hover:text-token-text-primary'>
                                        <IconRestart />
                                    </button>
                                    <button className='rounded-md p-1 text-token-text-tertiary hover:text-token-text-primary'>
                                        <IconUnagree />
                                    </button>
                                    <button className='rounded-md p-1 text-token-text-tertiary hover:text-token-text-primary'>
                                        <div className='[&_svg]:h-full [&_svg]:w-full icon-md h-4 w-4'>
                                            <IconModel />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}