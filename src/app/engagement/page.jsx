'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/sidebar/Sidebar'
import RealtimeReportSidebar from '@/components/realtime-report-sidebar/RealtimeReportSidebar'
import Header from '@/components/header/Header'
import { engagementData, getSessionsPerUserData } from './engagementData'
import styles from './engagement.module.css'

// Full 24 hours for Daily Active Users (arrows scroll through these)
const DAU_HOURS_ALL = ['12 am', '1 am', '2 am', '3 am', '4 am', '5 am', '6 am', '7 am', '8 am', '9 am', '10 am', '11 am', '12 pm', '1 pm', '2 pm', '3 pm', '4 pm', '5 pm', '6 pm', '7 pm', '8 pm', '9 pm', '10 pm', '11 pm']
const HOURS_WINDOW_SIZE = 5

// Full 12 months for Monthly Active Users (arrows scroll through these)
const MAU_MONTHS_ALL = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_WINDOW_SIZE = 5

const Engagement = () => {
  const [selectedVPN, setSelectedVPN] = useState('Portfolio')
  const [dateRange, setDateRange] = useState('Last 28 days')
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false)
  const [activeMetricTab, setActiveMetricTab] = useState('dau') // 'dau' | 'mau'
  const [dauWindowStart, setDauWindowStart] = useState(9) // Start at 9 am (index 9)
  const [mauWindowStart, setMauWindowStart] = useState(0) // Start at Jan
  const [chartContainerWidth, setChartContainerWidth] = useState(800)
  const [sessionsChartWidth, setSessionsChartWidth] = useState(800)
  const dateDropdownRef = useRef(null)
  const chartContainerRef = useRef(null)
  const sessionsChartRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target)) {
        setIsDateDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isDateDropdownOpen])

  // Measure chart container for full-width graph
  useEffect(() => {
    const el = chartContainerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0]?.contentRect ?? {}
      if (width > 0) setChartContainerWidth(width)
    })
    observer.observe(el)
    setChartContainerWidth(el.getBoundingClientRect().width || 800)
    return () => observer.disconnect()
  }, [])

  // Measure sessions chart container for full-width bar chart
  useEffect(() => {
    const el = sessionsChartRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0]?.contentRect ?? {}
      if (width > 0) setSessionsChartWidth(width)
    })
    observer.observe(el)
    setSessionsChartWidth(el.getBoundingClientRect().width || 800)
    return () => observer.disconnect()
  }, [])

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

  const vpnData = engagementData[selectedVPN] || engagementData.Portfolio
  const dauCount = vpnData.dau
  const mauCount = vpnData.mau
  const dauTrendDataAll = vpnData.dauTrend
  const mauTrendDataAll = vpnData.mauTrend
  const sessionsPerUserData = getSessionsPerUserData(selectedVPN)
  const yAxisMax = Math.max(80, Math.max(...dauTrendDataAll, ...mauTrendDataAll) * 1.1)
  const chartHeight = 220
  const padding = { top: 20, right: 44, bottom: 36, left: 16 }

  const isDaily = activeMetricTab === 'dau'
  const dauMaxStart = Math.max(0, DAU_HOURS_ALL.length - HOURS_WINDOW_SIZE)
  const mauMaxStart = Math.max(0, MAU_MONTHS_ALL.length - MONTHS_WINDOW_SIZE)
  const dauStart = Math.min(dauWindowStart, dauMaxStart)
  const mauStart = Math.min(mauWindowStart, mauMaxStart)
  const xLabels = isDaily
    ? DAU_HOURS_ALL.slice(dauStart, dauStart + HOURS_WINDOW_SIZE)
    : MAU_MONTHS_ALL.slice(mauStart, mauStart + MONTHS_WINDOW_SIZE)
  const trendData = isDaily
    ? dauTrendDataAll.slice(dauStart, dauStart + HOURS_WINDOW_SIZE)
    : mauTrendDataAll.slice(mauStart, mauStart + MONTHS_WINDOW_SIZE)
  const chartWidth = chartContainerWidth
  const chartInnerWidth = chartWidth - padding.left - padding.right
  const chartInnerHeight = chartHeight - padding.top - padding.bottom

  const handlePrevPeriod = () => {
    if (isDaily) setDauWindowStart((s) => Math.max(0, s - 1))
    else setMauWindowStart((s) => Math.max(0, s - 1))
  }
  const handleNextPeriod = () => {
    if (isDaily) setDauWindowStart((s) => Math.min(dauMaxStart, s + 1))
    else setMauWindowStart((s) => Math.min(mauMaxStart, s + 1))
  }

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
    const barWidth = sessionsChartWidth
    const barHeight = 220
    const pad = { top: 20, right: 48, bottom: 44, left: 24 }
    const innerW = barWidth - pad.left - pad.right
    const innerH = barHeight - pad.top - pad.bottom
    const rawMax = Math.max(...sessionsPerUserData.map((d) => d.value), 1)
    const barMax = Math.ceil(rawMax * 1.1 / 10) * 10 || 10
    const barTicks = [0, Math.round(barMax * 0.2), Math.round(barMax * 0.4), Math.round(barMax * 0.6), Math.round(barMax * 0.8), barMax]
    const barGap = innerW / (sessionsPerUserData.length + 1)
    const barThickness = Math.min(barGap * 0.55, 52)

    return (
      <svg viewBox={`0 0 ${barWidth} ${barHeight}`} className={styles.sessionsBarChart} preserveAspectRatio="xMinYMid meet">
        {barTicks.map((val, i) => (
          <line
            key={i}
            x1={pad.left}
            y1={pad.top + innerH - (val / barMax) * innerH}
            x2={pad.left + innerW}
            y2={pad.top + innerH - (val / barMax) * innerH}
            stroke="#e5e7eb"
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
                y={barHeight - 14}
                textAnchor="middle"
                className={styles.axisLabel}
              >
                {item.label}
              </text>
            </g>
          )
        })}
        <text
          x={barWidth - 28}
          y={pad.top + innerH / 2}
          transform={`rotate(-90 ${barWidth - 28} ${pad.top + innerH / 2})`}
          textAnchor="middle"
          className={styles.axisLabel}
        >
          (Number of Users)
        </text>
        {barTicks.map((val, i) => (
          <text
            key={i}
            x={barWidth - 10}
            y={i === 0 ? pad.top + innerH + 32 : pad.top + innerH - (val / barMax) * innerH + 4}
            textAnchor="end"
            className={styles.axisLabel}
          >
            {val}
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
            <div className={styles.chartWithArrowsRow}>
              <button
                type="button"
                className={styles.chartNavArrow}
                aria-label={isDaily ? 'Previous hours' : 'Previous months'}
                onClick={handlePrevPeriod}
                disabled={isDaily ? dauStart <= 0 : mauStart <= 0}
              >
                ‹
              </button>
              <div className={styles.lineChartScrollWrap} ref={chartContainerRef}>
                <div className={styles.lineChartInner}>
                  {renderActiveUsersLineChart()}
                </div>
              </div>
              <button
                type="button"
                className={styles.chartNavArrow}
                aria-label={isDaily ? 'Next hours' : 'Next months'}
                onClick={handleNextPeriod}
                disabled={isDaily ? dauStart >= dauMaxStart : mauStart >= mauMaxStart}
              >
                ›
              </button>
            </div>
          </div>

          <div className={styles.sessionsCard}>
            <div className={styles.sessionsCardTitleWrap}>
              <h3 className={styles.sessionsCardTitle}>Sessions Per User</h3>
              <div className={styles.dottedLineSessions}></div>
            </div>
            <div className={styles.sessionsChartWrap} ref={sessionsChartRef}>
              {renderSessionsBarChart()}
            </div>
            <div className={styles.sessionsCardFooter}>
              <div className={styles.sessionsAxisLabelWrap}>
                <span className={styles.sessionsAxisLabel}>(Sessions)</span>
              </div>
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
