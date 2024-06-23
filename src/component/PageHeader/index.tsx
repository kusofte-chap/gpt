'use client'
import { useEffect, useMemo, useState } from 'react';
import { Menu, MenuItem, useMediaQuery } from '@mui/material';
import cn from 'classnames'
import IconMenu from '@/assets/icons/icon-menu.svg'
import IconGpt from '@/assets/icons/icon-gpt.svg'
import IconRight from '@/assets/icons/icon-right.svg'
import { CHAT_MODEL, IModelOption } from '@/interface/common';
import { useSetRecoilState } from 'recoil';
import { currentChatModelState } from '@/store/atom';
import StyledTooltip from '../StyledTooltip';
import IconCloseMenu from '@/assets/icons/icon-close-menu.svg'
import { useToggleSideBar } from '@/hooks/index';

export function ModelSelect({
    modeList,
    onChange
}: { modeList: IModelOption[], onChange?: (m: CHAT_MODEL) => void }) {
    const [model, setModel] = useState(modeList[0].mode)
    const setGlobalModel = useSetRecoilState(currentChatModelState)

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const isMobile = useMediaQuery('(max-width: 768px)');

    useEffect(() => {
        if (modeList.length > 1) {
            setModel(modeList[0].mode)
        }
    }, [modeList])

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickItem = (model: CHAT_MODEL) => {
        setModel(model)
        onChange?.(model)
        setGlobalModel(model)
        setAnchorEl(null);
    };

    const placement = useMemo(() => {
        if (isMobile) {
            return {
                transformOrigin: { horizontal: 'center', vertical: 'top' },
                anchorOrigin: { horizontal: 'center', vertical: 'bottom' }
            }
        }
        return {
            transformOrigin: { horizontal: 'left', vertical: 'top' },
            anchorOrigin: { horizontal: 'left', vertical: 'bottom' }
        }
    }, [isMobile])


    return (
        <>
            <button
                onClick={handleClick}
                aria-controls={open ? 'modal-select-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                className={cn('group flex cursor-pointer items-center gap-1 rounded-md md:rounded-xl py-2 px-3 text-lg font-medium hover:bg-token-main-surface-secondary overflow-hidden whitespace-nowrap', {
                    'bg-token-main-surface-secondary': open
                })}
            >
                ChatGPT
                <IconMenu />
            </button>
            <Menu
                anchorEl={anchorEl}
                id="modal-select-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            p: 0,
                            width: { xs: 260, md: 300 },
                            mt: '4px',
                            borderRadius: '8px',
                            border: '1px solid #e0e0e0',
                            overflow: 'visible',
                            boxShadow: '0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1)'
                        },
                    },
                }}
                MenuListProps={{
                    sx: {
                        p: 0,
                        '.MuiMenuItem-root': {
                            p: 0,
                            bgcolor: 'transparent',
                            ':hover': {
                                bgcolor: 'unset'
                            }
                        }
                    }
                }}
                {...placement as any}
            >

                {
                    modeList.map((item) => {
                        return (
                            <MenuItem key={item.mode} onClick={() => handleClickItem(item.mode)}>
                                <div className='flex-1 flex gap-2 items-center justify-between m-1.5 rounded p-2.5 text-sm cursor-pointer focus-visible:outline-0 hover:bg-token-main-surface-secondary focus-visible:bg-token-main-surface-secondary radix-disabled:opacity-50 group relative !pr-3 !opacity-100'>
                                    <div className='flex-shrink-0 '>
                                        <IconGpt />
                                    </div>
                                    <div className='flex flex-col flex-1'>
                                        {item.mode}
                                        <div className='text-token-text-tertiary text-xs'>{item.description}</div>
                                    </div>
                                    <div className={cn('flex-shrink-0 w-4 h-4 hidden', { '!block': model === item.mode })}>
                                        <IconRight />
                                    </div>
                                </div>
                            </MenuItem>
                        )
                    })
                }
            </Menu>
        </>
    )

}

export default function PageHeader({ modeList, onChangeModel }: { modeList: IModelOption[], onChangeModel?: (m: CHAT_MODEL) => void }) {
    const { openSidebar, toggleCloseSideBar } = useToggleSideBar()

    return (
        <div className='sticky top-0 mb-1.5 flex items-center justify-between z-10 h-14 p-2 font-semibold bg-token-main-surface-primary'>
            <div className='flex items-center gap-2 overflow-hidden'>
                <StyledTooltip title='关闭侧栏' placement='bottom' arrow>
                    <button
                        onClick={toggleCloseSideBar}
                        className={cn('h-10 rounded-lg px-2 text-token-text-secondary focus-visible:outline-0 hover:bg-token-sidebar-surface-secondary focus-visible:bg-token-sidebar-surface-secondary', { 'hidden': openSidebar })}>
                        <IconCloseMenu />
                    </button>
                </StyledTooltip>
                <ModelSelect modeList={modeList} onChange={onChangeModel} />
            </div>
            {/* <div className='flex gap-2 pr-1'>
                <button className='h-10 rounded-lg px-2 text-token-text-secondary focus-visible:outline-0 hover:bg-token-main-surface-secondary focus-visible:bg-token-main-surface-secondary'>
                    <IconShare />
                </button>
            </div> */}
        </div >
    )
}
