'use client'

import { useRequest } from 'ahooks';
import React, { useEffect, useRef, useState } from 'react'
import { getImageList, getOriginUrl } from '@/api/gc';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import GlobalInputForm from '@/component/Footer';
import { CHAT_MODEL, IMAGE_MODEL } from '@/interface/common';
import { generateImage } from '@/api/gpt';
import { IImageItem } from '@/interface/chat';
import ScrollBottomWrapper from '@/component/ScrollBottomWrapper';
import Spinning from '@/component/Spinning';
import toast from '@/until/message';
import 'photoswipe/style.css';
import { useMediaQuery } from '@mui/material';

const LoadingSkeleton = () => {
    return (
        <div className='w-full v-h-full min-h-[50vh] flex items-center justify-center'>
            <Spinning />
        </div>
    )
}

const CreatingSkeleton = ({ isCreating }: { isCreating: boolean }) => {
    if (!isCreating) {
        return null
    }
    return (
        <div className='w-full h-[200px] rounded-lg border bg-white flex items-center justify-center '>
            <Spinning />
        </div>
    )
}

function MediaImage({ data }: { data: IImageItem }) {
    const [originalUrl, setOriginalUrl] = useState('')
    const pollingApi = useRequest(getOriginUrl, {
        manual: true,
        pollingInterval: 1000,
        pollingWhenHidden: false,
        pollingErrorRetryCount: 3,
        onSuccess: (rst) => {
            if (rst && rst.originalUrl) {
                setOriginalUrl(rst.originalUrl)
                pollingApi.cancel()
            }
        }
    })

    useEffect(() => {
        if (data.generationsId && !data.originalUrl) {
            pollingApi.run(data.generationsId)
        }
        return () => {
            pollingApi.cancel()
        }
    }, [data.generationsId, data.originalUrl])

    return (
        <a
            href={data.originalUrl || originalUrl}
            data-pswp-src={data.originalUrl}
            data-pswp-width="1024"
            data-pswp-height="1024"
            className='relative group rounded-lg overflow-hidden w-[calc(50%-10px)] pt-[calc(50%-10px)] md:w-[calc(25%-7.5px)] md:pt-[calc(25%-7.5px)] aspect-square'
            key={data.createTime}
        >
            <div className='absolute z-20 w-full h-[40px] bottom-0 left-0 p-2 translate-y-[40px] transition duration-300 bg-black/60 group-hover:translate-y-0 '>
                <p className='text-sm w-full text-white font-light break-word leading-5 truncate'>
                    {data.prompt}
                </p>
            </div>
            <img className='absolute z-10 top-0 left-0 w-full h-full object-cover object-center aspect-square' src={data.thumbUrl} alt={data.prompt} />
        </a>
    )
}

export default function AiGcWindow() {
    const ctrRef = useRef<AbortController | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [imageList, setImageList] = useState<IImageItem[]>([])

    const currentPage = useRef(1)
    const totalPages = useRef(-1)

    const isDesktop = useMediaQuery('(min-width: 768px)')

    const imageListApi = useRequest(getImageList, {
        onSuccess: (rst) => {
            setImageList(rst.items)
            currentPage.current = rst.page
            totalPages.current = rst.totalPage
        }
    })

    const onSend = (inputPrompt: string) => {
        setIsCreating(true)
        generateImage({ prompt: inputPrompt, model: IMAGE_MODEL.DALL_E_3 }).then(rst => {
            if (rst) {
                setImageList((prev => (isDesktop ? [rst, ...prev] : [...prev, rst])))
            } else {
                toast.error('生成失败')
            }
        }).catch(() => {
            toast.error('生成失败')
        }).finally(() => {
            setIsCreating(false)
        })
    }

    const onStop = () => {
        if (ctrRef.current) {
            ctrRef.current.abort()
        }
    }

    useEffect(() => {
        let lightbox: PhotoSwipeLightbox | null = new PhotoSwipeLightbox({
            gallery: '#gallery-started',
            children: 'a',
            pswpModule: () => import('photoswipe'),
            showHideAnimationType: 'zoom',
            initialZoomLevel: 'fit',
            secondaryZoomLevel: 1.5,
            maxZoomLevel: 1,
        });

        lightbox.on('uiRegister', function () {
            lightbox?.pswp?.ui?.registerElement({
                name: 'download-button',
                order: 8,
                isButton: true,
                tagName: 'a',
                html: {
                    isCustomSVG: true,
                    inner: '<path d="M20.5 14.3 17.1 18V10h-2.2v7.9l-3.4-3.6L10 16l6 6.1 6-6.1ZM23 23H9v2h14Z" id="pswp__icn-download"/>',
                    outlineID: 'pswp__icn-download'
                },
                onInit: (el: any, pswp: any) => {
                    el.setAttribute('download', '');
                    el.setAttribute('target', '_blank');
                    el.setAttribute('rel', 'noopener');
                    pswp.on('change', () => {
                        el.href = pswp.currSlide.data.src
                    });
                }
            });
        });
        lightbox.init();
        return () => {
            lightbox?.destroy();
            lightbox = null;
        };
    }, []);

    return (
        <div className='flex h-full flex-col focus-visible:outline-0'>
            <div className='flex-1 overflow-hidden'>
                <ScrollBottomWrapper>
                    <div className='flex flex-col text-sm pb-9'>
                        <div className='w-full py-0 px-3 text-base m-auto pt-4 md:py-5 md:px-5 lg:px-1 xl:px-5'>
                            {imageListApi.loading && <LoadingSkeleton />}
                            <div id='gallery-started' className="flex flex-wrap justify-between md:justify-start gap-[10px] w-full pswp-gallery md:max-w-[48rem] m-auto">
                                <CreatingSkeleton isCreating={isCreating && isDesktop} />
                                {imageList.map((item, index) => (
                                    <MediaImage key={index} data={item} />
                                ))
                                }
                                <CreatingSkeleton isCreating={isCreating && !isDesktop} />
                            </div>
                        </div>

                    </div>
                </ScrollBottomWrapper>
            </div>
            {
                !imageListApi.loading && imageList.length === 0 && <div className='w-full h-[200px] flex-shrink-0 text-center text-lg  text-black/50 font-light flex justify-center'>
                    从详细的描述开始 尝试一个例子
                </div>
            }
            <GlobalInputForm
                onSend={onSend}
                onStop={onStop}
                displayPrompts={false}
                placeHolder=""
                isStreaming={isCreating}
            />
        </div>
    )
}
