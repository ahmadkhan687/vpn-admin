const makeAlert = (overrides) => ({
  severity: 'Critical',
  severityCount: 1,
  alertName: 'Alert',
  alertRegion: 'Region',
  category: 'Network Health',
  categorySub: '',
  metricBreached: 'Metric > threshold',
  firstBreached: '1h ago',
  status: 'Open',
  description: 'Alert description.',
  chartData: [20, 35, 45, 55, 72],
  chartLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  currentValue: '0.72',
  threshold: '0.5',
  affectedSessions: '5%',
  mostImpactedRegion: 'Region',
  detailCategory: 'Network Health',
  link: '/connection-stability',
  ...overrides,
})

// Portfolio = overall aggregated alerts across all VPNs
const portfolioAlerts = [
  makeAlert({ id: 1, severity: 'Critical', severityCount: 1, alertName: 'Reconnect Frequency', alertRegion: 'South Asia VPN', category: 'Network Health', categorySub: 'South Asia VPN', metricBreached: 'Reconnects/session > 0.5', firstBreached: '2h 10m ago', status: 'Open', description: 'Reconnect frequency exceeded the acceptable threshold of 0.5 reconnects/session. This may indicate unstable network handoffs or packet fragmentation.', chartData: [20, 35, 45, 55, 72], currentValue: '0.72 reconnects/session', threshold: '0.5', affectedSessions: '7.4%', mostImpactedRegion: 'South Asia', detailCategory: 'Network Health' }),
  makeAlert({ id: 2, severity: 'Warning', severityCount: 4, alertName: 'MTU Errors Elevated', alertRegion: 'UDP - APAC', category: 'Protocol & Traffic', categorySub: 'UDP - APAC', metricBreached: 'MTU < 1400 bytes', firstBreached: '5h ago', status: 'Acknowledged', description: 'MTU error rate has exceeded threshold. Packet fragmentation may be impacting performance.', chartData: [30, 38, 42, 48, 55], currentValue: '1350 bytes', threshold: '1400 bytes', affectedSessions: '3.2%', mostImpactedRegion: 'APAC', detailCategory: 'Protocol & Traffic', link: '/protocol-overview' }),
  makeAlert({ id: 3, severity: 'Critical', severityCount: 1, alertName: 'Median Latency Breach', alertRegion: 'EU-West', category: 'Performance & Quality', categorySub: 'EU-West', metricBreached: 'Latency > 150ms', firstBreached: '1m ago', status: 'Open', description: 'Median latency has exceeded 150ms threshold in EU-West region.', chartData: [80, 100, 120, 140, 165], currentValue: '165ms', threshold: '150ms', affectedSessions: '12.1%', mostImpactedRegion: 'EU-West', detailCategory: 'Performance & Quality', link: '/performance-quality' }),
  makeAlert({ id: 4, severity: 'Informational', severityCount: 'Info', alertName: 'High Egress per Session', alertRegion: 'Grotate', category: 'Global', categorySub: 'US-East', metricBreached: 'Egress/session > 230MB', firstBreached: '1 day ago', status: 'Open', description: 'Egress volume per session has exceeded 230MB. Monitor for capacity planning.', chartData: [180, 195, 210, 225, 245], currentValue: '245MB', threshold: '230MB', affectedSessions: '2.1%', mostImpactedRegion: 'US-East', detailCategory: 'Global', link: '/network-overview' }),
  makeAlert({ id: 5, severity: 'Warning', severityCount: 4, alertName: 'Excessive Drop Rate', alertRegion: 'US East', category: 'Protocol & Traffic', categorySub: 'US-East', metricBreached: 'Drop packets > 2.0%', firstBreached: '3 days ago', status: 'Open', description: 'Packet drop rate has exceeded 2% threshold in US East.', chartData: [1.2, 1.5, 1.8, 2.1, 2.4], currentValue: '2.4%', threshold: '2.0%', affectedSessions: '5.8%', mostImpactedRegion: 'US-East', detailCategory: 'Protocol & Traffic', link: '/reliability-failure' }),
  makeAlert({ id: 6, severity: 'Warning', severityCount: 4, alertName: 'Idle Tunnel Accumulation', alertRegion: 'EU-West - A CDN', category: 'Capacity & Scaling', categorySub: 'EU-West', metricBreached: 'Idle tunnel > 50%', firstBreached: '5 days ago', status: 'Resolved', description: 'Idle tunnel percentage has been resolved. Capacity is now within normal range.', chartData: [55, 52, 48, 45, 42], currentValue: '42%', threshold: '50%', affectedSessions: '0%', mostImpactedRegion: 'EU-West', detailCategory: 'Capacity & Scaling', link: '/current-capacity' }),
  makeAlert({ id: 7, severity: 'Warning', severityCount: 2, alertName: 'Session Timeout Spike', alertRegion: 'North America', category: 'Session Behavior', categorySub: '', metricBreached: 'Timeout/session > 3', firstBreached: '6h ago', status: 'Open', description: 'Session timeout rate has increased above threshold.', chartData: [1.5, 2, 2.2, 2.5, 3.2], currentValue: '3.2', threshold: '3', affectedSessions: '4.1%', mostImpactedRegion: 'North America', detailCategory: 'Session Behavior', link: '/session-behavior' }),
  makeAlert({ id: 8, severity: 'Critical', severityCount: 1, alertName: 'High Packet Fragmentation', alertRegion: 'South Asia UDP', category: 'Network Health', categorySub: 'South Asia UDP', metricBreached: 'MTU < 1280 bytes', firstBreached: '3 hours ago', status: 'Open', description: 'Packet fragmentation exceeds acceptable levels. MTU below 1280 bytes threshold.', chartData: [1350, 1320, 1300, 1285, 1250], currentValue: '1250 bytes', threshold: '1280 bytes', affectedSessions: '8.3%', mostImpactedRegion: 'South Asia', detailCategory: 'Network Health' }),
]

// Steer Lucid VPN - different alerts
const steerLucidAlerts = [
  makeAlert({ id: 101, severity: 'Critical', severityCount: 2, alertName: 'Bandwidth Saturation', alertRegion: 'Steer Lucid - APAC', category: 'Performance & Quality', metricBreached: 'Bandwidth > 90%', firstBreached: '45m ago', status: 'Open', chartData: [65, 72, 78, 85, 92], currentValue: '92%', threshold: '90%', affectedSessions: '15.2%', mostImpactedRegion: 'APAC', detailCategory: 'Performance & Quality' }),
  makeAlert({ id: 102, severity: 'Warning', severityCount: 3, alertName: 'Connection Timeout', alertRegion: 'Steer Lucid - EU', category: 'Session Behavior', metricBreached: 'Timeout > 30s', firstBreached: '2h ago', status: 'Acknowledged', chartData: [12, 18, 22, 25, 28], currentValue: '28s', threshold: '30s', affectedSessions: '6.1%', mostImpactedRegion: 'EU-West', detailCategory: 'Session Behavior' }),
  makeAlert({ id: 103, severity: 'Informational', severityCount: 'Info', alertName: 'Peak Usage Anomaly', alertRegion: 'Steer Lucid - US', category: 'Capacity & Scaling', metricBreached: 'Sessions > 10k', firstBreached: '1 day ago', status: 'Open', chartData: [8, 8.5, 9, 9.2, 10.5], currentValue: '10.5k', threshold: '10k', affectedSessions: '1.2%', mostImpactedRegion: 'US-East', detailCategory: 'Capacity & Scaling' }),
  makeAlert({ id: 104, severity: 'Critical', severityCount: 1, alertName: 'DNS Resolution Failures', alertRegion: 'Steer Lucid - Global', category: 'Network Health', metricBreached: 'DNS fail > 1%', firstBreached: '20m ago', status: 'Open', chartData: [0.2, 0.4, 0.6, 0.8, 1.2], currentValue: '1.2%', threshold: '1%', affectedSessions: '4.3%', mostImpactedRegion: 'Global', detailCategory: 'Network Health' }),
]

// Crest VPN - different alerts
const crestAlerts = [
  makeAlert({ id: 201, severity: 'Warning', severityCount: 2, alertName: 'Jitter Spike', alertRegion: 'Crest - EU-West', category: 'Performance & Quality', metricBreached: 'Jitter > 20ms', firstBreached: '3h ago', status: 'Open', chartData: [8, 12, 15, 18, 22], currentValue: '22ms', threshold: '20ms', affectedSessions: '8.5%', mostImpactedRegion: 'EU-West', detailCategory: 'Performance & Quality' }),
  makeAlert({ id: 202, severity: 'Critical', severityCount: 1, alertName: 'Authentication Failures', alertRegion: 'Crest - APAC', category: 'Session Behavior', metricBreached: 'Auth fail > 2%', firstBreached: '1h ago', status: 'Open', chartData: [0.5, 1, 1.2, 1.6, 2.3], currentValue: '2.3%', threshold: '2%', affectedSessions: '11.2%', mostImpactedRegion: 'APAC', detailCategory: 'Session Behavior' }),
  makeAlert({ id: 203, severity: 'Warning', severityCount: 4, alertName: 'Tunnel Instability', alertRegion: 'Crest - US East', category: 'Network Health', metricBreached: 'Tunnel drops > 5/session', firstBreached: '4h ago', status: 'Resolved', chartData: [6, 5.5, 5, 4.5, 4], currentValue: '4', threshold: '5', affectedSessions: '2.1%', mostImpactedRegion: 'US-East', detailCategory: 'Network Health' }),
]

// Slick VPN - different alerts
const slickAlerts = [
  makeAlert({ id: 301, severity: 'Critical', severityCount: 1, alertName: 'Data Leak Detection', alertRegion: 'Slick - Global', category: 'Network Health', metricBreached: 'Leak events > 0', firstBreached: '10m ago', status: 'Open', chartData: [0, 0, 0, 1, 2], currentValue: '2', threshold: '0', affectedSessions: '0.5%', mostImpactedRegion: 'Global', detailCategory: 'Network Health' }),
  makeAlert({ id: 302, severity: 'Warning', severityCount: 3, alertName: 'High CPU Utilization', alertRegion: 'Slick - EU', category: 'Capacity & Scaling', metricBreached: 'CPU > 85%', firstBreached: '2h ago', status: 'Acknowledged', chartData: [70, 75, 80, 82, 87], currentValue: '87%', threshold: '85%', affectedSessions: '3.4%', mostImpactedRegion: 'EU-West', detailCategory: 'Capacity & Scaling' }),
  makeAlert({ id: 303, severity: 'Informational', severityCount: 'Info', alertName: 'Certificate Expiry Soon', alertRegion: 'Slick - All Regions', category: 'Protocol & Traffic', metricBreached: 'Cert < 30 days', firstBreached: '5 days ago', status: 'Open', chartData: [45, 40, 35, 32, 28], currentValue: '28 days', threshold: '30 days', affectedSessions: '0%', mostImpactedRegion: 'All', detailCategory: 'Protocol & Traffic' }),
  makeAlert({ id: 304, severity: 'Warning', severityCount: 2, alertName: 'Encryption Handshake Delays', alertRegion: 'Slick - APAC', category: 'Protocol & Traffic', metricBreached: 'Handshake > 500ms', firstBreached: '6h ago', status: 'Open', chartData: [200, 280, 350, 420, 520], currentValue: '520ms', threshold: '500ms', affectedSessions: '7.8%', mostImpactedRegion: 'APAC', detailCategory: 'Protocol & Traffic' }),
]

// Fortivo VPN - different alerts
const fortivoAlerts = [
  makeAlert({ id: 401, severity: 'Critical', severityCount: 1, alertName: 'Reconnect Frequency', alertRegion: 'Fortivo - South Asia', category: 'Network Health', metricBreached: 'Reconnects/session > 0.5', firstBreached: '30m ago', status: 'Open', chartData: [25, 40, 52, 65, 78], currentValue: '0.78 reconnects/session', threshold: '0.5', affectedSessions: '9.2%', mostImpactedRegion: 'South Asia', detailCategory: 'Network Health' }),
  makeAlert({ id: 402, severity: 'Warning', severityCount: 4, alertName: 'Split Tunnel Misconfiguration', alertRegion: 'Fortivo - US', category: 'Protocol & Traffic', metricBreached: 'Misconfig > 5%', firstBreached: '1 day ago', status: 'Open', chartData: [2, 3, 4, 4.5, 5.2], currentValue: '5.2%', threshold: '5%', affectedSessions: '4.1%', mostImpactedRegion: 'US-East', detailCategory: 'Protocol & Traffic' }),
  makeAlert({ id: 403, severity: 'Informational', severityCount: 'Info', alertName: 'Geo-Redundancy Check', alertRegion: 'Fortivo - Global', category: 'Capacity & Scaling', metricBreached: 'Redundancy < 99.9%', firstBreached: '3 days ago', status: 'Resolved', chartData: [99.5, 99.6, 99.7, 99.8, 99.95], currentValue: '99.95%', threshold: '99.9%', affectedSessions: '0.1%', mostImpactedRegion: 'Global', detailCategory: 'Capacity & Scaling' }),
]

// Qucik VPN - different alerts
const qucikAlerts = [
  makeAlert({ id: 501, severity: 'Warning', severityCount: 2, alertName: 'WireGuard Handshake Failures', alertRegion: 'Qucik - EU', category: 'Protocol & Traffic', metricBreached: 'Fail rate > 1%', firstBreached: '5h ago', status: 'Open', chartData: [0.2, 0.5, 0.7, 0.9, 1.1], currentValue: '1.1%', threshold: '1%', affectedSessions: '5.6%', mostImpactedRegion: 'EU-West', detailCategory: 'Protocol & Traffic' }),
  makeAlert({ id: 502, severity: 'Critical', severityCount: 1, alertName: 'Memory Pressure', alertRegion: 'Qucik - APAC', category: 'Capacity & Scaling', metricBreached: 'Memory > 95%', firstBreached: '15m ago', status: 'Open', chartData: [80, 85, 88, 92, 96], currentValue: '96%', threshold: '95%', affectedSessions: '12.3%', mostImpactedRegion: 'APAC', detailCategory: 'Capacity & Scaling' }),
  makeAlert({ id: 503, severity: 'Warning', severityCount: 3, alertName: 'IPv6 Adoption Low', alertRegion: 'Qucik - US', category: 'Network Health', metricBreached: 'IPv6 < 20%', firstBreached: '2 days ago', status: 'Acknowledged', chartData: [15, 16, 17, 18, 19], currentValue: '19%', threshold: '20%', affectedSessions: '2.2%', mostImpactedRegion: 'US-East', detailCategory: 'Network Health' }),
]

// Nexipher VPN - different alerts
const nexipherAlerts = [
  makeAlert({ id: 601, severity: 'Critical', severityCount: 1, alertName: 'Kill Switch Triggers', alertRegion: 'Nexipher - Global', category: 'Network Health', metricBreached: 'Triggers > 10/h', firstBreached: '25m ago', status: 'Open', chartData: [5, 6, 7, 9, 12], currentValue: '12/h', threshold: '10/h', affectedSessions: '6.7%', mostImpactedRegion: 'Global', detailCategory: 'Network Health' }),
  makeAlert({ id: 602, severity: 'Warning', severityCount: 4, alertName: 'Dedicated IP Pool Exhaustion', alertRegion: 'Nexipher - EU', category: 'Capacity & Scaling', metricBreached: 'Pool < 10% free', firstBreached: '4h ago', status: 'Open', chartData: [30, 25, 20, 15, 9], currentValue: '9%', threshold: '10%', affectedSessions: '8.4%', mostImpactedRegion: 'EU-West', detailCategory: 'Capacity & Scaling' }),
  makeAlert({ id: 603, severity: 'Informational', severityCount: 'Info', alertName: 'Protocol Migration Pending', alertRegion: 'Nexipher - All', category: 'Protocol & Traffic', metricBreached: 'Legacy > 5%', firstBreached: '1 week ago', status: 'Open', chartData: [12, 10, 8, 6, 5.5], currentValue: '5.5%', threshold: '5%', affectedSessions: '1.8%', mostImpactedRegion: 'All', detailCategory: 'Protocol & Traffic' }),
  makeAlert({ id: 604, severity: 'Warning', severityCount: 2, alertName: 'Peak Hour Congestion', alertRegion: 'Nexipher - APAC', category: 'Performance & Quality', metricBreached: 'Latency > 200ms', firstBreached: '3h ago', status: 'Acknowledged', chartData: [120, 140, 160, 180, 210], currentValue: '210ms', threshold: '200ms', affectedSessions: '11.1%', mostImpactedRegion: 'APAC', detailCategory: 'Performance & Quality' }),
]

export const alertsByVPN = {
  Portfolio: portfolioAlerts,
  'Steer Lucid': steerLucidAlerts,
  Crest: crestAlerts,
  Slick: slickAlerts,
  Fortivo: fortivoAlerts,
  Qucik: qucikAlerts,
  Nexipher: nexipherAlerts,
}

export const mostAffectedAreaByVPN = {
  Portfolio: { label: 'Network and Protocol Health', percentage: '9.3%' },
  'Steer Lucid': { label: 'Performance & Quality', percentage: '12.1%' },
  Crest: { label: 'Session Behavior', percentage: '8.7%' },
  Slick: { label: 'Network Health', percentage: '5.2%' },
  Fortivo: { label: 'Network Health', percentage: '7.8%' },
  Qucik: { label: 'Capacity & Scaling', percentage: '11.4%' },
  Nexipher: { label: 'Network Health', percentage: '9.1%' },
}

// Convert alerts to dashboard home page format: { title, description, level, link }
export const alertsToDashboardFormat = (alerts) =>
  (alerts || []).map((a) => ({
    title: `${a.alertName}${a.alertRegion ? ` - ${a.alertRegion}` : ''}`,
    description: a.description,
    level: a.severity === 'Critical' ? 'High Alert' : a.severity === 'Warning' ? 'Medium Level Alert' : 'Informational',
    link: 'View Alerts',
  }))

// Legacy exports for backward compatibility
export const alertsData = portfolioAlerts
export const mostAffectedArea = mostAffectedAreaByVPN.Portfolio
