import './globals.css'
import styles from './layout.module.css'
import ClientProviders from './ClientProvider'

export const metadata = {
  title: 'VPN App',
  description: 'My custom description for the Next.js app',
  icons: {
    icon: '/globe.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <div className={styles.layoutContainer}>
            <div className={styles.mainContent}>{children}</div>
          </div>
        </ClientProviders>
      </body>
    </html>
  )
}
