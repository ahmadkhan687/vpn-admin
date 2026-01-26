'use client'

import React, { useState, useEffect } from 'react'
import styles from './realtime-report-sidebar.module.css'

const RealtimeReportSidebar = () => {
  const [expandedSections, setExpandedSections] = useState({
    businessObjectives: true,
    networkProtocol: true,
    compliance: true,
  })
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
      // On mobile, sidebar should be closed by default
      if (window.innerWidth <= 768) {
        setIsOpen(false)
      } else {
        setIsOpen(true)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const sections = [
    {
      id: 'businessObjectives',
      title: 'Business Objectives',
      items: [
        'Cost and Unit Economics',
        'Capacity and Scaling',
        'Growth and Product Performance',
      ],
    },
    {
      id: 'networkProtocol',
      title: 'Network & Protocol Health',
      items: ['Network Health', 'Protocol and Traffic Mix'],
    },
    {
      id: 'compliance',
      title: 'Compliance & Governance',
      items: ['IPDR', 'Retention Compliance'],
    },
  ]

  return (
    <>
      {/* Hamburger Menu Button - Only visible on mobile */}
      {isMobile && (
        <button 
          className={styles.hamburgerButton}
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>
      )}

      {/* Overlay backdrop - Only visible on mobile when sidebar is open */}
      {isMobile && isOpen && (
        <div 
          className={styles.overlay}
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`${styles.realtimeSidebar} ${isMobile ? styles.mobileSidebar : ''} ${isMobile && !isOpen ? styles.sidebarClosed : ''}`}>
        <div className={styles.sidebarContent}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>Realtime Report</h2>
            {isMobile && (
              <button 
                className={styles.closeButton}
                onClick={toggleSidebar}
                aria-label="Close sidebar"
              >
                ×
              </button>
            )}
          </div>
          <div className={styles.sectionsContainer}>
            {sections.map((section) => (
              <div key={section.id} className={styles.section}>
                <button
                  className={styles.sectionHeader}
                  onClick={() => toggleSection(section.id)}
                >
                  <span className={styles.sectionTitle}>{section.title}</span>
                  <span
                    className={`${styles.chevron} ${
                      expandedSections[section.id] ? styles.chevronDown : styles.chevronRight
                    }`}
                  >
                    ▼
                  </span>
                </button>
                {expandedSections[section.id] && (
                  <div className={styles.sectionItems}>
                    {section.items.map((item, index) => (
                      <a key={index} href="#" className={styles.sectionItem}>
                        <span className={styles.itemChevron}>▶</span>
                        <span className={styles.itemText}>{item}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default RealtimeReportSidebar

