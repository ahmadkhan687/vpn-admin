'use client'

import React, { useState } from 'react'
import GaugeChart from 'react-gauge-chart'
import Sidebar from '@/components/sidebar/Sidebar'
import Header from '@/components/header/Header'
import styles from './dashboard.module.css'
import { vpnData } from './vpnData'
import { alertsByVPN, alertsToDashboardFormat } from '@/app/alerts/alertsData'

const Dashboard = () => {
  const [expandedCategory, setExpandedCategory] = useState(null)
  const [showAllExpanded, setShowAllExpanded] = useState(false)
  const [selectedVPN, setSelectedVPN] = useState('Portfolio')

  // Define dropdown options for this page
  const scopeOptions = [
    'Portfolio',
    'Steer Lucid',
    'Crest',
    'Slick',
    'Fortivo',
    'Qucik',
    'Nexipher',
  ]

  // Get data for selected VPN - alerts come from shared alertsData (same as Alerts page)
  const currentVPNData = vpnData[selectedVPN] || vpnData['Portfolio']
  const kpiData = currentVPNData.kpiData
  const vpnAlerts = alertsByVPN[selectedVPN] || alertsByVPN.Portfolio
  const alerts = alertsToDashboardFormat(vpnAlerts)
  const categoryCards = currentVPNData.categoryCards
  const healthStatus = {
    ...currentVPNData.healthStatus,
    activeIssues: vpnAlerts.length,
  }

  // Handle VPN selection change from header dropdown
  const handleVPNChange = (vpn) => {
    setSelectedVPN(vpn)
    // Reset expanded states when switching VPNs
    setExpandedCategory(null)
    setShowAllExpanded(false)
  }
  const getIcon = (iconType) => {
    switch (iconType) {
      case 'users':
        return (
          <img src="/icons/users.png" alt="Users icon" width="24" height="24" />
        )
      case 'filter':
        return (
          <img
            src="/icons/Filter.png"
            alt="Filter icon"
            width="24"
            height="24"
          />
        )
      case 'clock':
        return (
          <img src="/icons/Clock.png" alt="Clock icon" width="24" height="24" />
        )
      case 'calendar':
        return (
          <img
            src="/icons/Calendar.png"
            alt="Calendar icon"
            width="24"
            height="24"
          />
        )
      case 'backpack':
        return (
          <img src="/icons/case.png" alt="Case icon" width="24" height="24" />
        )
      case 'dollar':
        return (
          <img
            src="/icons/Dollar sign.png"
            alt="Dollar icon"
            width="24"
            height="24"
          />
        )
      default:
        return null
    }
  }

  const handleCategoryClick = (index) => {
    if (showAllExpanded) {
      // If all are expanded, don't handle individual clicks
      return
    }
    setExpandedCategory(expandedCategory === index ? null : index)
  }

  const handleToggleAllExpanded = () => {
    setShowAllExpanded(!showAllExpanded)
    setExpandedCategory(null) // Reset individual expansion when toggling all
  }

  const renderChart = (data, color) => {
    const maxValue = Math.max(...data)
    const minValue = Math.min(...data)
    const range = maxValue - minValue || 1
    const width = 200
    const height = 40
    const points = data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * width
        const y = height - ((value - minValue) / range) * height
        return `${x},${y}`
      })
      .join(' ')

    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className={styles.categoryChart}
      >
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={(data.length - 1) * (width / (data.length - 1))}
          cy={height - ((data[data.length - 1] - minValue) / range) * height}
          r="4"
          fill={color}
        />
      </svg>
    )
  }

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Header
          dropdownOptions={scopeOptions}
          defaultValue={selectedVPN}
          onValueChange={handleVPNChange}
        />
        <div className={styles.content}>
          <div className={styles.pageHeader}>
            <div className={styles.pageHeaderLeft}>
              <div className={styles.pageTitleContainer}>
                <div>
                  <h2 className={styles.pageTitle}>Business KPIs</h2>
                  <p className={styles.pageSubtitle}>Analysis of All VPNs</p>
                </div>
                <div className={styles.pageHeaderIcon}>
                  <img
                    src="/icons/Mask.png"
                    alt="Business KPIs Icon"
                    width="32"
                    height="32"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.kpiGrid}>
              {/* First row - 4 boxes in one container */}
              <div className={styles.kpiRow1}>
                {kpiData.slice(0, 4).map((kpi, index) => (
                  <div key={index} className={styles.kpiRow1Card}>
                    <div className={styles.kpiValueRow}>
                      <div className={styles.kpiValueContainer}>
                        <div className={styles.kpiValue}>{kpi.value}</div>
                        <div className={styles.kpiTitle}>{kpi.title}</div>
                      </div>
                      <div
                        className={`${styles.kpiIcon} ${
                          styles[
                            `kpiIcon${kpi.iconColor.charAt(0).toUpperCase() + kpi.iconColor.slice(1)}`
                          ]
                        }`}
                      >
                        {getIcon(kpi.iconType)}
                      </div>
                    </div>
                    <div
                      className={`${styles.kpiTrend} ${
                        kpi.direction === 'up'
                          ? styles.trendUp
                          : styles.trendDown
                      }`}
                    >
                      <span className={styles.trendIcon}>
                        {kpi.direction === 'up' ? '↗' : '↘'}
                      </span>
                      <span className={styles.trendNumber}>{kpi.trend}</span>
                      <span className={styles.kpiChange}>{kpi.change}</span>
                      <span className={styles.kpiPeriod}>{kpi.period}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Second row - 2 boxes in container + 1 separate */}
              <div className={styles.kpiRow2}>
                <div className={styles.kpiRow2Container}>
                  {kpiData.slice(4, 6).map((kpi, index) => (
                    <div key={index + 4} className={styles.kpiRow2Card}>
                      <div className={styles.kpiValueRow}>
                        <div className={styles.kpiValueContainer}>
                          <div className={styles.kpiValue}>{kpi.value}</div>
                          <div className={styles.kpiTitle}>{kpi.title}</div>
                        </div>
                        <div
                          className={`${styles.kpiIcon} ${
                            styles[
                              `kpiIcon${kpi.iconColor.charAt(0).toUpperCase() + kpi.iconColor.slice(1)}`
                            ]
                          }`}
                        >
                          {getIcon(kpi.iconType)}
                        </div>
                      </div>
                      <div
                        className={`${styles.kpiTrend} ${
                          kpi.direction === 'up'
                            ? styles.trendUp
                            : styles.trendDown
                        }`}
                      >
                        <span className={styles.trendNumber}>{kpi.trend}</span>
                        <span className={styles.trendIcon}>
                          {kpi.direction === 'up' ? '↗' : '↘'}
                        </span>
                        <span className={styles.kpiChange}>{kpi.change}</span>
                        <span className={styles.kpiPeriod}>{kpi.period}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Third box - separate */}
                {kpiData.slice(6, 7).map((kpi, index) => (
                  <div
                    key={index + 6}
                    className={`${styles.kpiCard} ${
                      kpi.hasGradient ? styles.kpiCardGradient : ''
                    }`}
                  >
                    <div className={styles.kpiCardHorizontal}>
                      <div className={styles.kpiValueContainer}>
                        <div className={styles.kpiValue}>{kpi.value}</div>
                        <div className={styles.kpiTitle}>{kpi.title}</div>
                      </div>
                      <div
                        className={`${styles.kpiIcon} ${
                          styles[
                            `kpiIcon${kpi.iconColor.charAt(0).toUpperCase() + kpi.iconColor.slice(1)}`
                          ]
                        }`}
                      >
                        {getIcon(kpi.iconType)}
                      </div>
                      <div
                        className={`${styles.kpiTrend} ${
                          kpi.direction === 'up'
                            ? styles.trendUp
                            : styles.trendDown
                        }`}
                      >
                        <span className={styles.trendIcon}>
                          {kpi.direction === 'up' ? '↗' : '↘'}
                        </span>
                        <span className={styles.trendNumber}>{kpi.trend}</span>
                        <span className={styles.kpiChange}>{kpi.change}</span>
                        <span className={styles.kpiPeriod}>{kpi.period}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.mainDashboardGrid}>
            {/* Left Column */}
            <div className={styles.leftColumn}>
              <div className={styles.healthCard}>
                <div className={styles.healthCardContent}>
                  {/* Left Section */}
                  <div className={styles.healthLeftSection}>
                    <div className={styles.healthHeader}>
                      <h3 className={styles.healthTitle}>
                        Overall Health Status
                      </h3>
                      <div className={styles.healthInfoIcon}>
                        <img
                          src="/icons/Frame.png"
                          alt="Overall Health Status"
                          width="20"
                          height="20"
                        />
                      </div>
                    </div>
                    <p className={styles.healthSubtitle}>
                      Analysis of All VPNs
                    </p>

                    <div className={styles.healthStatusSection}>
                      <span className={styles.healthStatusLabel}>Status:</span>
                      <span className={styles.healthStatusValue}>
                        {healthStatus.status}
                      </span>
                    </div>

                    <div className={styles.healthLink}>
                      <a href="#">For more Info, click here</a>
                    </div>

                    <div className={styles.statusLegend}>
                      <div className={styles.legendItem}>
                        <span
                          className={`${styles.legendDot} ${styles.healthy}`}
                        ></span>
                        <span className={styles.legendLabel}>Healthy</span>
                      </div>
                      <div className={styles.legendItem}>
                        <span
                          className={`${styles.legendDot} ${styles.critical}`}
                        ></span>
                        <span className={styles.legendLabel}>Critical</span>
                      </div>
                      <div className={styles.legendItem}>
                        <span
                          className={`${styles.legendDot} ${styles.strained}`}
                        ></span>
                        <span className={styles.legendLabel}>Strained</span>
                      </div>
                      <div className={styles.legendItem}>
                        <span
                          className={`${styles.legendDot} ${styles.atRisk}`}
                        ></span>
                        <span className={styles.legendLabel}>At Risk</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Gauge */}
                  <div className={styles.healthRightSection}>
                    <div className={styles.gaugeContainer}>
                      <GaugeChart
                        id="health-gauge"
                        nrOfLevels={4}
                        percent={healthStatus.gaugePercent}
                        colors={[
                          'rgba(60, 216, 86, 1)',
                          'rgba(239, 68, 68, 1)',
                          'rgba(254, 151, 27, 1)',
                          'rgba(250, 131, 130, 1)',
                        ]}
                        arcWidth={0.1}
                        needleColor="#d1d5db"
                        textColor="#ffffff"
                        hideText={true}
                        animate={true}
                      />
                      <div className={styles.gaugeLabels}>
                        <span className={styles.gaugeLabelLeft}>Low</span>
                        <span className={styles.gaugeValueText}>
                          {Math.round(healthStatus.gaugePercent * 100)}%
                        </span>
                        <span className={styles.gaugeLabelRight}>High</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.eyeButtonContainer}>
                <button
                  className={styles.eyeButton}
                  onClick={handleToggleAllExpanded}
                  title={showAllExpanded ? 'Hide all' : 'Show all'}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {showAllExpanded ? (
                      // Eye with slash (hidden)
                      <>
                        <path
                          d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                          fill="currentColor"
                          opacity="0.3"
                        />
                        <path
                          d="M1 1l22 22"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </>
                    ) : (
                      // Eye (visible)
                      <>
                        <path
                          d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                          fill="currentColor"
                        />
                      </>
                    )}
                  </svg>
                </button>
              </div>

              <div className={styles.categorySection}>
                <div className={styles.categoryGrid}>
                  {categoryCards.map((category, index) => (
                    <div
                      key={index}
                      className={`${styles.categoryCard} ${
                        index === 0 ? styles.categoryCardFirst : ''
                      } ${index === 1 ? styles.categoryCardSecond : ''} ${
                        index === 2 ? styles.categoryCardThird : ''
                      } ${index === 3 ? styles.categoryCardFourth : ''} ${
                        index === 4 ? styles.categoryCardFifth : ''
                      }`}
                      onClick={() => handleCategoryClick(index)}
                    >
                      {showAllExpanded || expandedCategory === index ? (
                        <div
                          className={styles.categoryCardExpanded}
                          data-status={category.status}
                        >
                          <div
                            className={`${styles.categoryStatusBadge} ${
                              styles[`statusBadge${category.status}`]
                            }`}
                          >
                            Status: {category.statusText}
                          </div>
                          <div className={styles.categoryExpandedTitle}>
                            {category.title}
                          </div>
                          <div className={styles.categoryPercentage}>
                            {category.percentage}
                          </div>
                          <div className={styles.categoryDescription}>
                            {category.description}
                          </div>
                          <div className={styles.categoryChartContainer}>
                            {renderChart(
                              category.chartData,
                              category.status === 'green'
                                ? '#22c55e'
                                : '#f97373'
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className={styles.categoryCardCollapsed}>
                          <div className={styles.categoryTitle}>
                            {category.title}
                          </div>
                          <div
                            className={`${styles.categoryStatus} ${
                              styles[
                                `categoryStatus${category.status.charAt(0).toUpperCase() + category.status.slice(1)}`
                              ]
                            }`}
                          >
                            Status: {category.statusText}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Alerts */}
            <div className={styles.rightColumn}>
              <div className={styles.alertsCard}>
                <div className={styles.alertsHeader}>
                  <div className={styles.alertsHeaderLeft}>
                    <div className={styles.alertsTitleRow}>
                      <h3 className={styles.alertsTitle}>Alerts</h3>
                      <div className={styles.alertsHeaderIcon}>
                        <img
                          src="/icons/Alert.png"
                          alt="Alerts"
                          width="48"
                          height="48"
                        />
                      </div>
                    </div>
                    <p className={styles.alertsSubtitle}>
                      Analysis of All VPNs
                    </p>
                    <div className={styles.alertsCount}>
                      Active Issues: {healthStatus.activeIssues}
                    </div>
                  </div>
                </div>
                <div className={styles.alertsList}>
                  {alerts.map((alert, index) => (
                    <div key={index} className={styles.alertItem}>
                      <div className={styles.alertContent}>
                        <div className={styles.alertTitle}>{alert.title}</div>
                        <div className={styles.alertDescription}>
                          {alert.description}
                        </div>
                        <a href="/alerts" className={styles.alertLink}>
                          {alert.link} →
                        </a>
                      </div>
                      <div className={styles.alertBadge}>
                        <span
                          className={`${styles.alertLevel} ${
                            alert.level.includes('High')
                              ? styles.levelHigh
                              : styles.levelMedium
                          }`}
                        >
                          {alert.level}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
