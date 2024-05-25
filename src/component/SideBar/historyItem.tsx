'use client'

import cn from 'classnames'
import { useContext, useEffect, useMemo, useState } from "react"
import MoreIcon from '@/assets/icons/icon-more.svg'
import { IChartItem, IHistoryGroup } from "@/interface/history"
import { faker } from "@faker-js/faker"
import { FAKE_DATA } from './testData'
import { Box, Grow, ListItemIcon, Menu, MenuItem, Popper, Typography } from '@mui/material'
import { PopoverProvider, PopoverContext } from "./context"
import IconRename from '@/assets/icons/icon-rename.svg'
import IconDelete from '@/assets/icons/icon-delete.svg'


const genFakerData = (n: number,) => {
    let count = 0
    let list: IChartItem[] = []
    while (count < n) {
        count++
        list.push({
            id: faker.string.uuid(),
            title: faker.lorem.words({ min: 2, max: 4 })
        })
    }
    return list
}

const genHistoryList = (n: number) => {
    let count = 0
    let list: IHistoryGroup[] = []
    while (count < n) {
        count++
        list.push({
            id: faker.string.uuid(),
            title: faker.person.fullName(),
            list: genFakerData(faker.number.int({ min: 10, max: 15 }))
        })
    }
    return list
}


interface IEditMenuProps {
    id: string;
    open: boolean
    anchorEl: HTMLElement | null
    onClose: () => void

}

function EditMenu({ id, open, anchorEl, onClose }: IEditMenuProps) {
    return (
        <Menu
            id={id}
            aria-labelledby="positioned-button__menu"
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            className='shadow-lg'
            slotProps={{
                paper: {
                    sx: {
                        width: 200
                    }
                }
            }}
            sx={{
                '.MuiMenu-paper': {
                    // maxWidth: '300px',
                    width: 'max-content',
                    border: '1px solid rgba(0,0,0,.1)',
                    borderRadius: '8px',
                    boxShadow: 'var(--tw-ring-offset-shadow,0 0 transparent),var(--tw-ring-shadow,0 0 transparent),var(--tw-shadow)'
                },
                '.MuiMenu-list': {
                    p: 0,
                    borderRadius: '3px',
                    '.MuiMenuItem-root': {
                        width: 90,
                        heigh: 40,
                        m: '6px',
                        p: '10px'
                    }
                }
            }}

        >
            <MenuItem>
                <ListItemIcon>
                    <IconRename />
                </ListItemIcon>
                <Typography variant="inherit" noWrap>
                    重命名
                </Typography>
            </MenuItem>
            <MenuItem>
                <ListItemIcon color='error'>
                    <IconDelete />
                </ListItemIcon>
                <Typography variant="inherit" noWrap color='error'>
                    删除
                </Typography>
            </MenuItem>
        </Menu>
    )
}

function ChartItem({ data }: { data: IChartItem }) {
    const { activeItemId, anchorEl, setActiveItemId, setAnchorEl } = useContext(PopoverContext)

    const isActive = useMemo(() => {
        return data.id === activeItemId
    }, [activeItemId])


    const handleItemClick = () => {
        setActiveItemId(data.id)
        setAnchorEl(prev => {
            if (prev) {
                return null
            }
            return prev
        })
    };

    const onToggleOpen = async (event: React.MouseEvent<HTMLElement>) => {
        const target = event.currentTarget

        if (anchorEl && anchorEl === event.currentTarget) {
            setAnchorEl(null);
        } else {
            setAnchorEl(null);
            setTimeout(() => {
                setAnchorEl(target)
            }, 0)
        }
    }

    return (
        <>
            <li
                className={cn('group relative rounded-lg cursor-pointer', {
                    'active:opacity-90 hover:bg-token-sidebar-surface-secondary': !isActive,
                    'opacity-90 bg-token-sidebar-surface-secondary': isActive
                })}>
                <a className="flex items-center gap-2 p-2" onClick={handleItemClick} data-state={isActive ? 'open' : 'closed'}>
                    <div className='relative grow overflow-hidden whitespace-nowrap'>
                        {data.title}
                        <div className={cn('absolute bottom-0 right-0 top-0 bg-gradient-to-l to-transparent from-token-sidebar-surface-primary  w-10 from-0% ', {
                            'group-hover:from-token-sidebar-surface-secondary group-hover:w-20 group-hover:from-60%': !isActive,
                            'from-token-sidebar-surface-secondary w-20 from-60%': isActive
                        })} />
                    </div>
                </a>
                <div className={cn('absolute bottom-0 right-0 top-0 items-center pr-2', { 'hidden group-hover:flex': !isActive, 'flex': isActive })}>
                    <button
                        type='button'
                        onClick={onToggleOpen}
                        className='flex items-center justify-center border-none bg-transparent outline-none text-[#0d0d0d]'
                    >
                        <MoreIcon />
                    </button>
                </div>
            </li >

        </>
    )
}

function HistoryGroup({ data }: { data: IHistoryGroup }) {
    return (
        <div className='relative mt-5 empty:mt-0 empty:hidden first:mt-0 last:mb-5'>
            <div className='bg-token-sidebar-surface-primary'>
                <div className='flex items-center h-9'>
                    <h3 className='pb-2 pt-3 px-2 text-xs font-medium text-ellipsis overflow-hidden break-all text-token-text-secondary'>{data.title}</h3>
                </div>
            </div>
            <ol>
                {
                    data.list.map((chart) => <ChartItem key={chart.id} data={chart} />)
                }
            </ol>
        </div>
    )
}

function List() {
    const { anchorEl } = useContext(PopoverContext)
    return (
        <>
            <div className='flex flex-1 flex-col gap-2 pb-2 text-token-text-primary text-sm'>
                <div className='empty:hidden'>
                    {
                        FAKE_DATA.map((g) => <HistoryGroup key={g.id} data={g} />)
                    }
                </div>
            </div>
            {Boolean(anchorEl) && <Popper
                open
                anchorEl={anchorEl}
                placement='bottom-start'
                transition
                sx={{
                    zIndex: 1200,
                    transformOrigin: 'center',
                }}
            >
                {({ TransitionProps }) => (
                    <Grow {...TransitionProps} timeout={200} >
                        <div className='max-w-xs rounded-lg popover bg-token-main-surface-primary shadow-lg will-change-[opacity,transform] border border-token-border-light'>
                            <button className='flex w-[90px] gap-2 items-center m-1.5 rounded p-2.5 text-sm cursor-pointer focus-visible:outline-0 hover:bg-token-main-surface-secondary focus-visible:bg-token-main-surface-secondary group relative'>
                                <IconRename />
                                重命名
                            </button>
                            <button className='flex w-[90px] gap-2 items-center m-1.5 rounded p-2.5 text-sm cursor-pointer focus-visible:outline-0 hover:bg-token-main-surface-secondary focus-visible:bg-token-main-surface-secondary group relative text-token-text-error'>
                                <IconDelete />
                                删除
                            </button>
                        </div>
                    </Grow>
                )}
            </Popper>}
        </>
    )
}

export function HistoryList() {
    return (
        <PopoverProvider>
            <List />
        </PopoverProvider>
    )
}