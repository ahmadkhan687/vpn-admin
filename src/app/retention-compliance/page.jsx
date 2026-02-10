'use client'

import React, { useState, useEffect, useRef } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import RealtimeReportSidebar from '@/components/realtime-report-sidebar/RealtimeReportSidebar'
import Header from '@/components/header/Header'
import { getRetentionComplianceForScope } from './retentionComplianceData'
import styles from './retention-compliance.module.css'

const RetentionCompliance = () => {
  const [selectedVPN, setSelectedVPN] = useState('Portfolio')
  const [dateRange, setDateRange] = useState('Last 28 days')
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false)
  const dateDropdownRef = useRef(null)
  const chartRef = useRef(null)
  const [chartWidth, setChartWidth] = useState(600)
  const [monthStart, setMonthStart] = useState(0)

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
    const el = chartRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0]?.contentRect ?? {}
      if (width > 0) setChartWidth(width)
    })
    observer.observe(el)
    setChartWidth(el.getBoundingClientRect().width || 600)
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
  const scopeData = getRetentionComplianceForScope(selectedVPN)

  const accessChartHeight = 200
  const pad = { top: 40, right: 44, bottom: 36, left: 32 }
  const innerW = chartWidth - pad.left - pad.right
  const innerH = accessChartHeight - pad.top - pad.bottom
  const yMax = 25
  const months = scopeData.trendMonths || ['Jan', 'Feb', 'Mar', 'Apr', 'May']
  const values = scopeData.trendValues || [8, 9, 9.2, 9.4, 9.1]
  const WINDOW_SIZE = 5
  const maxStart = Math.max(0, months.length - WINDOW_SIZE)
  const clampedStart = Math.min(monthStart, maxStart)
  const visibleMonths = months.slice(clampedStart, clampedStart + WINDOW_SIZE)
  const visibleValues = values.slice(clampedStart, clampedStart + WINDOW_SIZE)

  const points = visibleValues.map((value, i) => {
    const x = pad.left + (i / (visibleValues.length - 1 || 1)) * innerW
    const y = pad.top + innerH - (value / yMax) * innerH
    return { x, y }
  })
  const linePath = points.map((p, i) => (i === 0 ? 'M' : 'L') + ` ${p.x} ${p.y}`).join(' ')

  const usedPct = scopeData.slaUsedPct ?? 99.6
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
                <h2 className={styles.pageTitle}>Retention Compliance</h2>
                <span className={styles.titlePillPurple}>Compliance &amp; Governance</span>
              </div>
              <div className={styles.dottedLine}></div>
              <p className={styles.pageDescription}>
                Are data retention policies, legal holds, and deletion workflows configured correctly across all VPNs?
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

          <div className={styles.topRow}>
            <div className={styles.requestsCard}>
              <div className={styles.requestsTopBar}></div>
              <div className={styles.requestsHeader}>
                <div>
                  <h3 className={styles.requestsTitle}>Retention Requests Processed</h3>
                  <div className={styles.requestsValue}>{scopeData.requestsProcessed}</div>
                </div>
                <div className={styles.requestsKpiPills}>
                  <div className={styles.requestsPill}>
                    <span className={styles.requestsPillLabel}>Retention</span>
                    <span className={styles.requestsPillValue}>{scopeData.retentionRequests}</span>
                  </div>
                  <div className={styles.requestsPill}>
                    <span className={styles.requestsPillLabel}>Compliance Rate %</span>
                    <span className={styles.requestsPillValue}>{scopeData.complianceRatePct}%</span>
                  </div>
                </div>
              </div>
              <div className={styles.requestsChart} ref={chartRef}>
                <svg
                  viewBox={`0 0 ${chartWidth} ${accessChartHeight}`}
                  className={styles.requestsChartSvg}
                  preserveAspectRatio="xMinYMid meet"
                >
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
              <div className={styles.requestsBottomNav}>
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

            <div className={styles.slaCard}>
              <div className={styles.slaHeader}>
                <div className={styles.slaTitleWrap}>
                  <h3 className={styles.slaTitle}>Legal Request SLA</h3>
                  <div className={styles.slaTitleDotted}></div>
                </div>
                <div className={styles.slaUpdated}>
                  <span className={styles.slaUpdatedLabel}>Last Updated Now</span>
                </div>
              </div>
              <div className={styles.slaBody}>
                <div className={styles.slaDonutWrap}>
                  <svg width="220" height="220" viewBox="0 0 180 180">
                    <circle
                      cx="90"
                      cy="90"
                      r={radius}
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="14"
                    />
                    <circle
                      cx="90"
                      cy="90"
                      cy="90"
                      r={radius}
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="14"
                      strokeDasharray={`${usedLength} ${circumference - usedLength}`}
                      strokeLinecap="round"
                      transform="rotate(-90 90 90)"
                    />
                  </svg>
                  <div className={styles.slaCenterText}>
                    <div className={styles.slaCenterValue}>{usedPct.toFixed(1)}%</div>
                    <div className={styles.slaCenterLabel}>used</div>
                  </div>
                </div>
                <div className={styles.slaLegend}>
                  <div className={styles.slaLegendItem}>
                    <span className={styles.slaLegendDotPrimary}></span>
                    <span className={styles.slaLegendText}>
                      SLA Compliance: {scopeData.complianceRatePct?.toFixed(1) ?? usedPct.toFixed(1)}%
                    </span>
                  </div>
                  <div className={styles.slaLegendItem}>
                    <span className={styles.slaLegendDotWithin}></span>
                    <span className={styles.slaLegendText}>Within SLA: {scopeData.slaWithinCount}</span>
                  </div>
                  <div className={styles.slaLegendItem}>
                    <span className={styles.slaLegendDotBreached}></span>
                    <span className={styles.slaLegendText}>Breached SLA: {scopeData.slaBreachedCount}</span>
                  </div>
                </div>
              </div>
              <div className={styles.slaFooter}>
                <span className={styles.slaFooterLabel}>SLA Compliance Rate:</span>
                <span className={styles.slaFooterValue}>{scopeData.slaComplianceHours} Hours</span>
              </div>
            </div>
          </div>

          <div className={styles.logsCard}>
            <div className={styles.logsHeader}>
              <h3 className={styles.logsTitle}>Legal &amp; Retention Request Logs</h3>
              <div className={styles.logsSearchWrap}>
                <input className={styles.logsSearch} type="text" placeholder="Search..." />
              </div>
            </div>
            <div className={styles.logsTableWrap}>
              <table className={styles.logsTable}>
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Type</th>
                    <th>Received Date</th>
                    <th>SLA Deadline</th>
                    <th>Response Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedVPN === 'Portfolio'
                    ? getRetentionComplianceForScope('Portfolio').logs
                    : scopeData.logs || []
                  ).map((row, idx) => (
                    <tr key={`${row.id}-${idx}`}>
                      <td>{row.id}</td>
                      <td>{row.type}</td>
                      <td>{row.receivedDate}</td>
                      <td>{row.slaDeadline}</td>
                      <td>{row.responseTime}</td>
                      <td className={row.status === 'Allowed' ? styles.statusOk : styles.statusWarn}>{row.status}</td>
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

export default RetentionCompliance

