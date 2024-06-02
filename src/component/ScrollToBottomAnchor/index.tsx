
import React from 'react'
import IconDownArrow from '@/assets/icons/icon-down-arrow.svg'

export default function ScrollToBottomAnchor(props: any) {
    return (
        <button
            className="cursor-pointer absolute z-10 rounded-full bg-clip-padding border text-token-text-secondary border-token-border-light right-1/2 juice:translate-x-1/2 bg-token-main-surface-primary bottom-5"
            {...props}
        >
            <IconDownArrow />
        </button>
    )
}
