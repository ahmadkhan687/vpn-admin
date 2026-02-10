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
  
  // Check if current page is KPI Summary or any related page (Cost Efficiency, Cost Distribution, etc.)
  const isCollapsedSidebar = pathname === '/kpi-summary' || 
                             pathname === '/cost-efficiency' || 
                             pathname === '/cost-distribution' ||
                             pathname === '/current-capacity' ||
                             pathname === '/load-demand' ||
                             pathname === '/infrastructure-distribution' ||
                             pathname === '/acquisition' ||
                             pathname?.startsWith('/acquisition/') ||
                             pathname === '/engagement' ||
                             pathname === '/conversion' ||
                             pathname === '/retention' ||
                             pathname === '/ipdr' ||
                             pathname === '/retention-compliance'

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
    <div className={`${styles.sidebar} ${isCollapsedSidebar ? styles.collapsed : ''}`}>
      <div className={styles.logo}>
        {!isCollapsedSidebar && <span className={styles.logoText}>VPNs</span>}
        <img 
          src="/icons/logo.png" 
          alt="VPN Logo" 
          className={`${styles.logoIcon} ${isCollapsedSidebar ? styles.logoIconVisible : ''}`}
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
              title={isCollapsedSidebar ? item.name : ''}
            >
              <span className={styles.icon}>
                <img src={item.icon} alt={item.name} width="20" height="20" />
              </span>
              {!isCollapsedSidebar && <span className={styles.navText}>{item.name}</span>}
            </Link>
          )
        })}
      </nav>
      <div className={styles.footer}>
        <button onClick={handleLogout} className={styles.logoutBtn} title={isCollapsedSidebar ? 'Log Out' : ''}>
          <span className={styles.icon}>
            <img src="/icons/Logout.png" alt="Log Out" width="20" height="20" />
          </span>
          {!isCollapsedSidebar && <span className={styles.navText}>Log Out</span>}
        </button>
      </div>
    </div>
  )
}

export default Sidebar

