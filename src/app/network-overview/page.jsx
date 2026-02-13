'use client'

import React, { useState, useEffect, useRef } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import RealtimeReportSidebar from '@/components/realtime-report-sidebar/RealtimeReportSidebar'
import Header from '@/components/header/Header'
import styles from './network-overview.module.css'
import { getNetworkOverviewData } from './networkOverviewData'

const ALL_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const POINTS_PER_MONTH = 4
const TUNNELS_WINDOW = 12
const ACTIVE_TUNNELS_YMAX = 25000

const PEAK_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const BARS_PER_DAY = 8
const PEAK_YMAX = 3000

const NetworkOverview = () => {
  const [selectedVPN, setSelectedVPN] = useState('Portfolio')
  const [showAddAppModal, setShowAddAppModal] = useState(false)
  const [showAddServerModal, setShowAddServerModal] = useState(false)
  const [tunnelsMonthStart, setTunnelsMonthStart] = useState(0)
  const tunnelsChartRef = useRef(null)
  const peakChartRef = useRef(null)
  const [tunnelsWidth, setTunnelsWidth] = useState(400)
  const [peakWidth, setPeakWidth] = useState(400)

  const scopeData = getNetworkOverviewData(selectedVPN)
  const maxTunnelsStart = Math.max(0, ALL_MONTHS.length - 3)
  const visibleTunnelsMonths = ALL_MONTHS.slice(tunnelsMonthStart, tunnelsMonthStart + 3)
  const visibleTunnelsValues = scopeData.activeTunnelsValues.slice(
    tunnelsMonthStart * POINTS_PER_MONTH,
    tunnelsMonthStart * POINTS_PER_MONTH + TUNNELS_WINDOW
  )

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
    const el1 = tunnelsChartRef.current
    const el2 = peakChartRef.current
    const obs1 = el1
      ? new ResizeObserver((entries) => {
          const w = entries[0]?.contentRect?.width
          if (w > 0) setTunnelsWidth(w)
        })
      : null
    const obs2 = el2
      ? new ResizeObserver((entries) => {
          const w = entries[0]?.contentRect?.width
          if (w > 0) setPeakWidth(w)
        })
      : null
    if (el1) obs1?.observe(el1)
    if (el2) obs2?.observe(el2)
    if (el1) setTunnelsWidth(el1.getBoundingClientRect().width || 400)
    if (el2) setPeakWidth(el2.getBoundingClientRect().width || 400)
    return () => {
      if (el1) obs1?.disconnect()
      if (el2) obs2?.disconnect()
    }
  }, [])

  const handleVPNChange = (vpn) => setSelectedVPN(vpn)

  const pad = { top: 20, right: 24, bottom: 40, left: 40 }
  const chartH = 200

  const tunnelsInnerW = tunnelsWidth - pad.left - pad.right
  const tunnelsInnerH = chartH - pad.top - pad.bottom
  const tunnelsPoints = visibleTunnelsValues.map((v, i) => {
    const x = pad.left + (i / (visibleTunnelsValues.length - 1 || 1)) * tunnelsInnerW
    const y = pad.top + tunnelsInnerH - (v / ACTIVE_TUNNELS_YMAX) * tunnelsInnerH
    return { x, y }
  })
  const areaPath = tunnelsPoints.length
    ? `M ${tunnelsPoints[0].x} ${pad.top + tunnelsInnerH} L ${tunnelsPoints.map((p) => `${p.x} ${p.y}`).join(' L ')} L ${tunnelsPoints[tunnelsPoints.length - 1].x} ${pad.top + tunnelsInnerH} Z`
    : ''
  const linePath = tunnelsPoints.map((p, i) => (i === 0 ? 'M' : 'L') + ` ${p.x} ${p.y}`).join(' ')

  const peakInnerW = peakWidth - pad.left - pad.right
  const peakInnerH = chartH - pad.top - pad.bottom
  const peakValues = scopeData.peakValues
  const totalBars = peakValues.length
  const barGap = 1
  const barW = (peakInnerW - (totalBars - 1) * barGap) / totalBars
  const peakBarIndex = peakValues.indexOf(Math.max(...peakValues))

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
                <h2 className={styles.pageTitle}>Network Overview</h2>
                <span className={styles.titlePill}>Network &amp; Protocol Health</span>
              </div>
              <div className={styles.dottedLine}></div>
              <p className={styles.pageDescription}>
                Overview of network status, connectivity, and key network metrics.
              </p>
            </div>
          </div>

          <div className={styles.twoSectionsRow}>
            <div className={styles.tunnelsCard}>
              <div className={styles.tunnelsTitleWrap}>
                <h3 className={styles.cardTitle}>Active Tunnels</h3>
                <div className={styles.tunnelsTitleDotted}></div>
              </div>
              <div className={styles.tunnelsChartWrap} ref={tunnelsChartRef}>
                <svg viewBox={`0 0 ${tunnelsWidth} ${chartH}`} className={styles.chartSvg} preserveAspectRatio="xMinYMid meet">
                  <defs>
                    <linearGradient id="tunnelsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  {[0, 5000, 10000, 15000, 20000, 25000].map((val) => (
                    <line
                      key={val}
                      x1={pad.left}
                      y1={pad.top + tunnelsInnerH - (val / ACTIVE_TUNNELS_YMAX) * tunnelsInnerH}
                      x2={pad.left + tunnelsInnerW}
                      y2={pad.top + tunnelsInnerH - (val / ACTIVE_TUNNELS_YMAX) * tunnelsInnerH}
                      stroke="#f3f4f6"
                      strokeWidth="1"
                    />
                  ))}
                  {[0, 1, 2, 3].map((i) => (
                    <line
                      key={`v-${i}`}
                      x1={pad.left + (i / 3) * tunnelsInnerW}
                      y1={pad.top}
                      x2={pad.left + (i / 3) * tunnelsInnerW}
                      y2={pad.top + tunnelsInnerH}
                      stroke="#f3f4f6"
                      strokeWidth="1"
                    />
                  ))}
                  <path d={areaPath} fill="url(#tunnelsGrad)" />
                  <path d={linePath} fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  {visibleTunnelsMonths.map((m, i) => (
                    <text
                      key={m}
                      x={pad.left + (i / (visibleTunnelsMonths.length - 1 || 1)) * tunnelsInnerW}
                      y={chartH - 10}
                      textAnchor="middle"
                      className={styles.axisLabel}
                    >
                      {m}
                    </text>
                  ))}
                  {[0, 5000, 10000, 15000, 20000, 25000].map((val) => (
                    <text
                      key={`y-${val}`}
                      x={pad.left - 6}
                      y={pad.top + tunnelsInnerH - (val / ACTIVE_TUNNELS_YMAX) * tunnelsInnerH + 4}
                      textAnchor="end"
                      className={styles.axisLabel}
                    >
                      {val.toLocaleString()}
                    </text>
                  ))}
                </svg>
              </div>
              <div className={styles.tunnelsNavRow}>
                <button
                  type="button"
                  className={styles.tunnelsNavArrow}
                  onClick={() => setTunnelsMonthStart((s) => Math.max(0, s - 1))}
                  disabled={tunnelsMonthStart <= 0}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className={styles.tunnelsNavArrow}
                  onClick={() => setTunnelsMonthStart((s) => Math.min(maxTunnelsStart, s + 1))}
                  disabled={tunnelsMonthStart >= maxTunnelsStart}
                >
                  ›
                </button>
              </div>
              <div className={styles.tunnelsSummaryRow}>
                <div className={styles.tunnelsSummary}>
                  <span className={styles.tunnelsValue}>20,678.89</span>
                  <span className={styles.tunnelsChangeWrap}>
                    <span className={styles.tunnelsChangeCircle}>↓</span>
                    <span className={styles.tunnelsChange}>-1.5%</span>
                  </span>
                </div>
                <div className={styles.tunnelsLegend}>
                  <span className={styles.legendDot} style={{ background: '#8b5cf6' }}></span>
                  <span>Active Tunnels</span>
                </div>
              </div>
            </div>

            <div className={styles.peakCard}>
              <div className={styles.peakHeader}>
                <h3 className={styles.cardTitle}>Peak Concurrency</h3>
                <div className={styles.peakUpdated}>
                  <span className={styles.refreshIcon}>↻</span>
                  <span>Last Updated Now</span>
                </div>
              </div>
              <div className={styles.peakMetricRow}>
                <span className={styles.peakValue}>3,120</span>
                <div className={styles.peakMeta}>
                  <span className={styles.peakCapacity}>78% of capacity</span>
                  <span className={styles.peakTrend}>↑ 2+ last week</span>
                </div>
              </div>
              <div className={styles.peakChartWrap} ref={peakChartRef}>
                <svg viewBox={`0 0 ${peakWidth} ${chartH}`} className={styles.chartSvg} preserveAspectRatio="xMinYMid meet">
                  {[0, 500, 1000, 1500, 2000, 2500, 3000].map((val) => (
                    <line
                      key={val}
                      x1={pad.left}
                      y1={pad.top + peakInnerH - (val / PEAK_YMAX) * peakInnerH}
                      x2={pad.left + peakInnerW}
                      y2={pad.top + peakInnerH - (val / PEAK_YMAX) * peakInnerH}
                      stroke="#f3f4f6"
                      strokeWidth="1"
                    />
                  ))}
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <line
                      key={`v-${i}`}
                      x1={pad.left + (i / 7) * peakInnerW}
                      y1={pad.top}
                      x2={pad.left + (i / 7) * peakInnerW}
                      y2={pad.top + peakInnerH}
                      stroke="#f3f4f6"
                      strokeWidth="1"
                    />
                  ))}
                  {peakValues.map((v, i) => {
                    const barH = (v / PEAK_YMAX) * peakInnerH
                    const x = pad.left + i * (barW + barGap) + barW / 2
                    const barX = pad.left + i * (barW + barGap)
                    const y = pad.top + peakInnerH - barH
                    const isPeak = i === peakBarIndex
                    return (
                      <g key={i}>
                        <rect x={barX} y={y} width={barW} height={barH} fill="#eab308" rx="1" />
                        {isPeak && (
                          <g>
                            <rect x={x - 38} y={y - 28} width={76} height={22} rx="4" fill="#fff" stroke="#e5e7eb" strokeWidth="1" />
                            <text x={x} y={y - 13} textAnchor="middle" fontSize="10" fill="#374151" fontFamily="inherit">Peak at 19:20</text>
                          </g>
                        )}
                      </g>
                    )
                  })}
                  {PEAK_DAYS.map((day, i) => (
                    <text
                      key={day}
                      x={pad.left + (i + 0.5) / 7 * peakInnerW}
                      y={chartH - 10}
                      textAnchor="middle"
                      className={styles.axisLabel}
                    >
                      {day}
                    </text>
                  ))}
                  {[0, 500, 1000, 1500, 2000, 2500, 3000].map((val) => (
                    <text
                      key={`y-${val}`}
                      x={pad.left - 6}
                      y={pad.top + peakInnerH - (val / PEAK_YMAX) * peakInnerH + 4}
                      textAnchor="end"
                      className={styles.axisLabel}
                    >
                      {val.toLocaleString()}
                    </text>
                  ))}
                </svg>
              </div>
              <div className={styles.peakLegend}>
                <span className={styles.legendDot} style={{ background: '#eab308' }}></span>
                <span>Product</span>
              </div>
            </div>
          </div>

          <div className={styles.regionHealthSection}>
            <div className={styles.regionHealthHeader}>
              <div className={styles.regionHealthTitleWrap}>
                <h3 className={styles.regionHealthTitle}>
                  <span className={styles.globeIcon}>🌐</span>
                  Region Health State
                </h3>
                <span className={styles.regionHealthSubtitle}>(Server Utilization)</span>
              </div>
              <div className={styles.regionHealthActions}>
                <button type="button" className={styles.addServerBtn} onClick={() => setShowAddServerModal(true)}>Add Server +</button>
                <button type="button" className={styles.addAppBtn} onClick={() => setShowAddAppModal(true)}>Add Application +</button>
              </div>
            </div>
            <div className={styles.regionCardsGrid}>
              {[
                { region: 'India 1', city: 'Mumbai', status: 'healthy', tunnels: '3320', latency: '+23 ms', latencyColor: 'green', barData: [120, 180, 220, 280, 310, 290, 250] },
                { region: 'Germany', city: 'Frankfurt', status: 'degraded', tunnels: '3320', latency: '+23 ms', latencyColor: 'green', barData: [200, 250, 300, 280, 320, 310, 290] },
                { region: 'USA 1', city: 'Los Angeles', status: 'alert', tunnels: '320', latency: '+23 ms', latencyColor: 'red', barData: [80, 60, 90, 70, 85, 75, 65] },
                { region: 'UK', city: 'London', status: 'healthy', tunnels: '3320', latency: '+23 ms', latencyColor: 'green', barData: [240, 280, 310, 290, 320, 300, 270] },
                { region: 'Canada', city: 'Toronto', status: 'healthy', tunnels: '3320', latency: '+23 ms', latencyColor: 'green', barData: [180, 220, 260, 290, 310, 280, 240] },
              ].map((r) => (
                <div key={r.region} className={styles.regionCard}>
                  <div className={styles.regionCardHeader}>
                    <span className={styles.regionName}>{r.region} ({r.city})</span>
                    <div className={styles.regionUpdated}>
                      <span className={styles.refreshIcon}>↻</span>
                      <span>Last Updated Now</span>
                    </div>
                  </div>
                  <div className={styles.regionStatusRow}>
                    <span className={`${styles.statusBadge} ${styles[`status${r.status.charAt(0).toUpperCase() + r.status.slice(1)}`]}`}>
                      {r.status === 'healthy' && '✓'}
                      {r.status === 'degraded' && '⚠'}
                      {r.status === 'alert' && '⚠'}
                      {' '}{r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                  </div>
                  <div className={`${styles.regionTunnels} ${r.status === 'alert' ? styles.alertText : ''}`}>
                    {r.tunnels} Active Tunnels
                  </div>
                  <div className={`${styles.regionLatency} ${r.latencyColor === 'red' ? styles.latencyRed : styles.latencyGreen}`}>
                    {r.latency}
                  </div>
                  <div className={styles.regionBarChart}>
                    {['12pm', '2pm', '4pm', '6pm', '8pm', '10pm', '12am'].map((label, i) => {
                      const v = r.barData[i] ?? 0
                      const maxV = Math.max(...r.barData, 1)
                      const h = (v / maxV) * 48
                      return (
                        <div key={i} className={styles.regionBarWrap}>
                          <div className={styles.regionBar} style={{ height: Math.max(h, 4) }} />
                          <span className={styles.regionBarLabel}>{label}</span>
                        </div>
                      )
                    })}
                    <span className={styles.regionBarArrow}>›</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showAddServerModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddServerModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Add Server</h3>
              <button type="button" className={styles.modalClose} onClick={() => setShowAddServerModal(false)} aria-label="Close">×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Name</label>
                <input type="text" className={styles.formInput} />
              </div>
              <div className={styles.formGroup}>
                <label>URL</label>
                <input type="text" className={styles.formInput} />
              </div>
              <div className={styles.formGroup}>
                <label>Type</label>
                <input type="text" className={styles.formInput} />
              </div>
              <div className={styles.formGroup}>
                <label>Package Name</label>
                <input type="text" className={styles.formInput} />
              </div>
              <div className={styles.formGroup}>
                <label>Version</label>
                <input type="text" className={styles.formInput} />
              </div>
              <div className={styles.formGroup}>
                <label>Version Release Date</label>
                <input type="text" className={styles.formInput} placeholder="dd/mm/yyyy" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" className={styles.formCheckbox} />
                  Active
                </label>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.modalSubmitBtn} onClick={() => setShowAddServerModal(false)}>Submit</button>
                <button type="button" className={styles.modalCancelBtn} onClick={() => setShowAddServerModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddAppModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddAppModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Add Application</h3>
              <button type="button" className={styles.modalClose} onClick={() => setShowAddAppModal(false)} aria-label="Close">×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Server Name</label>
                <input type="text" className={styles.formInput} />
              </div>
              <div className={styles.formGroup}>
                <label>Display Name</label>
                <input type="text" className={styles.formInput} />
              </div>
              <div className={styles.formGroup}>
                <label>Protocol ID</label>
                <input type="text" className={styles.formInput} />
              </div>
              <div className={styles.formGroup}>
                <label>Country ID</label>
                <input type="text" className={styles.formInput} />
              </div>
              <div className={styles.formGroup}>
                <label>Server IP</label>
                <input type="text" className={styles.formInput} />
              </div>
              <div className={styles.formGroup}>
                <label>CPU info</label>
                <input type="text" className={styles.formInput} placeholder="dd/mm/yyyy" />
              </div>
              <div className={styles.formGroup}>
                <label>RAM Info</label>
                <input type="text" className={styles.formInput} />
              </div>
              <div className={styles.formGroup}>
                <label>Disk Info</label>
                <input type="text" className={styles.formInput} />
              </div>
              <div className={styles.formGroup}>
                <label>Operating System</label>
                <input type="text" className={styles.formInput} />
              </div>
              <div className={styles.formGroup}>
                <label>Ad ID</label>
                <input type="text" className={styles.formInput} />
              </div>
              <div className={styles.formGroup}>
                <label>Open File</label>
                <button type="button" className={styles.chooseFileBtn}>Choose File</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NetworkOverview
