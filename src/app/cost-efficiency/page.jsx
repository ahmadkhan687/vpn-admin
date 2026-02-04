'use client'

import React, { useState, useEffect, useRef } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import RealtimeReportSidebar from '@/components/realtime-report-sidebar/RealtimeReportSidebar'
import Header from '@/components/header/Header'
import styles from './cost-efficiency.module.css'
import { costEfficiencyData } from './costEfficiencyData'

const CostEfficiency = () => {
  const [selectedVPN, setSelectedVPN] = useState('Portfolio')
  const [dateRange, setDateRange] = useState('Last 28 days')
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false)
  const [userType, setUserType] = useState('all')
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const dateDropdownRef = useRef(null)
  const userDropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target)) {
        setIsDateDropdownOpen(false)
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isDateDropdownOpen, isUserDropdownOpen])

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

  // Get data for selected scope (Portfolio = overall data, VPN = that VPN's data)
  const currentData = costEfficiencyData[selectedVPN] || costEfficiencyData.Portfolio

  // Cost metrics tabs - values change when tab is active and when scope changes
  const [activeCostTab, setActiveCostTab] = useState('costPerHour')
  const costTabs = [
    { id: 'costPerHour', label: 'Cost Per Hour', activeValue: currentData.costPerHour, inactiveValue: '$0.00' },
    { id: 'costPerMonth', label: 'Cost Per Month', activeValue: currentData.costPerMonth, inactiveValue: '$0.00' },
    { id: 'costPerGB', label: 'Cost Per GB', activeValue: currentData.costPerGB, inactiveValue: '$0.00' },
  ]

  // User type dropdown - Cost Per Concurrent User (left card)
  const userTypeOptions = [
    { id: 'all', label: 'All users' },
    { id: 'free', label: 'Free users' },
    { id: 'paid', label: 'Paid users' },
    { id: 'trial', label: 'Trial users' },
  ]

  const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const currentUserData = currentData.userTypeData[userType] || currentData.userTypeData.all

  // Chart data - changes based on active tab and selected VPN
  const chartData = currentData.chartDataByTab[activeCostTab] || currentData.chartDataByTab.costPerHour
  const egressChartData = currentData.egressChartData

  const renderCostChart = () => {
    const width = 900
    const height = 220
    const padding = { top: 20, right: 20, bottom: 40, left: 50 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    const maxValue = Math.max(...chartData.map((d) => d.value))
    const minValue = Math.min(...chartData.map((d) => d.value))
    const range = maxValue - minValue || 1

    const points = chartData.map((d, index) => {
      const x = padding.left + (index / (chartData.length - 1)) * chartWidth
      const y = padding.top + chartHeight - ((d.value - minValue) / range) * chartHeight
      return { x, y, value: d.value, month: d.month }
    })

    const linePath = points.map((p, i) => (i === 0 ? 'M' : 'L') + ` ${p.x} ${p.y}`).join(' ')

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className={styles.costChart} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="costAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.2)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.02)" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
          <line
            key={i}
            x1={padding.left}
            y1={padding.top + chartHeight * (1 - pct)}
            x2={padding.left + chartWidth}
            y2={padding.top + chartHeight * (1 - pct)}
            stroke="#f3f4f6"
            strokeWidth="1"
          />
        ))}
        {/* Area fill */}
        <path
          d={`${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`}
          fill="url(#costAreaGradient)"
        />
        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Data points */}
        {points.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r="4" fill="#ffffff" stroke="#3b82f6" strokeWidth="2" />
        ))}
        {/* X-axis labels */}
        {chartData.map((d, index) => (
          <text
            key={index}
            x={padding.left + (index / (chartData.length - 1)) * chartWidth}
            y={height - padding.bottom + 20}
            textAnchor="middle"
            className={styles.chartAxisLabel}
          >
            {d.month}
          </text>
        ))}
      </svg>
    )
  }

  const renderConcurrentUserBarChart = () => {
    const barData = currentUserData.barData
    const months = allMonths
    const monthCount = barData.length
    const width = 600
    const height = 200
    const padding = { top: 15, right: 35, bottom: 40, left: 15 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom
    const maxVal = 30
    const barWidth = chartWidth / monthCount * 0.55
    const gap = chartWidth / monthCount

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className={styles.miniChart} preserveAspectRatio="xMidYMid meet">
        {[0, 6, 12, 18, 24, 30].map((val, i) => (
          <line
            key={i}
            x1={padding.left}
            y1={padding.top + chartHeight - (val / maxVal) * chartHeight}
            x2={padding.left + chartWidth}
            y2={padding.top + chartHeight - (val / maxVal) * chartHeight}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}
        {barData.map((val, i) => {
          const barHeight = (val / maxVal) * chartHeight
          const x = padding.left + i * gap + (gap - barWidth) / 2
          const y = padding.top + chartHeight - barHeight
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill="#22c55e"
              rx="4"
            />
          )
        })}
        {months.map((m, i) => (
          <text
            key={i}
            x={padding.left + (i + 0.5) * gap}
            y={height - 12}
            textAnchor="middle"
            className={styles.chartAxisLabel}
          >
            {m}
          </text>
        ))}
        <text x={width - 8} y={padding.top + chartHeight + 14} textAnchor="end" className={styles.chartAxisLabel}>0</text>
        <text x={width - 8} y={padding.top + chartHeight - (6 / maxVal) * chartHeight + 4} textAnchor="end" className={styles.chartAxisLabel}>6</text>
        <text x={width - 8} y={padding.top + chartHeight - (12 / maxVal) * chartHeight + 4} textAnchor="end" className={styles.chartAxisLabel}>12</text>
        <text x={width - 8} y={padding.top + chartHeight - (18 / maxVal) * chartHeight + 4} textAnchor="end" className={styles.chartAxisLabel}>18</text>
        <text x={width - 8} y={padding.top + chartHeight - (24 / maxVal) * chartHeight + 4} textAnchor="end" className={styles.chartAxisLabel}>24</text>
        <text x={width - 8} y={padding.top + 4} textAnchor="end" className={styles.chartAxisLabel}>30</text>
      </svg>
    )
  }

  const renderEgressLineChart = () => {
    const monthCount = egressChartData.length
    const width = 600
    const height = 200
    const padding = { top: 15, right: 35, bottom: 40, left: 15 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom
    const maxVal = 100
    const minVal = 20
    const range = maxVal - minVal

    const points = egressChartData.map((d, i) => {
      const x = padding.left + (i / (monthCount - 1)) * chartWidth
      const y = padding.top + chartHeight - ((d.value - minVal) / range) * chartHeight
      return { x, y, value: d.value }
    })

    const linePath = points.map((p, i) => (i === 0 ? 'M' : 'L') + ` ${p.x} ${p.y}`).join(' ')
    const monthGap = chartWidth / (monthCount - 1)

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className={styles.miniChart} preserveAspectRatio="xMidYMid meet">
        {[20, 40, 60, 80, 100].map((val, i) => (
          <line
            key={i}
            x1={padding.left}
            y1={padding.top + chartHeight - ((val - minVal) / range) * chartHeight}
            x2={padding.left + chartWidth}
            y2={padding.top + chartHeight - ((val - minVal) / range) * chartHeight}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}
        <path d={linePath} fill="none" stroke="#9333ea" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#ffffff" stroke="#9333ea" strokeWidth="2" />
        ))}
        {egressChartData.map((d, i) => (
          <text
            key={i}
            x={padding.left + i * monthGap}
            y={height - 12}
            textAnchor="middle"
            className={styles.chartAxisLabel}
          >
            {d.month}
          </text>
        ))}
        <text x={width - 8} y={padding.top + 4} textAnchor="end" className={styles.chartAxisLabel}>100</text>
        <text x={width - 8} y={padding.top + chartHeight * 0.25 + 4} textAnchor="end" className={styles.chartAxisLabel}>80</text>
        <text x={width - 8} y={padding.top + chartHeight * 0.5 + 4} textAnchor="end" className={styles.chartAxisLabel}>60</text>
        <text x={width - 8} y={padding.top + chartHeight * 0.75 + 4} textAnchor="end" className={styles.chartAxisLabel}>40</text>
        <text x={width - 8} y={padding.top + chartHeight + 14} textAnchor="end" className={styles.chartAxisLabel}>20</text>
        <text x={width - 12} y={height - 12} textAnchor="middle" className={styles.chartAxisArrow}>›</text>
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
                <h2 className={styles.pageTitle}>Cost Efficiency</h2>
                <span className={styles.titlePill}>Cost and Unit Economics</span>
              </div>
              <div className={styles.dottedLine}></div>
              <p className={styles.pageDescription}>
                Where is our cost coming from, and how efficiently is it scaling with usage?
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

          <div className={styles.costMetricsCard}>
            <div className={styles.costMetricsHeader}>
              <div className={styles.costMetricsTabs}>
                {costTabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`${styles.costTab} ${activeCostTab === tab.id ? styles.costTabActive : ''}`}
                    onClick={() => setActiveCostTab(tab.id)}
                  >
                    <span className={styles.costTabLabel}>{tab.label}</span>
                    <span className={`${styles.costTabValue} ${activeCostTab === tab.id ? styles.costTabValueActive : ''}`}>
                      {activeCostTab === tab.id ? tab.activeValue : tab.inactiveValue}
                    </span>
                  </button>
                ))}
              </div>
              <button className={styles.refreshButton} aria-label="Refresh">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 4v6h-6M1 20v-6h6" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
              </button>
            </div>
            <div className={styles.costChartContainer}>
              {renderCostChart()}
            </div>
          </div>

          <div className={styles.metricsCardsRow}>
            <div className={styles.metricCard}>
              <div className={styles.metricCardHeader}>
                <div className={styles.metricCardTitleWrap}>
                  <span className={styles.metricCardLabel}>Users</span>
                  <div className={styles.metricCardTitleRow}>
                    <span className={styles.metricCardTitleText}>Cost Per </span>
                    <div className={styles.inlineDropdown} ref={userDropdownRef}>
                      <button
                        className={styles.inlineDropdownTrigger}
                        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      >
                        {userTypeOptions.find((o) => o.id === userType)?.label || 'All users'}
                        <span className={styles.inlineDropdownChevron}>▼</span>
                      </button>
                      {isUserDropdownOpen && (
                        <div className={styles.inlineDropdownMenu}>
                          {userTypeOptions.map((opt) => (
                            <div
                              key={opt.id}
                              className={`${styles.inlineDropdownItem} ${userType === opt.id ? styles.inlineDropdownItemActive : ''}`}
                              onClick={() => {
                                setUserType(opt.id)
                                setIsUserDropdownOpen(false)
                              }}
                            >
                              {opt.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className={styles.metricCardTitleText}> Concurrent User</span>
                  </div>
                </div>
                <button className={styles.refreshButton} aria-label="Refresh">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 4v6h-6M1 20v-6h6" />
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                  </svg>
                </button>
              </div>
              <div className={styles.metricCardValue}>{currentUserData.value}</div>
              <div className={styles.metricCardTimeframe}>Past 7 Days</div>
              <div className={styles.metricChartWrap}>
                {renderConcurrentUserBarChart()}
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricCardHeader}>
                <h3 className={styles.metricCardTitle}>Egress GB per Minute</h3>
                <button className={styles.refreshButton} aria-label="Refresh">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 4v6h-6M1 20v-6h6" />
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                  </svg>
                </button>
              </div>
              <div className={styles.metricCardValue}>{currentData.egressValue}</div>
              <div className={styles.metricCardTimeframe}>Past 7 Days</div>
              <div className={styles.metricChartWrap}>
                {renderEgressLineChart()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CostEfficiency
