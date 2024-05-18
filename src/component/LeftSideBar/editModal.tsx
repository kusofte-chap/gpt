'use client'

import { ReactNode, useState } from "react";
import IconSetting from '@/assets/icons/icon-setting.svg'
import IconLogoOut from '@/assets/icons/icon-logout.svg'
import { Modal, Stack } from "@mui/material";
import IconClose from '@/assets/icons/icon-close.svg'
import IconSafe from '@/assets/icons/icon-safe.svg'
import cn from 'classnames'

interface ITabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const ButtonItem = ({ children, onClick }: { children: ReactNode, onClick?: () => void }) => {
    return (
        <a
            type="button"
            onClick={() => onClick?.()}
            className="flex gap-2 rounded p-2.5 text-sm cursor-pointer focus:ring-0 radix-disabled:pointer-events-none radix-disabled:opacity-50 group items-center hover:bg-token-sidebar-surface-secondary">
            {children}
        </a>
    )
}

export default function SettingPanel({ onSetting, onLogout }: {
    onSetting: () => void
    onLogout: () => void
}) {
    return (
        <div className="popover absolute bottom-full left-0 z-20 mb-1 w-full  overflow-hidden rounded-lg border border-token-border-light bg-white p-1.5 shadow-lg outline-none opacity-100 translate-y-0">
            <nav role='none'>
                <div className="ml-3 mr-2 py-2 text-sm text-token-text-secondary lowercase">ruiyang183@gmail</div>
                <div className="h-px bg-token-border-light my-1.5" />
                <ButtonItem
                    onClick={onSetting}>
                    <IconSetting className="w-[18px] h-[18px]" />
                    设置
                </ButtonItem>
                <div className="h-px bg-token-border-light my-1.5" />
                <ButtonItem
                    onClick={onLogout}>
                    <IconLogoOut className="w-[18px] h-[18px]" />
                    退出
                </ButtonItem>
            </nav>
        </div>
    )
}

function TabPanel(props: ITabPanelProps) {
    const { children, value, index, ...other } = props;
    if (value !== index) {
        return null
    }
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            className="flex flex-col gap-3 px-4 pb-1 text-sm text-token-text-primary sm:px-6 sm:pb-2 md:pl-0 md:pt-5"
            {...other}
        >
            {children}
        </div>
    )
}

export function EditPersonInfoDialog({ open, onClose }: { open: boolean, onClose: () => void }) {
    const [value, setValue] = useState(0);
    return (
        <Modal open={open}  >
            <div className="w-full h-full flex items-center justify-center">
                <div className="flex flex-col w-[680px] rounded-lg bg-white h-auto min-h-[300px] overflow-hidden">
                    <div className="px-4 pb-4 pt-5 sm:p-6 flex items-center justify-between border-b border-black/10 ">
                        <span className="text-lg font-medium leading-6 text-token-text-primary">设置</span>
                        <button className="w-6 h-6 text-token-text-tertiary hover:text-token-text-secondary" onClick={onClose}>
                            <IconClose />
                        </button>
                    </div>
                    <div className="flex-grow overflow-y-auto">
                        <Stack direction='row' >
                            <div className="m-2 md:m-0 md:px-4 md:pl-6 md:pt-4 flex flex-shrink-0 md:ml-[-8px] md:min-w-[180px] max-w-[200px] flex-col gap-2">
                                <button
                                    className={cn("group flex items-center justify-start gap-2 rounded-md px-2 py-1.5 text-sm text-token-text-primary", { 'bg-token-main-surface-tertiary': 0 === value })}
                                    onClick={() => setValue(0)}
                                >
                                    <IconSafe />
                                    修改密码
                                </button>
                                <button
                                    className={cn("group flex items-center justify-start gap-2 rounded-md px-2 py-1.5 text-sm text-token-text-primary", { 'bg-token-main-surface-tertiary': 1 === value })}
                                    onClick={() => setValue(1)}
                                >
                                    <IconSafe />
                                    编辑头像
                                </button>
                            </div>
                            <div className="max-h-[calc(100vh-150px)] w-full overflow-y-auto md:min-h-[380px]">
                                <TabPanel value={value} index={0}>
                                    Item Three
                                </TabPanel>
                                <TabPanel value={value} index={1}>
                                    Item Four
                                </TabPanel>
                            </div>
                        </Stack>
                    </div>
                </div>
            </div>
        </Modal>
    )
}