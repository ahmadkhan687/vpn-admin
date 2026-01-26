'use client'

import React, { useState, useRef } from 'react'
import GaugeChart from 'react-gauge-chart'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import Sidebar from '@/components/sidebar/Sidebar'
import RealtimeReportSidebar from '@/components/realtime-report-sidebar/RealtimeReportSidebar'
import Header from '@/components/header/Header'
import styles from './kpi-summary.module.css'
import { kpiSummaryData } from './kpiSummaryData'

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const KPISummary = () => {
  const [selectedVPN, setSelectedVPN] = useState('Portfolio')
  const [activeTab, setActiveTab] = useState('Overview')
  const [activeSubTab, setActiveSubTab] = useState('Core Metrics')
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false)
  const [comparisonVPNs, setComparisonVPNs] = useState([])
  const [isComparisonMode, setIsComparisonMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Network Health and Stability')
  const [selectedMetric, setSelectedMetric] = useState('Median Latency')
  const [tooltipContent, setTooltipContent] = useState('')
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const mapRef = useRef(null)
  const [liveSessionTooltipContent, setLiveSessionTooltipContent] = useState('')
  const [liveSessionTooltipPosition, setLiveSessionTooltipPosition] = useState({ x: 0, y: 0 })
  const liveSessionMapRef = useRef(null)

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

  // VPN data for comparison modal
  const vpnComparisonData = [
    {
      name: 'Fortivo',
      description: 'Primary enterprise VPN with full production traffic.',
      summary: 'Represents overall baseline usage and performance.',
    },
    {
      name: 'Steer Lucid',
      description: 'Growth-focused VPN with users acquired through organic discovery.',
      summary: 'Strong direct usage with consistent session patterns.',
    },
    {
      name: 'Nexipher',
      description: 'High-usage VPN primarily accessed by returning and power users.',
      summary: 'Usage driven by search and non-paid channels.',
    },
    {
      name: 'Slick',
      description: 'Marketing-led VPN with traffic influenced by paid acquisition.',
      summary: 'Higher variability due to campaign-driven usage.',
    },
    {
      name: 'Crest',
      description: 'VPNs acquired via referrals or affiliates.',
      summary: 'Usage concentrated around referral-based access.',
    },
    {
      name: 'Qucik',
      description: 'Lightweight VPN commonly accessed through direct communication links.',
      summary: 'Short, intent-driven sessions from owned channels.',
    },
  ]

  // Handle VPN selection change from header dropdown
  const handleVPNChange = (vpn) => {
    setSelectedVPN(vpn)
  }

  // Handle comparison VPN selection
  const handleComparisonVPNToggle = (vpnName) => {
    setComparisonVPNs((prev) => {
      if (prev.includes(vpnName)) {
        const updated = prev.filter((v) => v !== vpnName)
        if (updated.length < 2) {
          setIsComparisonMode(false)
        }
        return updated
      } else {
        if (prev.length < 2) {
          const updated = [...prev, vpnName]
          if (updated.length === 2) {
            setIsComparisonMode(true)
          }
          return updated
        }
        return prev
      }
    })
  }

  // Remove comparison VPN
  const removeComparisonVPN = (vpnName) => {
    setComparisonVPNs((prev) => {
      const updated = prev.filter((v) => v !== vpnName)
      if (updated.length < 2) {
        setIsComparisonMode(false)
      }
      return updated
    })
  }

  // Apply comparison
  const handleApplyComparison = () => {
    if (comparisonVPNs.length === 2) {
      setIsComparisonMode(true)
      setIsComparisonModalOpen(false)
    }
  }

  // Filter VPNs based on search
  const filteredVPNs = vpnComparisonData.filter((vpn) =>
    vpn.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Category and Metrics data
  const categoryMetrics = {
    'Network Health and Stability': [
      'Active Tunnels',
      'Peak Concurrency',
      'Median Latency',
      'Region Health State',
      'Tunnel Drop Rate',
      'Auth Failure Rate',
      'Packet Loss',
    ],
    'Capacity and Scaling': [
      'Overall Capacity',
      'Current Utilisation',
      'Capacity Headroom',
      'Sessions Per Node',
      'Autoscale Events',
      'Peak Hour Load',
    ],
    'Cost and Unit Economics': [
      'Egress GB Per Minute',
      'Cost Per Hour',
      'Cost Per GB',
      'Cost Per Concurrent User',
      'Free User Cost Share',
      'Top Cost Region',
    ],
    'Protocol and Traffic Mix': [
      'Protocol Distribution',
      'Avg Session Duration',
      'Egress Per Session',
      'Reconnect Frequency',
      'MTU Errors',
    ],
    'Growth and Product Performance': [
      'New Users',
      'New Devices',
      'DAU',
      'MAU',
      'Sessions Per User',
      'Trial to Paid Conversion',
      'Churn Rate',
    ],
    'Compliance and Governance': [
      'IPDR Access Count',
      'IPDR Audit Log Integrity',
      'Retention Compliance',
      'Legal Request SLA',
    ],
  }

  // Top Regions data (changes based on category and metric)
  const getTopRegions = () => {
    // Sample data - in real app, this would come from API based on category and metric
    const baseRegions = [
      { country: 'USA', flag: 'https://ipgeolocation.io/static/flags/us_64.png', value: '86%', status: 'critical' },
      { country: 'UK', flag: 'https://ipgeolocation.io/static/flags/gb_64.png', value: '67%', status: 'healthy' },
      { country: 'India', flag: 'https://ipgeolocation.io/static/flags/in_64.png', value: '56%', status: 'strained' },
      { country: 'Canada', flag: 'https://ipgeolocation.io/static/flags/ca_64.png', value: '78%', status: 'strained' },
      { country: 'Germany', flag: 'https://ipgeolocation.io/static/flags/de_64.png', value: '92%', status: 'critical' },
    ]

    // Values change based on category and metric
    if (selectedCategory === 'Network Health and Stability') {
      if (selectedMetric === 'Median Latency') {
        return [
          { country: 'USA', flag: 'https://ipgeolocation.io/static/flags/us_64.png', value: '86%', status: 'critical' },
          { country: 'UK', flag: 'https://ipgeolocation.io/static/flags/gb_64.png', value: '67%', status: 'healthy' },
          { country: 'India', flag: 'https://ipgeolocation.io/static/flags/in_64.png', value: '56%', status: 'strained' },
          { country: 'Canada', flag: 'https://ipgeolocation.io/static/flags/ca_64.png', value: '78%', status: 'strained' },
          { country: 'Germany', flag: 'https://ipgeolocation.io/static/flags/de_64.png', value: '92%', status: 'critical' },
        ]
      }
      // Default for other metrics
      return baseRegions.map((r, i) => ({
        ...r,
        value: `${85 - i * 5}%`,
        status: i % 3 === 0 ? 'critical' : i % 3 === 1 ? 'healthy' : 'strained',
      }))
    }
    if (selectedCategory === 'Capacity and Scaling') {
      return baseRegions.map((r, i) => ({
        ...r,
        value: `${92 - i * 4}%`,
        status: i % 3 === 0 ? 'critical' : i % 3 === 1 ? 'strained' : 'healthy',
      }))
    }
    if (selectedCategory === 'Cost and Unit Economics') {
      return baseRegions.map((r, i) => ({
        ...r,
        value: `${88 - i * 5}%`,
        status: i % 3 === 0 ? 'critical' : i % 3 === 1 ? 'strained' : 'healthy',
      }))
    }
    if (selectedCategory === 'Protocol and Traffic Mix') {
      return baseRegions.map((r, i) => ({
        ...r,
        value: `${85 - i * 4}%`,
        status: i % 3 === 0 ? 'critical' : i % 3 === 1 ? 'strained' : 'healthy',
      }))
    }
    if (selectedCategory === 'Growth and Product Performance') {
      return baseRegions.map((r, i) => ({
        ...r,
        value: `${90 - i * 5}%`,
        status: i % 3 === 0 ? 'critical' : i % 3 === 1 ? 'strained' : 'healthy',
      }))
    }
    if (selectedCategory === 'Compliance and Governance') {
      return baseRegions.map((r, i) => ({
        ...r,
        value: `${94 - i * 4}%`,
        status: i % 3 === 0 ? 'critical' : i % 3 === 1 ? 'strained' : 'healthy',
      }))
    }
    return baseRegions
  }

  const topRegions = getTopRegions()

  // Map helper functions (from dashboard)
  const countryNameMapping = {
    'United States of America': 'United States',
    'United Kingdom': 'United Kingdom',
  }

  const normalizeCountryName = (geoCountryName) => {
    if (!geoCountryName || typeof geoCountryName !== 'string') {
      return 'Unknown Country'
    }
    return countryNameMapping[geoCountryName.trim()] || geoCountryName.trim()
  }

  const fallbackColor = '#BFDBFE' // Light blue for unselected countries
  const selectedColor = '#1E40AF' // Dark blue for selected countries

  const countryColorMapping = {
    pakistan: '#006600',
    india: '#FF9933',
    bangladesh: '#1fab1f',
    russia: '#0033A0',
    'united arab emirates': '#000000',
    'united states': '#FF0000',
    'saudi arabia': 'purple',
    'usa 1': '#FF0000',
    'usa 2': '#FF0000',
    'usa 3': '#FF0000',
    'india 1': '#FF9933',
    'india 2': '#FF9933',
    germany: '#000000',
    finland: 'lightblue',
    france: 'blue',
    myanmar: '#A52A2A',
    afghanistan: '#FF0000',
    netherlands: '#FF9606',
    'singapore 1': 'pink',
    'singapore 2': 'pink',
    uk: '#263252',
    australia: '#F7D800',
    japan: '#C3202F',
  }

  const getCountryColor = (countryName) => {
    const normalizedCountryName = normalizeCountryName(
      (countryName || '').trim()
    )
    const lowerCaseName = normalizedCountryName.toLowerCase()
    return countryColorMapping[lowerCaseName] || fallbackColor
  }

  const handleMouseMove = (event) => {
    if (mapRef.current) {
      const mapRect = mapRef.current.getBoundingClientRect()
      setTooltipPosition({
        x: event.clientX - mapRect.left,
        y: event.clientY - mapRect.top,
      })
    }
  }

  // Map region names to country names for tooltip matching
  const getRegionFromCountry = (countryName) => {
    const regionMap = {
      'United States': 'USA',
      'United States of America': 'USA',
      'United Kingdom': 'UK',
      'India': 'India',
      'Canada': 'Canada',
      'Germany': 'Germany',
    }
    
    const normalizedName = normalizeCountryName(countryName)
    const regionKey = regionMap[normalizedName] || regionMap[countryName]
    
    if (regionKey) {
      return topRegions.find(r => r.country === regionKey)
    }
    return null
  }

  const handleMouseEnter = (geo) => {
    const countryName = normalizeCountryName(geo.properties.name.trim())
    const region = getRegionFromCountry(countryName)
    
    if (region) {
      setTooltipContent(`${region.country}: ${region.value}`)
    } else {
      setTooltipContent('')
    }
  }

  const handleMouseLeave = () => {
    setTooltipContent('')
  }

  // Live Sessions Map handlers
  const handleLiveSessionMouseMove = (event) => {
    if (liveSessionMapRef.current) {
      const mapRect = liveSessionMapRef.current.getBoundingClientRect()
      setLiveSessionTooltipPosition({
        x: event.clientX - mapRect.left,
        y: event.clientY - mapRect.top,
      })
    }
  }

  const handleLiveSessionMouseEnter = (countryData) => {
    if (!countryData || !countryData.CountryName) {
      setLiveSessionTooltipContent('Unknown Country: 0')
      return
    }
    setLiveSessionTooltipContent(
      `${countryData.CountryName.trim()}: ${countryData.Count || 0}`
    )
  }

  const handleLiveSessionMouseLeave = () => {
    setLiveSessionTooltipContent('')
  }

  // Jammu Kashmir GeoJSON (from dashboard)
  const jammuKashmirGeoJSON = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates: [
            [73.62640551195065, 37.28050348723224],
            [73.56693020162257, 32.32802077733206],
            [75.259879122026, 32.410817827161424],
            [75.86850875795051, 32.486148834405014],
            [75.87527942284396, 32.9581786781788],
            [76.27626972990129, 33.15918001141034],
            [77.03764258686874, 32.989236875787626],
            [78.5186879735819, 32.575270654636356],
            [79.21075822861314, 32.44478646850503],
            [79.54871655766908, 32.70936757947311],
            [79.16447722481644, 33.30375582012839],
            [78.97199650858181, 33.91317822357689],
            [79.57766045618627, 34.16788205541802],
            [79.90622527757301, 34.60254052967859],
            [80.4785278468209, 35.070322502300016],
            [80.45435729220827, 35.41025055689893],
            [79.93454401387186, 35.64227978849638],
            [79.50245663496253, 35.826427593569065],
            [79.02988462955864, 35.925610994630944],
            [78.50964976481521, 35.79997691293201],
            [78.02841258372843, 35.644551122054224],
            [77.60411025281383, 35.48718916120049],
            [77.19552868176288, 35.6070706312218],
            [76.78879348546485, 35.76735561866083],
          ],
          type: 'LineString',
        },
      },
      {
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates: [
            [76.71951899574572, 35.75455215215031],
            [76.99889057541486, 34.97211345767823],
            [76.70338007296681, 34.783822840550826],
            [75.53292496036693, 34.48258978538203],
            [74.49541671264637, 34.70938286915123],
            [74.05932424156131, 34.695644556367],
            [73.59345079466243, 34.22517004458844],
          ],
          type: 'LineString',
        },
      },
    ],
  }

  // Get KPI data for selected VPN
  const currentKPIData = kpiSummaryData[selectedVPN] || kpiSummaryData['Portfolio']

  // Get Live Sessions data for selected VPN
  const currentLiveSessionsData = currentKPIData?.liveSessions || kpiSummaryData['Portfolio'].liveSessions

  // Live Sessions Country Data (from data file based on selected VPN)
  const liveSessionCountryData = currentLiveSessionsData?.countryData || []

  const cleanedLiveSessionCountries = liveSessionCountryData.map((session) => ({
    ...session,
    CountryName: session.CountryName.trim(),
  }))

  // Cost Per Active User chart data (7 days: Monday to Sunday)
  const costPerActiveUserData = [
    { day: 'M', value: 225 }, // Monday
    { day: 'T', value: 285 }, // Tuesday
    { day: 'W', value: 225 }, // Wednesday
    { day: 'T', value: 495 }, // Thursday (peak)
    { day: 'F', value: 360 }, // Friday
    { day: 'S', value: 410 }, // Saturday
    { day: 'S', value: 260 }, // Sunday
  ]

  // Render Cost Per Active User chart
  const renderCostChart = () => {
    const width = 1000
    const height = 250
    const padding = { top: 20, right: 20, bottom: 40, left: 60 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Get data for comparison mode
    let primaryData = costPerActiveUserData
    let secondaryData = null
    
    if (isComparisonMode && comparisonVPNs.length === 2) {
      // Use sample data for comparison - you can replace with actual data from kpiSummaryData
      primaryData = [
        { day: 'M', value: 260 },
        { day: 'T', value: 290 },
        { day: 'W', value: 270 },
        { day: 'T', value: 360 },
        { day: 'F', value: 320 },
        { day: 'S', value: 340 },
        { day: 'S', value: 280 },
      ]
      
      secondaryData = [
        { day: 'M', value: 200 },
        { day: 'T', value: 285 },
        { day: 'W', value: 225 },
        { day: 'T', value: 495 },
        { day: 'F', value: 360 },
        { day: 'S', value: 410 },
        { day: 'S', value: 300 },
      ]
    }

    const allValues = isComparisonMode && secondaryData 
      ? [...primaryData.map(d => d.value), ...secondaryData.map(d => d.value)]
      : primaryData.map(d => d.value)
    
    const maxValue = Math.max(...allValues)
    const minValue = Math.min(...allValues)
    const range = maxValue - minValue || 1

    // Calculate points for primary line
    const primaryPoints = primaryData.map((d, index) => {
      const x = padding.left + (index / (primaryData.length - 1)) * chartWidth
      const y = padding.top + chartHeight - ((d.value - minValue) / range) * chartHeight
      return { x, y, value: d.value, day: d.day }
    })

    // Calculate points for secondary line (if comparison mode)
    let secondaryPoints = null
    if (isComparisonMode && secondaryData) {
      secondaryPoints = secondaryData.map((d, index) => {
        const x = padding.left + (index / (secondaryData.length - 1)) * chartWidth
        const y = padding.top + chartHeight - ((d.value - minValue) / range) * chartHeight
        return { x, y, value: d.value, day: d.day }
      })
    }

    // Create area path for primary line
    const primaryAreaPath = [
      `M ${primaryPoints[0].x} ${padding.top + chartHeight}`,
      ...primaryPoints.map(p => `L ${p.x} ${p.y}`),
      `L ${primaryPoints[primaryPoints.length - 1].x} ${padding.top + chartHeight}`,
      'Z'
    ].join(' ')

    // Create line path for primary
    const primaryLinePath = primaryPoints.map((p, i) => (i === 0 ? 'M' : 'L') + ` ${p.x} ${p.y}`).join(' ')

    // Create line path for secondary (if comparison mode)
    let secondaryLinePath = null
    if (secondaryPoints) {
      secondaryLinePath = secondaryPoints.map((p, i) => (i === 0 ? 'M' : 'L') + ` ${p.x} ${p.y}`).join(' ')
    }

    // Find peak point (Thursday)
    const peakPoint = primaryPoints[3] // Thursday is index 3

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className={styles.costChart} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.05)" />
          </linearGradient>
        </defs>
        
        {/* Y-axis labels */}
        <text x={padding.left - 10} y={padding.top} textAnchor="end" className={styles.axisLabel}>500</text>
        <text x={padding.left - 10} y={padding.top + chartHeight / 2} textAnchor="end" className={styles.axisLabel}>250</text>
        <text x={padding.left - 10} y={padding.top + chartHeight} textAnchor="end" className={styles.axisLabel}>0</text>
        
        {/* Y-axis line */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + chartHeight}
          stroke="#e5e7eb"
          strokeWidth="1"
        />
        
        {/* X-axis labels */}
        {primaryData.map((d, index) => {
          const x = padding.left + (index / (primaryData.length - 1)) * chartWidth
          return (
            <text
              key={index}
              x={x}
              y={height - padding.bottom + 20}
              textAnchor="middle"
              className={styles.axisLabel}
            >
              {d.day}
            </text>
          )
        })}
        
        {/* X-axis line */}
        <line
          x1={padding.left}
          y1={padding.top + chartHeight}
          x2={padding.left + chartWidth}
          y2={padding.top + chartHeight}
          stroke="#e5e7eb"
          strokeWidth="1"
        />
        
        {/* Area fill for primary line */}
        {!isComparisonMode && (
          <path d={primaryAreaPath} fill="url(#areaGradient)" />
        )}
        
        {/* Secondary line area (if comparison mode) */}
        {isComparisonMode && secondaryPoints && (
          <defs>
            <linearGradient id="secondaryAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(147, 51, 234, 0.3)" />
              <stop offset="100%" stopColor="rgba(147, 51, 234, 0.05)" />
            </linearGradient>
          </defs>
        )}
        
        {isComparisonMode && secondaryPoints && (
          <path
            d={[
              `M ${secondaryPoints[0].x} ${padding.top + chartHeight}`,
              ...secondaryPoints.map(p => `L ${p.x} ${p.y}`),
              `L ${secondaryPoints[secondaryPoints.length - 1].x} ${padding.top + chartHeight}`,
              'Z'
            ].join(' ')}
            fill="url(#secondaryAreaGradient)"
          />
        )}
        
        {/* Primary line */}
        <path
          d={primaryLinePath}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Secondary line (if comparison mode) */}
        {isComparisonMode && secondaryLinePath && (
          <path
            d={secondaryLinePath}
            fill="none"
            stroke="#9333ea"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        
        {/* Data points for primary line */}
        {primaryPoints.map((point, index) => (
          <circle
            key={`primary-${index}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#ffffff"
            stroke="#3b82f6"
            strokeWidth="2"
          />
        ))}
        
        {/* Data points for secondary line (if comparison mode) */}
        {isComparisonMode && secondaryPoints && secondaryPoints.map((point, index) => (
          <circle
            key={`secondary-${index}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#ffffff"
            stroke="#9333ea"
            strokeWidth="2"
          />
        ))}
        
        {/* Peak marker (Thursday - blue circle with white dot) */}
        {!isComparisonMode && (
          <>
            <circle
              cx={peakPoint.x}
              cy={peakPoint.y}
              r="8"
              fill="#3b82f6"
            />
            <circle
              cx={peakPoint.x}
              cy={peakPoint.y}
              r="4"
              fill="#ffffff"
            />
          </>
        )}
        
        {/* Peak marker for secondary line (if comparison mode) */}
        {isComparisonMode && secondaryPoints && (
          <>
            <circle
              cx={secondaryPoints[3].x}
              cy={secondaryPoints[3].y}
              r="8"
              fill="#9333ea"
            />
            <circle
              cx={secondaryPoints[3].x}
              cy={secondaryPoints[3].y}
              r="4"
              fill="#ffffff"
            />
          </>
        )}
      </svg>
    )
  }

  // Helper function to render KPI card
  const renderKPICard = (title, data, comparisonData = null) => {
    if (!data) return null
    
    const statusClass = {
      critical: styles.statusCritical,
      strained: styles.statusStrained,
      healthy: styles.statusHealthy,
      stable: styles.statusStable,
    }
    
    const statusTextClass = {
      critical: styles.statusCriticalText,
      strained: styles.statusStrainedText,
      healthy: styles.statusHealthyText,
      stable: styles.statusStableText,
    }
    
    const statusLabel = {
      critical: 'Critical',
      strained: 'Strained',
      healthy: 'Healthy',
      stable: 'Stable',
    }
    
    const statusIndicator = styles.statusDot
    
    // If comparison mode and comparison data exists, show comparison card
    if (isComparisonMode && comparisonData && comparisonVPNs.length === 2) {
      return (
        <div className={styles.kpiCard}>
          <div className={styles.kpiCardTitle}>{title}</div>
          <div className={styles.comparisonCardContent}>
            <div className={styles.comparisonVPNColumn}>
              <div className={`${styles.comparisonVPNPill} ${styles.pillBlue}`}>
                <div className={`${styles.pillIcon} ${styles.iconBlue}`}>
                  {comparisonVPNs[0].charAt(0)}
                </div>
                <span>{comparisonVPNs[0]}</span>
              </div>
              <div className={styles.kpiCardValue}>{data.value}</div>
              <div className={styles.kpiCardMeta}>
                <div className={styles.statusGroup}>
                  <span className={`${statusIndicator} ${statusClass[data.status]}`}></span>
                  <span className={`${styles.statusText} ${statusTextClass[data.status]}`}>
                    {statusLabel[data.status]}
                  </span>
                </div>
                {data.trend && (
                  <div className={styles.trendGroup}>
                    <span className={data.trend === 'declining' ? `${styles.trendArrow} ${styles.trendArrowDown}` : styles.trendArrow}>
                      {data.trend === 'rising' ? '↑' : '↓'}
                    </span>
                    <span className={styles.trendText}>
                      {data.trend === 'rising' ? 'Rising' : 'Declining'} {data.trendValue}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.comparisonSeparatorVertical}></div>
            <div className={styles.comparisonVPNColumn}>
              <div className={`${styles.comparisonVPNPill} ${styles.pillPurple}`}>
                <div className={`${styles.pillIcon} ${styles.iconPurple}`}>
                  {comparisonVPNs[1].charAt(0)}
                </div>
                <span>{comparisonVPNs[1]}</span>
              </div>
              <div className={styles.kpiCardValue}>{comparisonData.value}</div>
              <div className={styles.kpiCardMeta}>
                <div className={styles.statusGroup}>
                  <span className={`${statusIndicator} ${statusClass[comparisonData.status]}`}></span>
                  <span className={`${styles.statusText} ${statusTextClass[comparisonData.status]}`}>
                    {statusLabel[comparisonData.status]}
                  </span>
                </div>
                {comparisonData.trend && (
                  <div className={styles.trendGroup}>
                    <span className={comparisonData.trend === 'declining' ? `${styles.trendArrow} ${styles.trendArrowDown}` : styles.trendArrow}>
                      {comparisonData.trend === 'rising' ? '↑' : '↓'}
                    </span>
                    <span className={styles.trendText}>
                      {comparisonData.trend === 'rising' ? 'Rising' : 'Declining'} {comparisonData.trendValue}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={styles.comparisonCardFooter}>
            <button className={styles.viewBreakdownBtn}>View Breakdown →</button>
          </div>
        </div>
      )
    }
    
    // Normal single VPN card
    return (
      <div className={styles.kpiCard}>
        <div className={styles.kpiCardTitle}>{title}</div>
        <div className={styles.kpiCardValue}>{data.value}</div>
        <div className={styles.kpiCardMeta}>
          <div className={styles.statusGroup}>
            <span className={`${statusIndicator} ${statusClass[data.status]}`}></span>
            <span className={`${styles.statusText} ${statusTextClass[data.status]}`}>
              {statusLabel[data.status]}
            </span>
          </div>
          {data.trend && (
            <div className={styles.trendGroup}>
              <span className={data.trend === 'declining' ? `${styles.trendArrow} ${styles.trendArrowDown}` : styles.trendArrow}>
                {data.trend === 'rising' ? '↑' : '↓'}
              </span>
              <span className={styles.trendText}>
                {data.trend === 'rising' ? 'Rising' : 'Declining'} {data.trendValue}
              </span>
            </div>
          )}
        </div>
        <button className={styles.viewBreakdownBtn}>View Breakdown →</button>
      </div>
    )
  }

  // Helper function to render Live By VPN donut chart
  const renderLiveByVpnDonutChart = () => {
    const vpns = currentLiveSessionsData?.liveByVpn?.vpns || []
    const colors = ['#1e40af', '#9333ea', '#ec4899', '#f97316', '#22c55e']
    const radius = 80
    const circumference = 2 * Math.PI * radius
    let currentOffset = 0

    return (
      <svg width="200" height="200" viewBox="0 0 200 200" className={styles.donutChart}>
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="30"
        />
        {vpns.map((vpn, index) => {
          const percentage = vpn.percentage / 100
          const dashArray = `${circumference * percentage} ${circumference}`
          const offset = currentOffset
          currentOffset -= circumference * percentage
          
          return (
            <circle
              key={index}
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={colors[index % colors.length]}
              strokeWidth="30"
              strokeDasharray={dashArray}
              strokeDashoffset={offset}
              transform="rotate(-90 100 100)"
            />
          )
        })}
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
          {/* Comparison Bar - Top of all pages */}
          <div className={`${styles.comparisonBar} ${activeSubTab === 'Per VPN' && selectedVPN !== 'Portfolio' ? styles.comparisonBarActive : styles.comparisonBarInactive} ${isComparisonMode && comparisonVPNs.length === 2 ? styles.comparisonBarExpanded : ''}`}>
            {/* Comparison VPNs Display - Left side of toggle */}
            {isComparisonMode && comparisonVPNs.length > 0 && activeSubTab === 'Per VPN' && (
              <>
                {comparisonVPNs.map((vpn, index) => (
                  <React.Fragment key={vpn}>
                    {index > 0 && <div className={styles.comparisonSeparator}></div>}
                    <div className={`${styles.comparisonVPNPill} ${index === 0 ? styles.pillBlue : styles.pillPurple}`}>
                      <div className={`${styles.pillIcon} ${index === 0 ? styles.iconBlue : styles.iconPurple}`}>
                        {vpn.charAt(0)}
                      </div>
                      <span>{vpn}</span>
                      <button
                        className={styles.pillRemoveBtn}
                        onClick={() => removeComparisonVPN(vpn)}
                      >
                        ×
                      </button>
                    </div>
                  </React.Fragment>
                ))}
                <div className={styles.comparisonSeparator}></div>
              </>
            )}
            
            <div className={styles.comparisonToggle}>
              <label className={styles.toggleSwitch}>
                <input 
                  type="checkbox" 
                  checked={isComparisonMode && comparisonVPNs.length === 2}
                  onChange={(e) => {
                    if (e.target.checked && comparisonVPNs.length === 2) {
                      setIsComparisonMode(true)
                    } else {
                      setIsComparisonMode(false)
                    }
                  }}
                  disabled={activeSubTab !== 'Per VPN' || selectedVPN === 'Portfolio' || comparisonVPNs.length < 2}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>
            <div className={styles.comparisonSeparator}></div>
            <button 
              className={styles.addComparisonButton}
              disabled={activeSubTab !== 'Per VPN' || selectedVPN === 'Portfolio'}
              onClick={() => activeSubTab === 'Per VPN' && selectedVPN !== 'Portfolio' && setIsComparisonModalOpen(true)}
            >
              <span>Add a Comparison</span>
              <span className={styles.addComparisonIcon}>+</span>
            </button>
          </div>

          <div className={styles.tabsContainer}>
            <div className={styles.tabsWrapper}>
              <button
                className={`${styles.tab} ${activeTab === 'Overview' ? styles.tabActive : styles.tabInactive}`}
                onClick={() => setActiveTab('Overview')}
              >
                Overview
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'Live Sessions' ? styles.tabActive : styles.tabInactive}`}
                onClick={() => setActiveTab('Live Sessions')}
              >
                Live Sessions
              </button>
            </div>
          </div>

          {activeTab === 'Overview' && (
            <>
              <div className={styles.subTabsContainer}>
                <div className={styles.subTabsWrapper}>
                  <button
                    className={`${styles.subTab} ${activeSubTab === 'Core Metrics' ? styles.subTabActive : styles.subTabInactive}`}
                    onClick={() => setActiveSubTab('Core Metrics')}
                  >
                    Core Metrics
                  </button>
                  <button
                    className={`${styles.subTab} ${activeSubTab === 'Per VPN' ? styles.subTabActive : styles.subTabInactive}`}
                    onClick={() => setActiveSubTab('Per VPN')}
                  >
                    Per VPN
                  </button>
                  <button
                    className={`${styles.subTab} ${activeSubTab === 'Per Region' ? styles.subTabActive : styles.subTabInactive}`}
                    onClick={() => setActiveSubTab('Per Region')}
                  >
                    Per Region
                  </button>
                </div>
                <div className={styles.subTabsSeparator}></div>
              </div>

              {activeSubTab === 'Core Metrics' && (
                <div className={styles.kpiSections}>
                {/* Cost and Unit Economics */}
                <div className={styles.kpiSection}>
                  <div className={styles.sectionHeader}>
                    <button className={styles.sectionTitlePill}>Cost and Unit Economics</button>
                    <a href="#" className={styles.viewAllLink}>View All Metrics →</a>
                  </div>
                  <p className={styles.sectionQuestion}>Is the Business Growing Profitably?</p>
                  <div className={styles.kpiCardsGrid}>
                    {renderKPICard('COST PER ACTIVE USER', currentKPIData.costAndUnitEconomics.costPerActiveUser)}
                    {renderKPICard('EGRESS GB PER MINUTE', currentKPIData.costAndUnitEconomics.egressGBPerMinute)}
                    {renderKPICard('COST PER GB', currentKPIData.costAndUnitEconomics.costPerGB)}
                    {renderKPICard('FREE USER COST SHARE', currentKPIData.costAndUnitEconomics.freeUserCostShare)}
                  </div>
                </div>

                {/* Growth and Performance */}
                <div className={styles.kpiSection}>
                  <div className={styles.sectionHeader}>
                    <button className={styles.sectionTitlePill}>Growth and Performance</button>
                    <a href="#" className={styles.viewAllLink}>View All Metrics →</a>
                  </div>
                  <p className={styles.sectionQuestion}>Are we attracting and converting new users?</p>
                  <div className={styles.kpiCardsGrid}>
                    {renderKPICard('NEW USERS', currentKPIData.growthAndPerformance.newUsers)}
                    {renderKPICard('NEW DEVICES', currentKPIData.growthAndPerformance.newDevices)}
                    {renderKPICard('TRAIL USERS', currentKPIData.growthAndPerformance.trailUsers)}
                    {renderKPICard('TRIAL TO PAID CONVERSION', currentKPIData.growthAndPerformance.trialToPaidConversion)}
                  </div>
                </div>

                {/* Network Health and Stability & Protocol and Traffic Mix - Same Row */}
                <div className={styles.twoColumnRow}>
                  <div className={styles.kpiSection}>
                    <div className={styles.sectionHeader}>
                      <button className={styles.sectionTitlePill}>Network Health and Stability</button>
                      <a href="#" className={styles.viewAllLink}>View All Metrics →</a>
                    </div>
                    <p className={styles.sectionQuestion}>Are Users engaged and satisfied?</p>
                    <div className={styles.kpiCardsGrid}>
                      {renderKPICard('ACTIVE TUNNELS', currentKPIData.networkHealth.activeTunnels)}
                      {renderKPICard('MEDIAN LATENCY', currentKPIData.networkHealth.medianLatency)}
                    </div>
                  </div>

                  <div className={styles.kpiSection}>
                    <div className={styles.sectionHeader}>
                      <button className={styles.sectionTitlePill}>Protocol and Traffic Mix</button>
                      <a href="#" className={styles.viewAllLink}>View All Metrics →</a>
                    </div>
                    <p className={styles.sectionQuestion}>Is the platform secure and compliant?</p>
                    <div className={styles.kpiCardsGrid}>
                      {renderKPICard('AVG SESSION DURATION', currentKPIData.protocolAndTraffic.avgSessionDuration)}
                      {renderKPICard('EGRESS PER SESSION', currentKPIData.protocolAndTraffic.egressPerSession)}
                    </div>
                  </div>
                </div>

                {/* Capacity and Scaling & Compliance and Governance - Same Row */}
                <div className={styles.twoColumnRow}>
                  <div className={styles.kpiSection}>
                    <div className={styles.sectionHeader}>
                      <button className={styles.sectionTitlePill}>Capacity and Scaling</button>
                      <a href="#" className={styles.viewAllLink}>View All Metrics →</a>
                    </div>
                    <p className={styles.sectionQuestion}>Are Users engaged and satisfied?</p>
                    <div className={styles.kpiCardsGrid}>
                      {renderKPICard('CURRENT UTILIZATION', currentKPIData.capacityAndScaling.currentUtilization)}
                      {renderKPICard('SESSIONS PER NODE', currentKPIData.capacityAndScaling.sessionsPerNode)}
                    </div>
                  </div>

                  <div className={styles.kpiSection}>
                    <div className={styles.sectionHeader}>
                      <button className={styles.sectionTitlePill}>Compliance and Governance</button>
                      <a href="#" className={styles.viewAllLink}>View All Metrics →</a>
                    </div>
                    <p className={styles.sectionQuestion}>Is the platform secure and compliant?</p>
                    <div className={styles.kpiCardsGrid}>
                      {renderKPICard('IPDR ACCESS COUNT', currentKPIData.complianceAndGovernance.ipdrAccessCount)}
                      {renderKPICard('LEGAL REQUEST SLA', currentKPIData.complianceAndGovernance.legalRequestSLA)}
                    </div>
                  </div>
                </div>
                </div>
              )}

              {activeSubTab === 'Per VPN' && (
                <>
                  {selectedVPN === 'Portfolio' ? (
                    <div 
                      className={styles.popupOverlay}
                      onClick={() => setActiveSubTab('Core Metrics')}
                    >
                      <div 
                        className={styles.popupContent}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className={styles.popupIcon}>⚠️</div>
                        <h3 className={styles.popupTitle}>Please Select a VPN</h3>
                        <p className={styles.popupMessage}>
                          To view Per VPN metrics, please select a specific VPN from the dropdown below or from the scope dropdown in the header.
                        </p>
                        <div className={styles.popupDropdownContainer}>
                          <label className={styles.popupDropdownLabel}>Select VPN:</label>
                          <select
                            className={styles.popupDropdown}
                            value={selectedVPN}
                            onChange={(e) => {
                              handleVPNChange(e.target.value)
                              setActiveSubTab('Per VPN')
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {scopeOptions.map((vpn) => (
                              <option key={vpn} value={vpn}>
                                {vpn}
                              </option>
                            ))}
                          </select>
                        </div>
                        <p className={styles.popupHint}>
                          Change the scope to view detailed metrics for individual VPNs.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.perVpnContent}>
                      <div className={styles.perVpnGrid}>
                        {/* Status Card */}
                        <div className={styles.statusCard}>
                          <div className={styles.statusCardContent}>
                            <div className={styles.statusCardLeft}>
                              <div className={styles.statusHeading}>
                                <span className={styles.statusLabel}>Status:</span>
                                <span className={`${styles.statusValue} ${styles[`status${currentKPIData.costAndUnitEconomics.costPerActiveUser.status.charAt(0).toUpperCase() + currentKPIData.costAndUnitEconomics.costPerActiveUser.status.slice(1)}`]}`}>
                                  {currentKPIData.costAndUnitEconomics.costPerActiveUser.status.charAt(0).toUpperCase() + currentKPIData.costAndUnitEconomics.costPerActiveUser.status.slice(1)}
                                </span>
                              </div>
                              <div className={styles.kpiInfoLine}>
                                Core KPI: Capacity and Scaling
                              </div>
                              <div className={styles.kpiInfoLine}>
                                Primary Driver: Cost Per Active User
                              </div>
                            </div>
                            <div className={styles.statusCardCenter}>
                              <div className={styles.vpnLogoSection}>
                                <div className={styles.vpnLogo}>
                                  <div className={styles.vpnLogoCircle}>
                                    {selectedVPN.charAt(0)}
                                  </div>
                                </div>
                                <div className={styles.vpnScope}>
                                  Default Scope: {selectedVPN} VPN
                                </div>
                              </div>
                            </div>
                            <div className={styles.statusCardRight}>
                              <div className={styles.gaugeSection}>
                                <div className={styles.gaugeContainer}>
                                  <GaugeChart
                                    id={`per-vpn-gauge-${selectedVPN}`}
                                    nrOfLevels={5}
                                    percent={(() => {
                                      const status = currentKPIData.costAndUnitEconomics.costPerActiveUser.status
                                      if (status === 'critical') return 0.9
                                      if (status === 'strained') return 0.7
                                      if (status === 'healthy') return 0.3
                                      if (status === 'stable') return 0.5
                                      return 0.5
                                    })()}
                                    colors={[
                                      'rgba(34, 197, 94, 1)', // Green
                                      'rgba(132, 204, 22, 1)', // Light green
                                      'rgba(234, 179, 8, 1)', // Yellow
                                      'rgba(249, 115, 22, 1)', // Orange
                                      'rgba(239, 68, 68, 1)', // Red
                                    ]}
                                    arcWidth={0.15}
                                    needleColor="#1e40af"
                                    textColor="#ffffff"
                                    hideText={true}
                                    animate={true}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* What Changed Card */}
                        <div className={styles.whatChangedCard}>
                          <div className={styles.whatChangedHeader}>
                            <img src="/icons/Alert.png" alt="Alert" width="20" height="20" />
                            <h3 className={styles.whatChangedTitle}>What Changed:</h3>
                          </div>
                          <p className={styles.whatChangedText}>
                            Peak Hour Load increased by 8% in EU in Last 24h
                          </p>
                          <a href="#" className={styles.whatChangedLink}>
                            View Breakdown →
                          </a>
                        </div>
                      </div>
                      
                      {/* Cost Per Active User Graph */}
                      <div className={styles.graphCard}>
                        <div className={styles.graphHeader}>
                          <div className={styles.graphTitle}>
                            Primary Driver: Cost Per Active User
                            <span className={styles.graphDropdownArrow}>▼</span>
                          </div>
                        </div>
                        <div className={styles.graphContainer}>
                          {renderCostChart()}
                        </div>
                      </div>

                      {/* KPI Sections */}
                      <div className={styles.kpiSections}>
                        {/* Cost and Unit Economics */}
                        <div className={styles.kpiSection}>
                          <div className={styles.sectionHeader}>
                            <button className={styles.sectionTitlePill}>Cost and Unit Economics</button>
                            <a href="#" className={styles.viewAllLink}>View All Metrics →</a>
                          </div>
                          <p className={styles.sectionQuestion}>Is the VPN Growing Profitably?</p>
                          <div className={styles.kpiCardsGrid}>
                            {renderKPICard(
                              'COST PER ACTIVE USER',
                              isComparisonMode && comparisonVPNs.length === 2 
                                ? (kpiSummaryData[comparisonVPNs[0]] || kpiSummaryData['Portfolio']).costAndUnitEconomics.costPerActiveUser
                                : currentKPIData.costAndUnitEconomics.costPerActiveUser,
                              isComparisonMode && comparisonVPNs.length === 2 
                                ? (kpiSummaryData[comparisonVPNs[1]] || kpiSummaryData['Portfolio']).costAndUnitEconomics.costPerActiveUser
                                : null
                            )}
                            {renderKPICard(
                              'EGRESS GB PER MINUTE',
                              isComparisonMode && comparisonVPNs.length === 2 
                                ? (kpiSummaryData[comparisonVPNs[0]] || kpiSummaryData['Portfolio']).costAndUnitEconomics.egressGBPerMinute
                                : currentKPIData.costAndUnitEconomics.egressGBPerMinute,
                              isComparisonMode && comparisonVPNs.length === 2 
                                ? (kpiSummaryData[comparisonVPNs[1]] || kpiSummaryData['Portfolio']).costAndUnitEconomics.egressGBPerMinute
                                : null
                            )}
                            {renderKPICard(
                              'COST PER GB',
                              isComparisonMode && comparisonVPNs.length === 2 
                                ? (kpiSummaryData[comparisonVPNs[0]] || kpiSummaryData['Portfolio']).costAndUnitEconomics.costPerGB
                                : currentKPIData.costAndUnitEconomics.costPerGB,
                              isComparisonMode && comparisonVPNs.length === 2 
                                ? (kpiSummaryData[comparisonVPNs[1]] || kpiSummaryData['Portfolio']).costAndUnitEconomics.costPerGB
                                : null
                            )}
                            {renderKPICard(
                              'FREE USER COST SHARE',
                              isComparisonMode && comparisonVPNs.length === 2 
                                ? (kpiSummaryData[comparisonVPNs[0]] || kpiSummaryData['Portfolio']).costAndUnitEconomics.freeUserCostShare
                                : currentKPIData.costAndUnitEconomics.freeUserCostShare,
                              isComparisonMode && comparisonVPNs.length === 2 
                                ? (kpiSummaryData[comparisonVPNs[1]] || kpiSummaryData['Portfolio']).costAndUnitEconomics.freeUserCostShare
                                : null
                            )}
                          </div>
                        </div>

                        {/* Growth and Performance */}
                        <div className={styles.kpiSection}>
                          <div className={styles.sectionHeader}>
                            <button className={styles.sectionTitlePill}>Growth and Performance</button>
                            <a href="#" className={styles.viewAllLink}>View All Metrics →</a>
                          </div>
                          <p className={styles.sectionQuestion}>Are we attracting and converting new users?</p>
                          <div className={styles.kpiCardsGrid}>
                            {renderKPICard(
                              'NEW USERS',
                              isComparisonMode && comparisonVPNs.length === 2 
                                ? (kpiSummaryData[comparisonVPNs[0]] || kpiSummaryData['Portfolio']).growthAndPerformance.newUsers
                                : currentKPIData.growthAndPerformance.newUsers,
                              isComparisonMode && comparisonVPNs.length === 2 
                                ? (kpiSummaryData[comparisonVPNs[1]] || kpiSummaryData['Portfolio']).growthAndPerformance.newUsers
                                : null
                            )}
                            {renderKPICard(
                              'NEW DEVICES',
                              isComparisonMode && comparisonVPNs.length === 2 
                                ? (kpiSummaryData[comparisonVPNs[0]] || kpiSummaryData['Portfolio']).growthAndPerformance.newDevices
                                : currentKPIData.growthAndPerformance.newDevices,
                              isComparisonMode && comparisonVPNs.length === 2 
                                ? (kpiSummaryData[comparisonVPNs[1]] || kpiSummaryData['Portfolio']).growthAndPerformance.newDevices
                                : null
                            )}
                            {renderKPICard(
                              'TRAIL USERS',
                              isComparisonMode && comparisonVPNs.length === 2 
                                ? (kpiSummaryData[comparisonVPNs[0]] || kpiSummaryData['Portfolio']).growthAndPerformance.trailUsers
                                : currentKPIData.growthAndPerformance.trailUsers,
                              isComparisonMode && comparisonVPNs.length === 2 
                                ? (kpiSummaryData[comparisonVPNs[1]] || kpiSummaryData['Portfolio']).growthAndPerformance.trailUsers
                                : null
                            )}
                            {renderKPICard(
                              'TRIAL TO PAID CONVERSION',
                              isComparisonMode && comparisonVPNs.length === 2 
                                ? (kpiSummaryData[comparisonVPNs[0]] || kpiSummaryData['Portfolio']).growthAndPerformance.trialToPaidConversion
                                : currentKPIData.growthAndPerformance.trialToPaidConversion,
                              isComparisonMode && comparisonVPNs.length === 2 
                                ? (kpiSummaryData[comparisonVPNs[1]] || kpiSummaryData['Portfolio']).growthAndPerformance.trialToPaidConversion
                                : null
                            )}
                          </div>
                        </div>

                        {/* Network Health and Stability & Protocol and Traffic Mix - Same Row */}
                        <div className={styles.twoColumnRow}>
                          <div className={styles.kpiSection}>
                            <div className={styles.sectionHeader}>
                              <button className={styles.sectionTitlePill}>Network Health and Stability</button>
                              <a href="#" className={styles.viewAllLink}>View All Metrics →</a>
                            </div>
                            <p className={styles.sectionQuestion}>Are Users engaged and satisfied?</p>
                            <div className={styles.kpiCardsGrid}>
                              {renderKPICard(
                                'ACTIVE TUNNELS',
                                isComparisonMode && comparisonVPNs.length === 2 
                                  ? (kpiSummaryData[comparisonVPNs[0]] || kpiSummaryData['Portfolio']).networkHealth.activeTunnels
                                  : currentKPIData.networkHealth.activeTunnels,
                                isComparisonMode && comparisonVPNs.length === 2 
                                  ? (kpiSummaryData[comparisonVPNs[1]] || kpiSummaryData['Portfolio']).networkHealth.activeTunnels
                                  : null
                              )}
                              {renderKPICard(
                                'MEDIAN LATENCY',
                                isComparisonMode && comparisonVPNs.length === 2 
                                  ? (kpiSummaryData[comparisonVPNs[0]] || kpiSummaryData['Portfolio']).networkHealth.medianLatency
                                  : currentKPIData.networkHealth.medianLatency,
                                isComparisonMode && comparisonVPNs.length === 2 
                                  ? (kpiSummaryData[comparisonVPNs[1]] || kpiSummaryData['Portfolio']).networkHealth.medianLatency
                                  : null
                              )}
                            </div>
                          </div>

                          <div className={styles.kpiSection}>
                            <div className={styles.sectionHeader}>
                              <button className={styles.sectionTitlePill}>Protocol and Traffic Mix</button>
                              <a href="#" className={styles.viewAllLink}>View All Metrics →</a>
                            </div>
                            <p className={styles.sectionQuestion}>Is the platform secure and compliant?</p>
                            <div className={styles.kpiCardsGrid}>
                              {renderKPICard(
                                'AVG SESSION DURATION',
                                isComparisonMode && comparisonVPNs.length === 2 
                                  ? (kpiSummaryData[comparisonVPNs[0]] || kpiSummaryData['Portfolio']).protocolAndTraffic.avgSessionDuration
                                  : currentKPIData.protocolAndTraffic.avgSessionDuration,
                                isComparisonMode && comparisonVPNs.length === 2 
                                  ? (kpiSummaryData[comparisonVPNs[1]] || kpiSummaryData['Portfolio']).protocolAndTraffic.avgSessionDuration
                                  : null
                              )}
                              {renderKPICard(
                                'EGRESS PER SESSION',
                                isComparisonMode && comparisonVPNs.length === 2 
                                  ? (kpiSummaryData[comparisonVPNs[0]] || kpiSummaryData['Portfolio']).protocolAndTraffic.egressPerSession
                                  : currentKPIData.protocolAndTraffic.egressPerSession,
                                isComparisonMode && comparisonVPNs.length === 2 
                                  ? (kpiSummaryData[comparisonVPNs[1]] || kpiSummaryData['Portfolio']).protocolAndTraffic.egressPerSession
                                  : null
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Capacity and Scaling & Compliance and Governance - Same Row */}
                        <div className={styles.twoColumnRow}>
                          <div className={styles.kpiSection}>
                            <div className={styles.sectionHeader}>
                              <button className={styles.sectionTitlePill}>Capacity and Scaling</button>
                              <a href="#" className={styles.viewAllLink}>View All Metrics →</a>
                            </div>
                            <p className={styles.sectionQuestion}>Are Users engaged and satisfied?</p>
                            <div className={styles.kpiCardsGrid}>
                              {renderKPICard(
                                'CURRENT UTILIZATION',
                                isComparisonMode && comparisonVPNs.length === 2 
                                  ? (kpiSummaryData[comparisonVPNs[0]] || kpiSummaryData['Portfolio']).capacityAndScaling.currentUtilization
                                  : currentKPIData.capacityAndScaling.currentUtilization,
                                isComparisonMode && comparisonVPNs.length === 2 
                                  ? (kpiSummaryData[comparisonVPNs[1]] || kpiSummaryData['Portfolio']).capacityAndScaling.currentUtilization
                                  : null
                              )}
                              {renderKPICard(
                                'SESSIONS PER NODE',
                                isComparisonMode && comparisonVPNs.length === 2 
                                  ? (kpiSummaryData[comparisonVPNs[0]] || kpiSummaryData['Portfolio']).capacityAndScaling.sessionsPerNode
                                  : currentKPIData.capacityAndScaling.sessionsPerNode,
                                isComparisonMode && comparisonVPNs.length === 2 
                                  ? (kpiSummaryData[comparisonVPNs[1]] || kpiSummaryData['Portfolio']).capacityAndScaling.sessionsPerNode
                                  : null
                              )}
                            </div>
                          </div>

                          <div className={styles.kpiSection}>
                            <div className={styles.sectionHeader}>
                              <button className={styles.sectionTitlePill}>Compliance and Governance</button>
                              <a href="#" className={styles.viewAllLink}>View All Metrics →</a>
                            </div>
                            <p className={styles.sectionQuestion}>Is the platform secure and compliant?</p>
                            <div className={styles.kpiCardsGrid}>
                              {renderKPICard(
                                'IPDR ACCESS COUNT',
                                isComparisonMode && comparisonVPNs.length === 2 
                                  ? (kpiSummaryData[comparisonVPNs[0]] || kpiSummaryData['Portfolio']).complianceAndGovernance.ipdrAccessCount
                                  : currentKPIData.complianceAndGovernance.ipdrAccessCount,
                                isComparisonMode && comparisonVPNs.length === 2 
                                  ? (kpiSummaryData[comparisonVPNs[1]] || kpiSummaryData['Portfolio']).complianceAndGovernance.ipdrAccessCount
                                  : null
                              )}
                              {renderKPICard(
                                'LEGAL REQUEST SLA',
                                isComparisonMode && comparisonVPNs.length === 2 
                                  ? (kpiSummaryData[comparisonVPNs[0]] || kpiSummaryData['Portfolio']).complianceAndGovernance.legalRequestSLA
                                  : currentKPIData.complianceAndGovernance.legalRequestSLA,
                                isComparisonMode && comparisonVPNs.length === 2 
                                  ? (kpiSummaryData[comparisonVPNs[1]] || kpiSummaryData['Portfolio']).complianceAndGovernance.legalRequestSLA
                                  : null
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeSubTab === 'Per Region' && (
                <div className={styles.perRegionContainer}>
                  {/* Left Side - Controls and Top Regions */}
                  <div className={styles.perRegionLeft}>
                    <div className={styles.regionControls}>
                      <div className={styles.regionDropdownGroup}>
                        <label className={styles.regionDropdownLabel}>Category:</label>
                        <select
                          className={styles.regionDropdown}
                          value={selectedCategory}
                          onChange={(e) => {
                            setSelectedCategory(e.target.value)
                            // Reset to first metric of new category
                            setSelectedMetric(categoryMetrics[e.target.value][0])
                          }}
                        >
                          <option value="Network Health and Stability">Network Health and Stability (Current)</option>
                          <option value="Capacity and Scaling">Capacity and Scaling</option>
                          <option value="Cost and Unit Economics">Cost and Unit Economics</option>
                          <option value="Protocol and Traffic Mix">Protocol and Traffic Mix</option>
                          <option value="Growth and Product Performance">Growth and Product Performance</option>
                          <option value="Compliance and Governance">Compliance and Governance</option>
                        </select>
                      </div>
                      
                      <div className={styles.regionDropdownGroup}>
                        <label className={styles.regionDropdownLabel}>Metric Selected:</label>
                        <select
                          className={styles.regionDropdown}
                          value={selectedMetric}
                          onChange={(e) => setSelectedMetric(e.target.value)}
                        >
                          {categoryMetrics[selectedCategory]?.map((metric) => (
                            <option key={metric} value={metric}>
                              {metric} {metric === 'Median Latency' ? '(ms)' : metric === 'Cost Per Hour' || metric === 'Cost Per GB' || metric === 'Cost Per Concurrent User' ? '(USD)' : metric === 'Egress GB Per Minute' || metric === 'Egress Per Session' ? '(GB)' : metric === 'Avg Session Duration' ? '(min)' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className={styles.topRegionsSection}>
                      <h3 className={styles.topRegionsTitle}>Regions</h3>
                      <div className={styles.topRegionsList}>
                        {topRegions.map((region, index) => (
                          <div key={index} className={styles.topRegionItem}>
                            <div className={styles.regionFlag}>
                              <img src={region.flag} alt={region.country} width="24" height="18" />
                            </div>
                            <div className={styles.regionInfo}>
                              <div className={styles.regionCity}>
                                {region.country} <span className={styles.regionValue}>{region.value}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Map Chart */}
                  <div className={styles.perRegionRight}>
                    <div
                      ref={mapRef}
                      className={styles.mapContainerWrapper}
                    >
                      {/* VPN Logo Section - Top Right */}
                      <div className={styles.mapScope}>
                        <div className={styles.mapVPNLogo}>
                          <div className={styles.mapVPNLogoCircle}>
                            {selectedVPN.charAt(0)}
                          </div>
                        </div>
                        <div className={styles.mapScopeText}>
                          {selectedVPN}
                        </div>
                      </div>

                      {tooltipContent && (
                        <div
                          style={{
                            position: 'absolute',
                            top: tooltipPosition.y + 10,
                            left: tooltipPosition.x + 10,
                            padding: '8px 12px',
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: '#fff',
                            borderRadius: '4px',
                            fontSize: '14px',
                            pointerEvents: 'none',
                            zIndex: 2,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {tooltipContent}
                        </div>
                      )}

                      <ComposableMap
                        style={{
                          position: 'relative',
                          width: '100%',
                          height: '100%',
                        }}
                      >
                        <Geographies geography={geoUrl}>
                          {({ geographies }) =>
                            geographies.map((geo) => {
                              const countryName = normalizeCountryName(
                                geo.properties.name.trim()
                              )

                              // Check if this country matches any region
                              const region = getRegionFromCountry(countryName)
                              const countryColor = region ? selectedColor : fallbackColor

                              return (
                                <Geography
                                  key={geo.rsmKey}
                                  geography={geo}
                                  fill={region ? selectedColor : fallbackColor}
                                  stroke="#DDD"
                                  onMouseMove={handleMouseMove}
                                  onMouseEnter={() => handleMouseEnter(geo)}
                                  onMouseLeave={handleMouseLeave}
                                  style={{
                                    default: { outline: 'none' },
                                    hover: {
                                      fill: region ? selectedColor : '#93C5FD',
                                      outline: 'none',
                                      cursor: region ? 'pointer' : 'default',
                                      opacity: 0.8,
                                    },
                                    pressed: { outline: 'none' },
                                  }}
                                />
                              )
                            })
                          }
                        </Geographies>

                        <Geographies geography={jammuKashmirGeoJSON}>
                          {({ geographies }) =>
                            geographies.map((geo) => (
                              <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill={fallbackColor}
                                stroke="none"
                                style={{
                                  default: { outline: 'none' },
                                  hover: {
                                    fill: '#93C5FD',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    opacity: 0.8,
                                  },
                                  pressed: { outline: 'none' },
                                }}
                              />
                            ))
                          }
                        </Geographies>
                      </ComposableMap>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'Live Sessions' && (
            <div className={styles.liveSessionsContainer}>
              <div className={styles.liveSessionsRow}>
                {/* Box 1: Last 5 minute updated */}
                <div className={styles.liveSessionCard}>
                  <div className={styles.liveSessionValueRow}>
                    <div className={styles.liveSessionValueContainer}>
                      <div className={styles.liveSessionValue}>{currentLiveSessionsData?.last5MinUpdated || '980'}</div>
                      <div className={styles.liveSessionTitle}>Last 5 minute updated</div>
                    </div>
                    <div className={`${styles.liveSessionIcon} ${styles.liveSessionIconPurple}`}>
                      <img src="/icons/users.png" alt="Users" width="24" height="24" />
                    </div>
                  </div>
                </div>

                {/* Box 2: Live Active Tunnels */}
                <div className={styles.liveSessionCard}>
                  <div className={styles.liveSessionValueRow}>
                    <div className={styles.liveSessionValueContainer}>
                      <div className={styles.liveSessionValue}>{currentLiveSessionsData?.liveActiveTunnels || '52.2 K'}</div>
                      <div className={styles.liveSessionTitle}>Live Active Tunnels</div>
                    </div>
                    <div className={`${styles.liveSessionIcon} ${styles.liveSessionIconPurple}`}>
                      <img src="/icons/users.png" alt="Users" width="24" height="24" />
                    </div>
                  </div>
                </div>

                {/* Box 3: Currently Connected Users */}
                <div className={styles.liveSessionCard}>
                  <div className={styles.liveSessionValueRow}>
                    <div className={styles.liveSessionValueContainer}>
                      <div className={styles.liveSessionValue}>{currentLiveSessionsData?.currentlyConnectedUsers || '165,980'}</div>
                      <div className={styles.liveSessionTitle}>Currently Connected Users</div>
                    </div>
                    <div className={`${styles.liveSessionIcon} ${styles.liveSessionIconGray}`}>
                      <img src="/icons/Clock.png" alt="Clock" width="24" height="24" />
                    </div>
                  </div>
                </div>

                {/* Box 4: Real Time Connectivity */}
                <div className={styles.liveSessionCard}>
                  <div className={styles.liveSessionValueRow}>
                    <div className={styles.liveSessionValueContainer}>
                      <div className={styles.liveSessionValue}>{currentLiveSessionsData?.realTimeConnectivity || '2m30s'}</div>
                      <div className={styles.liveSessionTitle}>Real Time Connectivity</div>
                    </div>
                    <div className={`${styles.liveSessionIcon} ${styles.liveSessionIconPurple}`}>
                      <img src="/icons/Calendar.png" alt="Calendar" width="24" height="24" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Live By VPN Section */}
              <div className={styles.liveByVpnContainer}>
                <div className={styles.liveByVpnSection}>
                {/* Top Section: Header and Chart */}
                <div className={styles.liveByVpnTop}>
                  <div className={styles.liveByVpnLeft}>
                    <h3 className={styles.liveByVpnTitle}>Live By VPN</h3>
                    <div className={styles.liveByVpnTotal}>
                      <div className={styles.liveByVpnTotalValue}>
                        <span className={styles.liveByVpnNumber}>{currentLiveSessionsData?.liveByVpn?.totalUsed || '26.98'}</span>
                        <span className={styles.liveByVpnUnit}>{currentLiveSessionsData?.liveByVpn?.unit || 'GB'}</span>
                      </div>
                      <div className={styles.liveByVpnTotalLabel}>Used</div>
                    </div>
                  </div>
                  <div className={styles.liveByVpnRight}>
                    {/* Donut Chart */}
                    {renderLiveByVpnDonutChart()}
                  </div>
                </div>
                
                {/* Bottom Section: VPN List */}
                <div className={styles.liveByVpnList}>
                  {currentLiveSessionsData?.liveByVpn?.vpns?.map((vpn, index) => {
                    const colors = ['progressBlue', 'progressPurple', 'progressPink', 'progressOrange', 'progressGreen']
                    return (
                      <div key={index} className={styles.liveByVpnItem}>
                        <div className={styles.liveByVpnItemName}>{vpn.name}</div>
                        <div className={styles.liveByVpnProgressBar}>
                          <div className={`${styles.liveByVpnProgressFill} ${styles[colors[index % colors.length]]}`} style={{ width: `${vpn.percentage}%` }}></div>
                        </div>
                        <div className={styles.liveByVpnItemValue}>{vpn.value}</div>
                      </div>
                    )
                  })}
                </div>
                </div>
                {/* Right side section - Map */}
                <div className={styles.liveByVpnRightSection}>
                  <div
                    ref={liveSessionMapRef}
                    className={styles.mapContainerWrapper}
                  >
                    <h3
                      className={styles.subTileHeading}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        borderRadius: '5px',
                        width: '100%',
                        zIndex: 2,
                        justifyContent: 'center',
                        textAlign: 'center',
                      }}
                    >
                      Live Connection
                    </h3>

                    {liveSessionTooltipContent && (
                      <div
                        style={{
                          position: 'absolute',
                          top: liveSessionTooltipPosition.y + 10,
                          left: liveSessionTooltipPosition.x + 10,
                          padding: '8px 12px',
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          color: '#fff',
                          borderRadius: '4px',
                          fontSize: '14px',
                          pointerEvents: 'none',
                          zIndex: 2,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {liveSessionTooltipContent}
                      </div>
                    )}

                    <ComposableMap
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                      }}
                    >
                      <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                          geographies.map((geo) => {
                            const countryName = normalizeCountryName(
                              geo.properties.name.trim()
                            )

                            const countrySessionData =
                              cleanedLiveSessionCountries.find(
                                (country) =>
                                  country.CountryName.trim().toLowerCase() ===
                                  countryName.toLowerCase()
                              )

                            const countryColor = countrySessionData
                              ? selectedColor
                              : fallbackColor

                            return (
                              <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill={countrySessionData ? selectedColor : fallbackColor}
                                stroke="#DDD"
                                onMouseMove={handleLiveSessionMouseMove}
                                onMouseEnter={() =>
                                  countrySessionData &&
                                  handleLiveSessionMouseEnter(countrySessionData)
                                }
                                onMouseLeave={handleLiveSessionMouseLeave}
                                style={{
                                  default: { outline: 'none' },
                                  hover: {
                                    fill: countrySessionData
                                      ? selectedColor
                                      : '#93C5FD',
                                    outline: 'none',
                                    cursor: countrySessionData
                                      ? 'pointer'
                                      : 'default',
                                    opacity: 0.8,
                                  },
                                  pressed: { outline: 'none' },
                                }}
                              />
                            )
                          })
                        }
                      </Geographies>

                      <Geographies geography={jammuKashmirGeoJSON}>
                        {({ geographies }) =>
                          geographies.map((geo) => (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              fill={fallbackColor}
                              stroke="none"
                              style={{
                                default: { outline: 'none' },
                                hover: {
                                  fill: '#93C5FD',
                                  outline: 'none',
                                  cursor: 'pointer',
                                  opacity: 0.8,
                                },
                                pressed: { outline: 'none' },
                              }}
                            />
                          ))
                        }
                      </Geographies>
                    </ComposableMap>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Modal */}
      {isComparisonModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsComparisonModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <button className={styles.modalCloseBtn} onClick={() => setIsComparisonModalOpen(false)}>
                ×
              </button>
              <h2 className={styles.modalTitle}>Apply a comparison</h2>
              <div className={styles.modalHeaderRight}>
                <div className={styles.modalSearch}>
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                  />
                  <img src="/icons/search.png" alt="Search" width="16" height="16" />
                </div>
                <button className={styles.applyButton} onClick={handleApplyComparison}>
                  Apply
                </button>
                <div className={styles.modalUserIcon}>M</div>
              </div>
            </div>

            {/* Selected VPNs */}
            {comparisonVPNs.length > 0 && (
              <div className={styles.selectedVPNs}>
                {comparisonVPNs.map((vpn) => (
                  <div key={vpn} className={`${styles.selectedVPNPill} ${comparisonVPNs.indexOf(vpn) === 0 ? styles.pillBlue : styles.pillPurple}`}>
                    <div className={`${styles.pillIcon} ${comparisonVPNs.indexOf(vpn) === 0 ? styles.iconBlue : styles.iconPurple}`}>
                      {vpn.charAt(0)}
                    </div>
                    <span>{vpn}</span>
                    <button
                      className={styles.pillRemoveBtn}
                      onClick={() => handleComparisonVPNToggle(vpn)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* VPN Table */}
            <div className={styles.vpnTableContainer}>
              <table className={styles.vpnTable}>
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Summary</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVPNs.map((vpn) => (
                    <tr
                      key={vpn.name}
                      className={`${styles.tableRow} ${comparisonVPNs.includes(vpn.name) ? styles.tableRowSelected : ''}`}
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={comparisonVPNs.includes(vpn.name)}
                          onChange={() => handleComparisonVPNToggle(vpn.name)}
                          className={styles.tableCheckbox}
                        />
                      </td>
                      <td className={styles.tableName}>{vpn.name}</td>
                      <td className={styles.tableDescription}>{vpn.description}</td>
                      <td className={styles.tableSummary}>{vpn.summary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default KPISummary

