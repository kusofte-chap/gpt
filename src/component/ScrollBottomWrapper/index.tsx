import React from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'
import { css } from '@emotion/css'

const scrollBottomRoot = css({
    width: '100%',
    height: '100%',
    '&>div': {
        width: '100%',
        height: '100%',
        overflowY: 'auto'
    }
})

export default function ScrollBottomWrapper({ children }: { children: React.ReactNode }) {
    return (
        <ScrollToBottom
            className={scrollBottomRoot}
            initialScrollBehavior='smooth'
            followButtonClassName="scroll-bottom-anchor"
        >
            {children}
        </ScrollToBottom>
    )
}
