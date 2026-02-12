'use client'

import React, { useState, useEffect, useRef } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import RealtimeReportSidebar from '@/components/realtime-report-sidebar/RealtimeReportSidebar'
import Header from '@/components/header/Header'
import { getReliabilityData } from './reliabilityFailureData'
import styles from './reliability-failure.module.css'

const TUNNEL_DROP_DAYS = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat']
const TUNNEL_DROP_YMAX = 2500
const AUTH_DAYS = ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']
const AUTH_YMAX = 200
const LOG_COLUMNS = ['Timestamp', 'Failure Type', 'Reason', 'User', 'Device', 'Region']

const ReliabilityFailure = () => {
  const [selectedVPN, setSelectedVPN] = useState('Portfolio')
  const [dateRange, setDateRange] = useState('Last 28 days')
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false)
  const [logSortColumn, setLogSortColumn] = useState('Region')
  const [logSearch, setLogSearch] = useState('')
  const dateDropdownRef = useRef(null)
  const tunnelChartRef = useRef(null)
  const authChartRef = useRef(null)
  const [tunnelWidth, setTunnelWidth] = useState(400)
  const [authWidth, setAuthWidth] = useState(400)
  const [hoveredTunnelDay, setHoveredTunnelDay] = useState(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(e.target)) {
        setIsDateDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isDateDropdownOpen])

  useEffect(() => {
    const el1 = tunnelChartRef.current
    const el2 = authChartRef.current
    const obs1 = el1 ? new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width
      if (w > 0) setTunnelWidth(w)
    }) : null
    const obs2 = el2 ? new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width
      if (w > 0) setAuthWidth(w)
    }) : null
    if (el1) obs1?.observe(el1)
    if (el2) obs2?.observe(el2)
    if (el1) setTunnelWidth(el1.getBoundingClientRect().width || 400)
    if (el2) setAuthWidth(el2.getBoundingClientRect().width || 400)
    return () => {
      if (el1) obs1?.disconnect()
      if (el2) obs2?.disconnect()
    }
  }, [])

  const scopeOptions = ['Portfolio', 'Steer Lucid', 'Crest', 'Slick', 'Fortivo', 'Qucik', 'Nexipher']
  const scopeData = getReliabilityData(selectedVPN)
  const tunnelDropValues = scopeData.tunnelDrop.values
  const tunnelDropTooltips = scopeData.tunnelDrop.tooltips
  const authStacked = scopeData.authFailure.stacked
  const failureEvents = scopeData.events.filter((e) => {
    if (!logSearch.trim()) return true
    const q = logSearch.toLowerCase()
    return (
      e.timestamp.toLowerCase().includes(q) ||
      e.failureType.toLowerCase().includes(q) ||
      e.reason.toLowerCase().includes(q) ||
      e.user.toLowerCase().includes(q) ||
      e.device.toLowerCase().includes(q) ||
      e.region.toLowerCase().includes(q)
    )
  })

  const dateRangeOptions = [
    { label: 'Last 7 days', range: 'Jan 9, 2026 – Jan 15, 2026' },
    { label: 'Last 14 days', range: 'Jan 2, 2026 – Jan 15, 2026' },
    { label: 'Last 28 days', range: 'Dec 19, 2025 – Jan 15, 2026' },
    { label: 'Last 90 days', range: 'Oct 18, 2025 – Jan 15, 2026' },
  ]
  const currentDateRange = dateRangeOptions.find((o) => o.label === dateRange) || dateRangeOptions[2]

  const handleVPNChange = (vpn) => setSelectedVPN(vpn)

  const pad = { top: 20, right: 24, bottom: 40, left: 40 }
  const chartH = 200

  // Tunnel Drop Rate line chart
  const tunnelInnerW = tunnelWidth - pad.left - pad.right
  const tunnelInnerH = chartH - pad.top - pad.bottom
  const tunnelPoints = tunnelDropValues.map((v, i) => ({
    x: pad.left + (i / (tunnelDropValues.length - 1 || 1)) * tunnelInnerW,
    y: pad.top + tunnelInnerH - (v / TUNNEL_DROP_YMAX) * tunnelInnerH,
  }))
  const tunnelAreaPath = tunnelPoints.length
    ? `M ${tunnelPoints[0].x} ${pad.top + tunnelInnerH} L ${tunnelPoints.map((p) => `${p.x} ${p.y}`).join(' L ')} L ${tunnelPoints[tunnelPoints.length - 1].x} ${pad.top + tunnelInnerH} Z`
    : ''
  const tunnelLinePath = tunnelPoints.map((p, i) => (i === 0 ? 'M' : 'L') + ` ${p.x} ${p.y}`).join(' ')
  const dayColumnWidth = tunnelInnerW / TUNNEL_DROP_DAYS.length
  const dropRateToday = tunnelDropValues[tunnelDropValues.length - 1]
  const dropRateMax = Math.max(...tunnelDropValues)

  // Auth Failure stacked bar chart
  const visibleAuthDays = AUTH_DAYS
  const visibleAuthStacked = authStacked
  const authInnerW = authWidth - pad.left - pad.right - 24
  const authInnerH = chartH - pad.top - pad.bottom
  const authBarCount = AUTH_DAYS.length
  const authBarGap = 12
  const authBarW = (authInnerW - (authBarCount - 1) * authBarGap) / authBarCount
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
                <h2 className={styles.pageTitle}>Reliability &amp; Failures</h2>
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

          <div className={styles.twoCardsRow}>
            {/* Tunnel Drop Rate */}
            <div className={styles.rateCard}>
              <div className={styles.rateCardTitleWrap}>
                <h3 className={styles.rateCardTitle}>Tunnel Drop Rate</h3>
                <div className={styles.rateCardDashed}></div>
              </div>
              <div className={styles.rateCardMetricRow}>
                <span className={styles.rateMetricValue}>{scopeData.tunnelDrop.ratePct}%</span>
                <span className={styles.rateBubble}>Drop Rate Today: {dropRateToday.toLocaleString()} Max: {dropRateMax.toLocaleString()}</span>
              </div>
              <div className={styles.rateChangeRed}>{scopeData.tunnelDrop.change.startsWith('-') ? '↓' : '↑'} {Math.abs(parseFloat(scopeData.tunnelDrop.change))}% from last week</div>
              <div className={styles.chartWrap} ref={tunnelChartRef}>
                <svg viewBox={`0 0 ${tunnelWidth} ${chartH}`} className={styles.chartSvg} preserveAspectRatio="xMinYMid meet">
                  <defs>
                    <linearGradient id="tunnelDropGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <path d={tunnelAreaPath} fill="url(#tunnelDropGrad)" />
                  {hoveredTunnelDay !== null && (
                    <rect
                      x={pad.left + hoveredTunnelDay * dayColumnWidth}
                      y={pad.top}
                      width={dayColumnWidth}
                      height={tunnelInnerH}
                      fill="rgba(139, 92, 246, 0.15)"
                    />
                  )}
                  <path d={tunnelLinePath} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  {TUNNEL_DROP_DAYS.map((d, i) => {
                    const cx = pad.left + (i / (TUNNEL_DROP_DAYS.length - 1 || 1)) * tunnelInnerW
                    const isHovered = hoveredTunnelDay === i
                    return (
                      <g key={d}>
                        <rect
                          x={pad.left + i * dayColumnWidth}
                          y={pad.top}
                          width={dayColumnWidth}
                          height={tunnelInnerH}
                          fill="transparent"
                          onMouseEnter={() => setHoveredTunnelDay(i)}
                          onMouseLeave={() => setHoveredTunnelDay(null)}
                          style={{ cursor: 'pointer' }}
                        />
                        <text x={cx} y={chartH - 10} textAnchor="middle" className={isHovered ? styles.axisLabelHover : styles.axisLabel}>{d}</text>
                      </g>
                    )
                  })}
                  {hoveredTunnelDay !== null && (
                    <g className={styles.chartTooltip}>
                      <rect
                        x={tunnelPoints[hoveredTunnelDay]?.x - 50}
                        y={(tunnelPoints[hoveredTunnelDay]?.y ?? pad.top) - 32}
                        width={120}
                        height={24}
                        rx={4}
                        fill="#fff"
                        stroke="#e5e7eb"
                        strokeWidth="1"
                      />
                      <text
                        x={tunnelPoints[hoveredTunnelDay]?.x ?? pad.left}
                        y={(tunnelPoints[hoveredTunnelDay]?.y ?? pad.top) - 16}
                        textAnchor="middle"
                        fontSize="11"
                        fill="#374151"
                      >
                        {tunnelDropTooltips[hoveredTunnelDay]}
                      </text>
                    </g>
                  )}
                </svg>
              </div>
              <div className={styles.thresholdNote}>
                <span className={styles.thresholdDot}></span>
                Acceptable Threshold &lt;3
              </div>
            </div>

            {/* Auth Failure Rate */}
            <div className={styles.rateCard}>
              <div className={styles.rateCardHeaderRow}>
                <div className={styles.rateCardTitleWrap}>
                  <h3 className={styles.rateCardTitle}>Auth Failure Rate</h3>
                  <div className={styles.rateCardDashed}></div>
                </div>
                <div className={styles.refreshWrap}>
                  <span className={styles.refreshIcon}>↻</span>
                  <span className={styles.refreshText}>Last Updated Now</span>
                </div>
              </div>
              <div className={styles.authMetricRow}>
                <span className={styles.rateMetricValue}>{scopeData.authFailure.ratePct}%</span>
                <span className={scopeData.authFailure.change.startsWith('-') ? styles.rateChangeRed : styles.rateChangeGreen}>{scopeData.authFailure.change.startsWith('-') ? '↓' : '↑'} {Math.abs(parseFloat(scopeData.authFailure.change))}% from last week</span>
              </div>
              <div className={styles.failuresText}>Failures: <strong>{scopeData.authFailure.failures}</strong></div>
              <div className={styles.authChartRow}>
                <div className={styles.chartWrap} ref={authChartRef}>
                  <svg viewBox={`0 0 ${authWidth} ${chartH}`} className={styles.chartSvg} preserveAspectRatio="xMinYMid meet">
                    {[0, 50, 100, 150, 200].map((val) => (
                      <line key={val} x1={pad.left} y1={pad.top + authInnerH - (val / AUTH_YMAX) * authInnerH} x2={pad.left + authInnerW} y2={pad.top + authInnerH - (val / AUTH_YMAX) * authInnerH} stroke="#f3f4f6" strokeWidth="1" />
                    ))}
                    {visibleAuthDays.map((day, i) => (
                      <text key={`${day}-${i}`} x={pad.left + authBarGap / 2 + i * (authBarW + authBarGap) + authBarW / 2} y={chartH - 10} textAnchor="middle" className={styles.axisLabel}>{day}</text>
                    ))}
                    {visibleAuthStacked.map((dayData, dayIdx) => {
                      const barX = pad.left + authBarGap / 2 + dayIdx * (authBarW + authBarGap)
                      let pixelAcc = 0
                      const colors = ['#a78bfa', '#5eead4', '#fcd34d', '#fbbf24']
                      return dayData.map((val, segIdx) => {
                        const h = (val / AUTH_YMAX) * authInnerH
                        const y = pad.top + authInnerH - pixelAcc - h
                        pixelAcc += h
                        const isTop = segIdx === dayData.length - 1
                        const isBottom = segIdx === 0
                        return (
                          <rect key={`${dayIdx}-${segIdx}`} x={barX} y={y} width={authBarW} height={Math.max(h, 1)} fill={colors[segIdx]} rx={isTop || isBottom ? 2 : 0} ry={isTop || isBottom ? 2 : 0} />
                        )
                      })
                    })}
                    {[0, 50, 100, 150, 200].map((val) => (
                      <text key={val} x={pad.left + authInnerW + 8} y={pad.top + authInnerH - (val / AUTH_YMAX) * authInnerH + 4} textAnchor="start" className={styles.axisLabel}>{val}</text>
                    ))}
                  </svg>
                </div>
              </div>
              <div className={styles.authLegend}>
                <span className={styles.legendItem}><span className={styles.legendDot} style={{ background: '#fcd34d' }}></span>Invalid Credentials</span>
                <span className={styles.legendItem}><span className={styles.legendDot} style={{ background: '#5eead4' }}></span>Token Expired</span>
                <span className={styles.legendItem}><span className={styles.legendDot} style={{ background: '#a78bfa' }}></span>Certificate Error</span>
                <span className={styles.legendItem}><span className={styles.legendDot} style={{ background: '#fbbf24' }}></span>MFA Failure</span>
              </div>
            </div>

            {/* Failure Events Log */}
            <div className={styles.failureLogCard}>
              <div className={styles.failureLogHeader}>
                <div className={styles.failureLogTitleWrap}>
                  <h3 className={styles.failureLogTitle}>Failure Events Log</h3>
                  <div className={styles.failureLogDashed}></div>
                </div>
                <div className={styles.failureLogTopRight}>
                  <div className={styles.refreshWrap}>
                    <span className={styles.refreshIcon}>↻</span>
                    <span className={styles.refreshText}>Last Updated Now</span>
                  </div>
                  <div className={styles.failureLogSearch}>
                    <span className={styles.searchIcon}>🔍</span>
                    <input type="text" placeholder="Search..." value={logSearch} onChange={(e) => setLogSearch(e.target.value)} className={styles.searchInput} />
                  </div>
                </div>
              </div>
              <div className={styles.failureLogTableWrap}>
                <table className={styles.failureLogTable}>
                  <thead>
                    <tr>
                      {LOG_COLUMNS.map((col) => (
                        <th key={col}>
                          <button type="button" className={`${styles.failureLogHeaderPill} ${logSortColumn === col ? styles.failureLogHeaderPillActive : ''}`} onClick={() => setLogSortColumn(col)}>{col}</button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {failureEvents.map((row, i) => (
                      <tr key={i}>
                        <td>{row.timestamp}</td>
                        <td>
                          <span className={row.failureType === 'Auth Failure' ? styles.failureTypeAuth : styles.failureTypeOther}>{row.failureType}</span>
                        </td>
                        <td>{row.reason}</td>
                        <td>{row.user}</td>
                        <td>{row.device}</td>
                        <td>{row.region}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReliabilityFailure
