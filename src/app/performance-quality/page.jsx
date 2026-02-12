'use client'

import React, { useState, useEffect, useRef } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import RealtimeReportSidebar from '@/components/realtime-report-sidebar/RealtimeReportSidebar'
import Header from '@/components/header/Header'
import { getPerformanceQualityData } from './performanceQualityData'
import styles from './performance-quality.module.css'

const LATENCY_BAR_MAX = 200
const PACKET_LOSS_BAR_MAX = 10

const PerformanceQuality = () => {
  const [selectedVPN, setSelectedVPN] = useState('Portfolio')
  const [dateRange, setDateRange] = useState('Last 28 days')
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false)
  const dateDropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(e.target)) {
        setIsDateDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isDateDropdownOpen])

  const scopeOptions = ['Portfolio', 'Steer Lucid', 'Crest', 'Slick', 'Fortivo', 'Qucik', 'Nexipher']
  const dateRangeOptions = [
    { label: 'Last 7 days', range: 'Jan 9, 2026 – Jan 15, 2026' },
    { label: 'Last 14 days', range: 'Jan 2, 2026 – Jan 15, 2026' },
    { label: 'Last 28 days', range: 'Dec 19, 2025 – Jan 15, 2026' },
    { label: 'Last 90 days', range: 'Oct 18, 2025 – Jan 15, 2026' },
  ]
  const currentDateRange = dateRangeOptions.find((o) => o.label === dateRange) || dateRangeOptions[2]

  const handleVPNChange = (vpn) => setSelectedVPN(vpn)

  const scopeData = getPerformanceQualityData(selectedVPN)
  const latency = scopeData.medianLatency
  const packet = scopeData.packetLoss
  const latencyMarkerPos = Math.min(95, (latency.valueMs / LATENCY_BAR_MAX) * 100)
  const packetMarkerPos = Math.min(95, (parseFloat(packet.valuePct) / PACKET_LOSS_BAR_MAX) * 100)

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
                <h2 className={styles.pageTitle}>Performance &amp; Quality</h2>
                <span className={styles.titlePillOrange}>Network &amp; Protocol Health</span>
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
                  {dateRangeOptions.map((opt) => (
                    <div
                      key={opt.label}
                      className={`${styles.dateRangeOption} ${dateRange === opt.label ? styles.dateRangeOptionActive : ''}`}
                      onClick={() => { setDateRange(opt.label); setIsDateDropdownOpen(false) }}
                    >
                      <span className={styles.dateRangeOptionLabel}>{opt.label}</span>
                      <span className={styles.dateRangeOptionRange}>{opt.range}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.cardsColumn}>
            {/* Median Latency */}
            <div className={styles.metricCard}>
              <div className={styles.metricCardHeader}>
                <h3 className={styles.metricCardTitle}>Median Latency</h3>
                <div className={styles.refreshWrap}>
                  <span className={styles.refreshIcon}>↻</span>
                  <span className={styles.refreshText}>Last Updated Now</span>
                </div>
              </div>
              <div className={styles.metricMainRow}>
                <span className={styles.metricValue}>{latency.valueMs} ms</span>
                {latency.withinSLA && (
                  <span className={styles.slaBadge}>
                    <span className={styles.slaCheck}>✓</span>
                    Well within SLA
                  </span>
                )}
              </div>
              <div className={parseFloat(latency.changePct) >= 0 ? styles.metricChangeRed : styles.metricChangeGreen}>
                {parseFloat(latency.changePct) >= 0 ? '↑' : '↓'} {Math.abs(parseFloat(latency.changePct))}% from last week
              </div>
              <div className={styles.thresholdBarRow}>
                <div className={styles.thresholdBarWrap}>
                  <div className={styles.thresholdBar}></div>
                  <div className={styles.markerGroup} style={{ left: `${latencyMarkerPos}%` }}>
                    <span className={styles.markerBubble}>Currently: {latency.valueMs} ms</span>
                    <div className={latency.withinSLA ? styles.thresholdMarker : styles.thresholdMarkerRed}></div>
                  </div>
                  <div className={styles.markerGroup} style={{ left: `${(latency.thresholdMs / LATENCY_BAR_MAX) * 100}%` }}>
                    <span className={styles.markerWarningIcon}>⚠</span>
                    <span className={styles.markerBubbleBelow}>{latency.thresholdMs} ms</span>
                    <div className={styles.thresholdMarkerWarning}></div>
                  </div>
                </div>
                <div className={styles.thresholdBox}>
                  <span className={styles.thresholdWarningIcon}>⚠</span>
                  Acceptable threshold: <span className={styles.thresholdValue}>&lt;{latency.thresholdMs}ms</span>
                </div>
              </div>
              <div className={latency.status === 'healthy' ? styles.statusRow : styles.statusRowWarning}>
                {latency.status === 'healthy' ? <span className={styles.statusCheck}>✓</span> : <span className={styles.statusWarningIcon}>⚠</span>}
                Status: <strong>{latency.status === 'healthy' ? 'Healthy' : latency.status === 'atRisk' ? 'At Risk' : 'In Risk'}</strong>
              </div>
            </div>

            {/* Packet Loss */}
            <div className={styles.metricCard}>
              <div className={styles.metricCardHeader}>
                <h3 className={styles.metricCardTitle}>Packet Loss</h3>
                <div className={styles.refreshWrap}>
                  <span className={styles.refreshIcon}>↻</span>
                  <span className={styles.refreshText}>Last Updated Now</span>
                </div>
              </div>
              <div className={styles.metricMainRow}>
                <span className={styles.metricValue}>{packet.valuePct}%</span>
              </div>
              <div className={parseFloat(packet.changePct) <= 0 ? styles.metricChangeGreen : styles.metricChangeRed}>
                {parseFloat(packet.changePct) <= 0 ? '↓' : '↑'} {Math.abs(parseFloat(packet.changePct))}% from last week
              </div>
              <div className={styles.thresholdBarRow}>
                <div className={styles.thresholdBarWrap}>
                  <div className={styles.thresholdBar}></div>
                  <div className={styles.markerGroup} style={{ left: `${packetMarkerPos}%` }}>
                    <span className={styles.markerBubble}>Currently: {packet.valuePct}%</span>
                    <div className={styles.thresholdMarkerRed}></div>
                  </div>
                  <div className={styles.markerGroup} style={{ left: '50%' }}>
                    <span className={styles.markerWarningIcon}>⚠</span>
                    <span className={styles.markerBubbleBelow}>5%</span>
                    <div className={styles.thresholdMarkerWarning}></div>
                  </div>
                </div>
                <div className={styles.failuresBox}>
                  <span className={styles.failuresWarningIcon}>⚠</span>
                  Failures: {packet.failures}
                </div>
              </div>
              <div className={packet.status === 'healthy' ? styles.statusRow : styles.statusRowWarning}>
                {packet.status === 'healthy' ? <span className={styles.statusCheck}>✓</span> : <span className={styles.statusWarningIcon}>⚠</span>}
                Status: <strong>{packet.status === 'healthy' ? 'Healthy' : 'In Risk'}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerformanceQuality
