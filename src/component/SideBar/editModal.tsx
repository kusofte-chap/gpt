'use client'

import { ReactNode, useState } from "react";
import IconSetting from '@/assets/icons/icon-setting.svg'
import IconLogoOut from '@/assets/icons/icon-logout.svg'
import { FormHelperText, FormLabel, IconButton, InputAdornment, Modal, Stack, TextField } from "@mui/material";
import IconClose from '@/assets/icons/icon-close.svg'
import IconSafe from '@/assets/icons/icon-safe.svg'
import cn from 'classnames'
import { Controller, useForm } from "react-hook-form";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { useRequest } from "ahooks";
import { updatePassword, uploadAvatar } from "@/api/auth";
import toast from "@/until/message";
import encrypt from "@/until/encrypt";
import { handleLogout } from "@/until/index";
import { Avatar } from "@files-ui/react";
import { useRecoilState } from "recoil";
import { userInfoState } from "@/store/atom";

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
                {/* <div className="ml-3 mr-2 py-2 text-sm text-token-text-secondary lowercase">ruiyang183@gmail</div> */}
                {/* <div className="h-px bg-token-border-light my-1.5" /> */}
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
            className="flex flex-col gap-3 px-4 pb-1 text-sm text-token-text-primary  md:pt-5"
            {...other}
        >
            {children}
        </div>
    )
}

interface IFormFields {
    oldPass: string
    newPass: string
}

function EditPassWord() {
    const { control, getValues, handleSubmit } = useForm<IFormFields>({
        defaultValues: {
            oldPass: '',
            newPass: ''
        }
    })

    const [errorMsg, setErrorMsg] = useState('')
    const [showOldPass, setOldPass] = useState(false)
    const [showNewPass, setShowOldPss] = useState(false)

    const api = useRequest(updatePassword, {
        manual: true,
        onSuccess: (rst) => {
            toast.success('修改成功，请重新登录')
            handleLogout()
        },
        onError: (error: any) => {
            setErrorMsg(error?.response?.data?.message || "登陆失败")
        }
    })

    const handleOnSubmit = handleSubmit((data: IFormFields) => {
        api.run({
            oldPass: encrypt(data.oldPass),
            newPass: encrypt(data.newPass)
        })
    })

    return (
        <div className="w-full flex flex-col flex-1">
            <div className='w-full mb-5'>
                <Controller
                    name='oldPass'
                    control={control}
                    rules={{
                        required: '請輸入8-20位英數字或符號',
                        pattern: {
                            value: /^[a-zA-Z0-9]{6,20}$/,
                            message: '請輸入6-20位英數字或符號'
                        }
                    }}
                    render={({ field, fieldState: { error, invalid } }) => (
                        <TextField
                            {...field}
                            size="small"
                            type={showOldPass ? 'text' : 'password'}
                            fullWidth
                            error={invalid}
                            helperText={error?.message}
                            placeholder='請輸入旧密碼'
                            variant="outlined"
                            autoComplete='off'
                            onFocus={() => setErrorMsg('')}
                            sx={{
                                '.MuiFormHelperText-root': {
                                    margin: 0
                                }
                            }}
                            InputProps={{
                                endAdornment:
                                    <InputAdornment position="end">
                                        <IconButton
                                            size='small'
                                            edge="end"
                                            onClick={() => setOldPass(!showOldPass)}
                                        >
                                            {showOldPass ? <VisibilityOutlinedIcon fontSize='small' /> : <VisibilityOffOutlinedIcon fontSize='small' />}
                                        </IconButton>
                                    </InputAdornment>
                            }}
                        />
                    )}
                />
            </div>
            <div className='w-full mb-5'>
                <Controller
                    name='newPass'
                    control={control}
                    rules={{
                        required: '请输入新密码',
                        validate: (value) => value !== getValues('oldPass') || '新密码与旧密码相同'
                    }}
                    render={({ field, fieldState: { error, invalid } }) => (
                        <TextField
                            {...field}
                            type={showNewPass ? 'text' : 'password'}
                            fullWidth
                            size="small"
                            error={invalid}
                            helperText={error?.message}
                            placeholder='请输入新密码'
                            variant="outlined"
                            autoComplete='off'
                            onFocus={() => setErrorMsg('')}
                            sx={{
                                '.MuiFormHelperText-root': {
                                    margin: 0
                                }
                            }}
                            InputProps={{
                                endAdornment:
                                    <InputAdornment position="end">
                                        <IconButton
                                            size='small'
                                            edge="end"
                                            onClick={() => setShowOldPss(!showNewPass)}
                                        >
                                            {showNewPass ? <VisibilityOutlinedIcon fontSize='small' /> : <VisibilityOffOutlinedIcon fontSize='small' />}
                                        </IconButton>
                                    </InputAdornment>
                            }}
                        />
                    )}
                />
            </div>
            <div className='w-full mb-1'>
                <button
                    disabled={api.loading}
                    onClick={handleOnSubmit}
                    className='w-full h-10 bg-[#10a37f] disabled:bg-[#10a37f]/[0.5] tracking-[1.5px] rounded-[4px] border-0 text-white font-medium hover:shadow-ok-btn'>
                    确定
                </button>
            </div>
            {
                errorMsg && <FormHelperText error sx={{ fontSize: '14px' }}>{errorMsg}</FormHelperText>
            }
        </div>
    )
}



