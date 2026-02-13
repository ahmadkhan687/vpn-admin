'use client'

import React, { useState } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import RealtimeReportSidebar from '@/components/realtime-report-sidebar/RealtimeReportSidebar'
import Header from '@/components/header/Header'
import styles from './protocol-overview.module.css'
import DateRangePicker from '@/components/date-range-picker/DateRangePicker'
import { getProtocolOverviewData } from './protocolOverviewData'

const ProtocolOverview = () => {
  const [selectedVPN, setSelectedVPN] = useState('Portfolio')
  const [dateRange, setDateRange] = useState({
    startDate: new Date(2025, 11, 19),
    endDate: new Date(2026, 0, 15),
  })

  const scopeOptions = ['Portfolio', 'Steer Lucid', 'Crest', 'Slick', 'Fortivo', 'Qucik', 'Nexipher']

  const handleVPNChange = (vpn) => setSelectedVPN(vpn)
  const protocolData = getProtocolOverviewData(selectedVPN)

  const renderProtocolBarChart = () => {
    const width = 700
    const height = 220
    const padding = { top: 12, right: 70, bottom: 36, left: 80 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom
    const barHeight = (chartHeight / protocolData.length) - 14
    const maxVal = 100

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className={styles.protocolBarChartSvg} preserveAspectRatio="xMinYMid meet">
        {/* Vertical grid lines: 0, 20K, 40K, 60K, 80K */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
          <line
            key={i}
            x1={padding.left + pct * chartWidth}
            y1={padding.top}
            x2={padding.left + pct * chartWidth}
            y2={padding.top + chartHeight}
            stroke="#f3f4f6"
            strokeWidth="1"
          />
        ))}
        {protocolData.map((item, i) => {
          const y = padding.top + i * (barHeight + 14) + barHeight / 2
          const barW = (item.value / maxVal) * chartWidth
          return (
            <g key={item.label}>
              <text x={padding.left - 12} y={y + 4} textAnchor="end" className={styles.protocolAxisLabel}>
                {item.label}
              </text>
              <rect
                x={padding.left}
                y={y - barHeight / 2}
                width={barW}
                height={barHeight}
                fill="#22c55e"
                rx="4"
                ry="4"
              />
              <text x={padding.left + barW + 10} y={y + 4} textAnchor="start" className={styles.protocolAxisLabel}>
                {item.value}%
              </text>
            </g>
          )
        })}
        {/* X-axis labels */}
        {['0', '20K', '40K', '60K', '80K'].map((label, i) => (
          <text
            key={label}
            x={padding.left + (i / 4) * chartWidth}
            y={height - 10}
            textAnchor="middle"
            className={styles.protocolAxisLabel}
          >
            {label}
          </text>
        ))}
      </svg>
    )
  }

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
                <h2 className={styles.pageTitle}>Protocol and Traffic Mix Overview</h2>
                <span className={styles.titlePillOrange}>Network &amp; Protocol Health</span>
              </div>
              <div className={styles.dottedLine}></div>
              <p className={styles.pageDescription}>
                How fast are users and devices growing, where is that growth coming from, and is it happening efficiently?
              </p>
            </div>
            <div className={styles.pageHeaderRight}>
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
                presets={['Last 7 days', 'Last 14 days', 'Last 28 days', 'Last 90 days']}
              />
            </div>
          </div>

          <div className={styles.cardsColumn}>
            <div className={styles.metricCard}>
              <div className={styles.metricCardHeader}>
                <h3 className={styles.metricCardTitle}>Protocol Distribution</h3>
                <div className={styles.refreshWrap}>
                  <span className={styles.refreshIcon}>↻</span>
                  <span className={styles.refreshText}>Last Updated Now</span>
                </div>
              </div>
              <div className={styles.protocolChartWrap}>
                {renderProtocolBarChart()}
              </div>
              <div className={styles.protocolSummary}>
                <span>489.2 M total sessions</span>
                <span className={styles.protocolSummarySeparator}>•</span>
                <span>~16.5 TB Traffic</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProtocolOverview
