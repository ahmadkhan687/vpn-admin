'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import Sidebar from '@/components/sidebar/Sidebar'
import RealtimeReportSidebar from '@/components/realtime-report-sidebar/RealtimeReportSidebar'
import Header from '@/components/header/Header'
import styles from './cost-distribution.module.css'
import { topCostRegionDataByScope, getCostColor } from './topCostRegionData'

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const CostDistribution = () => {
  const [selectedVPN, setSelectedVPN] = useState('Portfolio')
  const [dateRange, setDateRange] = useState('Last 28 days')
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false)
  const [mapTooltipContent, setMapTooltipContent] = useState('')
  const [mapTooltipPosition, setMapTooltipPosition] = useState({ x: 0, y: 0 })
  const [barTooltipContent, setBarTooltipContent] = useState('')
  const [barTooltipPosition, setBarTooltipPosition] = useState({ x: 0, y: 0 })
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null)
  const dateDropdownRef = useRef(null)
  const mapRef = useRef(null)
  const barChartRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target)) {
        setIsDateDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isDateDropdownOpen])

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

  const dateRangeOptions = [
    { label: 'Last 7 days', range: 'Jan 9, 2026 – Jan 15, 2026' },
    { label: 'Last 14 days', range: 'Jan 2, 2026 – Jan 15, 2026' },
    { label: 'Last 28 days', range: 'Dec 19, 2025 – Jan 15, 2026' },
    { label: 'Last 90 days', range: 'Oct 18, 2025 – Jan 15, 2026' },
  ]

  // Handle VPN selection change from header dropdown
  const handleVPNChange = (vpn) => {
    setSelectedVPN(vpn)
  }

  const currentDateRange = dateRangeOptions.find((opt) => opt.label === dateRange) || dateRangeOptions[2]

  // Get data for selected scope (Portfolio = overall, VPN = that VPN's data)
  const currentData = topCostRegionDataByScope[selectedVPN] || topCostRegionDataByScope.Portfolio

  const countryNameMapping = {
    'United States of America': 'United States',
  }

  const normalizeCountryName = (name) => {
    if (!name || typeof name !== 'string') return ''
    return countryNameMapping[name.trim()] || name.trim()
  }

  const getRegionCost = (countryName) => {
    const normalized = normalizeCountryName(countryName)
    return currentData.regionCosts[normalized] || currentData.regionCosts[countryName]
  }

  const formatCost = (cost) => {
    if (cost >= 1000) return `$${(cost / 1000).toFixed(0)}k`
    return `$${cost}`
  }

  // Top cost = highest region cost on map (so value matches the darkest/highest region)
  const topCostValue = (() => {
    const costs = Object.values(currentData.regionCosts)
    if (costs.length === 0) return '$0'
    const maxCost = Math.max(...costs)
    return formatCost(maxCost)
  })()

  const handleMapMouseMove = (event) => {
    if (mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect()
      setMapTooltipPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top })
    }
  }

  const handleMapMouseEnter = (geo) => {
    const name = normalizeCountryName(geo.properties.name)
    const cost = getRegionCost(name) || getRegionCost(geo.properties.name)
    if (cost) {
      setMapTooltipContent(`${name}: ${formatCost(cost)}`)
    } else {
      setMapTooltipContent('')
    }
  }

  const handleMapMouseLeave = () => setMapTooltipContent('')

  const handleBarMouseMove = (event, index) => {
    if (barChartRef.current) {
      const rect = barChartRef.current.getBoundingClientRect()
      setBarTooltipPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top })
    }
    setHoveredBarIndex(index)
  }

  const handleBarMouseLeave = () => {
    setBarTooltipContent('')
    setHoveredBarIndex(null)
  }

  const handleBarMouseEnter = (index) => {
    setBarTooltipContent(currentData.monthlyBarData[index].tooltip)
    setHoveredBarIndex(index)
  }

  const { monthlyBarData } = currentData
  const maxBarValue = Math.max(...monthlyBarData.map((d) => d.value))

  const renderBarChart = () => {
    const barData = monthlyBarData.map((d) => d.value)
    const months = monthlyBarData.map((d) => d.month)
    const monthCount = barData.length
    const width = 800
    const height = 220
    const padding = { top: 15, right: 35, bottom: 40, left: 15 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom
    const maxVal = Math.ceil(maxBarValue / 1000) * 1000 || 6000
    const barWidth = (chartWidth / monthCount) * 0.55
    const gap = chartWidth / monthCount

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className={styles.barChartSvg} preserveAspectRatio="xMidYMid meet">
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
          <line
            key={i}
            x1={padding.left}
            y1={padding.top + chartHeight * (1 - pct)}
            x2={padding.left + chartWidth}
            y2={padding.top + chartHeight * (1 - pct)}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}
        {barData.map((val, i) => {
          const barHeight = (val / maxVal) * chartHeight
          const x = padding.left + i * gap + (gap - barWidth) / 2
          const y = padding.top + chartHeight - barHeight
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="#7F39FB"
                rx="4"
                className={hoveredBarIndex === i ? styles.barHovered : ''}
                onMouseEnter={() => handleBarMouseEnter(i)}
                onMouseMove={(e) => {
                  if (barChartRef.current) {
                    const rect = barChartRef.current.getBoundingClientRect()
                    setBarTooltipPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
                  }
                  setHoveredBarIndex(i)
                }}
                onMouseLeave={handleBarMouseLeave}
              />
            </g>
          )
        })}
        {months.map((m, i) => (
          <text
            key={i}
            x={padding.left + (i + 0.5) * gap}
            y={height - 12}
            textAnchor="middle"
            className={styles.chartAxisLabel}
          >
            {m}
          </text>
        ))}
        
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
                <h2 className={styles.pageTitle}>Cost Distribution</h2>
                <span className={styles.titlePill}>Cost and Unit Economics</span>
              </div>
              <div className={styles.dottedLine}></div>
              <p className={styles.pageDescription}>
                Where is our cost coming from, and how efficiently is it scaling with usage?
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

          <div className={styles.section}>
            <div className={styles.topCostRegionCard}>
              <div className={styles.topCostRegionHeader}>
                <div className={styles.topCostRegionTitleRow}>
                  <div className={styles.topCostRegionAccent}></div>
                  <h3 className={styles.topCostRegionTitle}>Top Cost Region</h3>
                </div>
                <div className={styles.topCostRegionValue}>{topCostValue}</div>
              </div>

              <div className={styles.topCostRegionMapSection} ref={mapRef}>
                {mapTooltipContent && (
                  <div
                    className={styles.mapTooltip}
                    style={{
                      left: mapTooltipPosition.x + 10,
                      top: mapTooltipPosition.y + 10,
                    }}
                  >
                    {mapTooltipContent}
                  </div>
                )}
                <div className={styles.mapLegend}>
                  <span className={styles.mapLegendLabel}>Regions grouped by cost</span>
                  <div className={styles.mapLegendBoxes}>
                    {[
                      { color: '#DBB2FF', label: '50k' },
                      { color: '#BB86FC', label: '200k' },
                      { color: '#7F39FB', label: '350k' },
                      { color: '#5600E8', label: '500k' },
                      { color: '#30009C', label: '750k' },
                    ].map((item) => (
                      <div key={item.label} className={styles.mapLegendBoxItem}>
                        <div
                          className={styles.mapLegendBox}
                          style={{ backgroundColor: item.color }}
                        />
                        <span className={styles.mapLegendBoxLabel}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <ComposableMap
                  className={styles.worldMap}
                  projection="geoEqualEarth"
                  projectionConfig={{ scale: 147 }}
                  width={900}
                  height={450}
                  style={{ width: '100%', height: '100%', maxWidth: '100%', objectFit: 'contain' }}
                >
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const countryName = geo.properties.name
                        const normalized = normalizeCountryName(countryName)
                        const cost = getRegionCost(normalized) || getRegionCost(countryName)
                        const fillColor = cost ? getCostColor(cost) : '#e5e7eb'

                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={fillColor}
                            stroke="#ddd"
                            strokeWidth={0.5}
                            onMouseMove={handleMapMouseMove}
                            onMouseEnter={() => handleMapMouseEnter(geo)}
                            onMouseLeave={handleMapMouseLeave}
                            style={{
                              default: { outline: 'none' },
                              hover: {
                                fill: cost ? '#7F39FB' : '#d1d5db',
                                outline: 'none',
                                cursor: 'pointer',
                              },
                              pressed: { outline: 'none' },
                            }}
                          />
                        )
                      })
                    }
                  </Geographies>
                </ComposableMap>
              </div>

              <div className={styles.topCostRegionBarSection} ref={barChartRef}>
                {renderBarChart()}
                {barTooltipContent && (
                  <div
                    className={styles.barTooltip}
                    style={{
                      left: barTooltipPosition.x + 12,
                      top: barTooltipPosition.y - 8,
                    }}
                  >
                    {barTooltipContent}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CostDistribution
