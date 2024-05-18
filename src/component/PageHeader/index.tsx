'use client'
import { useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import cn from 'classnames'
import IconMenu from '@/assets/icons/icon-menu.svg'
import IconGpt from '@/assets/icons/icon-gpt.svg'
import IconGpts from '@/assets/icons/icon-gpts.svg'
import IconRight from '@/assets/icons/icon-right.svg'

enum MODEL_ENUM {
    GPT = 'gpt',
    GPTS = 'gpts'
}

export default function PageHeader() {
    const [model, setModel] = useState(MODEL_ENUM.GPT)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickItem = (model: MODEL_ENUM) => {
        setModel(model)
        setAnchorEl(null);
    };

    return (
        <div className='sticky top-0 juice:p-3 mb-1.5 flex items-center justify-between z-10 h-14 p-2 font-semibold bg-token-main-surface-primary'>
            <div className='flex items-center gap-2 overflow-hidden'>
                <button
                    onClick={handleClick}
                    aria-controls={open ? 'modal-select-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    className={cn('group flex cursor-pointer items-center gap-1 rounded-xl py-2 px-3 text-lg font-medium hover:bg-token-main-surface-secondary overflow-hidden whitespace-nowrap', {
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
                                width: 300,
                                mt: 1.5,
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
                    transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                >
                    <MenuItem onClick={() => handleClickItem(MODEL_ENUM.GPT)}>
                        <div className='flex-1 flex gap-2 items-center justify-between m-1.5 rounded p-2.5 text-sm cursor-pointer focus-visible:outline-0 hover:bg-token-main-surface-secondary focus-visible:bg-token-main-surface-secondary radix-disabled:opacity-50 group relative !pr-3 !opacity-100'>
                            <div className='flex-shrink-0 '>
                                <IconGpt />
                            </div>
                            <div className='flex flex-col flex-1'>
                                GPT
                                <div className='text-token-text-tertiary text-xs'>非常适合用于日常任务</div>
                            </div>
                            <div className={cn('flex-shrink-0 w-4 h-4 hidden', { '!block': model === MODEL_ENUM.GPT })}>
                                <IconRight />
                            </div>
                        </div>
                    </MenuItem>
                    <MenuItem onClick={() => handleClickItem(MODEL_ENUM.GPTS)}>
                        <div className='flex-1 flex gap-2 items-center m-1.5 rounded p-2.5 text-sm cursor-pointer focus-visible:outline-0 hover:bg-token-main-surface-secondary focus-visible:bg-token-main-surface-secondary radix-disabled:opacity-50 group relative !pr-3 !opacity-100'>
                            <div className='flex-shrink-0 '>
                                <IconGpts />
                            </div>
                            <div className='flex flex-col flex-1 text-sm'>
                                AI助手
                                <div className='text-token-text-tertiary text-xs'>我们最智能的模型和更多内容</div>
                            </div>
                            <div className={cn('flex-shrink-0 w-4 h-4 hidden', { '!block': model === MODEL_ENUM.GPTS })}>
                                <IconRight />
                            </div>
                        </div>
                    </MenuItem>
                </Menu>
            </div>
        </div >
    )
}
