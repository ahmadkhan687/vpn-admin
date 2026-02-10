'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './realtime-report-sidebar.module.css'

const RealtimeReportSidebar = () => {
  const pathname = usePathname()
  
  // Determine initial expanded states based on current path
  const getInitialExpandedStates = () => {
    const sections = {
      businessObjectives: true,
      networkProtocol: false,
      compliance: false,
    }
    
    const subItems = {
      costAndUnitEconomics: false,
      capacityAndScaling: false,
      growthAndProductPerformance: false,
      networkHealth: false,
      protocolAndTrafficMix: false,
    }
    
    // Auto-expand based on current path
    if (pathname === '/cost-efficiency' || pathname === '/cost-distribution') {
      sections.businessObjectives = true
      subItems.costAndUnitEconomics = true
    }
    if (pathname === '/current-capacity' || pathname === '/load-demand' || pathname === '/infrastructure-distribution') {
      sections.businessObjectives = true
      subItems.capacityAndScaling = true
    }
    if (pathname === '/acquisition' || pathname?.startsWith('/acquisition/') || pathname === '/engagement' || pathname === '/conversion' || pathname === '/retention') {
      sections.businessObjectives = true
      subItems.growthAndProductPerformance = true
    }
    
    return { sections, subItems }
  }
  
  const initialStates = getInitialExpandedStates()
  const [expandedSections, setExpandedSections] = useState(initialStates.sections)
  const [expandedSubItems, setExpandedSubItems] = useState(initialStates.subItems)
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
  
  // Update expanded states when pathname changes
  useEffect(() => {
    const newStates = getInitialExpandedStates()
    setExpandedSections(newStates.sections)
    setExpandedSubItems(newStates.subItems)
  }, [pathname])

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
          subItems: [
            { name: 'Cost Efficiency', path: '/cost-efficiency' },
            { name: 'Cost Distribution', path: '/cost-distribution' },
          ],
        },
        {
          id: 'capacityAndScaling',
          name: 'Capacity and Scaling',
          subItems: [
            { name: 'Current Capacity', path: '/current-capacity' },
            { name: 'Load & Demand', path: '/load-demand' },
            { name: 'Infrastructure Distribution', path: '/infrastructure-distribution' },
          ],
        },
        {
          id: 'growthAndProductPerformance',
          name: 'Growth and Product Performance',
          subItems: [
            { name: 'Acquisition', path: '/acquisition' },
            { name: 'Engagement', path: '/engagement' },
            { name: 'Conversion', path: '/conversion' },
            { name: 'Retention', path: '/retention' },
          ],
        },
      ],
    },
    {
      id: 'networkProtocol',
      title: 'Network & Protocol Health',
      items: [
        {
          id: 'networkHealth',
          name: 'Network Health',
          subItems: [
            { name: 'Network Overview', path: '#' },
            { name: 'Reliability & Failures', path: '#' },
            { name: 'Performance & Quality', path: '#' },
          ],
        },
        {
          id: 'protocolAndTrafficMix',
          name: 'Protocol and Traffic Mix',
          subItems: [
            { name: 'Overview', path: '#' },
            { name: 'Session Behavior', path: '#' },
            { name: 'Connection Stability', path: '#' },
          ],
        },
      ],
    },
    {
      id: 'compliance',
      title: 'Compliance & Governance',
      items: [
        {
          name: 'Compliance & Governance',
          id: 'complianceItems',
          subItems: [
            { name: 'IPDR', path: '/ipdr' },
            { name: 'Retention Compliance', path: '/retention-compliance' },
          ],
        },
      ],
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
                                  <Link 
                                    key={subIndex} 
                                    href={subItem.path} 
                                    className={`${styles.subItem} ${pathname === subItem.path ? styles.subItemActive : ''}`}
                                  >
                                    <span className={styles.subItemText}>{subItem.name}</span>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      }
                      // Regular item (string) or simple link object
                      if (typeof item === 'object' && item.path) {
                        return (
                          <Link
                            key={index}
                            href={item.path}
                            className={`${styles.sectionItem} ${pathname === item.path ? styles.subItemActive : ''}`}
                          >
                            <span className={styles.itemText}>{item.name}</span>
                          </Link>
                        )
                      }
                      return (
                        <div key={index} className={styles.sectionItem}>
                          <span className={styles.itemText}>{String(item)}</span>
                        </div>
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

