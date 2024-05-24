'use client'

import React from 'react'
import IconFile from '@/assets/icons/icon-file.svg'
import IconSend from '@/assets/icons/icon-send.svg'
import IconUp from '@/assets/icons/icon-up.svg';
import { useRequest } from 'ahooks';
import { getDefaultPrompts } from '@/api/gpt';
import cn from 'classnames'
import { useMediaQuery } from '@mui/material';

interface IPrompt {
  description: string,
  title: string,
  prompt: string
}

function RecommendPrompts({ prompts }: { prompts: IPrompt[] }) {
  const isSmDevice = useMediaQuery('(max-width: 640px)')
  return (
    <div className="relative h-full w-full">
      <div className='flex flex-col gap-3.5 pb-3.5 pt-2'>
        <div className='grid w-full grid-flow-row grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-2 mb-4 md:mb-0'>
          <div className='flex flex-col gap-2'>
            {
              prompts.slice(0, isSmDevice ? 1 : 2).map((item, index) => {
                return (
                  <button key={index} className='relative group w-full whitespace-nowrap rounded-xl px-4 py-3 text-left text-token-text-primary md:whitespace-normal border-token-border-medium border hover:bg-[#f9f9f9]'>
                    <div className='flex'>
                      <div className='flex flex-col overflow-hidden'>
                        <div className='truncate'>{item.title}</div>
                        <div className='truncate text-sm font-normal opacity-50'>{item.description}</div>
                      </div>
                    </div>
                    <div className='absolute bottom-0 right-0 top-0 flex items-center rounded-xl bg-gradient-to-l from-[#f9f9f9] pl-6 pr-4 text-token-text-secondary opacity-0 group-hover:opacity-100 transition-all'>
                      <span className='rounded-lg bg-token-main-surface-primary p-1 shadow-md'>
                        <IconUp />
                      </span>
                    </div>
                  </button>
                )
              })
            }
          </div>
          <div className='flex flex-col gap-2'>
            {
              prompts.slice(isSmDevice ? 3 : 2).map((item, index) => {
                return (
                  <button key={index} className='relative group w-full whitespace-nowrap rounded-xl px-4 py-3 text-left text-token-text-primary md:whitespace-normal border-token-border-medium border hover:bg-[#f9f9f9]'>
                    <div className='flex'>
                      <div className='flex flex-col overflow-hidden'>
                        <div className='truncate'>{item.title}</div>
                        <div className='truncate text-sm font-normal opacity-50'>{item.description}</div>
                      </div>
                    </div>
                    <div className='absolute bottom-0 right-0 top-0 flex items-center rounded-xl bg-gradient-to-l from-[#f9f9f9] pl-6 pr-4 text-token-text-secondary opacity-0 group-hover:opacity-100 transition-all'>
                      <span className='rounded-lg bg-token-main-surface-primary p-1 shadow-md'>
                        <IconUp />
                      </span>
                    </div>
                  </button>
                )
              })
            }
          </div>
        </div>
      </div>

    </div>
  )
}

export default function PageFooter() {
  const { data: prompts = [], loading } = useRequest<IPrompt[], any>(getDefaultPrompts)

  return (
    <div className='w-full md:pt-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:w-[calc(100%-.5rem)]'>
      <div className="px-3 text-base md:px-4 m-auto lg:px-1 xl:px-5">
        <div className='mx-auto flex flex-1 gap-3 text-base juice:gap-4 juice:md:gap-6 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]'>
          <form className='w-full'>
            <div className='relative flex h-full max-w-full flex-1 flex-col'>
              <div className={cn('absolute bottom-full left-0 right-0 transition-all ease duration-300 opacity-0', { 'opacity-100': !loading })} >
                <RecommendPrompts prompts={prompts} />
              </div>
              <div className='overflow-hidden [&:has(textarea:focus)]:border-token-border-xheavy [&:has(textarea:focus)]:shadow-[0_2px_6px_rgba(0,0,0,.05)] flex flex-col w-full flex-grow relative border dark:text-white rounded-2xl bg-token-main-surface-primary border-token-border-medium'>
                <textarea
                  className='m-0 w-full h-[44px] md:h-[52px] resize-none border-0 bg-transparent focus:ring-0 focus-visible:ring-0 dark:bg-transparent py-[10px] pr-10 md:py-3.5 md:pr-12 max-h-[25dvh] max-h-52 placeholder-black/50 dark:placeholder-white/50 pl-10 md:pl-[55px]'
                  placeholder='给“ChatGPT”发送消息'
                />
                <div className='absolute bottom-2.5 left-2 md:bottom-3.5 md:left-4'>
                  <button className='flex items-center justify-center text-token-text-primary juice:h-8 juice:w-8 dark:text-white juice:rounded-full focus-visible:outline-black dark:focus-visible:outline-white juice:mb-1 juice:ml-[3px]'>
                    <IconFile />
                  </button>
                  {/* <input multiple type="file" accept='*' className="hidden" /> */}
                </div>
                <button disabled className='absolute bottom-1.5 right-2 rounded-lg border border-black bg-black p-0.5 text-white transition-colors enabled:bg-black disabled:text-gray-400 disabled:opacity-10 dark:border-white dark:bg-white dark:hover:bg-white md:bottom-2.5 md:right-3'>
                  <span>
                    <IconSend />
                  </span>
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
      <div className='relative px-2 py-2 text-center text-xs text-token-text-secondary md:px-[60px]'>
        <span>ChatGPT 也可能会犯错。请核查重要信息。</span>
      </div>
    </div>
  )
}
