import { mobileDrawerState, sideBarState } from "@/store/atom"
import { useCallback, useMemo } from "react"
import { useRecoilState, useSetRecoilState } from "recoil"
import anime from 'animejs/lib/anime.es.js';
import { useMediaQuery } from "@mui/material";

export const useToggleSideBar = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [openSidebar, setSideBar] = useRecoilState(sideBarState)
    const setMobileSideBar = useSetRecoilState(mobileDrawerState)
    
    const toggleCloseSideBar = useCallback(() => {
        if (isMobile) {
            setMobileSideBar(false)
            return
        }
       
        const sidebarEl = document.querySelector('#gpt-sidebar')
        if (sidebarEl) {
            anime({
                targets: sidebarEl,
                width: sidebarEl?.clientWidth ? [260, 0] : [0, 260],
                opacity: sidebarEl?.clientWidth ? [1, 0] : [0, 1],
                easing: 'easeInOutQuad',
                duration: 350,
                complete: () => {
                    setSideBar(prev => !prev)
                }
            })
        }
    }, [setSideBar,isMobile])

    return useMemo(() => ({
        openSidebar,
        toggleCloseSideBar
    }), [openSidebar, toggleCloseSideBar])
}