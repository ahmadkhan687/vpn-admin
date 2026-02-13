'use client'

import React, { useState } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import RealtimeReportSidebar from '@/components/realtime-report-sidebar/RealtimeReportSidebar'
import Header from '@/components/header/Header'
import styles from './load-demand.module.css'
import { getLoadDemandData } from './loadDemandData'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const hours = [
  '12 AM',
  '2 AM',
  '4 AM',
  '6 AM',
  '8 AM',
  '10 AM',
  '12 PM',
  '2 PM',
  '4 PM',
  '6 PM',
  '8 PM',
  '10 PM',
]

const getHeatColor = (value) => {
  if (value >= 500) return '#3E1C96'
  if (value >= 200) return '#9B8AFB'
  if (value >= 100) return '#EBE9FE'
  return '#F3F4F6'
}

const LoadDemand = () => {
  const [selectedVPN, setSelectedVPN] = useState('Portfolio')

  const scopeOptions = [
    'Portfolio',
    'Steer Lucid',
    'Crest',
    'Slick',
    'Fortivo',
    'Qucik',
    'Nexipher',
  ]

  const handleVPNChange = (vpn) => setSelectedVPN(vpn)
  const loadData = getLoadDemandData(selectedVPN)

  return (
    <div className={`${styles.dashboardContainer} ${styles.withRealtimeSidebar}`}>
      <Sidebar />
      <RealtimeReportSidebar />
      <div className={styles.mainContent}>
        <Header
          dropdownOptions={scopeOptions}
          defaultValue={selectedVPN}
          onValueChange={handleVPNChange}
        />
        <div className={styles.content}>
          <div className={styles.pageHeader}>
            <div className={styles.pageHeaderLeft}>
              <div className={styles.titleRow}>
                <h2 className={styles.pageTitle}>Load & Demand</h2>
                <span className={styles.titlePill}>Capacity and Scaling</span>
              </div>
              <div className={styles.dottedLine}></div>
              <p className={styles.pageDescription}>
                Track load patterns and demand forecasting across infrastructure and VPNs.
              </p>
            </div>
          </div>

          <div className={styles.heatmapCard}>
            <div className={styles.heatmapHeader}>
              <div>
                <h3 className={styles.cardTitle}>Peak Hour Load</h3>
                <div className={styles.dottedLine}></div>
                <p className={styles.cardDescription}>When are we pushing the edge of our capacity?</p>
              </div>
              <div className={styles.heatmapDate}>Last 28 days&nbsp;&nbsp;Dec 19, 2025 – Jan 15, 2026</div>
            </div>
            <div className={styles.heatmapGridWrapper}>
              <div className={styles.heatmapHeaderRow}>
                <div className={styles.timeCell}></div>
                {days.map((day) => (
                  <div key={day} className={styles.dayCell}>
                    {day}
                  </div>
                ))}
              </div>
              <div className={styles.heatmapBody}>
                {hours.map((hour, rowIndex) => (
                  <div key={hour} className={styles.heatmapRow}>
                    <div className={styles.timeCell}>{hour}</div>
                    {days.map((day, colIndex) => {
                      const value = loadData.heatmapValues[rowIndex][colIndex]
                      return (
                        <div
                          key={`${hour}-${day}`}
                          className={styles.heatmapCell}
                          style={{ backgroundColor: getHeatColor(value) }}
                          title={`${day} ${hour} • ${value} Mbps`}
                        ></div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.heatmapLegend}>
              {[
                { color: '#EBE9FE', label: '100 Mbps+' },
                { color: '#9B8AFB', label: '200 Mbps+' },
                { color: '#3E1C96', label: '500 Mbps+' },
              ].map((item) => (
                <div key={item.label} className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ backgroundColor: item.color }}></span>
                  <span className={styles.legendLabel}>{item.label}</span>
                </div>
              ))}
            </div>
            <div className={styles.heatmapStats}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Today</div>
                <div className={styles.statValue}>{loadData.today}</div>
                <div className={loadData.todayChange >= 0 ? styles.statChangePositive : styles.statChangeNegative}>
                  {loadData.todayChange >= 0 ? '+' : ''}{loadData.todayChange}%
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>This week</div>
                <div className={styles.statValue}>{loadData.thisWeek}</div>
                <div className={loadData.weekChange >= 0 ? styles.statChangePositive : styles.statChangeNegative}>
                  {loadData.weekChange >= 0 ? '+' : ''}{loadData.weekChange}%
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>This month</div>
                <div className={styles.statValue}>{loadData.thisMonth}</div>
                <div className={loadData.monthChange >= 0 ? styles.statChangePositive : styles.statChangeNegative}>
                  {loadData.monthChange >= 0 ? '+' : ''}{loadData.monthChange}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadDemand
