import React from 'react'
import { Modal } from '@mui/material'
import IconClose from '@/assets/icons/icon-close.svg'
import IconChat from '@/assets/icons/icon-start-chat.svg'
import IconChecked from '@/assets/icons/icon-checked.svg'
import IconStar from '@/assets/icons/icon-star.svg'
import Link from 'next/link'
import { IGroupListItem, TOOLS_TO_CONVERTS } from '@/interface/gpts'
import { faker } from '@faker-js/faker'

interface IRoleModalProps {
    data?: IGroupListItem
    open: boolean
    onClose: () => void
}

export default function RoleModal({ data, open, onClose }: IRoleModalProps) {
    return (
        <Modal open={open}>
            <div className='w-full h-full flex flex-col items-center justify-center'>
                <div className='flex w-full h-[calc(100vh-30rem)] min-h-[60vh] md:min-h-[70vh] max-w-[95vw] md:max-w-xl flex-col shadow-xl rounded-lg bg-white'>
                    <div className='flex-grow overflow-y-auto'>
                        <div className='relative flex h-full flex-col gap-2 overflow-hidden px-2 py-4'>
                            <div className='flex flex-grow flex-col gap-4 overflow-y-auto px-6 pb-20 pt-16'>
                                <div className='absolute top-4 right-4 z-10 flex items-center justify-end bg-gradient-to-b from-token-main-surface-primary to-transparent pb-2'>
                                    <button className='btn relative btn-ghost btn-circle' onClick={onClose}>
                                        <div className='flex w-full items-center justify-center gap-1.5'>
                                            <IconClose className='icon-md' />
                                        </div>
                                    </button>
                                </div>
                                <div className='absolute left-0 bottom-4 w-full'>
                                    <div className='flex min-h-[64px] items-end bg-gradient-to-t from-token-main-surface-primary to-transparent px-2'>
                                        <div className='flex flex-grow flex-col items-center'>
                                            <Link href={`/gpts/${data?.id}`} target='_self' className='btn relative h-12 w-full bg-[#0d0d0d] text-white'>
                                                <div className='flex w-full items-center justify-center gap-1.5'>
                                                    <IconChat />
                                                    开始聊天
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-col items-center justify-center text-token-text-primary !h-fit'>
                                    <div className='mb-3 h-20 w-20'>
                                        <div className='gizmo-shadow-stroke overflow-hidden rounded-full'>
                                            <img src={data?.profile_picture_name} alt={data?.name} className='h-full w-full bg-token-main-surface-secondary' width={80} height={80} />
                                        </div>
                                    </div>
                                    <div className='flex flex-col items-center gap-2'>
                                        <div className='text-center text-2xl font-semibold'>{data?.name}</div>
                                        <div className='text-sm text-token-text-tertiary'>{`创建者：${data?.author.name}`}</div>
                                        <div className='max-w-md text-center text-sm font-normal text-token-text-primary'>
                                            {data?.description}
                                        </div>
                                    </div>
                                </div>
                                <div className='flex justify-center'>
                                    <div className='flex flex-col justify-center items-center gap-2 border-l border-token-border-heavy first:border-0 w-48 mt-4 px-2'>
                                        <div className='flex flex-row items-center gap-1.5 pt-1 text-xl font-semibold text-center leading-none'>
                                            <IconStar />
                                            {faker.finance.amount({ min: 3.6, max: 5, dec: 1 })}
                                        </div>
                                        <div className='text-xs text-token-text-tertiary'>{`评级 (${faker.finance.amount({ min: 0.1, max: 5, dec: 1 })}K+)`}</div>
                                    </div>
                                    <div className='flex flex-col justify-center items-center gap-2 border-l border-token-border-heavy first:border-0 w-48 mt-4 px-2'>
                                        <div className='flex flex-row items-center gap-1.5 pt-1 text-xl font-semibold text-center leading-none'>#8</div>
                                        <div className='text-xs text-token-text-tertiary'>属于Education (全球)</div>
                                    </div>
                                    <div className='flex flex-col justify-center items-center gap-2 border-l border-token-border-heavy first:border-0 w-48 mt-4 px-2'>
                                        <div className='flex flex-row items-center gap-1.5 pt-1 text-xl font-semibold text-center leading-none'>{faker.finance.amount({ min: 100, max: 1000, dec: 0 })}</div>
                                        <div className='text-xs text-token-text-tertiary'>对话</div>
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    <div className='font-bold mt-6'>对话开场白</div>
                                    <div className='mt-4 grid grid-cols-2 gap-x-1.5 gap-y-2'>
                                        {
                                            data?.prompt_starters.map((item) => {
                                                return (
                                                    <div className='flex' key={item}>
                                                        <Link href='1' className='group relative ml-2 h-14 flex-grow rounded-xl border border-token-border-medium bg-token-main-surface-primary px-4 hover:bg-token-main-surface-secondary focus:outline-none'>
                                                            <div className='flex h-full items-center'>
                                                                <div className="line-clamp-2 text-sm">{item}</div>
                                                            </div>
                                                            <div className='absolute -bottom-px -left-2 h-3 w-4 border-b border-token-border-medium bg-token-main-surface-primary group-hover:bg-token-main-surface-secondary'>
                                                                <div className='h-3 w-2 rounded-br-full border-b border-r border-token-border-medium bg-token-main-surface-primary' />
                                                            </div>
                                                            <div className='absolute bottom-0 right-2 top-0 hidden items-center group-hover:flex'>
                                                                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-token-main-surface-primary'>
                                                                    <IconChat />
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                {data && data.tools.length > 0 && <div className='w-full flex flex-col'>
                                    <div className='font-bold mt-6 mb-2'>功能</div>
                                    {
                                        data?.tools.map((item, index) => {
                                            return (
                                                <div className='flex flex-row items-start gap-2 py-1 text-sm' key={index}>
                                                    <IconChecked />
                                                    <div>{TOOLS_TO_CONVERTS[item.type]}</div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