function EditAvatar() {
    const [userInfo, setUserInfo] = useRecoilState(userInfoState)
    const [imageSource, setImageSource] = useState<string | File>(userInfo?.user?.avatarUrl || '');
    const [errorMsg, setErrorMsg] = useState('');

    const avatarApi = useRequest(uploadAvatar, {
        manual: true,
        onSuccess: (rst: any) => {
            if (rst) {
                setUserInfo((old => {
                    if (old) {
                        return {
                            ...old,
                            user: {
                                ...old.user,
                                avatarUrl: rst.avatarUrl
                            }
                        }
                    }
                    return {
                        authorities: [],
                        user: {
                            id: '',
                            username: '',
                            avatarUrl: rst.avatarUrl
                        }
                    }
                }))
            }
            toast.success('修改成功')
        },
        onError: (error: any) => {
            setErrorMsg(error?.response?.data?.message || "登陆失败")
        }
    })

    const isLimit2M = (file: File) => {
        return file.size / 1024 / 1024 <= 2
    }
    const handleChangeSource = (selectedFile: any) => {
        setErrorMsg('')
        if (!isLimit2M(selectedFile)) {
            setErrorMsg('文件大小超过2M')
        }
        setImageSource(selectedFile);
    };

    const handleOnConfirmUpdateAvatar = () => {
        if (imageSource instanceof File) {
            if (!isLimit2M(imageSource)) {
                return
            }
            avatarApi.run(imageSource)
        }
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <Avatar
                src={imageSource}
                onChange={handleChangeSource}
                variant="circle"
                emptyLabel="请选择头像"
                loadingLabel="上传中..."
                changeLabel="点击头像修改"
                smartImgFit='center'
                isLoading={avatarApi.loading}
                alt="头像"
            />
            <div className="text-sm text-token-text-secondary my-3 h-5">
                <FormHelperText error sx={{ fontSize: '14px', m: 0 }}>{errorMsg}</FormHelperText>
            </div>
            <button
                disabled={avatarApi.loading}
                onClick={handleOnConfirmUpdateAvatar}
                className="w-20 h-8 bg-[#10a37f] disabled:bg-[#10a37f]/[0.5] tracking-[1.5px] rounded-[4px] border-0 text-white font-medium hover:shadow-ok-btn">
                {avatarApi.loading ? '上传中...' : '确定'}
            </button>
        </div>
    )
}

export function EditPersonInfoDialog({ open, onClose }: { open: boolean, onClose: () => void }) {
    const [value, setValue] = useState(0);

    const handleOnClose = () => {
        onClose()
        setValue(0)
    }

    return (
        <Modal open={open}  >
            <div className="w-full h-full flex items-center justify-center">
                <div className="flex flex-col w-[680px] rounded-lg bg-white h-auto min-h-[300px] overflow-hidden">
                    <div className="px-4 pb-4 pt-5 sm:p-6 flex items-center justify-between border-b border-black/10 ">
                        <span className="text-lg font-medium leading-6 text-token-text-primary">设置</span>
                        <button className="w-6 h-6 text-token-text-tertiary hover:text-token-text-secondary" onClick={handleOnClose}>
                            <IconClose />
                        </button>
                    </div>
                    <div className="flex-grow overflow-y-auto">
                        <Stack direction='row'>
                            <div className="m-2 md:m-0 md:px-4 md:pt-5 flex flex-shrink-0  md:min-w-[180px] max-w-[200px] border-r border-black/10 flex-col gap-2">
                                <button
                                    className={cn("group flex items-center justify-start gap-2 rounded-md px-2 py-2 text-sm text-token-text-primary", { 'bg-token-main-surface-tertiary': 0 === value })}
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
                                    <EditPassWord />
                                </TabPanel>
                                <TabPanel value={value} index={1}>
                                    <EditAvatar />
                                </TabPanel>
                            </div>
                        </Stack>
                    </div>
                </div>
            </div>
        </Modal>
    )
}