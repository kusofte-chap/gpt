'use client'

import { useSetRecoilState } from 'recoil'
import { useRequest } from 'ahooks'
import { queryUserInfo } from '@/api/auth'
import { userInfoState } from '@/store/atom'

export default function Updated() {
    const setUserInfo = useSetRecoilState(userInfoState)

    useRequest(queryUserInfo, {
        onSuccess: (userInfo) => {
            if (userInfo.status) {
                return
            }
            setUserInfo(userInfo)
        }
    })

    return null
}
