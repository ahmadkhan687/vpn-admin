'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useToken } from '@/context/tokenContext'
import { useRouter } from 'next/navigation'
import styles from './sidebar.module.css'

const Sidebar = () => {
  const pathname = usePathname()
  const { logout } = useToken()
  const router = useRouter()
  const isKPISummaryPage = pathname === '/kpi-summary'

  const menuItems = [
    { name: 'Home', path: '/dashboard', icon: '/icons/Home.png' },
    { name: 'KPI Summary Page', path: '/kpi-summary', icon: '/icons/Mask group.png' },
    { name: 'KPI Full Metrics', path: '/kpi-full-metrics', icon: '/icons/Full Metrix.png' },
    { name: 'KPI Breakdown Page', path: '/kpi-breakdown', icon: '/icons/Breakdown.png' },
    { name: 'Alerts', path: '/alerts', icon: '/icons/Alert triangle.png' },
  ]

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className={`${styles.sidebar} ${isKPISummaryPage ? styles.collapsed : ''}`}>
      <div className={styles.logo}>
        {!isKPISummaryPage && <span className={styles.logoText}>VPNs</span>}
        <img 
          src="/icons/logo.png" 
          alt="VPN Logo" 
          className={`${styles.logoIcon} ${isKPISummaryPage ? styles.logoIconVisible : ''}`}
        />
      </div>
      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              title={isKPISummaryPage ? item.name : ''}
            >
              <span className={styles.icon}>
                <img src={item.icon} alt={item.name} width="20" height="20" />
              </span>
              {!isKPISummaryPage && <span className={styles.navText}>{item.name}</span>}
            </Link>
          )
        })}
      </nav>
      <div className={styles.footer}>
        <button onClick={handleLogout} className={styles.logoutBtn} title={isKPISummaryPage ? 'Log Out' : ''}>
          <span className={styles.icon}>
            <img src="/icons/Logout.png" alt="Log Out" width="20" height="20" />
          </span>
          {!isKPISummaryPage && <span className={styles.navText}>Log Out</span>}
        </button>
      </div>
    </div>
  )
}

export default Sidebar

