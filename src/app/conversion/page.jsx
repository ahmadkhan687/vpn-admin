'use client'

import React, { useState, useEffect, useRef } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import RealtimeReportSidebar from '@/components/realtime-report-sidebar/RealtimeReportSidebar'
import Header from '@/components/header/Header'
import DateRangePicker from '@/components/date-range-picker/DateRangePicker'
import { conversionData } from './conversionData'
import styles from './conversion.module.css'

const ConversionIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.kpiIcon}>
    <circle cx="20" cy="20" r="18" fill="#f3f4f6" />
    <rect x="12" y="16" width="4" height="10" rx="1" fill="#9ca3af" />
    <rect x="18" y="12" width="4" height="14" rx="1" fill="#9ca3af" />
    <rect x="24" y="18" width="4" height="8" rx="1" fill="#9ca3af" />
    <path d="M26 14a6 6 0 01-4 4" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
)

const TrialIcon = () => (
  <div className={styles.trialIconWrap}>
    <span className={styles.trialBadge}>TRIAL</span>
  </div>
)

const PaidIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.kpiIcon}>
    <circle cx="20" cy="20" r="18" fill="#f3f4f6" />
    <circle cx="20" cy="15" r="5" fill="#9ca3af" />
    <path d="M14 28c0-3.3 2.7-6 6-6s6 2.7 6 6" fill="#9ca3af" />
    <text x="20" y="36" textAnchor="middle" fill="#9ca3af" fontSize="12" fontWeight="700" fontFamily="system-ui">$</text>
  </svg>
)

