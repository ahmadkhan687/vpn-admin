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

  const nodesByVPN = {
    Portfolio: [
      { id: 'a', name: 'Node A', sessions: 2150, utilized: 98, colorKey: 'Red', overLimit: true },
      { id: 'b', name: 'Node B', sessions: 2150, utilized: 78, colorKey: 'Orange', overLimit: false },
      { id: 'c', name: 'Node C', sessions: 2150, utilized: 78, colorKey: 'Orange', overLimit: false },
      { id: 'd', name: 'Node D', sessions: 350, utilized: 65, colorKey: 'LightBlue', overLimit: false },
      { id: 'e', name: 'Node E', sessions: 2350, utilized: 66, colorKey: 'LightBlue', overLimit: false },
      { id: 'f', name: 'Node F', sessions: 2350, utilized: 60, colorKey: 'Green', overLimit: false },
    ],
    'Steer Lucid': [
      { id: 'a', name: 'Node A', sessions: 1890, utilized: 91, colorKey: 'Red', overLimit: true },
      { id: 'b', name: 'Node B', sessions: 1650, utilized: 72, colorKey: 'Orange', overLimit: false },
      { id: 'c', name: 'Node C', sessions: 1420, utilized: 62, colorKey: 'LightBlue', overLimit: false },
      { id: 'd', name: 'Node D', sessions: 2100, utilized: 58, colorKey: 'Green', overLimit: false },
      { id: 'e', name: 'Node E', sessions: 980, utilized: 68, colorKey: 'LightBlue', overLimit: false },
      { id: 'f', name: 'Node F', sessions: 750, utilized: 55, colorKey: 'Green', overLimit: false },
    ],
    Crest: [
      { id: 'a', name: 'Node A', sessions: 1200, utilized: 92, colorKey: 'Red', overLimit: true },
      { id: 'b', name: 'Node B', sessions: 1100, utilized: 76, colorKey: 'Orange', overLimit: false },
      { id: 'c', name: 'Node C', sessions: 890, utilized: 61, colorKey: 'LightBlue', overLimit: false },
      { id: 'd', name: 'Node D', sessions: 650, utilized: 45, colorKey: 'Green', overLimit: false },
      { id: 'e', name: 'Node E', sessions: 420, utilized: 29, colorKey: 'Green', overLimit: false },
    ],
    Slick: [
      { id: 'a', name: 'Node A', sessions: 2480, utilized: 95, colorKey: 'Red', overLimit: true },
      { id: 'b', name: 'Node B', sessions: 2200, utilized: 79, colorKey: 'Orange', overLimit: false },
      { id: 'c', name: 'Node C', sessions: 1950, utilized: 69, colorKey: 'LightBlue', overLimit: false },
      { id: 'd', name: 'Node D', sessions: 1800, utilized: 64, colorKey: 'LightBlue', overLimit: false },
      { id: 'e', name: 'Node E', sessions: 1650, utilized: 59, colorKey: 'Green', overLimit: false },
      { id: 'f', name: 'Node F', sessions: 1320, utilized: 47, colorKey: 'Green', overLimit: false },
    ],
    Fortivo: [
      { id: 'a', name: 'Node A', sessions: 3100, utilized: 99, colorKey: 'Red', overLimit: true },
      { id: 'b', name: 'Node B', sessions: 2750, utilized: 88, colorKey: 'Red', overLimit: true },
      { id: 'c', name: 'Node C', sessions: 2400, utilized: 77, colorKey: 'Orange', overLimit: false },
      { id: 'd', name: 'Node D', sessions: 2100, utilized: 67, colorKey: 'LightBlue', overLimit: false },
      { id: 'e', name: 'Node E', sessions: 1850, utilized: 59, colorKey: 'Green', overLimit: false },
      { id: 'f', name: 'Node F', sessions: 1520, utilized: 48, colorKey: 'Green', overLimit: false },
    ],
    Qucik: [
      { id: 'a', name: 'Node A', sessions: 1650, utilized: 75, colorKey: 'Orange', overLimit: false },
      { id: 'b', name: 'Node B', sessions: 1420, utilized: 65, colorKey: 'LightBlue', overLimit: false },
      { id: 'c', name: 'Node C', sessions: 1180, utilized: 54, colorKey: 'Green', overLimit: false },
      { id: 'd', name: 'Node D', sessions: 950, utilized: 43, colorKey: 'Green', overLimit: false },
    ],
    Nexipher: [
      { id: 'a', name: 'Node A', sessions: 2890, utilized: 93, colorKey: 'Red', overLimit: true },
      { id: 'b', name: 'Node B', sessions: 2550, utilized: 82, colorKey: 'Orange', overLimit: false },
      { id: 'c', name: 'Node C', sessions: 2180, utilized: 70, colorKey: 'Orange', overLimit: false },
      { id: 'd', name: 'Node D', sessions: 1920, utilized: 62, colorKey: 'LightBlue', overLimit: false },
      { id: 'e', name: 'Node E', sessions: 1680, utilized: 54, colorKey: 'Green', overLimit: false },
      { id: 'f', name: 'Node F', sessions: 1350, utilized: 44, colorKey: 'Green', overLimit: false },
    ],
  }

  const nodesData = nodesByVPN[selectedVPN] || nodesByVPN.Portfolio

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
            <div className={styles.sessionsCard}>
              <h3 className={styles.sessionsTitle}>Sessions Per Node</h3>
              <div className={styles.nodesGrid}>
                {nodesData.map((node) => (
                  <div
                    key={node.id}
                    className={`${styles.nodeBox} ${styles[`nodeColor${node.colorKey}`]}`}
                  >
                    <div className={styles.nodeHeader}>
                      <span className={styles.nodeName}>{node.name}</span>
                      {node.overLimit && (
                        <span className={styles.overLimitBadge}>Over Limit</span>
                      )}
                    </div>
                    <div className={styles.nodeSessions}>{node.sessions} Active Sessions</div>
                    <div className={styles.nodeUtilized}>{node.utilized}% Utilized</div>
                  </div>
                ))}
              </div>
              <div className={styles.legend}>
                <div className={styles.legendItem}>
                  <span className={`${styles.legendSwatch} ${styles.legendGreen}`} />
                  <span>0-60%</span>
                </div>
                <div className={styles.legendItem}>
                  <span className={`${styles.legendSwatch} ${styles.legendLightBlue}`} />
                  <span>60-70%</span>
                </div>
                <div className={styles.legendItem}>
                  <span className={`${styles.legendSwatch} ${styles.legendOrange}`} />
                  <span>70-80%</span>
                </div>
                <div className={styles.legendItem}>
                  <span className={`${styles.legendSwatch} ${styles.legendRed}`} />
                  <span>&gt; 90%</span>
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
