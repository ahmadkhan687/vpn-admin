'use client'

import React, { useState, useEffect, useRef } from 'react'
import { PieChart } from '@mui/x-charts/PieChart'
import Sidebar from '@/components/sidebar/Sidebar'
import RealtimeReportSidebar from '@/components/realtime-report-sidebar/RealtimeReportSidebar'
import DateRangePicker from '@/components/date-range-picker/DateRangePicker'
import Header from '@/components/header/Header'
import styles from './current-capacity.module.css'
import { currentCapacityDataByScope } from './currentCapacityData'

const CurrentCapacity = () => {
  const [selectedVPN, setSelectedVPN] = useState('Portfolio')
  const [dateRange, setDateRange] = useState({
    startDate: new Date(2025, 11, 19),
    endDate: new Date(2026, 0, 15),
  })
  const [activeCapacityTab, setActiveCapacityTab] = useState('overall')
  const [headroomRegion, setHeadroomRegion] = useState('All Regions')
  const [headroomGateway, setHeadroomGateway] = useState('All Gateways')
  const [headroomRegionOpen, setHeadroomRegionOpen] = useState(false)
  const [headroomGatewayOpen, setHeadroomGatewayOpen] = useState(false)
  const [headroomTooltip, setHeadroomTooltip] = useState(null)
  const headroomRegionRef = useRef(null)
  const headroomGatewayRef = useRef(null)
  const headroomChartRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headroomRegionRef.current && !headroomRegionRef.current.contains(event.target)) {
        setHeadroomRegionOpen(false)
      }
      if (headroomGatewayRef.current && !headroomGatewayRef.current.contains(event.target)) {
        setHeadroomGatewayOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [headroomRegionOpen, headroomGatewayOpen])

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

  const currentData = currentCapacityDataByScope[selectedVPN] || currentCapacityDataByScope.Portfolio
  const isPortfolio = selectedVPN === 'Portfolio'

  const vpnSegments = activeCapacityTab === 'utilization' ? currentData.utilizationSegments : currentData.overallSegments

  const HEADROOM_TEAL = '#0d9488'
  const headroomMinY = 0

  const renderHeadroomChart = () => {
    const headroomChartData = currentData.headroomChartData
    const width = 900
    const height = 260
    const padding = { top: 20, right: 45, bottom: 40, left: 20 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom
    const maxUsed = Math.max(...headroomChartData.map((d) => d.used), 1)
    const headroomChartMaxY = Math.ceil(maxUsed / 250) * 250 || 500
    const headroomYAxisValues = [0, Math.round(headroomChartMaxY * 0.25), Math.round(headroomChartMaxY * 0.5), Math.round(headroomChartMaxY * 0.75), headroomChartMaxY]

    const points = headroomChartData.map((d, index) => {
      const x = padding.left + (index / Math.max(headroomChartData.length - 1, 1)) * chartWidth
      const y = padding.top + chartHeight - ((d.used - headroomMinY) / (headroomChartMaxY - headroomMinY)) * chartHeight
      return { x, y, ...d }
    })

    const linePath = points.map((p, i) => (i === 0 ? 'M' : 'L') + ` ${p.x} ${p.y}`).join(' ')

    return (
      <div
        className={styles.headroomChartWrap}
        ref={headroomChartRef}
        onMouseLeave={() => setHeadroomTooltip(null)}
      >
        <div className={styles.headroomChartRow}>
        <svg viewBox={`0 0 ${width} ${height}`} className={styles.headroomChartSvg} preserveAspectRatio="xMidYMid meet">
          {/* Horizontal grid lines only */}
          {[0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = padding.top + chartHeight * (1 - pct)
            return (
              <line
                key={i}
                x1={padding.left}
                y1={y}
                x2={padding.left + chartWidth}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            )
          })}
          {/* Solid teal line only - no dashed line */}
          <path
            d={linePath}
            fill="none"
            stroke={HEADROOM_TEAL}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Invisible hover targets */}
          {points.map((point, index) => (
            <rect
              key={index}
              x={point.x - 15}
              y={padding.top}
              width={30}
              height={chartHeight}
              fill="transparent"
              onMouseMove={(e) => {
                if (!headroomChartRef.current) return
                const rect = headroomChartRef.current.getBoundingClientRect()
                setHeadroomTooltip({
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                  date: point.date,
                  used: point.used,
                  capacity: point.capacity,
                  headroom: point.headroom,
                  pctUsed: point.pctUsed,
                })
              }}
            />
          ))}
        </svg>
        {/* Y-axis labels (right side) */}
        <div className={styles.headroomYAxis}>
          {headroomYAxisValues.map((val) => (
            <span key={val}>{val >= 1000 ? `${Math.floor(val / 1000)},${String(val % 1000).padStart(3, '0')}` : val}</span>
          ))}
        </div>
        </div>
        {/* X-axis labels */}
        <div className={styles.headroomXAxis}>
          {headroomChartData.filter((_, i) => i === 0 || i === Math.floor(headroomChartData.length / 2) || i === headroomChartData.length - 1).map((d) => (
            <span key={d.date}>{d.date}</span>
          ))}
        </div>
        {headroomTooltip && (
          <div
            className={styles.headroomTooltip}
            style={{
              left: headroomTooltip.x + 16,
              top: headroomTooltip.y - 40,
            }}
          >
            <div className={styles.headroomTooltipDate}>{headroomTooltip.date}</div>
            <div>Used: {headroomTooltip.used} Mbps</div>
            <div>Capacity: {headroomTooltip.capacity} Mbps</div>
            <div>Headroom: {headroomTooltip.headroom} Mbps ({headroomTooltip.pctUsed}% used)</div>
          </div>
        )}
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
                <h2 className={styles.pageTitle}>Current Capacity</h2>
                <span className={styles.titlePill}>Capacity and Scaling</span>
              </div>
              <div className={styles.dottedLine}></div>
              <p className={styles.pageDescription}>
                Where is our cost coming from, and how efficiently is it scaling with usage?
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

          {/* Overall Capacity Card */}
          <div className={styles.capacityCard}>
            <div className={styles.capacityCardContent}>
              <div className={styles.capacityLeftSection}>
                <div className={styles.capacityTabs}>
                  <button
                    className={`${styles.capacityTab} ${activeCapacityTab === 'overall' ? styles.capacityTabActive : ''}`}
                    onClick={() => setActiveCapacityTab('overall')}
                    type="button"
                  >
                    Overall Capacity
                  </button>
                  <button
                    className={`${styles.capacityTab} ${activeCapacityTab === 'utilization' ? styles.capacityTabActive : ''}`}
                    onClick={() => setActiveCapacityTab('utilization')}
                    type="button"
                  >
                    Current Utilization
                  </button>
                </div>
                <div className={styles.capacityMetricsRow}>
                  <div className={styles.capacityMetricBlock}>
                    <span className={styles.capacityMetricLabel}>Overall Capacity</span>
                    <span className={`${styles.capacityMetricValue} ${activeCapacityTab === 'overall' ? '' : styles.capacityMetricValueMuted}`}>
                      {currentData.overallCapacityValue}
                    </span>
                  </div>
                  <div className={styles.capacityMetricBlock}>
                    <span className={styles.capacityMetricLabel}>Current Utilization</span>
                    <span className={`${styles.capacityMetricValue} ${activeCapacityTab === 'utilization' ? '' : styles.capacityMetricValueMuted}`}>
                      {activeCapacityTab === 'utilization' ? currentData.currentUtilizationValue : '$0.00'}
                    </span>
                  </div>
                </div>
                {activeCapacityTab === 'overall' ? (
                  <>
                    <div className={styles.capacitySubsection}>
                      <span className={styles.capacitySubtitle}>Overall Capacity: </span>
                      <span className={styles.capacitySubtitleBold}>{currentData.overallMbps} Mbps</span>
                    </div>
                    <p className={styles.capacityMeta}>{currentData.meta}</p>
                  </>
                ) : (
                  <p className={styles.capacityUtilizationMbps}>{currentData.utilizationMbpsText}</p>
                )}
                <div className={styles.capacityLegendCard}>
                  <h4 className={styles.capacityLegendTitle}>All VPNs</h4>
                  <div className={styles.capacityLegend}>
                    {activeCapacityTab === 'utilization'
                      ? (isPortfolio
                          ? [
                              currentData.vpnListPercent.slice(0, 2),
                              currentData.vpnListPercent.slice(2, 4),
                              currentData.vpnListPercent.slice(4, 5),
                            ]
                          : [currentData.vpnListPercent]
                        ).map((group, colIndex) => (
                          <div key={colIndex} className={styles.capacityLegendCol}>
                            {group.map((item) => (
                              <div key={item.name} className={styles.capacityLegendItem}>
                                <span className={styles.capacityLegendDot} style={{ backgroundColor: item.color }}></span>
                                <span>
                                  {item.name} ({item.percent}%)
                                </span>
                              </div>
                            ))}
                          </div>
                        ))
                      : (isPortfolio
                          ? [
                              [currentData.overallSegments[0], currentData.overallSegments[3]],
                              [currentData.overallSegments[1], currentData.overallSegments[4]],
                              [currentData.overallSegments[2]],
                            ]
                          : [currentData.overallSegments]
                        ).map((group, colIndex) => (
                          <div key={colIndex} className={styles.capacityLegendCol}>
                            {group
                              .filter((s) => s && s.label !== 'Unused Capacity')
                              .map((seg) => (
                                <div key={seg.label} className={styles.capacityLegendItem}>
                                  <span className={styles.capacityLegendDot} style={{ backgroundColor: seg.color }}></span>
                                  <span>{seg.label}</span>
                                </div>
                              ))}
                          </div>
                        ))}
                  </div>
                </div>
              </div>
              <div className={styles.capacityRightSection}>
                <div className={styles.capacityGaugeHeader}>
                  <button className={styles.refreshButton} aria-label="Refresh">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 4v6h-6M1 20v-6h6" />
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                    </svg>
                  </button>
                  <span className={styles.lastUpdatedText}>Last Updated</span>
                </div>
                <div className={styles.pieWrapper}>
                  <PieChart
                    width={280}
                    height={280}
                    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                    series={[
                      {
                        innerRadius: 85,
                        outerRadius: 125,
                        paddingAngle: 2,
                        cornerRadius: 2,
                        data: vpnSegments.map((segment) => ({
                          id: segment.label,
                          value: segment.value,
                          label: segment.label,
                          color: segment.color,
                        })),
                      },
                    ]}
                    slotProps={{ legend: { hidden: true } }}
                  />
                  <div className={styles.pieCenterText}>
                    <span className={styles.pieCenterValue}>{currentData.centerUsedPercent}</span>
                    <span className={styles.pieCenterLabel}>used</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Capacity Headroom Section */}
          <div className={styles.headroomCard}>
            <div className={styles.headroomHeader}>
              <div className={styles.headroomHeaderLeft}>
                <h3 className={styles.headroomTitle}>Capacity Headroom</h3>
                <div className={styles.headroomTitleDotted}></div>
                <div className={styles.headroomValue}>{currentData.headroomValue}</div>
              </div>
              <div className={styles.headroomHeaderRight}>
                <div className={styles.headroomDropdowns}>
                  <div className={styles.headroomDropdownWrap} ref={headroomRegionRef}>
                    <button
                      type="button"
                      className={styles.headroomDropdownBtn}
                      onClick={() => { setHeadroomGatewayOpen(false); setHeadroomRegionOpen((v) => !v) }}
                    >
                      {headroomRegion}
                      <span className={styles.headroomDropdownChevron}>▼</span>
                    </button>
                    {headroomRegionOpen && (
                      <div className={styles.headroomDropdownMenu}>
                        <div className={styles.headroomDropdownItem} onClick={() => { setHeadroomRegion('All Regions'); setHeadroomRegionOpen(false) }}>All Regions</div>
                        <div className={styles.headroomDropdownItem} onClick={() => { setHeadroomRegion('North America'); setHeadroomRegionOpen(false) }}>North America</div>
                        <div className={styles.headroomDropdownItem} onClick={() => { setHeadroomRegion('Europe'); setHeadroomRegionOpen(false) }}>Europe</div>
                        <div className={styles.headroomDropdownItem} onClick={() => { setHeadroomRegion('Asia Pacific'); setHeadroomRegionOpen(false) }}>Asia Pacific</div>
                      </div>
                    )}
                  </div>
                  <div className={styles.headroomDropdownWrap} ref={headroomGatewayRef}>
                    <button
                      type="button"
                      className={styles.headroomDropdownBtn}
                      onClick={() => { setHeadroomRegionOpen(false); setHeadroomGatewayOpen((v) => !v) }}
                    >
                      {headroomGateway}
                      <span className={styles.headroomDropdownChevron}>▼</span>
                    </button>
                    {headroomGatewayOpen && (
                      <div className={styles.headroomDropdownMenu}>
                        <div className={styles.headroomDropdownItem} onClick={() => { setHeadroomGateway('All Gateways'); setHeadroomGatewayOpen(false) }}>All Gateways</div>
                        <div className={styles.headroomDropdownItem} onClick={() => { setHeadroomGateway('Gateway 1'); setHeadroomGatewayOpen(false) }}>Gateway 1</div>
                        <div className={styles.headroomDropdownItem} onClick={() => { setHeadroomGateway('Gateway 2'); setHeadroomGatewayOpen(false) }}>Gateway 2</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.headroomRefresh}>
                  <button className={styles.refreshButton} aria-label="Refresh">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 4v6h-6M1 20v-6h6" />
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                    </svg>
                  </button>
                  <span className={styles.lastUpdatedText}>Last Updated</span>
                </div>
              </div>
            </div>
            <div className={styles.headroomChartContainer}>
              {renderHeadroomChart()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CurrentCapacity
