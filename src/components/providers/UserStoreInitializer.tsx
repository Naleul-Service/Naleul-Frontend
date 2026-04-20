'use client'
import { useEffect } from 'react'
import { useUserStore } from '@/src/components/store/useUserStore'

interface Props {
  userId: string
  userName: string
  userEmail: string
  userRole: 'FREE' | 'PRO' | 'ADMIN'
}

export function UserStoreInitializer({ userId, userName, userRole, userEmail }: Props) {
  const setUser = useUserStore((s) => s.setUser)

  useEffect(() => {
    setUser({ userId, userName, userRole, userEmail })
  }, [])

  return null
}
