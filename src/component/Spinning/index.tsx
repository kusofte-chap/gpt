import React from 'react'

export default function Spining() {
    return (
        <span className='flex items-center justify-center  w-5 h-5 flex-shrink-0 animate-spin'>
            <img src='/loading.png' />
        </span>
    )
}
