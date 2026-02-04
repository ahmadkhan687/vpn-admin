'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/sidebar/Sidebar'
import RealtimeReportSidebar from '@/components/realtime-report-sidebar/RealtimeReportSidebar'
import Header from '@/components/header/Header'
import styles from './engagement.module.css'

const DAU_HOURS = ['9 am', '10 am', '11 am', '12 pm', '1 pm']
const MAU_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May']

// Daily Active Users: hourly trend (Y 0–80) — 5 points for 9 am, 10 am, 11 am, 12 pm, 1 pm
const dauTrendData = [45, 52, 38, 62, 55]
// Monthly Active Users: monthly trend (Y 0–80)
const mauTrendData = [12, 18, 15, 22, 20]

// Sessions Per User: categories and counts (matching image ~18, ~20, ~70, ~20, ~8)
const sessionsPerUserData = [
  { label: '1', value: 18 },
  { label: '2-3', value: 20 },
  { label: '4-6', value: 70 },
  { label: '7-10', value: 20 },
  { label: '10+', value: 8 },
]

const Engagement = () => {
  const [selectedVPN, setSelectedVPN] = useState('Portfolio')
  const [dateRange, setDateRange] = useState('Last 28 days')
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false)
  const [activeMetricTab, setActiveMetricTab] = useState('dau') // 'dau' | 'mau'
  const dateDropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target)) {
        setIsDateDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isDateDropdownOpen])

  const scopeOptions = [
    'Portfolio',
    'Steer Lucid',
    'Crest',
    'Slick',
    'Fortivo',
    'Qucik',
    'Nexipher',
  ]

  const dateRangeOptions = [
    { label: 'Last 7 days', range: 'Jan 9, 2026 – Jan 15, 2026' },
    { label: 'Last 14 days', range: 'Jan 2, 2026 – Jan 15, 2026' },
    { label: 'Last 28 days', range: 'Dec 19, 2025 – Jan 15, 2026' },
    { label: 'Last 90 days', range: 'Oct 18, 2025 – Jan 15, 2026' },
  ]

  const handleVPNChange = (vpn) => setSelectedVPN(vpn)
  const currentDateRange = dateRangeOptions.find((opt) => opt.label === dateRange) || dateRangeOptions[2]

  const dauCount = 233
  const mauCount = 92
  const yAxisMax = 80
  const chartHeight = 220
  const padding = { top: 20, right: 44, bottom: 36, left: 16 }

  const isDaily = activeMetricTab === 'dau'
  const xLabels = isDaily ? DAU_HOURS : MAU_MONTHS
  const trendData = isDaily ? dauTrendData : mauTrendData
  const chartInnerWidth = Math.max(400, (xLabels.length - 1) * 60)
  const chartWidth = chartInnerWidth + padding.left + padding.right
  const chartInnerHeight = chartHeight - padding.top - padding.bottom

  const renderActiveUsersLineChart = () => {
    const points = trendData.map((value, i) => {
      const x = padding.left + (i / (trendData.length - 1)) * chartInnerWidth
      const y = padding.top + chartInnerHeight - (value / yAxisMax) * chartInnerHeight
      return { x, y, value }
    })
    const linePath = points.map((p, i) => (i === 0 ? 'M' : 'L') + ` ${p.x} ${p.y}`).join(' ')
    return (
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className={styles.lineChartSvg}
        preserveAspectRatio="xMinYMid meet"
      >
        {[0.25, 0.5, 0.75, 1].map((pct, i) => (
          <line
            key={i}
            x1={padding.left}
            y1={padding.top + chartInnerHeight * (1 - pct)}
            x2={padding.left + chartInnerWidth}
            y2={padding.top + chartInnerHeight * (1 - pct)}
            stroke="#f3f4f6"
            strokeWidth="1"
          />
        ))}
        <path d={linePath} fill="none" stroke="#9333ea" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#fff" stroke="#9333ea" strokeWidth="2" />
        ))}
        {xLabels.map((label, i) => (
          <text
            key={label}
            x={padding.left + (i / (xLabels.length - 1)) * chartInnerWidth}
            y={chartHeight - 10}
            textAnchor="middle"
            className={styles.axisLabel}
          >
            {label}
          </text>
        ))}
        <text x={padding.left - 4} y={padding.top + 4} textAnchor="start" className={styles.axisLabel}>80</text>
        <text x={padding.left - 4} y={padding.top + chartInnerHeight * 0.5 + 4} textAnchor="start" className={styles.axisLabel}>40</text>
        <text x={padding.left - 4} y={padding.top + chartInnerHeight + 14} textAnchor="start" className={styles.axisLabel}>0</text>
      </svg>
    )
  }

  const renderSessionsBarChart = () => {
    const barWidth = 480
    const barHeight = 220
    const pad = { top: 16, right: 40, bottom: 40, left: 24 }
    const innerW = barWidth - pad.left - pad.right
    const innerH = barHeight - pad.top - pad.bottom
    const barMax = 100
    const barGap = innerW / (sessionsPerUserData.length + 1)
    const barThickness = Math.min(barGap * 0.6, 48)

    return (
      <svg viewBox={`0 0 ${barWidth} ${barHeight}`} className={styles.sessionsBarChart} preserveAspectRatio="xMidYMid meet">
        {[20, 40, 60, 80, 100].map((val, i) => (
          <line
            key={i}
            x1={pad.left}
            y1={pad.top + innerH - (val / barMax) * innerH}
            x2={pad.left + innerW}
            y2={pad.top + innerH - (val / barMax) * innerH}
            stroke="#f3f4f6"
            strokeWidth="1"
          />
        ))}
        {sessionsPerUserData.map((item, i) => {
          const x = pad.left + (i + 1) * barGap - barThickness / 2
          const h = (item.value / barMax) * innerH
          const y = pad.top + innerH - h
          return (
            <g key={item.label}>
              <rect
                x={x}
                y={y}
                width={barThickness}
                height={h}
                fill="#9333ea"
                rx="4"
                ry="4"
              />
              <text
                x={pad.left + (i + 1) * barGap}
                y={barHeight - 12}
                textAnchor="middle"
                className={styles.axisLabel}
              >
                {item.label}
              </text>
            </g>
          )
        })}
        <text x={barWidth - 8} y={pad.top + innerH + 14} textAnchor="end" className={styles.axisLabel}>(Number of Users)</text>
        <text x={barWidth - 8} y={pad.top + innerH + 28} textAnchor="end" className={styles.axisLabel}>0</text>
        <text x={barWidth - 8} y={pad.top + innerH - (20 / barMax) * innerH + 4} textAnchor="end" className={styles.axisLabel}>20</text>
        <text x={barWidth - 8} y={pad.top + innerH - (40 / barMax) * innerH + 4} textAnchor="end" className={styles.axisLabel}>40</text>
        <text x={barWidth - 8} y={pad.top + innerH - (60 / barMax) * innerH + 4} textAnchor="end" className={styles.axisLabel}>60</text>
        <text x={barWidth - 8} y={pad.top + innerH - (80 / barMax) * innerH + 4} textAnchor="end" className={styles.axisLabel}>80</text>
        <text x={barWidth - 8} y={pad.top + 4} textAnchor="end" className={styles.axisLabel}>100</text>
        <text x={pad.left + innerW / 2} y={barHeight - 4} textAnchor="middle" className={styles.axisLabel}>(Sessions)</text>
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
                <h2 className={styles.pageTitle}>Engagement</h2>
                <span className={styles.titlePillGreen}>Growth and Product Performance</span>
              </div>
              <div className={styles.dottedLine}></div>
              <p className={styles.pageDescription}>
                How fast are users and devices growing, where is that growth coming from, and is it happening efficiently?
              </p>
            </div>
            <div className={styles.pageHeaderRight} ref={dateDropdownRef}>
              <div
                className={styles.dateRangeSelector}
                onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
              >
                <span className={styles.dateRangeLabel}>{dateRange}</span>
                <span className={styles.dateRangeValue}>{currentDateRange.range}</span>
                <span className={styles.dateRangeChevron}>▼</span>
              </div>
              {isDateDropdownOpen && (
                <div className={styles.dateRangeDropdown}>
                  {dateRangeOptions.map((option) => (
                    <div
                      key={option.label}
                      className={`${styles.dateRangeOption} ${dateRange === option.label ? styles.dateRangeOptionActive : ''}`}
                      onClick={() => {
                        setDateRange(option.label)
                        setIsDateDropdownOpen(false)
                      }}
                    >
                      <span className={styles.dateRangeOptionLabel}>{option.label}</span>
                      <span className={styles.dateRangeOptionRange}>{option.range}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.activeUsersCard}>
            <div className={styles.activeUsersCardTop}>
              <div className={styles.metricTabs}>
                <button
                  type="button"
                  className={`${styles.metricTab} ${activeMetricTab === 'dau' ? styles.metricTabActive : ''}`}
                  onClick={() => setActiveMetricTab('dau')}
                >
                  <span className={styles.metricTabLabel}>Daily Active Users</span>
                  <span className={styles.metricTabValue}>{dauCount}</span>
                </button>
                <button
                  type="button"
                  className={`${styles.metricTab} ${activeMetricTab === 'mau' ? styles.metricTabActive : ''}`}
                  onClick={() => setActiveMetricTab('mau')}
                >
                  <span className={styles.metricTabLabel}>Monthly Active Users</span>
                  <span className={styles.metricTabValue}>{mauCount}</span>
                </button>
              </div>
              <div className={styles.lastUpdated}>
                <span className={styles.lastUpdatedIcon} aria-hidden>↻</span>
                <span className={styles.lastUpdatedText}>Last Updated Now</span>
              </div>
            </div>
            <div className={styles.lineChartScrollWrap}>
              <div className={styles.lineChartInner} style={{ minWidth: chartWidth }}>
                {renderActiveUsersLineChart()}
              </div>
            </div>
            <div className={styles.chartNavArrows}>
              <button type="button" className={styles.chartNavArrow} aria-label="Previous period">‹</button>
              <button type="button" className={styles.chartNavArrow} aria-label="Next period">›</button>
            </div>
          </div>

          <div className={styles.sessionsCard}>
            <h3 className={styles.sessionsCardTitle}>Sessions Per User</h3>
            <div className={styles.dottedLineSessions}></div>
            <div className={styles.sessionsChartWrap}>
              {renderSessionsBarChart()}
            </div>
            <div className={styles.sessionsCardFooter}>
              <Link href="/acquisition/all-users" className={styles.viewAllUsersLink}>
                View All Users →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Engagement
