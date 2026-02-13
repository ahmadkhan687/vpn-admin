'use client'

import React, { useRef, useState, useEffect } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import RealtimeReportSidebar from '@/components/realtime-report-sidebar/RealtimeReportSidebar'
import Header from '@/components/header/Header'
import styles from './region-health-state.module.css'
import { getRegionHealthStateData } from './regionHealthStateData'

const TIME_LABELS = ['12pm', '2pm', '4pm', '6pm', '8pm', '10pm', '12am']

const GlobeIcon = () => (
  <svg className={styles.globeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const WarningIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const AlertIconLarge = () => (
  <svg className={styles.alertIconLarge} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const RefreshIcon = () => (
  <svg className={styles.refreshIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
)

const RegionHealthState = () => {
  const [selectedVPN, setSelectedVPN] = useState('Portfolio')
  const cardRefs = useRef([])
  const [chartWidths, setChartWidths] = useState({})

  const scopeOptions = [
    'Portfolio',
    'Steer Lucid',
    'Crest',
    'Slick',
    'Fortivo',
    'Qucik',
    'Nexipher',
  ]

  useEffect(() => {
    const observers = regions.map((_, i) => {
      const el = cardRefs.current[i]?.querySelector('[data-chart]')
      if (!el) return null
      const obs = new ResizeObserver((entries) => {
        const w = entries[0]?.contentRect?.width
        if (w > 0) setChartWidths((prev) => ({ ...prev, [i]: w }))
      })
      obs.observe(el)
      setChartWidths((prev) => ({ ...prev, [i]: el.getBoundingClientRect().width || 280 }))
      return obs
    })
    return () => observers.forEach((obs) => obs?.disconnect())
  }, [selectedVPN])

  const handleVPNChange = (vpn) => setSelectedVPN(vpn)
  const scopeData = getRegionHealthStateData(selectedVPN)
  const regions = scopeData.regions
  const regionBarValues = scopeData.regionBarValues

  const pad = { top: 8, right: 24, bottom: 28, left: 8 }
  const chartH = 100
  const barCount = 12

  const renderStatus = (status) => {
    if (status === 'healthy') {
      return (
        <span className={styles.statusHealthy}>
          <CheckIcon />
          Healthy
        </span>
      )
    }
    if (status === 'degraded') {
      return (
        <span className={styles.statusDegraded}>
          <WarningIcon />
          Degraded
        </span>
      )
    }
    return (
      <span className={styles.statusAlert}>
        Alert
      </span>
    )
  }

  const renderBarChart = (values, index) => {
    const w = chartWidths[index] ?? 280
    const innerW = w - pad.left - pad.right
    const innerH = chartH - pad.top - pad.bottom
    const maxVal = Math.max(...values)
    const barGap = 2
    const barW = (innerW - (barCount - 1) * barGap) / barCount

    return (
      <svg viewBox={`0 0 ${w} ${chartH}`} className={styles.chartSvg} preserveAspectRatio="xMinYMid meet">
        {[0.25, 0.5, 0.75].map((frac) => (
          <line
            key={frac}
            x1={pad.left}
            y1={pad.top + frac * innerH}
            x2={pad.left + innerW}
            y2={pad.top + frac * innerH}
            stroke="#f3f4f6"
            strokeWidth="1"
          />
        ))}
        {values.map((v, i) => {
          const barH = maxVal > 0 ? (v / maxVal) * innerH : 0
          const x = pad.left + i * (barW + barGap)
          const y = pad.top + innerH - barH
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={barW}
              height={barH}
              className={styles.barFill}
              rx="1"
            />
          )
        })}
        {TIME_LABELS.map((label, i) => (
          <text
            key={label}
            x={pad.left + (i * 2 / (TIME_LABELS.length - 1)) * (innerW / 2) + (innerW / (TIME_LABELS.length - 1)) * i * 0.5}
            y={chartH - 8}
            textAnchor="middle"
            className={styles.xAxisLabel}
          >
            {label}
          </text>
        ))}
        <text
          x={pad.left + innerW + 8}
          y={chartH - 8}
          textAnchor="start"
          className={styles.xAxisLabel}
        >
          &gt;
        </text>
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
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleWrap}>
              <h1 className={styles.sectionTitle}>Region Health State</h1>
              <GlobeIcon />
              <span className={styles.sectionSubtitle}>(Server Utilization)</span>
            </div>
            <div className={styles.headerButtons}>
              <button type="button" className={styles.addButton}>
                Add Server +
              </button>
              <button type="button" className={styles.addButton}>
                Add Application +
              </button>
            </div>
          </div>

          <div className={styles.cardsGrid}>
            {regions.map((region, index) => (
              <div
                key={`${region.name}-${region.city}`}
                className={styles.regionCard}
                ref={(el) => { cardRefs.current[index] = el }}
              >
                <div className={styles.cardTop}>
                  <div className={styles.cardRegionInfo}>
                    <h3 className={styles.regionName}>
                      {region.name} <span className={styles.regionCity}>({region.city})</span>
                    </h3>
                    {renderStatus(region.status)}
                  </div>
                  <div className={styles.cardTopRight}>
                    {region.status === 'alert' && <AlertIconLarge />}
                    <RefreshIcon />
                    <span className={styles.lastUpdated}>Last Updated Now</span>
                  </div>
                </div>

                <div className={styles.cardMetrics}>
                  <div className={styles.activeTunnelsRow}>
                    <span className={`${styles.activeTunnelsValue} ${region.status === 'alert' ? styles.alert : ''}`}>
                      {region.activeTunnels.toLocaleString()}
                    </span>
                    <span className={styles.activeTunnelsLabel}>Active Tunnels</span>
                  </div>
                  <div className={styles.latencyValue}>+23 ms</div>
                </div>

                <div className={styles.chartWrap} data-chart>
                  {renderBarChart(regionBarValues[index], index)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegionHealthState
