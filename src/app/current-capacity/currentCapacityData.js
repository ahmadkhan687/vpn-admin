// Current Capacity data per scope
// Portfolio = aggregated data across all VPNs
// Individual VPNs = that VPN's capacity data

const baseHeadroomChartData = [
  { date: 'Mar 1', used: 320, capacity: 500, headroom: 180, pctUsed: 64 },
  { date: 'Mar 5', used: 380, capacity: 500, headroom: 120, pctUsed: 76 },
  { date: 'Mar 8', used: 350, capacity: 500, headroom: 150, pctUsed: 70 },
  { date: 'Mar 11', used: 410, capacity: 500, headroom: 90, pctUsed: 82 },
  { date: 'Mar 13', used: 410, capacity: 500, headroom: 90, pctUsed: 82 },
  { date: 'Mar 15', used: 390, capacity: 500, headroom: 110, pctUsed: 78 },
  { date: 'Mar 18', used: 440, capacity: 500, headroom: 60, pctUsed: 88 },
  { date: 'Mar 22', used: 400, capacity: 500, headroom: 100, pctUsed: 80 },
  { date: 'Mar 25', used: 370, capacity: 500, headroom: 130, pctUsed: 74 },
  { date: 'Mar 31', used: 420, capacity: 500, headroom: 80, pctUsed: 84 },
]

function scaleHeadroomData(data, factor) {
  return data.map((d) => {
    const used = Math.round(d.used * factor)
    const capacity = Math.round(d.capacity * factor)
    const headroom = capacity - used
    const pctUsed = capacity > 0 ? Math.min(99, Math.round((used / capacity) * 100)) : 0
    return { ...d, used, capacity, headroom, pctUsed }
  })
}

