import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/src/components/layout/sidebar/SideBar'
import { cookies } from 'next/headers'
import { UserStoreInitializer } from '@/src/components/providers/UserStoreInitializer'
import { QueryProvider } from '@/src/components/providers/QueryProvider'
import { GoogleAnalytics } from '@next/third-parties/google'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: '나를(Naleul)',
  description: '나의 목표와 시간 관리해주는 플랫폼',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  const userName = cookieStore.get('userName')?.value
  const userEmail = cookieStore.get('userEmail')?.value
  const userRole = cookieStore.get('userRole')?.value as 'FREE' | 'PRO' | 'ADMIN' | undefined

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body>
        <QueryProvider>
          {userId && userRole && userName && userEmail && (
            <UserStoreInitializer userId={userId} userName={userName} userEmail={userEmail} userRole={userRole} />
          )}
          <div className="flex">
            <Sidebar />
            <div className="flex-1 overflow-y-auto">{children}</div>
          </div>
        </QueryProvider>
      </body>
      <GoogleAnalytics gaId="G-C8XZ1EJLH9" />
    </html>
  )
}
