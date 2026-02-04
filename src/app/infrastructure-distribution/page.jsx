'use client'

import React, { useState } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import RealtimeReportSidebar from '@/components/realtime-report-sidebar/RealtimeReportSidebar'
import Header from '@/components/header/Header'
import styles from './infrastructure-distribution.module.css'

const InfrastructureDistribution = () => {
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
                <h2 className={styles.pageTitle}>Infrastructure Distribution</h2>
                <span className={styles.titlePill}>Capacity and Scaling</span>
              </div>
              <div className={styles.dottedLine}></div>
              <p className={styles.pageDescription}>
                View infrastructure distribution across regions, nodes, and data centers.
              </p>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.infoCard}>
              <h3 className={styles.cardTitle}>Infrastructure Distribution Overview</h3>
              <p className={styles.cardDescription}>
                This page displays how infrastructure is distributed across geographic regions, including node count, data center allocation, and regional capacity split.
              </p>
              <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                  <div className={styles.metricValue}>248</div>
                  <div className={styles.metricLabel}>Total Nodes</div>
                  <div className={styles.metricTrend}>↑ 12 vs last month</div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.metricValue}>18</div>
                  <div className={styles.metricLabel}>Data Centers</div>
                  <div className={styles.metricTrend}>→ Same as last quarter</div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.metricValue}>42%</div>
                  <div className={styles.metricLabel}>North America</div>
                  <div className={styles.metricTrend}>↓ 1% vs last month</div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.metricValue}>35%</div>
                  <div className={styles.metricLabel}>Europe</div>
                  <div className={styles.metricTrend}>↑ 1% vs last month</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InfrastructureDistribution
