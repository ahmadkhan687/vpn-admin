'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { PieChart } from '@mui/x-charts/PieChart'
import Sidebar from '@/components/sidebar/Sidebar'
import RealtimeReportSidebar from '@/components/realtime-report-sidebar/RealtimeReportSidebar'
import DateRangePicker from '@/components/date-range-picker/DateRangePicker'
import Header from '@/components/header/Header'
import { fetchAcquisitionUsers } from './acquisitionApi'
import {
  getUserTypeData,
  getDeviceDataByUserType,
  getSubscriptionData,
  getMonitoredUsersByType,
  getAllUsersTableByType,
} from './acquisitionUtils'
import styles from './acquisition.module.css'

const GROWTH_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
const SUBSCRIPTION_BAR_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const Acquisition = () => {
  const [selectedVPN, setSelectedVPN] = useState('Portfolio')
  const [dateRange, setDateRange] = useState({
    startDate: new Date(2025, 11, 19),
    endDate: new Date(2026, 0, 15),
  })
  const [activeMetricTab, setActiveMetricTab] = useState('newUsers')
  const [userType, setUserType] = useState('all')
  const [isUserTypeDropdownOpen, setIsUserTypeDropdownOpen] = useState(false)
  const [subscriptionUserType, setSubscriptionUserType] = useState('all')
  const [isSubscriptionDropdownOpen, setIsSubscriptionDropdownOpen] = useState(false)
  const [monitoredUserType, setMonitoredUserType] = useState('all')
  const [isMonitoredDropdownOpen, setIsMonitoredDropdownOpen] = useState(false)
  const [allUsersTableType, setAllUsersTableType] = useState('all')
  const [isAllUsersDropdownOpen, setIsAllUsersDropdownOpen] = useState(false)
  const [isDeviceDropdownOpen, setIsDeviceDropdownOpen] = useState(false)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const userTypeDropdownRef = useRef(null)
  const subscriptionDropdownRef = useRef(null)
  const monitoredDropdownRef = useRef(null)
  const allUsersDropdownRef = useRef(null)
  const deviceDropdownRef = useRef(null)

  // Fetch users from API (real-time data) - main array of users with details
  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchAcquisitionUsers({
      vpn: selectedVPN,
      startDate: dateRange?.startDate,
      endDate: dateRange?.endDate,
    })
      .then(({ users: fetchedUsers }) => setUsers(fetchedUsers || []))
      .catch((err) => setError(err?.message || 'Failed to load acquisition data'))
      .finally(() => setLoading(false))
  }, [selectedVPN, dateRange?.startDate?.getTime?.(), dateRange?.endDate?.getTime?.()])

  // Derive display data from users array (each user has full details)
  const userTypeData = useMemo(() => getUserTypeData(users), [users])
  const deviceDataByUserType = useMemo(() => getDeviceDataByUserType(users), [users])
  const subscriptionData = useMemo(() => getSubscriptionData(users), [users])
  const monitoredUsersDataByType = useMemo(() => getMonitoredUsersByType(users), [users])
  const allUsersTableDataByType = useMemo(() => getAllUsersTableByType(users), [users])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userTypeDropdownRef.current && !userTypeDropdownRef.current.contains(event.target)) {
        setIsUserTypeDropdownOpen(false)
      }
      if (subscriptionDropdownRef.current && !subscriptionDropdownRef.current.contains(event.target)) {
        setIsSubscriptionDropdownOpen(false)
      }
      if (monitoredDropdownRef.current && !monitoredDropdownRef.current.contains(event.target)) {
        setIsMonitoredDropdownOpen(false)
      }
      if (allUsersDropdownRef.current && !allUsersDropdownRef.current.contains(event.target)) {
        setIsAllUsersDropdownOpen(false)
      }
      if (deviceDropdownRef.current && !deviceDropdownRef.current.contains(event.target)) {
        setIsDeviceDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isUserTypeDropdownOpen, isSubscriptionDropdownOpen, isMonitoredDropdownOpen, isAllUsersDropdownOpen, isDeviceDropdownOpen])

  const scopeOptions = [
    'Portfolio',
    'Steer Lucid',
    'Crest',
    'Slick',
    'Fortivo',
    'Qucik',
    'Nexipher',
  ]

  const handleVPNChange = (vpn) => setSelectedVPN(vpn)

  // Left side (growth card): always total / all users
  const leftSideData = userTypeData.all
  const trendData = activeMetricTab === 'newUsers' ? leftSideData.newUsersTrend : leftSideData.frequentUsersTrend
  // Right side (Users Based on Devices): depends on user type dropdown
  const currentDeviceData = deviceDataByUserType[userType] || deviceDataByUserType.all
  // Users Per Subscription section (below): depends on subscriptionUserType dropdown
  const currentSubscriptionData = subscriptionData[subscriptionUserType] || subscriptionData.all
  // Monitored Users section: depends on monitoredUserType dropdown
  const currentMonitoredUsers = monitoredUsersDataByType[monitoredUserType] || monitoredUsersDataByType.all
  // All Users table section: depends on allUsersTableType dropdown
  const currentAllUsersTable = allUsersTableDataByType[allUsersTableType] || allUsersTableDataByType.all
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

  const renderSubscriptionBarChart = () => {
    const barData = currentSubscriptionData.barData
    const barWidth = Math.max(600, barData.length * 48)
    const barHeight = 180
    const pad = { top: 16, right: 24, bottom: 36, left: 24 }
    const innerW = barWidth - pad.left - pad.right
    const innerH = barHeight - pad.top - pad.bottom
    const barMax = 30
    const barGap = innerW / (barData.length + 1)
    const barThickness = Math.min(barGap * 0.5, 36)

    return (
      <svg viewBox={`0 0 ${barWidth} ${barHeight}`} className={styles.subscriptionBarChart} preserveAspectRatio="xMidYMid meet">
        {[6, 12, 18, 24, 30].map((val, i) => (
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
        {barData.map((val, i) => {
          const x = pad.left + (i + 1) * barGap - barThickness / 2
          const h = (val / barMax) * innerH
          const y = pad.top + innerH - h
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={barThickness}
              height={h}
              fill="#9333ea"
              rx="4"
              ry="4"
            />
          )
        })}
        {SUBSCRIPTION_BAR_MONTHS.map((m, i) => (
          <text
            key={m}
            x={pad.left + (i + 1) * barGap}
            y={barHeight - 10}
            textAnchor="middle"
            className={styles.subscriptionBarAxisLabel}
          >
            {m}
          </text>
        ))}
        <text x={barWidth - 8} y={pad.top + innerH + 14} textAnchor="end" className={styles.subscriptionBarAxisLabel}>0</text>
        <text x={barWidth - 8} y={pad.top + innerH - (6 / barMax) * innerH + 4} textAnchor="end" className={styles.subscriptionBarAxisLabel}>6</text>
        <text x={barWidth - 8} y={pad.top + innerH - (12 / barMax) * innerH + 4} textAnchor="end" className={styles.subscriptionBarAxisLabel}>12</text>
        <text x={barWidth - 8} y={pad.top + innerH - (18 / barMax) * innerH + 4} textAnchor="end" className={styles.subscriptionBarAxisLabel}>18</text>
        <text x={barWidth - 8} y={pad.top + innerH - (24 / barMax) * innerH + 4} textAnchor="end" className={styles.subscriptionBarAxisLabel}>24</text>
        <text x={barWidth - 8} y={pad.top + 4} textAnchor="end" className={styles.subscriptionBarAxisLabel}>30</text>
      </svg>
    )
  }

  if (loading) {
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
          <div className={styles.content} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
            <div className={styles.loadingSpinner} aria-hidden="true" />
            <span style={{ marginLeft: 12 }}>Loading acquisition data…</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
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
          <div className={styles.content} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, color: '#b91c1c', flexDirection: 'column', gap: 8 }}>
            <span>{error}</span>
          </div>
        </div>
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
                <h2 className={styles.pageTitle}>Acquisition</h2>
                <span className={styles.titlePillGreen}>Growth and Product Performance</span>
              </div>
              <div className={styles.dottedLine}></div>
              <p className={styles.pageDescription}>
                How fast are users and devices growing, where is that growth coming from, and is it happening efficiently?
              </p>
            </div>
            <div className={styles.pageHeaderRight}>
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
                presets={['Last 7 days', 'Last 14 days', 'Last 28 days', 'Last 90 days']}
              />
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

          <div className={styles.cardsRow}>
            <div className={styles.subscriptionCard}>
              <div className={styles.subscriptionHeader}>
                <div className={styles.subscriptionHeaderLeft}>
                  <div>
                    <span className={styles.subscriptionLabel}>Users</span>
                    <h3 className={styles.subscriptionTitle}>Users Per Subscription</h3>
                  </div>
                  <div className={styles.subscriptionDropdownWrap} ref={subscriptionDropdownRef}>
                    <button
                      type="button"
                      className={styles.subscriptionDropdownTrigger}
                      onClick={() => setIsSubscriptionDropdownOpen(!isSubscriptionDropdownOpen)}
                    >
                      <span>
                        {subscriptionUserType === 'all' && 'All users'}
                        {subscriptionUserType === 'free' && 'Free users'}
                        {subscriptionUserType === 'paid' && 'Paid users'}
                        {subscriptionUserType === 'trial' && 'Trial users'}
                      </span>
                      <span className={styles.subscriptionDropdownArrow}>{isSubscriptionDropdownOpen ? '▲' : '▼'}</span>
                    </button>
                    {isSubscriptionDropdownOpen && (
                      <div className={styles.subscriptionDropdown}>
                        {[
                          { id: 'all', label: 'All users' },
                          { id: 'free', label: 'Free users' },
                          { id: 'paid', label: 'Paid users' },
                          { id: 'trial', label: 'Trial users' },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            className={styles.subscriptionDropdownOption}
                            onClick={() => {
                              setSubscriptionUserType(opt.id)
                              setIsSubscriptionDropdownOpen(false)
                            }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <button className={styles.subscriptionRefreshBtn} aria-label="Refresh">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 4v6h-6M1 20v-6h6" />
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                  </svg>
                </button>
              </div>
              <div className={styles.subscriptionMetric}>
                <span className={styles.subscriptionUsersCount}>{currentSubscriptionData.users} Users</span>
                <span className={styles.subscriptionPeriod}>Past 7 Days</span>
              </div>
              <div className={styles.subscriptionChartWrap}>
                <div style={{ minWidth: Math.max(600, currentSubscriptionData.barData.length * 48) }}>
                  {renderSubscriptionBarChart()}
                </div>
              </div>
            </div>

            <div className={styles.monitoredCard}>
              <div className={styles.monitoredHeader}>
                <div className={styles.monitoredHeaderLeft}>
                  <h3 className={styles.monitoredTitle}>Monitored Users</h3>
                  <div className={styles.monitoredDropdownWrap} ref={monitoredDropdownRef}>
                    <button
                      type="button"
                      className={styles.monitoredDropdownTrigger}
                      onClick={() => setIsMonitoredDropdownOpen(!isMonitoredDropdownOpen)}
                      aria-label="Filter by user type"
                    >
                      <span className={styles.monitoredDropdownArrow}>{isMonitoredDropdownOpen ? '▲' : '▼'}</span>
                    </button>
                    {isMonitoredDropdownOpen && (
                      <div className={styles.monitoredDropdown}>
                        {[
                          { id: 'all', label: 'All users' },
                          { id: 'free', label: 'Free users' },
                          { id: 'paid', label: 'Paid users' },
                          { id: 'trial', label: 'Trial users' },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            className={styles.monitoredDropdownOption}
                            onClick={() => {
                              setMonitoredUserType(opt.id)
                              setIsMonitoredDropdownOpen(false)
                            }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <button className={styles.monitoredFilterBtn} aria-label="Filter">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                </button>
              </div>
              <div className={styles.monitoredTableWrap}>
                <table className={styles.monitoredTable}>
                  <thead>
                    <tr>
                      <th className={styles.monitoredThLeft}>User Name</th>
                      <th className={styles.monitoredThCenter}>Status</th>
                      <th className={styles.monitoredThRight}>Last Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMonitoredUsers.map((row, i) => (
                      <tr key={i}>
                        <td className={styles.monitoredTdLeft}>{row.name}</td>
                        <td className={styles.monitoredTdCenter}>{row.status}</td>
                        <td className={styles.monitoredTdRight}>{row.lastActive}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Link href="/acquisition/all-users" className={styles.monitoredViewAll}>
                View All Monitored Users
                <span className={styles.monitoredViewAllArrow}>›</span>
              </Link>
            </div>
          </div>

          <div className={styles.allUsersSection}>
            <div className={styles.allUsersHeader}>
              <div className={styles.allUsersDropdownWrap} ref={allUsersDropdownRef}>
                <button
                  type="button"
                  className={styles.allUsersTitleBtn}
                  onClick={() => setIsAllUsersDropdownOpen(!isAllUsersDropdownOpen)}
                >
                  <span className={styles.allUsersTitleLabel}>
                    {allUsersTableType === 'all' && 'All Users'}
                    {allUsersTableType === 'free' && 'Free Users'}
                    {allUsersTableType === 'paid' && 'Paid Users'}
                    {allUsersTableType === 'trial' && 'Trial Users'}
                  </span>
                  <span className={styles.allUsersTitleArrow}>{isAllUsersDropdownOpen ? '▲' : '▼'}</span>
                </button>
                {isAllUsersDropdownOpen && (
                  <div className={styles.allUsersDropdown}>
                    {[
                      { id: 'all', label: 'All users' },
                      { id: 'free', label: 'Free users' },
                      { id: 'paid', label: 'Paid users' },
                      { id: 'trial', label: 'Trial users' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        className={styles.allUsersDropdownOption}
                        onClick={() => {
                          setAllUsersTableType(opt.id)
                          setIsAllUsersDropdownOpen(false)
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className={styles.allUsersTableWrap}>
              <table className={styles.allUsersTable}>
                <thead>
                  <tr>
                    <th className={styles.allUsersTh}>User Name</th>
                    <th className={styles.allUsersTh}>Status</th>
                    <th className={styles.allUsersTh}>Email</th>
                    <th className={styles.allUsersTh}>Device</th>
                    <th className={styles.allUsersTh}>Last Active</th>
                    <th className={styles.allUsersTh}>View Profile</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAllUsersTable.map((row, i) => (
                    <tr key={i}>
                      <td className={styles.allUsersTd}>{row.name}</td>
                      <td className={styles.allUsersTd}>{row.status}</td>
                      <td className={styles.allUsersTd}>{row.email}</td>
                      <td className={styles.allUsersTd}>{row.device}</td>
                      <td className={styles.allUsersTd}>{row.lastActive}</td>
                      <td className={styles.allUsersTd}>
                        <Link
                          href={`/acquisition/profile/${row.id != null ? row.id : encodeURIComponent(row.name)}?name=${encodeURIComponent(row.name)}&email=${encodeURIComponent(row.email)}&device=${encodeURIComponent(row.device)}&country=${encodeURIComponent(row.country || '—')}&status=${encodeURIComponent(row.status)}`}
                          className={styles.profileHistoryBtn}
                        >
                          Profile/History
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.allUsersFooter}>
              <Link href="/acquisition/all-users" className={styles.allUsersViewAll}>
                View All Users
                <span className={styles.allUsersViewAllArrow}>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Acquisition
