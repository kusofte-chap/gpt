'use client'

import { Fragment, ReactNode, useState } from "react";
import IconSetting from '@/assets/icons/icon-setting.svg'
import IconLogoOut from '@/assets/icons/icon-logout.svg'
import { Avatar, Button, Divider, FormHelperText, FormLabel, IconButton, InputAdornment, Modal, Stack, TextField } from "@mui/material";
import IconClose from '@/assets/icons/icon-close.svg'
import IconSafe from '@/assets/icons/icon-safe.svg'
import IconProfile from '@/assets/icons/icon-profile.svg'
import cn from 'classnames'
import { Controller, useForm } from "react-hook-form";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { useRequest } from "ahooks";
import { updatePassword, uploadAvatar } from "@/api/auth";
import toast from "@/until/message";
import encrypt from "@/until/encrypt";
import { handleLogout } from "@/until/index";
import { useRecoilState } from "recoil";
import { userInfoState } from "@/store/atom";
import { deepOrange } from "@mui/material/colors";
import IconSpinning from '@/assets/icons/spinning.svg';
import ImgCrop from "antd-img-crop";
import { Upload } from "antd";
import type { GetProp, UploadProps } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

interface ITabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        toast.error('请上传JPG/PNG格式!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        toast.error('图片大小不能超过2MB!');
    }
    return isJpgOrPng && isLt2M;
};

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
    confirmPass: string
}

function EditAvatar() {
    const [userInfo, setUserInfo] = useRecoilState(userInfoState)
    const [imageUrl, setImageUrl] = useState(userInfo?.user?.avatarUrl)
    const [loading, setLoading] = useState(false);

    const handleChange: UploadProps['onChange'] = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            setLoading(false);
            getBase64(info.file.originFileObj as FileType, (url) => {
                setImageUrl(url);
            });
            if (info.file.response) {
                setUserInfo((old => {
                    if (old) {
                        return {
                            ...old,
                            user: {
                                ...old.user,
                                avatarUrl: info.file.response.avatarUrl
                            }
                        }
                    }
                    return {
                        authorities: [],
                        user: {
                            id: '',
                            username: '',
                            avatarUrl: info.file.response.avatarUrl
                        }
                    }
                }))
            }
        }
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>上传中...</div>
        </button>
    );

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-20 h-20 flex items-center justify-center">

                <ImgCrop
                    showGrid
                    rotationSlider
                    aspectSlider
                    showReset
                    aspect={1}
                    modalTitle="编辑头像"
                    modalProps={{
                        zIndex: 10000,
                    }}
                    modalOk="上传"
                    modalCancel="取消"
                >
                    <Upload
                        style={{ padding: '2px' }}
                        name="avatar"
                        listType="picture-circle"
                        className="avatar-uploader"
                        showUploadList={false}
                        action={`${process.env.NEXT_PUBLIC_API_URL}/api/users/updateAvatar`}
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                        headers={{
                            Authorization: `Bearer ${localStorage.getItem('gpt_token')}`
                        }}
                    >
                        {imageUrl ? loading ? uploadButton : <Avatar
                            src={imageUrl}
                            sx={{
                                width: 80,
                                height: 80,
                                bgcolor: deepOrange[500],
                                '.MuiAvatar-root': {
                                    fontSize: '14px'
                                }
                            }}
                        />
                            : uploadButton}
                    </Upload>
                </ImgCrop>
            </div>
        </div>
    )
}

