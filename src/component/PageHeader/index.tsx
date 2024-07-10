'use client'

import { ReactNode, useMemo, useState } from 'react';
import { Menu, MenuItem, useMediaQuery } from '@mui/material';
import cn from 'classnames'
import IconMenu from '@/assets/icons/icon-menu.svg'
import IconChecked from '@/assets/icons/icon-check.svg'
import { CHAT_MODEL, IModelOption } from '@/interface/common';
import StyledTooltip from '../StyledTooltip';
import IconCloseMenu from '@/assets/icons/icon-close-menu.svg'
import { useToggleSideBar } from '@/hooks/index';
import LogoGpt3 from '@/assets/icons/icon-gpt-3.5.svg'
import LogoGpt4 from '@/assets/icons/icon-gpt-4.svg'
import Logo4o from '@/assets/icons/icon-gpt-4o.svg'
import { useSearchParams } from 'next/navigation';

const LogoMaps: Record<CHAT_MODEL, ReactNode> = {
    [CHAT_MODEL.GPT_3_5_TURBO]: <LogoGpt3 />,
    [CHAT_MODEL.GPT_4_TURBO]: <LogoGpt4 />,
    [CHAT_MODEL.GPT_4o]: <Logo4o />
}

export function ModelSelect({
    modeList,
    onChange
}: { modeList: IModelOption[], onChange?: (m: CHAT_MODEL) => void }) {
    const searchParams = useSearchParams()
    const defaultModel = searchParams.get('model')
    const [model, setModel] = useState(defaultModel || modeList[0].mode)

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const isMobile = useMediaQuery('(max-width: 768px)');

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickItem = (model: CHAT_MODEL) => {
        setModel(model)
        onChange?.(model)
        setAnchorEl(null);
        history.replaceState(null, '', `?model=${model}`);
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
                {model}
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
                                    <div className='flex-shrink-0 bg-[#ececec] flex  w-7 h-7 items-center justify-center rounded-full'>
                                        {LogoMaps[item.mode]}
                                    </div>
                                    <div className='flex flex-col flex-1'>
                                        {item.mode}
                                        <div className='text-token-text-tertiary text-xs'>{item.description}</div>
                                    </div>
                                    <div className={cn('flex-shrink-0 w-4 h-4 hidden', { '!block': model === item.mode })}>
                                        <IconChecked />
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
        </div >
    )
}
