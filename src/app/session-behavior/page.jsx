'use client'

import React, { useState, useEffect, useRef } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import RealtimeReportSidebar from '@/components/realtime-report-sidebar/RealtimeReportSidebar'
import Header from '@/components/header/Header'
import { getSessionBehaviorData } from './sessionBehaviorData'
import styles from './session-behavior.module.css'

const ALL_SESSION_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const SESSION_TOOLTIP_DATA = [
  { duration: '1min 5sec', sessions: '15.2k' },
  { duration: '1min 45sec', sessions: '16.8k' },
  { duration: '1min 30sec', sessions: '17.1k' },
  { duration: '1min 10sec', sessions: '18.4k' },
  { duration: '1min 55sec', sessions: '16.2k' },
  { duration: '1min 20sec', sessions: '17.5k' },
  { duration: '1min 40sec', sessions: '19.1k' },
  { duration: '2min 5sec', sessions: '18.8k' },
  { duration: '1min 50sec', sessions: '20.2k' },
  { duration: '1min 35sec', sessions: '19.4k' },
  { duration: '2min 10sec', sessions: '21.1k' },
  { duration: '1min 45sec', sessions: '17.9k' },
]
const ALL_SESSION_POINTS = ALL_SESSION_MONTHS.map((m, i) => ({
  date: `${m} 14`,
  ...SESSION_TOOLTIP_DATA[i],
}))
const SESSION_WINDOW = 5
const SESSION_MAX_START = ALL_SESSION_MONTHS.length - SESSION_WINDOW

const EGRESS_TIME_LABELS = ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm']
const EGRESS_HOURS_PER_VIEW = 8
const EGRESS_MAX_START = 24 - EGRESS_HOURS_PER_VIEW

