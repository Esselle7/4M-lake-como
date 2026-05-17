import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '@/context/LanguageContext'
import ClientLayout from '@/components/ClientLayout'

export const metadata: Metadata = {
  title: '4M Luxury Boats – Lake Como',
  description: 'Private boat tours on Lake Como. Exclusive experiences crafted for those who seek the extraordinary.',
  keywords: 'Lake Como boat tour, private boat Como, luxury experience Como, escursioni barca Lago di Como',
  icons: {
    icon: '/images/logo-original-rounded.png',
    apple: '/images/logo-original-rounded.png',
  },
  openGraph: {
    title: '4M Luxury Boats – Lake Como',
    description: 'Private boat tours on Lake Como.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body>
        <LanguageProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </LanguageProvider>
      </body>
    </html>
  )
}