const Conversion = () => {
  const [selectedVPN, setSelectedVPN] = useState('Portfolio')
  const [dateRange, setDateRange] = useState({
    startDate: new Date(2025, 11, 19),
    endDate: new Date(2026, 0, 15),
  })
  const [chartContainerWidth, setChartContainerWidth] = useState(500)
  const trendChartRef = useRef(null)

  useEffect(() => {
    const el = trendChartRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0]?.contentRect ?? {}
      if (width > 0) setChartContainerWidth(width)
    })
    observer.observe(el)
    setChartContainerWidth(el.getBoundingClientRect().width || 500)
    return () => observer.disconnect()
  }, [])

  const scopeOptions = ['Portfolio', 'Steer Lucid', 'Crest', 'Slick', 'Fortivo', 'Qucik', 'Nexipher']

  const handleVPNChange = (vpn) => setSelectedVPN(vpn)
  const vpnData = conversionData[selectedVPN] || conversionData.Portfolio

  const kpiCards = [
    { icon: <ConversionIcon />, title: 'Trial to Paid Conversion', value: vpnData.trialToPaidConversion },
    { icon: <TrialIcon />, title: 'Trial Users', value: vpnData.trialUsers },
    { icon: <PaidIcon />, title: 'Paid Users', value: vpnData.paidUsers },
    { icon: <ConversionIcon />, title: 'Average Time to Convert', value: vpnData.avgTimeToConvert },
  ]

  const funnel = vpnData.funnel || { trialStarted: 45, activeTrial: 30, paymentPage: 40, paidUsers: 20 }
  const totalFunnelSum = funnel.trialStarted + funnel.activeTrial + funnel.paymentPage + funnel.paidUsers
  const funnelStages = [
    { label: 'Trial Started', value: funnel.trialStarted, pct: totalFunnelSum ? Math.round((funnel.trialStarted / totalFunnelSum) * 1000) / 10 : 0, color: '#60a5fa' },
    { label: 'Active Trial Users', value: funnel.activeTrial, pct: totalFunnelSum ? Math.round((funnel.activeTrial / totalFunnelSum) * 1000) / 10 : 0, color: '#3b82f6' },
    { label: 'Payment Page reached', value: funnel.paymentPage, pct: totalFunnelSum ? Math.round((funnel.paymentPage / totalFunnelSum) * 1000) / 10 : 0, color: '#2563eb' },
    { label: 'Paid Users', value: funnel.paidUsers, pct: totalFunnelSum ? Math.round((funnel.paidUsers / totalFunnelSum) * 1000) / 10 : 0, color: '#1d4ed8' },
  ]
  const totalFunnel = funnel.trialStarted

  const trendData = vpnData.trendData || [1500, 2200, 3000, 2500, 2800]
  const trendMonths = vpnData.trendMonths || ['May', 'June', 'July', 'Aug', 'Sept']
  const yMax = 4000
  const chartHeight = 200
  const pad = { top: 20, right: 40, bottom: 36, left: 24 }
  const innerW = chartContainerWidth - pad.left - pad.right
  const innerH = chartHeight - pad.top - pad.bottom
  const points = trendData.map((v, i) => ({
    x: pad.left + (i / (trendData.length - 1)) * innerW,
    y: pad.top + innerH - (v / yMax) * innerH,
  }))
  const linePath = points.map((p, i) => (i === 0 ? 'M' : 'L') + ` ${p.x} ${p.y}`).join(' ')
  const highlightedIndex = 2

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
                <h2 className={styles.pageTitle}>Conversion</h2>
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

          <div className={styles.kpiCardsRow}>
            {kpiCards.map((card) => (
              <div key={card.title} className={styles.kpiCard}>
                <div className={styles.kpiCardIcon}>{card.icon}</div>
                <h3 className={styles.kpiCardTitle}>{card.title}</h3>
                <div className={styles.kpiCardDottedLine}></div>
                <div className={styles.kpiCardValue}>{card.value}</div>
              </div>
            ))}
          </div>

          <div className={styles.twoSectionsRow}>
            <div className={styles.funnelCard}>
              <div className={styles.funnelCardHeader}>
                <h3 className={styles.funnelCardTitle}>Conversion Funnel</h3>
                <div className={styles.funnelRefresh}>
                  <span className={styles.funnelRefreshIcon}>↻</span>
                  <span className={styles.funnelRefreshLabel}>(Last 7 Days)</span>
                </div>
              </div>
              <div className={styles.funnelUsersLabel}>Users: {totalFunnel}</div>
              <div className={styles.funnelContent}>
                <div className={styles.funnelDiagram}>
                  {funnelStages.map((stage, i) => (
                    <div key={stage.label} className={styles.funnelStage} style={{ background: stage.color, width: `${100 - i * 12}%` }}>
                      <span className={styles.funnelStageLabel}>{stage.label}</span>
                      <span className={styles.funnelStageIcon}>
                        {i === 0 && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
                        )}
                        {(i === 1 || i === 3) && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>
                        )}
                        {i === 2 && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                <div className={styles.funnelLegend}>
                  {funnelStages.map((stage) => (
                    <div key={stage.label} className={styles.funnelLegendItem}>
                      <span className={styles.funnelLegendDot} style={{ background: stage.color }}></span>
                      <span>{stage.label}: {stage.value} ({stage.pct}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.trendCard}>
              <h3 className={styles.trendCardTitle}>Conversion Rate Trend</h3>
              <div className={styles.trendChartRow} ref={trendChartRef}>
                <button type="button" className={styles.trendNavArrow}>‹</button>
                <div className={styles.trendChartWrap}>
                  <svg viewBox={`0 0 ${chartContainerWidth} ${chartHeight}`} className={styles.trendChartSvg} preserveAspectRatio="xMinYMid meet">
                    {[0.25, 0.5, 0.75, 1].map((pct, i) => (
                      <line key={i} x1={pad.left} y1={pad.top + innerH * (1 - pct)} x2={pad.left + innerW} y2={pad.top + innerH * (1 - pct)} stroke="#f3f4f6" strokeWidth="1" />
                    ))}
                    <path d={linePath} fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {points.map((p, i) => (
                      <g key={i}>
                        {i === highlightedIndex && (
                          <>
                            <line x1={p.x} y1={p.y} x2={p.x} y2={chartHeight - pad.bottom} stroke="#d1d5db" strokeWidth="1" strokeDasharray="4 2" />
                            <rect x={p.x - 28} y={p.y - 24} width="56" height="20" rx="4" fill="#374151" />
                            <text x={p.x} y={p.y - 10} textAnchor="middle" fill="#fff" fontSize="10">{trendMonths[i]} {trendData[i]}k</text>
                          </>
                        )}
                        <circle cx={p.x} cy={p.y} r={i === highlightedIndex ? 6 : 4} fill={i === highlightedIndex ? '#f97316' : '#fff'} stroke="#f97316" strokeWidth="2" />
                      </g>
                    ))}
                    {trendMonths.map((m, i) => (
                      <text key={m} x={pad.left + (i / (trendMonths.length - 1)) * innerW} y={chartHeight - 8} textAnchor="middle" className={styles.trendAxisLabel}>{m}</text>
                    ))}
                    <text x={pad.left - 4} y={pad.top + 4} textAnchor="start" className={styles.trendAxisLabel}>4,000k</text>
                    <text x={pad.left - 4} y={pad.top + innerH + 14} textAnchor="start" className={styles.trendAxisLabel}>0</text>
                  </svg>
                </div>
                <button type="button" className={styles.trendNavArrow}>›</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Conversion
