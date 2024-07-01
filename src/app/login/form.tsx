'use client'

import { Checkbox, FormControlLabel, FormHelperText, IconButton, InputAdornment, Skeleton, TextField } from '@mui/material'
import React, { Fragment, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { useRequest } from 'ahooks';
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { getCodeAndUid, login } from '@/api/auth';
import encrypt from '@/until/encrypt';
import { useRouter } from 'next/navigation'
import CachedIcon from '@mui/icons-material/Cached';
import IconSpinning from '@/assets/icons/spinning.svg';

interface IFormValues {
    username: string
    password: string
    code: string
    rememberMe: boolean
}

interface ICodeAndUid {
    uuid: string
    img: string
}

const DEFAULT_VALUES = {
    username: '',
    password: '',
    code: '',
    rememberMe: true
}

const customTheme = createTheme({
    palette: {
        primary: {
            main: '#10a37f'
        }
    },
});

export default function LoginForm() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [loginError, setLoginError] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const { control, handleSubmit } = useForm<IFormValues>({
        defaultValues: DEFAULT_VALUES
    })

    const codeApi = useRequest<ICodeAndUid, any>(getCodeAndUid)

    const loginApi = useRequest(login, {
        manual: true,
        onBefore: () => {
            setLoading(true)
        },
        onSuccess: (rst: any) => {
            if (rst) {
                rst.token && localStorage.setItem('gpt_token', rst.token.replace('Bearer ', '').trim())
                router.push('/')
            }
        },
        onError: (error: any) => {
            setLoading(false)
            setLoginError(error?.response?.data?.message || "登陆失败")
        }
    })

    const onLogin = handleSubmit((formValues: IFormValues) => {
        setLoginError('')
        const params = {
            username: formValues.username,
            password: encrypt(formValues.password),
            rememberMe: formValues.rememberMe,
            code: formValues.code,
            uuid: codeApi.data?.uuid
        }
        loginApi.run(params)
    }, () => {
        setLoginError('')
    })

    return (
        <ThemeProvider theme={customTheme}>
            <form className='w-full px-6 md:max-w-[320px] md:mx-auto md:px-0'>
                <div className='w-full mb-4'>
                    <Controller
                        name='username'
                        control={control}
                        rules={{
                            required: '账号不能为空'
                        }}
                        render={({ field, fieldState: { error, invalid } }) => (
                            <TextField
                                fullWidth
                                label='账号'
                                size='medium'
                                error={invalid}
                                helperText={error?.message}
                                placeholder='請輸入账号'
                                sx={{
                                    '.MuiFormHelperText-root': {
                                        margin: 0
                                    }
                                }}
                                {...field}
                            />
                        )}
                    />
                </div>
                <div className='w-full mb-4'>
                    <Controller
                        name='password'
                        control={control}
                        rules={{
                            required: '密码不能为空'
                        }}
                        render={({ field, fieldState: { error, invalid } }) => (
                            <TextField
                                {...field}
                                type={showPassword ? 'text' : 'password'}
                                fullWidth
                                error={invalid}
                                helperText={error?.message}
                                placeholder='請輸入密码'
                                label='密码'
                                autoComplete='off'
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
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <VisibilityOutlinedIcon fontSize='small' /> : <VisibilityOffOutlinedIcon fontSize='small' />}
                                            </IconButton>
                                        </InputAdornment>
                                }}
                            />
                        )}
                    />
                </div>
                <div className='w-full mb-4 flex justify-between gap-2'>
                    <div className='flex-1'>
                        <Controller
                            name='code'
                            control={control}
                            rules={{
                                required: '验证码不能为空'
                            }}
                            render={({ field, fieldState: { error, invalid } }) => (
                                <TextField
                                    fullWidth
                                    label='验证码'
                                    placeholder='请输入验证码'
                                    size='medium'
                                    error={invalid}
                                    helperText={error?.message}
                                    sx={{
                                        '.MuiFormHelperText-root': {
                                            margin: 0
                                        }
                                    }}
                                    {...field}
                                />
                            )}
                        />
                    </div>
                    <div className='flex-1 flex items-center'>
                        <div className='flex-grow flex items-center flex-col'>
                            {
                                codeApi.loading ? <Skeleton
                                    variant="rounded"
                                    animation='wave'
                                    width='100%'
                                    height={52}
                                /> : <img
                                    className='block w-full h-[52px] user-drag-none select-none drag-none object-scale-down object-center outline-0 border-0 border-[transparent] text-opacity-0'
                                    src={codeApi.data?.img}
                                />
                            }
                        </div>
                        <IconButton sx={{
                            flexShrink: 0,
                            width: "32",
                            height: "32",
                            color: '#10a37f'
                        }}
                            disabled={codeApi.loading}
                            onClick={() => codeApi.run()}
                        >
                            <CachedIcon />
                        </IconButton>
                    </div>
                </div>
                <div className='w-full mb-4'>
                    <Controller
                        name='rememberMe'
                        control={control}
                        render={({ field }) => (
                            <FormControlLabel
                                label="记住我"
                                control={<Checkbox size='small' sx={{ color: '#98A2B3' }} {...field} />}
                                sx={{
                                    height: '22px',
                                    '.MuiTypography-root': {
                                        fontSize: '14px',
                                        color: '#000',
                                        fontWeight: 400,
                                        lineHeight: '24px',
                                        padding: 0
                                    }
                                }}
                            />
                        )}
                    />
                </div>
                <div className='w-full mb-4'>
                    <button
                        className='flex items-center justify-center gap-2 disabled:opacity-50 w-full h-[52px] bg-[#10a37f] tracking-[1.5px] rounded-[4px] border-0 text-white font-medium hover:shadow-[inset_0_0_0_150px_#0000001a]'
                        onClick={onLogin}
                        disabled={loading}
                    >
                        {
                            loading ? <Fragment>
                                <IconSpinning />
                                登录...
                            </Fragment> : '登录'
                        }
                    </button>
                </div>
                {
                    loginError && <FormHelperText error>{loginError}</FormHelperText>
                }
            </form>
        </ThemeProvider>
    )
}
