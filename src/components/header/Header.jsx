'use client'

import React, { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import styles from './header.module.css'

const Header = ({ dropdownOptions = [], defaultValue, onValueChange }) => {
  const pathname = usePathname()
  // Check if current page is KPI Summary or any related page with Realtime Sidebar
  const isRealtimeSidebarPage = pathname === '/kpi-summary' || 
                                 pathname === '/cost-efficiency' || 
                                 pathname === '/cost-distribution' ||
                                 pathname === '/current-capacity' ||
                                 pathname === '/load-demand' ||
                                 pathname === '/infrastructure-distribution' ||
                                 pathname === '/acquisition'
  const [selectedValue, setSelectedValue] = useState(
    defaultValue || (dropdownOptions.length > 0 ? dropdownOptions[0] : '')
  )
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Update selected value when defaultValue prop changes
  useEffect(() => {
    if (defaultValue) {
      setSelectedValue(defaultValue)
    }
  }, [defaultValue])

  const handleSelect = (value) => {
    setSelectedValue(value)
    setIsDropdownOpen(false)
    // Call the callback if provided
    if (onValueChange) {
      onValueChange(value)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  return (
    <header className={`${styles.header} ${isRealtimeSidebarPage ? styles.headerKPISummary : ''}`}>
      <div className={styles.left}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>
            VPN Dashboard ({selectedValue || 'Portfolio'})
          </h1>
          <p className={styles.subtitle}>Analysis of All VPNs</p>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.scopeSection}>
          <div className={styles.greenDot}></div>
          <span className={styles.scopeLabel}>Scope:</span>
          <div className={styles.scopeDropdownContainer} ref={dropdownRef}>
            <div
              className={styles.scopeDropdown}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className={styles.scopeValue}>{selectedValue}</span>
              <span className={styles.dropdownIcon}>▼</span>
            </div>
            {isDropdownOpen && dropdownOptions.length > 0 && (
              <div className={styles.dropdownMenu}>
                {dropdownOptions.map((option) => (
                  <div
                    key={option}
                    className={`${styles.dropdownItem} ${
                      selectedValue === option ? styles.active : ''
                    }`}
                    onClick={() => handleSelect(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