function EditPassWord() {
    const [userInfo, setUserInfo] = useRecoilState(userInfoState)
    const [errorMsg, setErrorMsg] = useState('')

    const { control, getValues, handleSubmit } = useForm<IFormFields>({
        defaultValues: {
            oldPass: '',
            newPass: '',
            confirmPass: ''
        }
    })

    const [showOldPass, setShowOldPass] = useState(false)
    const [showNewPass, setShowNewPass] = useState(false)
    const [showConfirmPass, setShowConfirmPass] = useState(false)

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
            <div className="mb-2">
                个性化您的构建者个人资料，以便与您的 GPT 的用户建立联系。这些设置将应用于公开共享的 GPT。
            </div>
            <EditAvatar />
            <div className="w-full flex flex-col justify-center gap-3">
                <div className="w-full flex flex-col gap-2">
                    <div className="text-sm text-black font-medium">名称</div>
                    <div className="text-sm text-black">{userInfo?.user?.username}</div>
                </div>
                <Divider className="my-3 border-token-border-light" />
                <div className="w-full flex gap-2">
                    <div className="text-sm text-black font-medium w-20 h-10 flex items-center flex-shrink-0">旧密码</div>
                    <div className="flex items-center flex-grow">
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
                                    placeholder='请输入旧密码'
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
                                                    onClick={() => setShowOldPass(!showOldPass)}
                                                >
                                                    {showOldPass ? <VisibilityOutlinedIcon fontSize='small' /> : <VisibilityOffOutlinedIcon fontSize='small' />}
                                                </IconButton>
                                            </InputAdornment>
                                    }}
                                />
                            )}
                        />
                    </div>
                </div>
                <div className="w-full flex gap-2">
                    <div className="text-sm text-black font-medium w-20  h-10 flex items-center flex-shrink-0">新密码</div>
                    <div className="flex items-center flex-grow">
                        <Controller
                            name='newPass'
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
                                    type={showNewPass ? 'text' : 'password'}
                                    fullWidth
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
                                                    onClick={() => setShowNewPass(!showNewPass)}
                                                >
                                                    {showNewPass ? <VisibilityOutlinedIcon fontSize='small' /> : <VisibilityOffOutlinedIcon fontSize='small' />}
                                                </IconButton>
                                            </InputAdornment>
                                    }}
                                />
                            )}
                        />
                    </div>
                </div>
                <div className="w-full flex gap-2">
                    <div className="text-sm text-black font-medium w-20  h-10 flex items-center flex-shrink-0">确认密码</div>
                    <div className="flex items-center flex-grow">
                        <Controller
                            name='confirmPass'
                            control={control}
                            rules={{
                                required: '请输入再次输入新密码',
                                validate: (value) => value === getValues('newPass') || '确认密码与新密码不相同'
                            }}
                            render={({ field, fieldState: { error, invalid } }) => (
                                <TextField
                                    {...field}
                                    type={showConfirmPass ? 'text' : 'password'}
                                    fullWidth
                                    size="small"
                                    error={invalid}
                                    helperText={error?.message}
                                    placeholder='请再次输入新密码'
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
                                                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                                                >
                                                    {showConfirmPass ? <VisibilityOutlinedIcon fontSize='small' /> : <VisibilityOffOutlinedIcon fontSize='small' />}
                                                </IconButton>
                                            </InputAdornment>
                                    }}
                                />
                            )}
                        />
                    </div>
                </div>
                <div className='w-full flex items-center gap-2'>
                    <div className="w-20 flex-shrink-0" />
                    <div className="flex flex-col gap-2 flex-grow">
                        <button
                            className=' flex items-center justify-center gap-2 disabled:opacity-50 w-full h-[40px] bg-[#10a37f] tracking-[1.5px] rounded-[4px] border-0 text-white font-medium hover:shadow-[inset_0_0_0_150px_#0000001a]'
                            onClick={handleOnSubmit}
                            disabled={api.loading}
                        >
                            {
                                api.loading ? <Fragment>
                                    <IconSpinning />
                                    确认...
                                </Fragment> : '确认'
                            }
                        </button>
                        {errorMsg && <div className='text-sm text-red-500'>{errorMsg}</div>}
                    </div>
                </div>
            </div>
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
                        <div className="text-lg font-medium leading-6 text-token-text-primary">设置</div>
                        <button className="w-6 h-6 text-token-text-tertiary hover:text-token-text-secondary" onClick={handleOnClose}>
                            <IconClose />
                        </button>
                    </div>
                    <div className="flex-grow">
                        <Stack direction='row' height={600}>
                            <div className="m-2 md:m-0 md:px-4 md:pt-5 flex flex-shrink-0  md:min-w-[180px] max-w-[200px] border-r border-black/10 flex-col gap-2">
                                <button
                                    className={cn("group flex items-center justify-start gap-2 rounded-md px-2 py-2 text-sm text-token-text-primary", { 'bg-token-main-surface-tertiary': 0 === value })}
                                    onClick={() => setValue(0)}
                                >
                                    <IconProfile />
                                    构建者个人资料
                                </button>
                            </div>
                            <div className=" w-full max-h-[calc(100vh-150px)] overflow-y-auto md:min-h-[380px]">
                                <TabPanel value={value} index={0}>
                                    <EditPassWord />
                                </TabPanel>
                            </div>
                        </Stack>
                    </div>
                </div>
            </div>
        </Modal >
    )
}