const SessionBehavior = () => {
  const [selectedVPN, setSelectedVPN] = useState('Portfolio')
  const [dateRange, setDateRange] = useState('Last 28 days')
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false)
  const [sessionChartStart, setSessionChartStart] = useState(0)
  const [egressChartStart, setEgressChartStart] = useState(0)
  const [hoveredLineIndex, setHoveredLineIndex] = useState(null)
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null)
  const [lineTooltip, setLineTooltip] = useState({ x: 0, y: 0, visible: false, data: null })
  const [barTooltip, setBarTooltip] = useState({ x: 0, y: 0, visible: false, value: null })
  const dateDropdownRef = useRef(null)
  const lineChartWrapRef = useRef(null)
  const barChartWrapRef = useRef(null)

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

  const scopeData = getSessionBehaviorData(selectedVPN)
  const totalHoursFormatted = scopeData.totalHours >= 1000
    ? `${(scopeData.totalHours / 1000).toFixed(1)}K hrs`
    : `${scopeData.totalHours.toLocaleString()} hrs`

  const renderSessionDurationLineChart = () => {
    const visibleMonths = ALL_SESSION_MONTHS.slice(sessionChartStart, sessionChartStart + SESSION_WINDOW)
    const visibleValues = scopeData.avgSessionDurationValues.slice(sessionChartStart, sessionChartStart + SESSION_WINDOW)
    const visiblePoints = ALL_SESSION_POINTS.slice(sessionChartStart, sessionChartStart + SESSION_WINDOW)
    const width = 1000
    const height = 220
    const pad = { top: 15, right: 40, bottom: 40, left: 15 }
    const innerW = width - pad.left - pad.right
    const innerH = height - pad.top - pad.bottom
    const yMax = 80
    const points = visibleValues.map((val, i) => {
      const x = pad.left + (i / Math.max(visibleValues.length - 1, 1)) * innerW
      const y = pad.top + innerH - (val / yMax) * innerH
      return { x, y, ...visiblePoints[i] }
    })
    const linePath = points.map((p, i) => (i === 0 ? 'M' : 'L') + ` ${p.x} ${p.y}`).join(' ')

    return (
      <div className={styles.chartWithArrows}>
        <button
          type="button"
          className={styles.chartNavArrow}
          onClick={() => setSessionChartStart((s) => Math.max(0, s - 1))}
          disabled={sessionChartStart <= 0}
          aria-label="Previous months"
        >
          ‹
        </button>
        <div className={styles.lineChartWrap} ref={lineChartWrapRef}>
          <svg viewBox={`0 0 ${width} ${height}`} className={styles.lineChartSvg} preserveAspectRatio="xMinYMid meet">
            {[0, 20, 40, 60, 80].map((val) => (
              <line
                key={val}
                x1={pad.left}
                y1={pad.top + innerH - (val / yMax) * innerH}
                x2={pad.left + innerW}
                y2={pad.top + innerH - (val / yMax) * innerH}
                stroke="#f3f4f6"
                strokeWidth="1"
              />
            ))}
            <path d={linePath} fill="none" stroke="#9333ea" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="5"
                fill="#fff"
                stroke="#9333ea"
                strokeWidth="2"
                className={hoveredLineIndex === i ? styles.pointHovered : ''}
                onMouseEnter={(e) => {
                  setHoveredLineIndex(i)
                  if (lineChartWrapRef.current) {
                    const rect = lineChartWrapRef.current.getBoundingClientRect()
                    setLineTooltip({
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top - 70,
                      visible: true,
                      data: visiblePoints[i],
                    })
                  }
                }}
                onMouseMove={(e) => {
                  if (lineChartWrapRef.current) {
                    const rect = lineChartWrapRef.current.getBoundingClientRect()
                    setLineTooltip((prev) => ({
                      ...prev,
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top - 70,
                    }))
                  }
                }}
                onMouseLeave={() => {
                  setHoveredLineIndex(null)
                  setLineTooltip((prev) => ({ ...prev, visible: false }))
                }}
              />
            ))}
            {visibleMonths.map((m, i) => (
              <text
                key={`${sessionChartStart}-${m}`}
                x={pad.left + (i / Math.max(visibleMonths.length - 1, 1)) * innerW}
                y={height - 10}
                textAnchor="middle"
                className={styles.axisLabel}
              >
                {m}
              </text>
            ))}
            {[0, 20, 40, 60, 80].map((val) => (
              <text
                key={val}
                x={width - 12}
                y={pad.top + innerH - (val / yMax) * innerH + 4}
                textAnchor="end"
                className={styles.axisLabel}
              >
                {val}
              </text>
            ))}
          </svg>
          {lineTooltip.visible && lineTooltip.data && (
            <div
              className={styles.chartTooltip}
              style={{ left: lineTooltip.x, top: lineTooltip.y }}
            >
              <div>{lineTooltip.data.date}</div>
              <div>Sessions</div>
              <div>{lineTooltip.data.duration}</div>
              <div>{lineTooltip.data.sessions}</div>
            </div>
          )}
        </div>
        <button
          type="button"
          className={styles.chartNavArrow}
          onClick={() => setSessionChartStart((s) => Math.min(SESSION_MAX_START, s + 1))}
          disabled={sessionChartStart >= SESSION_MAX_START}
          aria-label="Next months"
        >
          ›
        </button>
      </div>
    )
  }

  const renderEgressBarChart = () => {
    const fullEgressValues = scopeData.egressWindows[0]
    const visibleLabels = EGRESS_TIME_LABELS.slice(egressChartStart, egressChartStart + EGRESS_HOURS_PER_VIEW)
    const visibleValues = fullEgressValues.slice(egressChartStart, egressChartStart + EGRESS_HOURS_PER_VIEW)
    const width = 1000
    const height = 220
    const pad = { top: 20, right: 40, bottom: 44, left: 24 }
    const innerW = width - pad.left - pad.right
    const innerH = height - pad.top - pad.bottom
    const maxVal = Math.max(...visibleValues, 1)
    const barCount = visibleLabels.length
    const barGap = innerW / (barCount + 1)
    const barThickness = Math.min(barGap * 0.6, 80)

    return (
      <div className={styles.chartWithArrows}>
        <button
          type="button"
          className={styles.chartNavArrow}
          onClick={() => setEgressChartStart((s) => Math.max(0, s - EGRESS_HOURS_PER_VIEW))}
          disabled={egressChartStart <= 0}
          aria-label="Previous hours"
        >
          ‹
        </button>
        <div className={styles.barChartWrap} ref={barChartWrapRef}>
          <svg viewBox={`0 0 ${width} ${height}`} className={styles.barChartSvg} preserveAspectRatio="xMinYMid meet">
            {[0.25, 0.5, 0.75, 1].map((pct, i) => (
              <line
                key={i}
                x1={pad.left}
                y1={pad.top + innerH * (1 - pct)}
                x2={pad.left + innerW}
                y2={pad.top + innerH * (1 - pct)}
                stroke="#f3f4f6"
                strokeWidth="1"
              />
            ))}
            {visibleLabels.map((label, i) => {
              const val = visibleValues[i]
              const x = pad.left + (i + 1) * barGap - barThickness / 2
              const h = (val / maxVal) * innerH
              const y = pad.top + innerH - h
              return (
                <g key={`${egressChartStart}-${label}`}>
                  <rect
                    x={x}
                    y={y}
                    width={barThickness}
                    height={h}
                    fill="#3b82f6"
                    rx="4"
                    ry="4"
                    className={hoveredBarIndex === i ? styles.barHovered : ''}
                    onMouseEnter={(e) => {
                      setHoveredBarIndex(i)
                      if (barChartWrapRef.current) {
                        const rect = barChartWrapRef.current.getBoundingClientRect()
                        setBarTooltip({
                          x: e.clientX - rect.left,
                          y: e.clientY - rect.top - 45,
                          visible: true,
                          value: `${val} MB Egress`,
                        })
                      }
                    }}
                    onMouseMove={(e) => {
                      if (barChartWrapRef.current) {
                        const rect = barChartWrapRef.current.getBoundingClientRect()
                        setBarTooltip((prev) => ({
                          ...prev,
                          x: e.clientX - rect.left,
                          y: e.clientY - rect.top - 45,
                        }))
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredBarIndex(null)
                      setBarTooltip((prev) => ({ ...prev, visible: false }))
                    }}
                  />
                  <text
                    x={pad.left + (i + 1) * barGap}
                    y={height - 10}
                    textAnchor="middle"
                    className={styles.axisLabel}
                  >
                    {label}
                  </text>
                </g>
              )
            })}
          </svg>
          {barTooltip.visible && barTooltip.value && (
            <div
              className={styles.chartTooltip}
              style={{ left: barTooltip.x, top: barTooltip.y }}
            >
              {barTooltip.value}
            </div>
          )}
        </div>
        <button
          type="button"
          className={styles.chartNavArrow}
          onClick={() => setEgressChartStart((s) => Math.min(EGRESS_MAX_START, s + EGRESS_HOURS_PER_VIEW))}
          disabled={egressChartStart >= EGRESS_MAX_START}
          aria-label="Next hours"
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
                <h2 className={styles.pageTitle}>Session Behavior</h2>
                <span className={styles.titlePillOrange}>Network &amp; Protocol Health</span>
                <span className={styles.totalHoursBadge}>
                  Total Hours: {totalHoursFormatted}
                  {selectedVPN === 'Portfolio' && (
                    <span className={styles.scopeHint} title="Portfolio = sum across all VPNs"> (Overall)</span>
                  )}
                </span>
              </div>
              <div className={styles.dottedLine}></div>
              <p className={styles.pageDescription}>
                How fast are users and devices growing, where is that growth coming from, and is it happening efficiently?
                {selectedVPN === 'Portfolio' ? ' Portfolio shows aggregate (sum for total hours, average for metrics).' : ` Showing data for ${selectedVPN} only.`}
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
            {/* Average Session Duration Card */}
            <div className={styles.metricCard}>
              <div className={styles.metricCardHeader}>
                <h3 className={styles.metricCardTitle}>Average Session Duration</h3>
                <div className={styles.refreshWrap}>
                  <span className={styles.refreshIcon}>↻</span>
                  <span className={styles.refreshText}>Last Updated Now</span>
                </div>
              </div>
              <div className={styles.metricValueRow}>
                <span className={styles.metricValue}>{scopeData.avgSessionDuration}</span>
                <span className={parseFloat(scopeData.avgSessionDurationChange) >= 0 ? styles.metricTrendGreen : styles.metricTrendRed}>
                  <span className={styles.trendArrow}>{parseFloat(scopeData.avgSessionDurationChange) >= 0 ? '↑' : '↓'}</span>
                  {Math.abs(parseFloat(scopeData.avgSessionDurationChange))}%
                </span>
              </div>
              {renderSessionDurationLineChart()}
            </div>

            {/* Egress Per Session Card */}
            <div className={styles.metricCard}>
              <div className={styles.metricCardHeader}>
                <h3 className={styles.metricCardTitle}>Egress Per Session</h3>
                <div className={styles.refreshWrap}>
                  <span className={styles.refreshIcon}>↻</span>
                  <span className={styles.refreshText}>Last Updated Now</span>
                </div>
              </div>
              <p className={styles.egressThreshold}>Normal egress threshold: 280 MB.</p>
              <div className={styles.metricValueRow}>
                <span className={styles.metricValue}>{scopeData.egressMB} MB</span>
                <span className={styles.metricTrendGreen}>
                  <span className={styles.trendArrow}>↑</span> {scopeData.egressChange}
                </span>
              </div>
              {renderEgressBarChart()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SessionBehavior
