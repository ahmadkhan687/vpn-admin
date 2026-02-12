'use client'

import React, { useState } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import Header from '@/components/header/Header'
import { alertsData, mostAffectedArea } from './alertsData'
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

const Alerts = () => {
  const [selectedVPN, setSelectedVPN] = useState('Portfolio')
  const [filterTab, setFilterTab] = useState('all') // 'all' | 'critical'
  const [selectedAlert, setSelectedAlert] = useState(alertsData[0])
  const [dateRange, setDateRange] = useState('Last 28 days')
  const [dateRangeValue, setDateRangeValue] = useState('Dec 19, 2025 - Jan 15, 2026')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7
  const totalPages = 2

  const filteredAlerts =
    filterTab === 'critical'
      ? alertsData.filter((a) => a.severity === 'Critical')
      : alertsData

  const paginatedAlerts = filteredAlerts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const criticalCount = 5
  const warningCount = 5
  const infoCount = 4
  const activeCount = 17

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

  // Chart dimensions for selected alert
  const chartWidth = 280
  const chartHeight = 120
  const chartData = selectedAlert?.chartData || []
  const chartLabels = selectedAlert?.chartLabels || []
  const maxVal = Math.max(...chartData, 1)
  const minVal = Math.min(...chartData, 0)
  const range = maxVal - minVal || 1
  const pad = { top: 10, right: 10, bottom: 24, left: 30 }
  const innerW = chartWidth - pad.left - pad.right
  const innerH = chartHeight - pad.top - pad.bottom
  const points = chartData.map((val, i) => {
    const x = pad.left + (i / (chartData.length - 1 || 1)) * innerW
    const y = pad.top + innerH - ((val - minVal) / range) * innerH
    return { x, y, val }
  })
  const linePath = points.map((p, i) => (i === 0 ? 'M' : 'L') + ` ${p.x} ${p.y}`).join(' ')

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
          <div className={styles.twoColumnLayout}>
            {/* Left column - Alerts list */}
            <div className={styles.leftColumn}>
              <div className={styles.pageHeader}>
                <h2 className={styles.pageTitle}>Alerts</h2>
                <div className={styles.lastUpdated}>
                  <span className={styles.refreshIcon}>↻</span>
                  <span>Last Updated Now</span>
                </div>
              </div>

              {/* Summary card */}
              <div className={styles.summaryCard}>
                <span className={styles.summaryCount}>{activeCount} Active Alerts</span>
                <div className={styles.severityBadges}>
                  <span className={styles.badgeCritical}>{criticalCount} Critical</span>
                  <span className={styles.badgeWarning}>{warningCount} Warning</span>
                  <span className={styles.badgeInfo}>{infoCount} Informational</span>
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
                      <th>Severity</th>
                      <th>Alert</th>
                      <th>Category</th>
                      <th>Metric Breached</th>
                      <th>
                        First Breached <span className={styles.sortArrow}>▼</span>
                      </th>
                      <th>
                        Status <span className={styles.sortArrow}>▼</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAlerts.map((alert) => (
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
                            {alert.severityCount} {alert.severity}
                          </span>
                        </td>
                        <td>
                          <div className={styles.alertCell}>
                            <span className={styles.alertName}>{alert.alertName}</span>
                            <span className={styles.alertRegion}>{alert.alertRegion}</span>
                          </div>
                        </td>
                        <td>{alert.category}</td>
                        <td>{alert.metricBreached}</td>
                        <td>{alert.firstBreached}</td>
                        <td>
                          <span
                            className={`${styles.statusBadge} ${getStatusClass(alert.status)}`}
                          >
                            {alert.status}
                            {alert.status === 'Resolved' && ' ✓'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className={styles.pagination}>
                  <span className={styles.paginationLabel}>
                    Page {currentPage}-{totalPages}
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
              <div className={styles.dateRangeRow}>
                <select
                  className={styles.dateSelect}
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option>Last 28 days</option>
                  <option>Last 7 days</option>
                  <option>Last 14 days</option>
                  <option>Last 90 days</option>
                </select>
                <select
                  className={styles.dateSelect}
                  value={dateRangeValue}
                  onChange={(e) => setDateRangeValue(e.target.value)}
                >
                  <option>Dec 19, 2025 - Jan 15, 2026</option>
                </select>
              </div>

              {/* Most affected area */}
              <div className={styles.affectedCard}>
                <div className={styles.affectedLabel}>Most affected area:</div>
                <div className={styles.affectedContent}>
                  <span className={styles.affectedText}>{mostAffectedArea.label}</span>
                  <span className={styles.affectedPercent}>{mostAffectedArea.percentage}</span>
                </div>
              </div>

              {/* Selected alert details */}
              {selectedAlert && (
                <div className={styles.detailCard}>
                  <div className={styles.detailHeader}>
                    <span className={styles.detailIcon}>📈</span>
                    <h3
                      className={`${styles.detailTitle} ${
                        selectedAlert.severity === 'Critical'
                          ? styles.detailTitleCritical
                          : selectedAlert.severity === 'Warning'
                            ? styles.detailTitleWarning
                            : ''
                      }`}
                    >
                      {selectedAlert.alertName} Spike
                    </h3>
                  </div>
                  <span
                    className={`${styles.detailBadge} ${getSeverityClass(selectedAlert.severity)}`}
                  >
                    {selectedAlert.severity} | {selectedAlert.detailCategory}
                  </span>
                  <p className={styles.detailDescription}>{selectedAlert.description}</p>

                  {/* Chart */}
                  <div className={styles.chartWrap}>
                    <svg
                      width={chartWidth}
                      height={chartHeight}
                      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                      className={styles.chartSvg}
                    >
                      {/* Grid lines */}
                      {[20, 40, 60].map((pct, i) => {
                        const y = pad.top + innerH - (pct / 100) * innerH
                        return (
                          <line
                            key={i}
                            x1={pad.left}
                            y1={y}
                            x2={pad.left + innerW}
                            y2={y}
                            stroke="#f3f4f6"
                            strokeWidth="1"
                          />
                        )
                      })}
                      <path
                        d={linePath}
                        fill="none"
                        stroke="#4f46e5"
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
                          stroke="#4f46e5"
                          strokeWidth="2"
                        />
                      ))}
                      {chartLabels.map((l, i) => (
                        <text
                          key={i}
                          x={pad.left + (i / (chartLabels.length - 1 || 1)) * innerW}
                          y={chartHeight - 6}
                          textAnchor="middle"
                          className={styles.chartLabel}
                        >
                          {l}
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
                    <button className={styles.btnPrimary}>Acknowledges</button>
                    <button className={styles.btnSecondary}>View visited metrics</button>
                    <a href={selectedAlert.link} className={styles.btnLink}>
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
