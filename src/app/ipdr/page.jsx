'use client'

import React, { useState, useEffect, useRef } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import RealtimeReportSidebar from '@/components/realtime-report-sidebar/RealtimeReportSidebar'
import Header from '@/components/header/Header'
import { ipdrData } from './ipdrData'
import styles from './ipdr.module.css'

const ACCESS_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
const ACCESS_WINDOW_SIZE = 5

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" className={styles.kpiIcon} aria-hidden="true">
    <circle cx="12" cy="12" r="9" fill="none" stroke="#111827" strokeWidth="1.8" />
    <ellipse cx="12" cy="12" rx="4" ry="9" fill="none" stroke="#111827" strokeWidth="1.8" />
    <line x1="3" y1="12" x2="21" y2="12" stroke="#111827" strokeWidth="1.5" />
  </svg>
)

const WarningIcon = () => (
  <svg viewBox="0 0 24 24" className={styles.kpiIcon} aria-hidden="true">
    <path
      d="M12 4l8 14H4l8-14z"
      fill="none"
      stroke="#111827"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <line x1="12" y1="10" x2="12" y2="14" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="17" r="1" fill="#111827" />
  </svg>
)

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" className={styles.kpiIcon} aria-hidden="true">
    <path
      d="M12 3l7 3v6c0 4.2-2.7 7.8-7 9-4.3-1.2-7-4.8-7-9V6l7-3z"
      fill="none"
      stroke="#111827"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M9 12l2 2 4-4"
      fill="none"
      stroke="#16a34a"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const IPDR = () => {
  const [selectedVPN, setSelectedVPN] = useState('Portfolio')
  const [dateRange, setDateRange] = useState('Last 28 days')
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false)
  const [accessTab, setAccessTab] = useState('daily') // 'daily' | 'weekly'
  const [monthStart, setMonthStart] = useState(0)
  const dateDropdownRef = useRef(null)
  const accessChartRef = useRef(null)
  const [chartWidth, setChartWidth] = useState(500)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target)) {
        setIsDateDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isDateDropdownOpen])

  useEffect(() => {
    const el = accessChartRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0]?.contentRect ?? {}
      if (width > 0) setChartWidth(width)
    })
    observer.observe(el)
    setChartWidth(el.getBoundingClientRect().width || 500)
    return () => observer.disconnect()
  }, [])

  const scopeOptions = ['Portfolio', 'Steer Lucid', 'Crest', 'Slick', 'Fortivo', 'Qucik', 'Nexipher']
  const dateRangeOptions = [
    { label: 'Last 7 days', range: 'Jan 9, 2026 – Jan 15, 2026' },
    { label: 'Last 14 days', range: 'Jan 2, 2026 – Jan 15, 2026' },
    { label: 'Last 28 days', range: 'Dec 19, 2025 – Jan 15, 2026' },
    { label: 'Last 90 days', range: 'Oct 18, 2025 – Jan 15, 2026' },
  ]

  const handleVPNChange = (vpn) => setSelectedVPN(vpn)
  const currentDateRange = dateRangeOptions.find((opt) => opt.label === dateRange) || dateRangeOptions[2]
  const vpnData = ipdrData[selectedVPN] || ipdrData.Portfolio

  const { kpis, accessCount, accessTrend, accessTrendDaily, accessTrendWeekly, integrity, logs } = vpnData

  const accessChartHeight = 200
  const pad = { top: 20, right: 44, bottom: 36, left: 24 }
  const innerW = chartWidth - pad.left - pad.right
  const innerH = accessChartHeight - pad.top - pad.bottom
  const yMax = 25
  const months = ACCESS_MONTHS
  const dailyValues = accessTrendDaily || accessTrend || [6, 7, 6.5, 7.2, 6.8]
  const weeklyValues = accessTrendWeekly || accessTrend || [6, 7, 6.5, 7.2, 6.8]
  const allValues = accessTab === 'daily' ? dailyValues : weeklyValues
  const maxStart = Math.max(0, months.length - ACCESS_WINDOW_SIZE)
  const clampedStart = Math.min(monthStart, maxStart)
  const visibleMonths = months.slice(clampedStart, clampedStart + ACCESS_WINDOW_SIZE)
  const values = allValues.slice(clampedStart, clampedStart + ACCESS_WINDOW_SIZE)

  const points = values.map((value, i) => {
    const x = pad.left + (i / (values.length - 1 || 1)) * innerW
    const y = pad.top + innerH - (value / yMax) * innerH
    return { x, y }
  })
  const linePath = points.map((p, i) => (i === 0 ? 'M' : 'L') + ` ${p.x} ${p.y}`).join(' ')

  const usedPct = integrity?.usedPct ?? 99.6
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const usedLength = (usedPct / 100) * circumference

  return (
    <div className={`${styles.dashboardContainer} ${styles.withRealtimeSidebar}`}>
      <Sidebar />
      <RealtimeReportSidebar />
      <div className={styles.mainContent}>
        <Header dropdownOptions={scopeOptions} defaultValue={selectedVPN} onValueChange={handleVPNChange} />
        <div className={styles.content}>
          <div className={styles.pageHeader}>
            <div className={styles.pageHeaderLeft}>
              <div className={styles.titleRow}>
                <h2 className={styles.pageTitle}>IPDR</h2>
                <span className={styles.titlePillPurple}>Compliance &amp; Governance</span>
              </div>
              <div className={styles.dottedLine}></div>
              <p className={styles.pageDescription}>
                Is the system compliant with data retention policies, audit integrity standards, and legal response SLAs?
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

          {/* Top KPI cards */}
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}>
              <div className={styles.kpiIconWrap}>
                <GlobeIcon />
              </div>
              <div className={styles.kpiTitleWrap}>
                <h3 className={styles.kpiTitle}>IPDR Access Count</h3>
                <div className={styles.kpiTitleDotted}></div>
              </div>
              <div className={styles.kpiValueRow}>
                <div className={styles.kpiValue}>{kpis.accessCountPct}</div>
                <div className={styles.kpiChangeRow}>
                  <span className={styles.kpiArrowPositive}>↑</span>
                  <span className={styles.kpiChangePositive}>{kpis.accessCountChange}</span>
                </div>
              </div>
            </div>
            <div className={styles.kpiCard}>
              <div className={styles.kpiIconWrap}>
                <WarningIcon />
              </div>
              <div className={styles.kpiTitleWrap}>
                <h3 className={styles.kpiTitle}>Policy Violations</h3>
                <div className={styles.kpiTitleDotted}></div>
              </div>
              <div className={styles.kpiValueRow}>
                <div className={styles.kpiValue}>{kpis.policyViolations}</div>
                <div className={styles.kpiChangeRow}>
                  <span className={styles.kpiArrowNegative}>↓</span>
                  <span className={styles.kpiChangeNegative}>{kpis.policyViolationsChange}</span>
                </div>
              </div>
            </div>
            <div className={styles.kpiCard}>
              <div className={styles.kpiIconWrap}>
                <ShieldIcon />
              </div>
              <div className={styles.kpiTitleBar}>
                <div className={styles.kpiTitleWrap}>
                  <h3 className={styles.kpiTitle}>Total Audit Events</h3>
                  <div className={styles.kpiTitleDotted}></div>
                </div>
                <div className={styles.kpiLastVerified}>
                  <span className={styles.kpiLastVerifiedIcon}>↻</span>
                  <span className={styles.kpiLastVerifiedText}>Last Verified 10 min ago</span>
                </div>
              </div>
              <div className={styles.kpiAuditContent}>
                <div className={styles.kpiAuditLeft}>
                  <div className={styles.kpiValue}>{kpis.totalAuditEvents}</div>
                  <div className={styles.kpiChangeRow}>
                    <span className={styles.kpiArrowPositive}>↑</span>
                    <span className={styles.kpiChangePositive}>{kpis.totalAuditChange}</span>
                  </div>
                </div>
                <div className={styles.kpiAuditSparkline}>
                  <svg viewBox="0 0 180 40" className={styles.sparklineSvg}>
                    <polyline
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="2"
                      points="0,26 10,24 20,25 30,22 40,24 50,21 60,23 70,22 80,24 90,23 100,25 110,24 120,26 130,24 140,26 150,25 160,27 170,26 180,28"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Middle row: Access count + Integrity */}
          <div className={styles.middleRow}>
            <div className={styles.accessCard}>
              <div className={styles.accessTopBar}></div>
              <div className={styles.accessCardHeader}>
                <div className={styles.accessTitleBlock}>
                  <h3 className={styles.accessTitle}>IPDR Access Count</h3>
                  <div className={styles.accessValue}>{accessCount}</div>
                </div>
                <div className={styles.accessTabs}>
                  <button
                    type="button"
                    className={`${styles.accessTab} ${accessTab === 'daily' ? styles.accessTabActive : ''}`}
                    onClick={() => setAccessTab('daily')}
                  >
                    Daily
                  </button>
                  <button
                    type="button"
                    className={`${styles.accessTab} ${accessTab === 'weekly' ? styles.accessTabActive : ''}`}
                    onClick={() => setAccessTab('weekly')}
                  >
                    Weekly
                  </button>
                </div>
              </div>
              <div className={styles.accessChart} ref={accessChartRef}>
                <svg viewBox={`0 0 ${chartWidth} ${accessChartHeight}`} className={styles.accessChartSvg} preserveAspectRatio="xMinYMid meet">
                  {[5, 10, 15, 20, 25].map((val) => (
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
                  <path d={linePath} fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  {points.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#fff" stroke="#4f46e5" strokeWidth="2" />
                  ))}
                  {visibleMonths.map((m, i) => (
                    <text
                      key={m}
                      x={pad.left + (i / (visibleMonths.length - 1 || 1)) * innerW}
                      y={accessChartHeight - 10}
                      textAnchor="middle"
                      className={styles.axisLabel}
                    >
                      {m}
                    </text>
                  ))}
                  {[5, 10, 15, 20, 25].map((val) => (
                    <text
                      key={`label-${val}`}
                      x={chartWidth - 8}
                      y={pad.top + innerH - (val / yMax) * innerH + 4}
                      textAnchor="end"
                      className={styles.axisLabel}
                    >
                      {val}%
                    </text>
                  ))}
                </svg>
              </div>
              <div className={styles.accessBottomNav}>
                <button
                  type="button"
                  className={styles.chartNavArrow}
                  onClick={() => setMonthStart((s) => Math.max(0, s - 1))}
                  disabled={clampedStart <= 0}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className={styles.chartNavArrow}
                  onClick={() => setMonthStart((s) => Math.min(maxStart, s + 1))}
                  disabled={clampedStart >= maxStart}
                >
                  ›
                </button>
              </div>
            </div>

            <div className={styles.integrityCard}>
              <div className={styles.integrityHeader}>
                <div className={styles.integrityTitleWrap}>
                  <h3 className={styles.integrityTitle}>IPDR Audit Log  Integrity</h3>
                  <div className={styles.integrityTitleDotted}></div>
                </div>
                <div className={styles.integrityUpdated}>
                  <span className={styles.integrityRefresh}>↻</span>
                  <span className={styles.integrityUpdatedText}>Last Updated Now</span>
                </div>
              </div>
              <div className={styles.integrityBody}>
                <div className={styles.integrityDonutWrap}>
                  <svg width="220" height="220" viewBox="0 0 180 180">
                    {/* grey background ring */}
                    <circle
                      cx="90"
                      cy="90"
                      r={radius}
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="14"
                    />
                    {/* blue gauge arc for used percentage */}
                    <circle
                      cx="90"
                      cy="90"
                      r={radius}
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="14"
                      strokeDasharray={`${usedLength} ${circumference - usedLength}`}
                      strokeLinecap="round"
                      transform="rotate(-90 90 90)"
                    />
                  </svg>
                  <div className={styles.integrityCenterText}>
                    <div className={styles.integrityCenterValue}>{usedPct.toFixed(1)}%</div>
                    <div className={styles.integrityCenterLabel}>used</div>
                  </div>
                </div>
                <div className={styles.integrityLegend}>
                  <div className={styles.integrityLegendItem}>
                    <span className={styles.integrityCheck}>✔</span>
                    <span className={styles.integrityLegendValid}>Valid</span>
                  </div>
                  <div className={styles.integrityLegendItem}>
                    <span className={styles.integrityLegendIntact}>
                      <span className={styles.integrityLegendIntactValue}>{(integrity?.validPct ?? 99.6).toFixed(1)}%</span>{' '}
                      Intact
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Access logs table */}
          <div className={styles.logsCard}>
            <div className={styles.logsHeader}>
              <h3 className={styles.logsTitle}>IPDR Access Logs</h3>
              <div className={styles.logsSearchWrap}>
                <input className={styles.logsSearch} placeholder="Search..." />
              </div>
            </div>
            <div className={styles.logsTableWrap}>
              <table className={styles.logsTable}>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>User</th>
                    <th>Role</th>
                    <th>Action</th>
                    <th>Scope</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedVPN === 'Portfolio'
                    ? Object.entries(ipdrData)
                        .filter(([key]) => key !== 'Portfolio')
                        .flatMap(([, v]) => v.logs || [])
                    : logs || []
                  ).map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.timestamp}</td>
                      <td>{row.user}</td>
                      <td>{row.role}</td>
                      <td>{row.action}</td>
                      <td>{row.scope}</td>
                      <td>{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IPDR

