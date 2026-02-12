'use client'

import React, { useState, useEffect, useRef } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import RealtimeReportSidebar from '@/components/realtime-report-sidebar/RealtimeReportSidebar'
import Header from '@/components/header/Header'
import styles from './connection-stability.module.css'

const ALL_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const MONTHS_PER_VIEW = 3
const RECONNECT_MAX_START = ALL_MONTHS.length - MONTHS_PER_VIEW

const buildReconnectData = () => {
  const patterns = [
    [3200, 12500, 18500, 8200],
    [4200, 14200, 19500, 9200],
    [3800, 13200, 17800, 8500],
    [4500, 15200, 21500, 10200],
    [3900, 12800, 18200, 8800],
    [4800, 16200, 22800, 11200],
    [4100, 13800, 19200, 9500],
    [4400, 14800, 20800, 9800],
    [3600, 12200, 17200, 7900],
    [4700, 15800, 22200, 10800],
    [4000, 13500, 18800, 9100],
    [3400, 11800, 16800, 7600],
  ]
  const out = []
  for (let m = 0; m < 12; m++) {
    for (let i = 0; i < 4; i++) {
      out.push({ month: ALL_MONTHS[m], value: patterns[m][i] })
    }
  }
  return out
}
const ALL_RECONNECT_DATA = buildReconnectData()
const Y_AXIS_VALUES = [0, 5000, 10000, 15000, 20000, 25000]

const MTU_LOCATION_DATA = [
  { label: 'USA', value: 340, color: '#ea580c' },
  { label: 'Canada', value: 280, color: '#fb923c' },
  { label: 'UK', value: 240, color: '#c2410c' },
  { label: 'France', value: 260, color: '#3b82f6' },
]

