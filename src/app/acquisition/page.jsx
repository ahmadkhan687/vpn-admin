'use client'

import React, { useState, useEffect, useRef } from 'react'
import { PieChart } from '@mui/x-charts/PieChart'
import Sidebar from '@/components/sidebar/Sidebar'
import RealtimeReportSidebar from '@/components/realtime-report-sidebar/RealtimeReportSidebar'
import Header from '@/components/header/Header'
import styles from './acquisition.module.css'

// Many months so the graph scrolls horizontally; values go up and down for a realistic trend
const GROWTH_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

// Per user type: display values (New Users, Frequent Users) and trend data for the graph. "all" = total.
const userTypeData = {
  all: {
    newUsers: 233,
    frequentUsers: 222,
    newUsersTrend: [520, 380, 610, 450, 720, 580, 680, 790, 640, 820, 710, 850],
    frequentUsersTrend: [420, 280, 520, 350, 640, 480, 560, 720, 490, 680, 590, 750],
  },
  free: {
    newUsers: 142,
    frequentUsers: 98,
    newUsersTrend: [320, 220, 380, 280, 420, 350, 400, 480, 380, 520, 440, 550],
    frequentUsersTrend: [280, 180, 320, 220, 380, 290, 350, 420, 340, 450, 380, 480],
  },
  paid: {
    newUsers: 68,
    frequentUsers: 95,
    newUsersTrend: [140, 100, 160, 120, 200, 160, 190, 220, 180, 210, 200, 230],
    frequentUsersTrend: [90, 70, 95, 85, 110, 120, 130, 140, 125, 150, 140, 160],
  },
  trial: {
    newUsers: 23,
    frequentUsers: 29,
    newUsersTrend: [60, 60, 50, 50, 100, 70, 90, 90, 80, 90, 70, 70],
    frequentUsersTrend: [50, 30, 105, 45, 150, 70, 110, 160, 45, 80, 100, 110],
  },
}

// Device breakdown per user type (for right-side "Users Based on Devices" pie only).
const deviceDataByUserType = {
  all: [
    { id: 'Android', value: 38, color: '#9acd32' },
    { id: 'Windows', value: 27, color: '#87ceeb' },
    { id: 'iOS', value: 20, color: '#e07c24' },
    { id: 'Other', value: 10, color: '#b794f6' },
    { id: 'Linux', value: 5, color: '#daa520' },
  ],
  free: [
    { id: 'Android', value: 42, color: '#9acd32' },
    { id: 'Windows', value: 24, color: '#87ceeb' },
    { id: 'iOS', value: 18, color: '#e07c24' },
    { id: 'Other', value: 12, color: '#b794f6' },
    { id: 'Linux', value: 4, color: '#daa520' },
  ],
  paid: [
    { id: 'Android', value: 30, color: '#9acd32' },
    { id: 'Windows', value: 32, color: '#87ceeb' },
    { id: 'iOS', value: 25, color: '#e07c24' },
    { id: 'Other', value: 8, color: '#b794f6' },
    { id: 'Linux', value: 5, color: '#daa520' },
  ],
  trial: [
    { id: 'Android', value: 35, color: '#9acd32' },
    { id: 'iOS', value: 28, color: '#e07c24' },
    { id: 'Windows', value: 22, color: '#87ceeb' },
    { id: 'Other', value: 10, color: '#b794f6' },
    { id: 'Linux', value: 5, color: '#daa520' },
  ],
}

