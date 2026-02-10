'use client'

import React, { useState, useEffect, useRef } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import RealtimeReportSidebar from '@/components/realtime-report-sidebar/RealtimeReportSidebar'
import Header from '@/components/header/Header'
import { retentionData } from './retentionData'
import styles from './retention.module.css'

const CHURN_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May']
const MONTHS_WINDOW_SIZE = 5

const Retention = () => {
  const [selectedVPN, setSelectedVPN] = useState('Portfolio')
  const [dateRange, setDateRange] = useState('Last 28 days')
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false)
  const [churnBreakdownTab, setChurnBreakdownTab] = useState('byRegion')
  const [monthWindowStart, setMonthWindowStart] = useState(0)
  const [chartContainerWidth, setChartContainerWidth] = useState(400)
  const [breakdownChartWidth, setBreakdownChartWidth] = useState(800)
  const dateDropdownRef = useRef(null)
  const churnLineChartRef = useRef(null)
  const breakdownChartRef = useRef(null)

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
    const el = churnLineChartRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0]?.contentRect ?? {}
      if (width > 0) setChartContainerWidth(width)
    })
    observer.observe(el)
    setChartContainerWidth(el.getBoundingClientRect().width || 400)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const el = breakdownChartRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0]?.contentRect ?? {}
      if (width > 0) setBreakdownChartWidth(width)
    })
    observer.observe(el)
    setBreakdownChartWidth(el.getBoundingClientRect().width || 800)
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
  const vpnData = retentionData[selectedVPN] || retentionData.Portfolio

  const churnUsers = vpnData.churnUsers
  const churnTrend = vpnData.churnTrend
  const maxStart = Math.max(0, churnTrend.length - MONTHS_WINDOW_SIZE)
  const monthStart = Math.min(monthWindowStart, maxStart)
  const visibleMonths = CHURN_MONTHS.slice(monthStart, monthStart + MONTHS_WINDOW_SIZE)
  const visibleTrend = churnTrend.slice(monthStart, monthStart + MONTHS_WINDOW_SIZE)
  const yAxisMax = 25
  const chartHeight = 200
  const pad = { top: 20, right: 40, bottom: 36, left: 16 }
  const chartWidth = chartContainerWidth
  const chartInnerWidth = chartWidth - pad.left - pad.right
  const chartInnerHeight = chartHeight - pad.top - pad.bottom

  const byAccount = vpnData.byAccountType || { free: 72, paid: 23 }
  const totalAccount = byAccount.free + byAccount.paid
  const freePct = totalAccount ? Math.round((byAccount.free / totalAccount) * 1000) / 10 : 75.8
  const paidPct = totalAccount ? Math.round((byAccount.paid / totalAccount) * 1000) / 10 : 24.2

  const breakdownData = churnBreakdownTab === 'byRegion' ? vpnData.byRegion : vpnData.byDevice
  const breakdownLabels = churnBreakdownTab === 'byRegion' ? breakdownData.map((d) => d.region) : breakdownData.map((d) => d.device)
  const breakdownPcts = breakdownData.map((d) => d.pct)
  const breakdownMax = 40

  const renderChurnLineChart = () => {
    const points = visibleTrend.map((value, i) => {
      const x = pad.left + (i / (visibleTrend.length - 1)) * chartInnerWidth
      const y = pad.top + chartInnerHeight - (value / yAxisMax) * chartInnerHeight
      return { x, y }
    })
    const linePath = points.map((p, i) => (i === 0 ? 'M' : 'L') + ` ${p.x} ${p.y}`).join(' ')
    return (
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className={styles.churnLineChartSvg} preserveAspectRatio="xMinYMid meet">
        {[5, 10, 15, 20, 25].map((val) => (
          <line
            key={val}
            x1={pad.left}
            y1={pad.top + chartInnerHeight - (val / yAxisMax) * chartInnerHeight}
            x2={pad.left + chartInnerWidth}
            y2={pad.top + chartInnerHeight - (val / yAxisMax) * chartInnerHeight}
            stroke="#f3f4f6"
            strokeWidth="1"
          />
        ))}
        <path d={linePath} fill="none" stroke="#9333ea" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#fff" stroke="#9333ea" strokeWidth="2" />
        ))}
        {visibleMonths.map((m, i) => (
          <text key={m} x={pad.left + (i / (visibleMonths.length - 1)) * chartInnerWidth} y={chartHeight - 8} textAnchor="middle" className={styles.axisLabel}>{m}</text>
        ))}
        <text x={chartWidth - 8} y={pad.top + 4} textAnchor="end" className={styles.axisLabel}>25%</text>
        <text x={chartWidth - 8} y={pad.top + chartInnerHeight * 0.5 + 4} textAnchor="end" className={styles.axisLabel}>15%</text>
        <text x={chartWidth - 8} y={pad.top + chartInnerHeight + 14} textAnchor="end" className={styles.axisLabel}>5%</text>
      </svg>
    )
  }

  const renderAccountTypeBarChart = () => {
    const maxVal = Math.max(byAccount.free, byAccount.paid, 1)
    const barH = 120
    const freeH = (byAccount.free / maxVal) * barH
    const paidH = (byAccount.paid / maxVal) * barH
    return (
      <div className={styles.accountBarChart}>
        <div className={styles.accountBarWrap}>
          <div className={styles.accountBar} style={{ height: freeH, background: '#9333ea' }} title={`Free: ${byAccount.free}`} />
          <span className={styles.accountBarLabel}>Free</span>
        </div>
        <div className={styles.accountBarWrap}>
          <div className={styles.accountBar} style={{ height: paidH, background: '#22c55e' }} title={`Paid: ${byAccount.paid}`} />
          <span className={styles.accountBarLabel}>Paid</span>
        </div>
        <div className={styles.accountLegend}>
          <div className={styles.accountLegendItem}>
            <span className={styles.accountLegendDot} style={{ background: '#9333ea' }}></span>
            Free: {byAccount.free} ({freePct}%)
          </div>
          <div className={styles.accountLegendItem}>
            <span className={styles.accountLegendDot} style={{ background: '#22c55e' }}></span>
            Paid: {byAccount.paid} ({paidPct}%)
          </div>
        </div>
      </div>
    )
  }

  const renderBreakdownHorizontalBar = () => {
    const w = breakdownChartWidth
    const h = 180
    const padB = { top: 20, right: 24, bottom: 32, left: 140 }
    const innerW = w - padB.left - padB.right
    const innerH = h - padB.top - padB.bottom
    const barHeight = innerH / breakdownLabels.length - 12
    return (
      <svg viewBox={`0 0 ${w} ${h}`} className={styles.breakdownBarSvg} preserveAspectRatio="xMinYMid meet">
        {[0, 10, 20, 30, 40].map((val) => (
          <line
            key={val}
            x1={padB.left + (val / breakdownMax) * innerW}
            y1={padB.top}
            x2={padB.left + (val / breakdownMax) * innerW}
            y2={padB.top + innerH}
            stroke="#f3f4f6"
            strokeWidth="1"
          />
        ))}
        {breakdownLabels.map((label, i) => {
          const y = padB.top + i * (barHeight + 12) + barHeight / 2
          const barW = (breakdownPcts[i] / breakdownMax) * innerW
          return (
            <g key={label}>
              <text x={padB.left - 8} y={y + 4} textAnchor="end" className={styles.axisLabel}>{label}</text>
              <rect x={padB.left} y={y - barHeight / 2} width={barW} height={barHeight} fill="#9333ea" rx="4" ry="4" />
            </g>
          )
        })}
        <text x={padB.left + innerW / 2} y={h - 8} textAnchor="middle" className={styles.axisLabel}>Churn rate (%)</text>
        <text x={padB.left} y={padB.top + innerH + 14} textAnchor="start" className={styles.axisLabel}>0%</text>
        <text x={padB.left + innerW} y={padB.top + innerH + 14} textAnchor="end" className={styles.axisLabel}>40%</text>
      </svg>
    )
  }

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
                <h2 className={styles.pageTitle}>Retention</h2>
                <span className={styles.titlePillGreen}>Growth and Product Performance</span>
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
                  {dateRangeOptions.map((option) => (
                    <div
                      key={option.label}
                      className={`${styles.dateRangeOption} ${dateRange === option.label ? styles.dateRangeOptionActive : ''}`}
                      onClick={() => { setDateRange(option.label); setIsDateDropdownOpen(false) }}
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
            <div className={styles.churnLineCard}>
              <div className={styles.churnLineCardTitleBar}></div>
              <h3 className={styles.churnLineCardTitle}>Churn Rate</h3>
              <div className={styles.churnLineCardValue}>
                {churnUsers} <span className={styles.churnLineCardValueUnit}>(Users)</span>
              </div>
              <div className={styles.churnChartWithArrows}>
                <button type="button" className={styles.chartNavArrow} onClick={() => setMonthWindowStart((s) => Math.max(0, s - 1))} disabled={monthStart <= 0}>‹</button>
                <div className={styles.churnLineChartWrap} ref={churnLineChartRef}>
                  {renderChurnLineChart()}
                </div>
                <button type="button" className={styles.chartNavArrow} onClick={() => setMonthWindowStart((s) => Math.min(maxStart, s + 1))} disabled={monthStart >= maxStart}>›</button>
              </div>
            </div>

            <div className={styles.churnByAccountCard}>
              <h3 className={styles.churnByAccountTitle}>Churn Rate</h3>
              <p className={styles.churnByAccountSubtitle}>(Based on Account Type)</p>
              <div className={styles.lastUpdated}>
                <span className={styles.lastUpdatedIcon}>↻</span>
                <span className={styles.lastUpdatedText}>Last Updated Now</span>
              </div>
              {renderAccountTypeBarChart()}
            </div>
          </div>

          <div className={styles.breakdownCard}>
            <div className={styles.breakdownCardHeader}>
              <h3 className={styles.breakdownCardTitle}>Churn Breakdown</h3>
              <div className={styles.breakdownCardRight}>
                <div className={styles.breakdownTabs}>
                  <button
                    type="button"
                    className={`${styles.breakdownTab} ${churnBreakdownTab === 'byRegion' ? styles.breakdownTabActive : ''}`}
                    onClick={() => setChurnBreakdownTab('byRegion')}
                  >
                    By Region
                  </button>
                  <button
                    type="button"
                    className={`${styles.breakdownTab} ${churnBreakdownTab === 'byDevice' ? styles.breakdownTabActive : ''}`}
                    onClick={() => setChurnBreakdownTab('byDevice')}
                  >
                    By Device
                  </button>
                </div>
                <div className={styles.lastUpdated}>
                  <span className={styles.lastUpdatedIcon}>↻</span>
                  <span className={styles.lastUpdatedText}>Last Updated Now</span>
                </div>
              </div>
            </div>
            <div className={styles.breakdownChartWrap} ref={breakdownChartRef}>
              {renderBreakdownHorizontalBar()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Retention
