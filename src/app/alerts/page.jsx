'use client'

import React, { useState, useEffect } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import Header from '@/components/header/Header'
import DateRangePicker from '@/components/date-range-picker/DateRangePicker'
import { alertsByVPN, mostAffectedAreaByVPN } from './alertsData'
import styles from './alerts.module.css'

const scopeOptions = [
  'Portfolio',
  'Steer Lucid',
  'Crest',
  'Slick',
  'Fortivo',
  'Qucik',
  'Nexipher',
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const expandTo12Months = (arr) => {
  if (!arr?.length) return []
  if (arr.length >= 12) return arr.slice(0, 12)
  const out = []
  for (let i = 0; i < 12; i++) {
    const t = i / 11
    const idx = t * (arr.length - 1)
    const lo = Math.floor(idx)
    const hi = Math.min(lo + 1, arr.length - 1)
    const f = idx - lo
    out.push(arr[lo] + f * (arr[hi] - arr[lo]))
  }
  return out
}

const Alerts = () => {
  const [selectedVPN, setSelectedVPN] = useState('Portfolio')
  const [filterTab, setFilterTab] = useState('all') // 'all' | 'critical'
  const vpnAlerts = alertsByVPN[selectedVPN] || alertsByVPN.Portfolio
  const [selectedAlert, setSelectedAlert] = useState(vpnAlerts[0] || null)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(2025, 11, 19),
    endDate: new Date(2026, 0, 15),
  })
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const alerts = alertsByVPN[selectedVPN] || alertsByVPN.Portfolio
    setSelectedAlert(alerts[0] || null)
    setCurrentPage(1)
  }, [selectedVPN])

  const [chartMonthStart, setChartMonthStart] = useState(0) // 0-7, show 5 months at a time
  const itemsPerPage = 7

  const filteredAlerts =
    filterTab === 'critical'
      ? vpnAlerts.filter((a) => a.severity === 'Critical')
      : vpnAlerts

  const totalPages = Math.max(1, Math.ceil(filteredAlerts.length / itemsPerPage))
  const safePage = Math.min(currentPage, totalPages)
  const paginatedAlertsSafe = filteredAlerts.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  )

  const criticalCount = vpnAlerts.filter((a) => a.severity === 'Critical').length
  const warningCount = vpnAlerts.filter((a) => a.severity === 'Warning').length
  const infoCount = vpnAlerts.filter((a) => a.severity === 'Informational').length
  const activeCount = vpnAlerts.length

  const mostAffectedArea = mostAffectedAreaByVPN[selectedVPN] || mostAffectedAreaByVPN.Portfolio

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'Critical':
        return styles.severityCritical
      case 'Warning':
        return styles.severityWarning
      case 'Informational':
        return styles.severityInfo
      default:
        return ''
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'Open':
        return styles.statusOpen
      case 'Acknowledged':
        return styles.statusAcknowledged
      case 'Resolved':
        return styles.statusResolved
      default:
        return ''
    }
  }

  // Chart - 5 months visible, arrows scroll month window, Y-axis 0-100
  const monthsVisible = 5
  const maxMonthStart = 12 - monthsVisible
  const chartWidth = 280
  const chartHeight = 120
  const rawChartData = expandTo12Months(selectedAlert?.chartData || [])
  const chartData = rawChartData.slice(chartMonthStart, chartMonthStart + monthsVisible)
  const chartLabels = MONTHS.slice(chartMonthStart, chartMonthStart + monthsVisible)
  const maxVal = Math.max(...rawChartData, 1)
  const minVal = Math.min(...rawChartData, 0)
  const range = maxVal - minVal || 1
  const isReconnectChart = selectedAlert?.alertName === 'Reconnect Frequency'
  const yScale = 100 // Y-axis 0 to 100
  const pad = { top: 10, right: 10, bottom: 24, left: 36 }
  const innerW = chartWidth - pad.left - pad.right
  const innerH = chartHeight - pad.top - pad.bottom
  const points = chartData.map((val, i) => {
    const x = pad.left + (i / (chartData.length - 1 || 1)) * innerW
    const norm = isReconnectChart ? Math.min(val / yScale, 1) : (val - minVal) / range
    const y = pad.top + innerH - norm * innerH
    return { x, y, val }
  })
  const linePath = points.map((p, i) => (i === 0 ? 'M' : 'L') + ` ${p.x} ${p.y}`).join(' ')
  const monthRangeLabel = `${chartLabels[0]} - ${chartLabels[chartLabels.length - 1]}`

  return (
    <div className={styles.alertsContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Header
          dropdownOptions={scopeOptions}
          defaultValue={selectedVPN}
          onValueChange={setSelectedVPN}
        />
        <div className={styles.content}>
          {/* Top bar: Alerts + Last Updated left, Date range right */}
          <div className={styles.topBar}>
            <div className={styles.topBarLeft}>
              <h2 className={styles.pageTitle}>Alerts</h2>
              <div className={styles.lastUpdated}>
                <span className={styles.refreshIcon}>↻</span>
                <span>Last Updated Now</span>
              </div>
            </div>
            <div className={styles.dateRangeWrapper}>
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
                presets={['Last 7 days', 'Last 14 days', 'Last 28 days', 'Last 90 days']}
              />
            </div>
          </div>

          <div className={styles.twoColumnLayout}>
            {/* Left column - Alerts list */}
            <div className={styles.leftColumn}>
              {/* Summary row: 17 Active Alerts + severity pills | Most affected area card */}
              <div className={styles.summaryRow}>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryLeft}>
                    <span className={styles.summaryNumber}>{activeCount}</span>
                    <span className={styles.summaryLabel}>Active Alerts</span>
                  </div>
                  <div className={styles.summarySeparator} />
                  <div className={styles.severityBadges}>
                    <span className={styles.badgeCritical}>{criticalCount} Critical</span>
                    <span className={styles.badgeWarning}>{warningCount} Warning</span>
                    <span className={styles.badgeInfo}>{infoCount} Informational</span>
                  </div>
                </div>
                <div className={styles.affectedCard}>
                  <div className={styles.affectedLabel}>Most affected area:</div>
                  <span className={styles.affectedTextDotted}>{mostAffectedArea.label}</span>
                  <div className={styles.affectedPillWrap}>
                    <span className={styles.affectedPill}>{mostAffectedArea.percentage}</span>
                  </div>
                </div>
              </div>

              {/* Filter tabs */}
              <div className={styles.filterTabs}>
                <button
                  className={`${styles.filterTab} ${filterTab === 'all' ? styles.filterTabActive : ''}`}
                  onClick={() => setFilterTab('all')}
                >
                  All
                </button>
                <button
                  className={`${styles.filterTab} ${filterTab === 'critical' ? styles.filterTabActive : ''}`}
                  onClick={() => setFilterTab('critical')}
                >
                  <img src="/icons/Alert triangle.png" alt="" width="14" height="14" />
                  Critical
                </button>
              </div>

              {/* Table */}
              <div className={styles.tableCard}>
                <table className={styles.alertsTable}>
                  <thead>
                    <tr>
                      <th>Severity <span className={styles.sortArrow}>▼</span></th>
                      <th>Alert <span className={styles.sortArrow}>▼</span></th>
                      <th>Category <span className={styles.sortArrow}>▼</span></th>
                      <th>Metric Breached <span className={styles.sortArrow}>▼</span></th>
                      <th>First Breached <span className={styles.sortArrow}>▼</span></th>
                      <th>Status <span className={styles.sortArrow}>▼</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAlertsSafe.map((alert) => (
                      <tr
                        key={alert.id}
                        className={`${styles.tableRow} ${
                          selectedAlert?.id === alert.id ? styles.tableRowSelected : ''
                        }`}
                        onClick={() => setSelectedAlert(alert)}
                      >
                        <td>
                          <span
                            className={`${styles.severityBadge} ${getSeverityClass(alert.severity)}`}
                          >
                            {typeof alert.severityCount === 'string'
                              ? alert.severityCount
                              : `${alert.severityCount} ${alert.severity}`}
                          </span>
                        </td>
                        <td>
                          <div className={styles.alertCell}>
                            <span className={styles.alertName}>{alert.alertName}</span>
                            <span className={styles.alertRegion}>{alert.alertRegion}</span>
                          </div>
                        </td>
                        <td>
                          <div className={styles.categoryCell}>
                            <span className={styles.categoryMain}>{alert.category}</span>
                            {(alert.categorySub || alert.alertRegion) && (
                              <span className={styles.categorySub}>
                                {alert.categorySub || alert.alertRegion}
                              </span>
                            )}
                          </div>
                        </td>
                        <td>{alert.metricBreached}</td>
                        <td>{alert.firstBreached}</td>
                        <td>
                          <span
                            className={`${styles.statusBadge} ${getStatusClass(alert.status)} ${
                              alert.severity === 'Informational' && alert.status === 'Open'
                                ? styles.statusOpenInfo
                                : ''
                            }`}
                          >
                            {alert.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className={styles.pagination}>
                  <span className={styles.paginationLabel}>
                    Page {safePage}-{totalPages}
                  </span>
                  <div className={styles.paginationButtons}>
                    <button
                      className={styles.paginationBtn}
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    >
                      ‹‹
                    </button>
                    <button
                      className={styles.paginationBtn}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      ‹
                    </button>
                    <button
                      className={styles.paginationBtn}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      ›
                    </button>
                    <button
                      className={styles.paginationBtn}
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      ››
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Details panel */}
            <div className={styles.rightColumn}>
              {/* Selected alert details */}
              {selectedAlert && (
                <div className={styles.detailCard}>
                  <div className={styles.detailHeader}>
                    <img src="/icons/Alert triangle.png" alt="" className={styles.detailIcon} width="20" height="20" />
                    <h3 className={styles.detailTitle}>
                      {selectedAlert.alertName} Spike
                    </h3>
                  </div>
                  <div className={styles.detailBadgeRow}>
                    <span
                      className={`${styles.detailBadgeCircle} ${
                        selectedAlert.severity === 'Critical'
                          ? styles.detailBadgeCircleRed
                          : selectedAlert.severity === 'Warning'
                            ? styles.detailBadgeCircleYellow
                            : styles.detailBadgeCircleBlue
                      }`}
                    />
                    <span className={`${styles.detailBadgeSeverity} ${selectedAlert.severity === 'Critical' ? styles.detailBadgeRed : selectedAlert.severity === 'Warning' ? styles.detailBadgeYellow : styles.detailBadgeBlue}`}>
                      {selectedAlert.severity}
                    </span>
                    <span className={styles.detailBadgeSeparator} />
                    <span className={styles.detailBadgeCategory}>{selectedAlert.detailCategory}</span>
                  </div>
                  <p className={styles.detailDescription}>{selectedAlert.description}</p>

                  {/* Chart */}
                  <div className={styles.chartWrap}>
                    <div className={styles.chartHeader}>
                      <button
                        type="button"
                        className={styles.chartNavBtn}
                        onClick={() => setChartMonthStart((s) => Math.max(0, s - 1))}
                        disabled={chartMonthStart === 0}
                        aria-label="Previous months"
                      >
                        ‹
                      </button>
                      <span className={styles.chartYearLabel}>{monthRangeLabel}</span>
                      <button
                        type="button"
                        className={styles.chartNavBtn}
                        onClick={() => setChartMonthStart((s) => Math.min(maxMonthStart, s + 1))}
                        disabled={chartMonthStart >= maxMonthStart}
                        aria-label="Next months"
                      >
                        ›
                      </button>
                    </div>
                    <svg
                      width={chartWidth}
                      height={chartHeight}
                      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                      className={styles.chartSvg}
                    >
                      {/* Grid lines */}
                      {[0.25, 0.5, 0.75].map((pct, i) => {
                        const y = pad.top + innerH - pct * innerH
                        return (
                          <line
                            key={i}
                            x1={pad.left}
                            y1={y}
                            x2={pad.left + innerW}
                            y2={y}
                            stroke="#e5e7eb"
                            strokeWidth="1"
                          />
                        )
                      })}
                      <path
                        d={linePath}
                        fill="none"
                        stroke="#dc2626"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {points.map((p, i) => (
                        <circle
                          key={i}
                          cx={p.x}
                          cy={p.y}
                          r="3"
                          fill="#fff"
                          stroke="#dc2626"
                          strokeWidth="2"
                        />
                      ))}
                      {chartLabels.map((l, i) => (
                        <text
                          key={i}
                          x={pad.left + (i / (chartLabels.length - 1 || 1)) * innerW}
                          y={chartHeight - 6}
                          textAnchor="middle"
                          className={styles.chartMonthLabel}
                        >
                          {l}
                        </text>
                      ))}
                      {[0, 20, 40, 60, 80, 100].map((yVal) => (
                        <text
                          key={yVal}
                          x={8}
                          y={pad.top + innerH - (yVal / 100) * innerH + 4}
                          textAnchor="start"
                          className={styles.chartLabel}
                        >
                          {yVal}
                        </text>
                      ))}
                    </svg>
                  </div>

                  <p className={styles.detailDescription}>{selectedAlert.description}</p>

                  {/* Key metrics */}
                  <div className={styles.keyMetrics}>
                    <div className={styles.metricRow}>
                      <span className={styles.metricLabel}>Current Value:</span>
                      <span className={styles.metricValue}>{selectedAlert.currentValue}</span>
                    </div>
                    <div className={styles.metricRow}>
                      <span className={styles.metricLabel}>Threshold:</span>
                      <span className={styles.metricValue}>{selectedAlert.threshold}</span>
                    </div>
                    <div className={styles.metricRow}>
                      <span className={styles.metricLabel}>Affected sessions:</span>
                      <span className={styles.metricValue}>{selectedAlert.affectedSessions}</span>
                    </div>
                    <div className={styles.metricRow}>
                      <span className={styles.metricLabel}>Most impacted region:</span>
                      <span className={styles.metricValue}>
                        {selectedAlert.mostImpactedRegion}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className={styles.actionButtons}>
                    <div className={styles.actionButtonsRow}>
                      <button className={styles.btnPrimary}>Acknowledges</button>
                      <button className={styles.btnSecondary}>View visited metrics</button>
                    </div>
                    <a href={selectedAlert.link} className={styles.btnLinkOutlined}>
                      Go to {selectedAlert.detailCategory} →
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Alerts
