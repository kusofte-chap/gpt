import React from 'react'
import LogoXl from '@/assets/logo-md.svg'
import LoginForm from './form'
import { Typography } from '@mui/material'


export default function Login() {
    return (
        <div className='w-full h-screen flex flex-col items-center justify-center'>
            <div className='flex items-center justify-center'>
                <LogoXl className='w-16 h-[128px]' />
            </div>
            <section className='w-full max-w-[300px] flex flex-col py-16'>
                <div className='pt-10 px-5 pb-6 box-content'>
                    <Typography component='h3' fontSize='32px' color='#2d333a' textAlign='center'>欢迎回来</Typography>
                </div>
                <LoginForm />
            </section>
        </div>
    )
}
