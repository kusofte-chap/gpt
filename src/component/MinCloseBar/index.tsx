
'use client'

import React from 'react'
import StyledTooltip from '../StyledTooltip'

export default function MinCloseBar() {
    return (
        <div className='fixed left-0 top-1/2 z-40' style={{ transform: 'translateX(260px) translateY(-50%) rotate(0deg) translateZ(0px)' }}>

            <button>
                <div className='group flex h-[72px] w-8 items-center justify-center'>
                    <StyledTooltip title='关闭边栏' arrow placement="right">
                        <div className=' flex h-6 w-6 flex-col items-center'>
                            <div className="h-3 w-1 rounded-full translate-y-[0.15rem] transition-transform rotate-0 bg-[var(--text-quaternary)]  group-hover:translate-y-0 group-hover:rotate-[15deg] group-hover:bg-[#000]" />
                            <div className="h-3 w-1 rounded-full translate-y-[-0.15rem] transition-transform rotate-0  bg-[var(--text-quaternary)] group-hover:translate-y-0 group-hover:-rotate-[15deg] group-hover:bg-[#000]" />
                        </div>
                    </StyledTooltip>
                </div>
            </button>

        </div>
    )
}