const Acquisition = () => {
  const [selectedVPN, setSelectedVPN] = useState('Portfolio')
  const [dateRange, setDateRange] = useState('Last 28 days')
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false)
  const [activeMetricTab, setActiveMetricTab] = useState('newUsers')
  const [userType, setUserType] = useState('all')
  const [isUserTypeDropdownOpen, setIsUserTypeDropdownOpen] = useState(false)
  const [isDeviceDropdownOpen, setIsDeviceDropdownOpen] = useState(false)
  const dateDropdownRef = useRef(null)
  const userTypeDropdownRef = useRef(null)
  const deviceDropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target)) {
        setIsDateDropdownOpen(false)
      }
      if (userTypeDropdownRef.current && !userTypeDropdownRef.current.contains(event.target)) {
        setIsUserTypeDropdownOpen(false)
      }
      if (deviceDropdownRef.current && !deviceDropdownRef.current.contains(event.target)) {
        setIsDeviceDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isDateDropdownOpen, isUserTypeDropdownOpen, isDeviceDropdownOpen])

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

  // Left side (growth card): always total / all users
  const leftSideData = userTypeData.all
  const trendData = activeMetricTab === 'newUsers' ? leftSideData.newUsersTrend : leftSideData.frequentUsersTrend
  // Right side (Users Based on Devices): depends on user type dropdown
  const currentDeviceData = deviceDataByUserType[userType] || deviceDataByUserType.all
  const yAxisMax = 4000
  const chartWidth = Math.max(600, GROWTH_MONTHS.length * 52)
  const chartHeight = 220
  const padding = { top: 20, right: 44, bottom: 36, left: 16 }
  const chartInnerWidth = chartWidth - padding.left - padding.right
  const chartInnerHeight = chartHeight - padding.top - padding.bottom

  const renderGrowthLineChart = () => {
    const points = trendData.map((value, i) => {
      const x = padding.left + (i / (trendData.length - 1)) * chartInnerWidth
      const y = padding.top + chartInnerHeight - (value / yAxisMax) * chartInnerHeight
      return { x, y, value }
    })
    const linePath = points.map((p, i) => (i === 0 ? 'M' : 'L') + ` ${p.x} ${p.y}`).join(' ')
    return (
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className={styles.growthChartSvg}
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
        {GROWTH_MONTHS.map((m, i) => (
          <text
            key={m}
            x={padding.left + (i / (GROWTH_MONTHS.length - 1)) * chartInnerWidth}
            y={chartHeight - 10}
            textAnchor="middle"
            className={styles.growthChartAxisLabel}
          >
            {m}
          </text>
        ))}
        <text x={chartWidth - 8} y={padding.top + chartInnerHeight + 14} textAnchor="end" className={styles.growthChartAxisLabel}>0</text>
        <text x={chartWidth - 8} y={padding.top + chartInnerHeight * 0.75 + 4} textAnchor="end" className={styles.growthChartAxisLabel}>1,000</text>
        <text x={chartWidth - 8} y={padding.top + chartInnerHeight * 0.5 + 4} textAnchor="end" className={styles.growthChartAxisLabel}>2,000</text>
        <text x={chartWidth - 8} y={padding.top + chartInnerHeight * 0.25 + 4} textAnchor="end" className={styles.growthChartAxisLabel}>3,000</text>
        <text x={chartWidth - 8} y={padding.top + 4} textAnchor="end" className={styles.growthChartAxisLabel}>4,000k</text>
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
                <h2 className={styles.pageTitle}>Acquisition</h2>
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

          <div className={styles.cardsRow}>
            <div className={styles.growthCard}>
              <div className={styles.growthMetricTabs}>
                <button
                  type="button"
                  className={`${styles.growthTab} ${activeMetricTab === 'newUsers' ? styles.growthTabActive : ''}`}
                  onClick={() => setActiveMetricTab('newUsers')}
                >
                  <span className={styles.growthTabLabel}>New Users</span>
                  <span className={styles.growthTabValue}>{leftSideData.newUsers}</span>
                </button>
                <button
                  type="button"
                  className={`${styles.growthTab} ${activeMetricTab === 'frequentUsers' ? styles.growthTabActive : ''}`}
                  onClick={() => setActiveMetricTab('frequentUsers')}
                >
                  <span className={styles.growthTabLabel}>Frequent Users</span>
                  <span className={styles.growthTabValue}>{leftSideData.frequentUsers}</span>
                </button>
                <span className={styles.growthTabChevron}>›</span>
              </div>
              <div className={styles.growthChartScrollWrap}>
                <div className={styles.growthChartInner} style={{ minWidth: chartWidth }}>
                  {renderGrowthLineChart()}
                </div>
              </div>
            </div>

            <div className={styles.devicesCard}>
              <div className={styles.devicesCardHeader} ref={deviceDropdownRef}>
                <h3 className={styles.devicesCardTitle}>Users Based on Devices</h3>
                <div className={styles.devicesHeaderRight}>
                  <div className={styles.userTypeDropdownWrap} ref={userTypeDropdownRef}>
                    <button
                      type="button"
                      className={styles.userTypeTrigger}
                      onClick={() => setIsUserTypeDropdownOpen(!isUserTypeDropdownOpen)}
                    >
                      <span className={styles.userTypeTriggerLabel}>
                        {userType === 'all' && 'All users'}
                        {userType === 'free' && 'Free users'}
                        {userType === 'paid' && 'Paid users'}
                        {userType === 'trial' && 'Trial users'}
                      </span>
                      <span className={styles.userTypeTriggerArrow}>{isUserTypeDropdownOpen ? '▲' : '▼'}</span>
                    </button>
                    {isUserTypeDropdownOpen && (
                      <div className={styles.userTypeDropdown}>
                        {[
                          { id: 'all', label: 'All users' },
                          { id: 'free', label: 'Free users' },
                          { id: 'paid', label: 'Paid users' },
                          { id: 'trial', label: 'Trial users' },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            className={styles.userTypeOption}
                            onClick={() => {
                              setUserType(opt.id)
                              setIsUserTypeDropdownOpen(false)
                            }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.devicesPieWrap}>
                <PieChart
                  width={280}
                  height={220}
                  margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                  series={[
                    {
                      innerRadius: 0,
                      outerRadius: 100,
                      paddingAngle: 0,
                      cornerRadius: 0,
                      data: currentDeviceData.map((d) => ({
                        id: d.id,
                        value: d.value,
                        label: d.id,
                        color: d.color,
                      })),
                    },
                  ]}
                  slotProps={{ legend: { hidden: true } }}
                />
              </div>
              <div className={styles.devicesLegend}>
                {currentDeviceData.map((d) => (
                  <div key={d.id} className={styles.devicesLegendItem}>
                    <span className={styles.devicesLegendDot} style={{ backgroundColor: d.color }} />
                    <span className={styles.devicesLegendLabel}>{d.id}:</span>
                    <span className={styles.devicesLegendValue}>{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Acquisition
