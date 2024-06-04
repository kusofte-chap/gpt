'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import { Skeleton, useMediaQuery } from '@mui/material';
import PageHeader from '@/component/PageHeader';
import GlobalInputForm from '@/component/Footer';
import { currentChatModelState } from '@/store/atom';
import { IMAGE_MODE_CONVERTER } from '@/interface/common';
import { generateImage } from '@/api/gpt';
import { IGImageItem } from '@/interface/chat';
import toast from '@/until/message';
import 'photoswipe/style.css';

export default function AiGcWindow() {
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const ctrRef = useRef<AbortController | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const currentModel = useRecoilValue(currentChatModelState)
    const [imageList, setImageList] = useState<IGImageItem[]>([])

    const onSend = async (inputPrompt: string) => {
        setIsCreating(true)
        const rst = await generateImage({ prompt: inputPrompt, model: currentModel })
        if (rst) {
            setImageList([...imageList, rst])
        } else {
            toast.error('生成失败')
        }
        setIsCreating(false)
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
                        el.href = pswp.currSlide.data.src;
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
            <div className='w-full h-[56px] hidden md:block'>
                {isDesktop && <PageHeader modeList={IMAGE_MODE_CONVERTER} />}
            </div>
            <div className='flex-shrink-0 mb-4 mt-4 md:mt-0'>
                <GlobalInputForm
                    isStreaming={isCreating}
                    onSend={onSend}
                    onStop={onStop}
                    displayPrompts={false}
                    hiddenFileUpload={true}
                    hiddenGptTip={true}
                    containerClass='md:max-w-3xl lg:max-w-[60rem] xl:max-w-[68rem]'
                    placeHolder="巴洛克式绘画"
                />
            </div>
            <div className='flex-1 overflow-y-auto pb-9'>
                <div className='py-0 px-3 text-base m-auto md:py-2 md:px-5 lg:px-1 xl:px-5'>
                    <div id='gallery-started' className="pswp-gallery grid grid-cols-2 md:grid-cols-4 gap-5 md:max-w-3xl lg:max-w-[60rem] xl:max-w-[68rem] m-auto">
                        <a href='https://cdn.photoswipe.com/photoswipe-demo-images/photos/2/img-2500.jpg'
                            data-pswp-src="https://cdn.photoswipe.com/photoswipe-demo-images/photos/2/img-2500.jpg"
                            data-pswp-width="1024"
                            data-pswp-height="1024"
                            className='relative group overflow-hidden'
                        >
                            <div className='absolute bottom-0 left-0 p-2 translate-y-[200px] transition duration-300 bg-black/60 group-hover:translate-y-0 '>
                                <p className='text-sm w-full text-white font-light break-word leading-5 line-clamp-3'>
                                    Prompt: 反射洞穴周围环境的音箱，H.R. Giger 绘画，特写
                                </p>
                            </div>
                            <img className='w-full h-[200px] object-cover object-center rounded-lg' src="https://cdn.photoswipe.com/photoswipe-demo-images/photos/2/img-200.jpg" alt="" />
                        </a>
                        <a href='https://cdn.photoswipe.com/photoswipe-demo-images/photos/7/img-2500.jpg'
                            data-pswp-src="https://cdn.photoswipe.com/photoswipe-demo-images/photos/7/img-2500.jpg"
                            data-pswp-width="1024"
                            data-pswp-height="1024"
                            className='relative group overflow-hidden'
                        >
                            <div className='absolute bottom-0 left-0 p-2 translate-y-[200px] transition duration-300 bg-black/60 group-hover:translate-y-0 '>
                                <p className='text-sm w-full text-white font-light break-word leading-5 line-clamp-3'>
                                    Prompt: 反射洞穴周围环境的音箱，H.R. Giger 绘画，特写
                                </p>
                            </div>
                            <img className='w-full h-[200px] object-cover object-center rounded-lg' src="https://cdn.photoswipe.com/photoswipe-demo-images/photos/7/img-200.jpg" alt="" />
                        </a>
                        <a href='https://cdn.photoswipe.com/photoswipe-demo-images/photos/3/img-2500.jpg'
                            data-pswp-src="https://cdn.photoswipe.com/photoswipe-demo-images/photos/3/img-2500.jpg"
                            data-pswp-width="1024"
                            data-pswp-height="1024"
                            className='relative group overflow-hidden'
                        >
                            <div className='absolute bottom-0 left-0 p-2 translate-y-[200px] transition duration-300 bg-black/60 group-hover:translate-y-0 '>
                                <p className='text-sm w-full text-white font-light break-word leading-5 line-clamp-3'>
                                    Prompt: 反射洞穴周围环境的音箱，H.R. Giger 绘画，特写
                                </p>
                            </div>
                            <img className='w-full h-[200px] object-cover object-center rounded-lg' src="https://cdn.photoswipe.com/photoswipe-demo-images/photos/3/img-200.jpg" alt="" />
                        </a>
                        <a href='https://cdn.photoswipe.com/photoswipe-demo-images/photos/3/img-2500.jpg'
                            data-pswp-src="https://cdn.photoswipe.com/photoswipe-demo-images/photos/3/img-2500.jpg"
                            data-pswp-width="1024"
                            data-pswp-height="1024"
                            className='relative group overflow-hidden'
                        >
                            <div className='absolute bottom-0 left-0 p-2 translate-y-[200px] transition duration-300 bg-black/60 group-hover:translate-y-0 '>
                                <p className='text-sm w-full text-white font-light break-word leading-5 line-clamp-3'>
                                    Prompt: 反射洞穴周围环境的音箱，H.R. Giger 绘画，特写
                                </p>
                            </div>
                            <img className='w-full h-[200px] object-cover object-center rounded-lg' src="https://cdn.photoswipe.com/photoswipe-demo-images/photos/3/img-200.jpg" alt="" />
                        </a>
                        <a href='https://cdn.photoswipe.com/photoswipe-demo-images/photos/2/img-2500.jpg'
                            data-pswp-src="https://cdn.photoswipe.com/photoswipe-demo-images/photos/2/img-2500.jpg"
                            data-pswp-width="1024"
                            data-pswp-height="1024"
                            className='relative group overflow-hidden'
                        >
                            <div className='absolute bottom-0 left-0 p-2 translate-y-[200px] transition duration-300 bg-black/60 group-hover:translate-y-0 '>
                                <p className='text-sm w-full text-white font-light break-word leading-5 line-clamp-3'>
                                    Prompt: 反射洞穴周围环境的音箱，H.R. Giger 绘画，特写
                                </p>
                            </div>
                            <img className='w-full h-[200px] object-cover object-center rounded-lg' src="https://cdn.photoswipe.com/photoswipe-demo-images/photos/2/img-200.jpg" alt="" />
                        </a>
                        <a className='w-full h-[200px] object-cover object-center rounded-lg'>
                            <Skeleton variant="rectangular" width="100%" height='100%' className='rounded-lg'
                                sx={{
                                    '&.MuiSkeleton-root>*': {
                                        visibility: 'visible',
                                    }
                                }}>
                                <div className='w-full h-[200px] flex items-center justify-center text-[18px] font-thin text-[#000]'>生成中...</div>
                            </Skeleton>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
