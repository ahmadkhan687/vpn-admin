'use client'

import React, { useState, useEffect } from 'react'
import styles from './realtime-report-sidebar.module.css'

const RealtimeReportSidebar = () => {
  const [expandedSections, setExpandedSections] = useState({
    businessObjectives: true,
    networkProtocol: false,
    compliance: false,
  })
  const [expandedSubItems, setExpandedSubItems] = useState({
    costAndUnitEconomics: false,
    capacityAndScaling: false,
    growthAndProductPerformance: false,
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

  const toggleSubItem = (subItem) => {
    setExpandedSubItems((prev) => ({
      ...prev,
      [subItem]: !prev[subItem],
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
        {
          id: 'costAndUnitEconomics',
          name: 'Cost and Unit Economics',
          subItems: ['Cost Efficiency', 'Cost Distribution'],
        },
        {
          id: 'capacityAndScaling',
          name: 'Capacity and Scaling',
          subItems: ['Current Capacity', 'Load & Demand', 'Infrastructure Distribution'],
        },
        {
          id: 'growthAndProductPerformance',
          name: 'Growth and Product Performance',
          subItems: ['Acquisition', 'Engagement', 'Conversion', 'Retention'],
        },
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
              <div key={section.id} className={`${styles.section} ${expandedSections[section.id] ? styles.active : ''}`}>
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
                    {section.items.map((item, index) => {
                      // Check if item has subItems (nested structure)
                      if (typeof item === 'object' && item.subItems) {
                        return (
                          <div key={index} className={styles.nestedItemContainer}>
                            <button
                              className={styles.sectionItem}
                              onClick={() => toggleSubItem(item.id)}
                            >
                              <span className={styles.itemChevron}>
                                {expandedSubItems[item.id] ? '▼' : '▶'}
                              </span>
                              <span className={styles.itemText}>{item.name}</span>
                            </button>
                            {expandedSubItems[item.id] && (
                              <div className={styles.subItemsContainer}>
                                {item.subItems.map((subItem, subIndex) => (
                                  <a key={subIndex} href="#" className={styles.subItem}>
                                    <span className={styles.subItemText}>{subItem}</span>
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      }
                      // Regular item (string)
                      return (
                        <a key={index} href="#" className={styles.sectionItem}>
                          <span className={styles.itemChevron}>▶</span>
                          <span className={styles.itemText}>{item}</span>
                        </a>
                      )
                    })}
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