const ConnectionStability = () => {
  const [selectedVPN, setSelectedVPN] = useState('Portfolio')
  const [dateRange, setDateRange] = useState('Last 28 days')
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false)
  const [chartMonthStart, setChartMonthStart] = useState(3)
  const dateDropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(e.target)) {
        setIsDateDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isDateDropdownOpen])

  const scopeOptions = ['Portfolio', 'Steer Lucid', 'Crest', 'Slick', 'Fortivo', 'Qucik', 'Nexipher']
  const dateRangeOptions = [
    { label: 'Last 7 days', range: 'Jan 9, 2026 – Jan 15, 2026' },
    { label: 'Last 14 days', range: 'Jan 2, 2026 – Jan 15, 2026' },
    { label: 'Last 28 days', range: 'Dec 19, 2025 – Jan 15, 2026' },
    { label: 'Last 90 days', range: 'Oct 18, 2025 – Jan 15, 2026' },
  ]
  const currentDateRange = dateRangeOptions.find((o) => o.label === dateRange) || dateRangeOptions[2]

  const handleVPNChange = (vpn) => setSelectedVPN(vpn)

  const renderReconnectAreaChart = () => {
    const visibleMonths = ALL_MONTHS.slice(chartMonthStart, chartMonthStart + MONTHS_PER_VIEW)
    const pointsPerMonth = 4
    const startIdx = chartMonthStart * pointsPerMonth
    const endIdx = (chartMonthStart + MONTHS_PER_VIEW) * pointsPerMonth
    const chartData = ALL_RECONNECT_DATA.slice(startIdx, endIdx)

    const width = 1000
    const height = 240
    const padding = { top: 20, right: 50, bottom: 50, left: 50 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom
    const yMax = 25000

    const points = chartData.map((d, i) => {
      const x = padding.left + (i / (chartData.length - 1 || 1)) * chartWidth
      const y = padding.top + chartHeight - (d.value / yMax) * chartHeight
      return { x, y, value: d.value }
    })

    const linePath = points.map((p, i) => (i === 0 ? 'M' : 'L') + ` ${p.x} ${p.y}`).join(' ')
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`

    return (
      <div className={styles.chartWithArrows}>
        <button
          type="button"
          className={styles.chartNavArrow}
          onClick={() => setChartMonthStart((s) => Math.max(0, s - 1))}
          disabled={chartMonthStart <= 0}
          aria-label="Previous months"
        >
          ‹
        </button>
        <div className={styles.chartWrap}>
          <svg viewBox={`0 0 ${width} ${height}`} className={styles.reconnectChartSvg} preserveAspectRatio="xMinYMid meet">
        <defs>
          <linearGradient id="reconnectAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.25)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0.02)" />
          </linearGradient>
        </defs>
        {Y_AXIS_VALUES.map((val) => (
          <line
            key={val}
            x1={padding.left}
            y1={padding.top + chartHeight - (val / yMax) * chartHeight}
            x2={padding.left + chartWidth}
            y2={padding.top + chartHeight - (val / yMax) * chartHeight}
            stroke="#f3f4f6"
            strokeWidth="1"
          />
        ))}
        <path d={areaPath} fill="url(#reconnectAreaGradient)" />
        <path
          d={linePath}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {visibleMonths.map((m, i) => (
          <text
            key={`${chartMonthStart}-${m}`}
            x={padding.left + ((i + 0.5) / MONTHS_PER_VIEW) * chartWidth}
            y={height - 12}
            textAnchor="middle"
            className={styles.chartAxisLabel}
          >
            {m}
          </text>
        ))}
        {Y_AXIS_VALUES.map((val) => (
          <text
            key={val}
            x={padding.left - 8}
            y={padding.top + chartHeight - (val / yMax) * chartHeight + 4}
            textAnchor="end"
            className={styles.chartAxisLabel}
          >
            {val === 0 ? '0' : val === 5000 ? '5 000' : val === 10000 ? '10 000' : val === 15000 ? '15 000' : val === 20000 ? '20 000' : '25 000'}
          </text>
        ))}
          </svg>
        </div>
        <button
          type="button"
          className={styles.chartNavArrow}
          onClick={() => setChartMonthStart((s) => Math.min(RECONNECT_MAX_START, s + 1))}
          disabled={chartMonthStart >= RECONNECT_MAX_START}
          aria-label="Next months"
        >
          ›
        </button>
      </div>
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
                <h2 className={styles.pageTitle}>Connection Stability</h2>
                <span className={styles.titlePillOrange}>Network &amp; Protocol Health</span>
              </div>
              <div className={styles.dottedLine}></div>
              <p className={styles.pageDescription}>
                How fast are users and devices growing, where is that growth coming from, and is it happening efficiently?
              </p>
            </div>
            <div className={styles.pageHeaderRight} ref={dateDropdownRef}>
              <div className={styles.dateRangeSelector} onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}>
                <span className={styles.dateRangeLabel}>{dateRange}</span>
                <span className={styles.dateRangeValue}>{currentDateRange.range}</span>
                <span className={styles.dateRangeChevron}>▼</span>
              </div>
              {isDateDropdownOpen && (
                <div className={styles.dateRangeDropdown}>
                  {dateRangeOptions.map((opt) => (
                    <div
                      key={opt.label}
                      className={`${styles.dateRangeOption} ${dateRange === opt.label ? styles.dateRangeOptionActive : ''}`}
                      onClick={() => { setDateRange(opt.label); setIsDateDropdownOpen(false) }}
                    >
                      <span className={styles.dateRangeOptionLabel}>{opt.label}</span>
                      <span className={styles.dateRangeOptionRange}>{opt.range}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.cardsColumn}>
            <div className={styles.metricCard}>
              <div className={styles.metricCardHeader}>
                <h3 className={styles.metricCardTitle}>Reconnect Frequency</h3>
                <div className={styles.refreshWrap}>
                  <span className={styles.refreshIcon}>↻</span>
                  <span className={styles.refreshText}>Last Updated Now</span>
                </div>
              </div>
              <div className={styles.metricValueRow}>
                <span className={styles.metricValue}>0.38 reconnects/ sessions</span>
                <span className={styles.stableBadge}>Stable</span>
              </div>
              <div className={styles.chartContainer}>
                {renderReconnectAreaChart()}
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLeft}>Affected Sessions: 7.4%</span>
                <span className={styles.summaryRight}>
                  <span className={styles.globeIcon}>🌐</span>
                  Most Impacted region : South Asia
                </span>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricCardHeader}>
                <h3 className={styles.metricCardTitle}>MTU Errors</h3>
                <div className={styles.refreshWrap}>
                  <span className={styles.refreshIcon}>↻</span>
                  <span className={styles.refreshText}>Last Updated Now</span>
                </div>
              </div>
              <div className={styles.mtuErrorRow}>
                <span className={styles.mtuErrorValue}>1,284 errors</span>
                <span className={styles.mtuElevated}>
                  <span className={styles.mtuArrowRed}>↑</span> Elevated
                </span>
                <span className={styles.mtuErrorBadge}>+18 Errors</span>
              </div>
              <div className={styles.mtuInsightsSection}>
                <h4 className={styles.mtuInsightsTitle}>MTU Error Insights</h4>
                <ul className={styles.mtuInsightsList}>
                  <li>
                    <span className={styles.mtuWarningIcon}>⚠</span>
                    Most errors occur on UDP Traffic
                  </li>
                  <li>
                    <span className={styles.mtuWarningIcon}>⚠</span>
                    62% of errors from MTU &lt; 1400
                  </li>
                  <li>
                    <span className={styles.mtuWarningIcon}>⚠</span>
                    Corelates with reconnect spikes
                  </li>
                </ul>
              </div>
              <div className={styles.mtuDivider}></div>
              <div className={styles.mtuLocationSection}>
                <h4 className={styles.mtuLocationTitle}>
                  <span className={styles.globeIcon}>🌐</span>
                  Location Based Errors
                </h4>
                <div className={styles.mtuBarChart}>
                  {MTU_LOCATION_DATA.map((item) => {
                    const maxVal = Math.max(...MTU_LOCATION_DATA.map((d) => d.value))
                    const pct = (item.value / maxVal) * 100
                    return (
                      <div key={item.label} className={styles.mtuBarRow}>
                        <span className={styles.mtuBarLabel}>{item.label}</span>
                        <div className={styles.mtuBarTrack}>
                          <div
                            className={styles.mtuBarFill}
                            style={{ width: `${pct}%`, backgroundColor: item.color }}
                          />
                        </div>
                        <span className={styles.mtuBarValue}>{item.value}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConnectionStability
