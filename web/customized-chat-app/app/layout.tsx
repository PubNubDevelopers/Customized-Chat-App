import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'PubNub Customized Chat App',
  description: 'Customized Chat Application using the PubNub Chat SDK written in Next.js'
}

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <Suspense>
        <body
          className={poppins.className}>
          {children}
        </body>
      </Suspense>
    </html>
  )
}