export const currentCapacityDataByScope = {
  Portfolio: {
    overallCapacityValue: '$110.00',
    currentUtilizationValue: '$120.00',
    overallMbps: 500,
    meta: 'Across 5 VPNs • 12 Gateways • 3 Regions',
    utilizationMbpsText: '420 Mbps of 500 Mbps',
    centerUsedPercent: '84%',
    overallSegments: [
      { label: 'Fortivo VPN', value: 28, color: '#2563eb' },
      { label: 'SteerLucid VPN', value: 18, color: '#6d28d9' },
      { label: 'Slick VPN', value: 14, color: '#c026d3' },
      { label: 'Crest VPN', value: 12, color: '#ea580c' },
      { label: 'Quick VPN', value: 12, color: '#65a30d' },
      { label: 'Unused Capacity', value: 16, color: '#e5e7eb' },
    ],
    utilizationSegments: [
      { label: 'Fortivo VPN', value: 31, color: '#2563eb' },
      { label: 'SteerLucid VPN', value: 22, color: '#6d28d9' },
      { label: 'Slick VPN', value: 18, color: '#c026d3' },
      { label: 'Crest VPN', value: 8, color: '#ea580c' },
      { label: 'Quick VPN', value: 5, color: '#65a30d' },
      { label: 'Unused Capacity', value: 16, color: '#e5e7eb' },
    ],
    vpnListPercent: [
      { name: 'Fortivo VPN', percent: 31, color: '#2563eb' },
      { name: 'Crest VPN', percent: 8, color: '#ea580c' },
      { name: 'SteerLucid VPN', percent: 22, color: '#6d28d9' },
      { name: 'Slick VPN', percent: 18, color: '#c026d3' },
      { name: 'Quick VPN', percent: 5, color: '#65a30d' },
    ],
    headroomValue: '$110.00',
    headroomChartData: baseHeadroomChartData,
  },
  'Steer Lucid': {
    overallCapacityValue: '$98.00',
    currentUtilizationValue: '$105.00',
    overallMbps: 380,
    meta: '1 VPN • 4 Gateways • 2 Regions',
    utilizationMbpsText: '312 Mbps of 380 Mbps',
    centerUsedPercent: '82%',
    overallSegments: [
      { label: 'SteerLucid VPN', value: 82, color: '#6d28d9' },
      { label: 'Unused Capacity', value: 18, color: '#e5e7eb' },
    ],
    utilizationSegments: [
      { label: 'SteerLucid VPN', value: 82, color: '#6d28d9' },
      { label: 'Unused Capacity', value: 18, color: '#e5e7eb' },
    ],
    vpnListPercent: [{ name: 'SteerLucid VPN', percent: 82, color: '#6d28d9' }],
    headroomValue: '$98.00',
    headroomChartData: scaleHeadroomData(baseHeadroomChartData, 0.76),
  },
  Crest: {
    overallCapacityValue: '$72.00',
    currentUtilizationValue: '$68.00',
    overallMbps: 280,
    meta: '1 VPN • 3 Gateways • 2 Regions',
    utilizationMbpsText: '198 Mbps of 280 Mbps',
    centerUsedPercent: '71%',
    overallSegments: [
      { label: 'Crest VPN', value: 71, color: '#ea580c' },
      { label: 'Unused Capacity', value: 29, color: '#e5e7eb' },
    ],
    utilizationSegments: [
      { label: 'Crest VPN', value: 71, color: '#ea580c' },
      { label: 'Unused Capacity', value: 29, color: '#e5e7eb' },
    ],
    vpnListPercent: [{ name: 'Crest VPN', percent: 71, color: '#ea580c' }],
    headroomValue: '$72.00',
    headroomChartData: scaleHeadroomData(baseHeadroomChartData, 0.56),
  },
  Slick: {
    overallCapacityValue: '$85.00',
    currentUtilizationValue: '$92.00',
    overallMbps: 320,
    meta: '1 VPN • 3 Gateways • 2 Regions',
    utilizationMbpsText: '268 Mbps of 320 Mbps',
    centerUsedPercent: '84%',
    overallSegments: [
      { label: 'Slick VPN', value: 84, color: '#c026d3' },
      { label: 'Unused Capacity', value: 16, color: '#e5e7eb' },
    ],
    utilizationSegments: [
      { label: 'Slick VPN', value: 84, color: '#c026d3' },
      { label: 'Unused Capacity', value: 16, color: '#e5e7eb' },
    ],
    vpnListPercent: [{ name: 'Slick VPN', percent: 84, color: '#c026d3' }],
    headroomValue: '$85.00',
    headroomChartData: scaleHeadroomData(baseHeadroomChartData, 0.64),
  },
  Fortivo: {
    overallCapacityValue: '$118.00',
    currentUtilizationValue: '$125.00',
    overallMbps: 460,
    meta: '1 VPN • 5 Gateways • 2 Regions',
    utilizationMbpsText: '398 Mbps of 460 Mbps',
    centerUsedPercent: '87%',
    overallSegments: [
      { label: 'Fortivo VPN', value: 87, color: '#2563eb' },
      { label: 'Unused Capacity', value: 13, color: '#e5e7eb' },
    ],
    utilizationSegments: [
      { label: 'Fortivo VPN', value: 87, color: '#2563eb' },
      { label: 'Unused Capacity', value: 13, color: '#e5e7eb' },
    ],
    vpnListPercent: [{ name: 'Fortivo VPN', percent: 87, color: '#2563eb' }],
    headroomValue: '$118.00',
    headroomChartData: scaleHeadroomData(baseHeadroomChartData, 0.92),
  },
  Qucik: {
    overallCapacityValue: '$65.00',
    currentUtilizationValue: '$58.00',
    overallMbps: 240,
    meta: '1 VPN • 2 Gateways • 1 Region',
    utilizationMbpsText: '168 Mbps of 240 Mbps',
    centerUsedPercent: '70%',
    overallSegments: [
      { label: 'Quick VPN', value: 70, color: '#65a30d' },
      { label: 'Unused Capacity', value: 30, color: '#e5e7eb' },
    ],
    utilizationSegments: [
      { label: 'Quick VPN', value: 70, color: '#65a30d' },
      { label: 'Unused Capacity', value: 30, color: '#e5e7eb' },
    ],
    vpnListPercent: [{ name: 'Quick VPN', percent: 70, color: '#65a30d' }],
    headroomValue: '$65.00',
    headroomChartData: scaleHeadroomData(baseHeadroomChartData, 0.48),
  },
  Nexipher: {
    overallCapacityValue: '$88.00',
    currentUtilizationValue: '$82.00',
    overallMbps: 340,
    meta: '1 VPN • 3 Gateways • 2 Regions',
    utilizationMbpsText: '245 Mbps of 340 Mbps',
    centerUsedPercent: '72%',
    overallSegments: [
      { label: 'Nexipher VPN', value: 72, color: '#7c3aed' },
      { label: 'Unused Capacity', value: 28, color: '#e5e7eb' },
    ],
    utilizationSegments: [
      { label: 'Nexipher VPN', value: 72, color: '#7c3aed' },
      { label: 'Unused Capacity', value: 28, color: '#e5e7eb' },
    ],
    vpnListPercent: [{ name: 'Nexipher VPN', percent: 72, color: '#7c3aed' }],
    headroomValue: '$88.00',
    headroomChartData: scaleHeadroomData(baseHeadroomChartData, 0.68),
  },
}
