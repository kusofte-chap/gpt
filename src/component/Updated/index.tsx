'use client'

import { userInfoState } from '@/store/atom'
import { useSetRecoilState } from 'recoil'
import { useRequest } from 'ahooks'
import { queryUserInfo } from '@/api/auth'

export default function Updated() {
    const setUserInfo = useSetRecoilState(userInfoState)

    useRequest(queryUserInfo, {
        onSuccess: (userInfo) => {
            setUserInfo(userInfo)
        }
    })

    return null
}
