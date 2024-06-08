'use client'
import ScrollToBottom, { useScrollToBottom, useSticky } from 'react-scroll-to-bottom'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil';
import { useRequest } from 'ahooks';
import { getImageList, getOriginUrl } from '@/api/gc';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import { Skeleton, useMediaQuery } from '@mui/material';
import PageHeader from '@/component/PageHeader';
import GlobalInputForm from '@/component/Footer';
import { currentChatModelState } from '@/store/atom';
import { CHAT_MODEL, IMAGE_MODE_CONVERTER } from '@/interface/common';
import { generateImage } from '@/api/gpt';
import { IImageItem } from '@/interface/chat';
import toast from '@/until/message';
import { css } from '@emotion/css'
import 'photoswipe/style.css';

const scrollBottomRoot = css({
    width: '100%',
    height: '100%',
    '&>div': {
        width: '100%',
        height: '100%',
        overflowY: 'auto'
    }
})

const LoadingSkeleton = () => {
    return (
        <>
            <Skeleton variant="rounded" width="100%" height="200px" />
            <Skeleton variant="rounded" width="100%" height="200px" />
            <Skeleton variant="rounded" width="100%" height="200px" />
            <Skeleton variant="rounded" width="100%" height="200px" />
            <Skeleton variant="rounded" width="100%" height="200px" />
            <Skeleton variant="rounded" width="100%" height="200px" />
            <Skeleton variant="rounded" width="100%" height="200px" />
            <Skeleton variant="rounded" width="100%" height="200px" />
            <Skeleton variant="rounded" width="100%" height="200px" />
            <Skeleton variant="rounded" width="100%" height="200px" />
            <Skeleton variant="rounded" width="100%" height="200px" />
            <Skeleton variant="rounded" width="100%" height="200px" />
        </>
    )
}


const CreatingSkeleton = ({ isCreating }: { isCreating: boolean }) => {
    if (!isCreating) {
        return
    }
    return (
        <div className='w-full h-[200px] rounded-lg'>
            <Skeleton variant="rectangular" width="100%" height='100%' className='rounded-lg'
                sx={{
                    '&.MuiSkeleton-root>*': {
                        visibility: 'visible',
                    }
                }}>
                <div className='w-full h-[200px] flex items-center justify-center text-[18px] font-thin text-[#000]'>生成中...</div>
            </Skeleton>
        </div>
    )
}


function getDownLoadUrl(url: string) {
    const urlObject = new URL(url)
    return `${urlObject.origin}${urlObject.pathname}?attname=&${urlObject.searchParams.toString()}`
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
            className='relative group rounded-lg bg-[#0000001c] overflow-hidden'
            key={data.createTime}

        >
            <div className='absolute w-full h-[40px] bottom-0 left-0 p-2 translate-y-[40px] transition duration-300 bg-black/60 group-hover:translate-y-0 '>
                <p className='text-sm w-full text-white font-light break-word leading-5 truncate'>
                    {`Prompt: ${data.prompt}`}
                </p>
            </div>
            <img className='w-full h-[200px] object-cover object-center ' src={data.thumbUrl} alt={data.prompt} />
        </a>
    )
}

export default function AiGcWindow() {
    const ctrRef = useRef<AbortController | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [imageList, setImageList] = useState<IImageItem[]>([])
    const [model, setModel] = useState(CHAT_MODEL.DALL_E_3)

    const currentPage = useRef(1)
    const totalPages = useRef(-1)

    const imageListApi = useRequest(getImageList, {
        onSuccess: (rst) => {
            setImageList(rst.items)
            currentPage.current = rst.page
            totalPages.current = rst.totalPage
        }
    })

    const onSend = (inputPrompt: string) => {
        setIsCreating(true)
        generateImage({ prompt: inputPrompt, model }).then(rst => {
            if (rst) {
                setImageList((prev => ([rst, ...prev])))
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
                <ScrollToBottom
                    className={scrollBottomRoot}
                    initialScrollBehavior='smooth'
                >
                    <div className='flex flex-col text-sm pb-9'>
                        <div className='hidden md:block md:shadow-3xl-btr' >
                            <PageHeader modeList={IMAGE_MODE_CONVERTER} onChangeModel={setModel} />
                        </div>
                        <div className='w-full py-0 px-3 text-base m-auto md:py-5 md:px-5 lg:px-1 xl:px-5'>
                            <div id='gallery-started' className="w-full pswp-gallery grid grid-cols-2 md:grid-cols-4 gap-5 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] m-auto">
                                <CreatingSkeleton isCreating={isCreating} />
                                {
                                    imageListApi.loading ? <LoadingSkeleton /> : <Fragment>
                                        {imageList.map((item, index) => (
                                            <MediaImage key={index} data={item} />
                                        ))
                                        }
                                    </Fragment>
                                }
                            </div>
                        </div>

                    </div>
                </ScrollToBottom>
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
                placeHolder="巴洛克式绘画"
                isStreaming={isCreating}
            />
        </div>
    )
}
