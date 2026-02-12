// Per-VPN data. Portfolio = aggregate (avg/sum) of all VPNs.
const VPNS = ['Steer Lucid', 'Crest', 'Slick', 'Fortivo', 'Qucik', 'Nexipher']

const vpnData = {
  'Steer Lucid': {
    tunnelDrop: { values: [980, 1850, 2100, 1650, 820, 1320, 45], ratePct: 1.9, change: -0.2, tooltips: ['980: Low load', '1850: Peak', '2100: Spike', '1650: Normal', '820: Dip', '1320: Rise', '45: Current'] },
    authFailure: { ratePct: 3.1, change: -0.1, failures: 312, stacked: [[25, 40, 50, 35], [30, 45, 55, 40], [35, 50, 60, 45], [40, 55, 65, 50], [30, 45, 55, 40], [25, 40, 50, 35], [20, 35, 45, 30]] },
    events: [
      { timestamp: 'Jan 15, 2026, 11:45', failureType: 'Auth Failure', reason: 'Invalid Credentials', user: 'LKJHSDF', device: 'Windows', region: 'Germany' },
      { timestamp: 'Jan 15, 2026, 11:30', failureType: 'Tunnel Drop', reason: 'Connection Lost', user: 'Mary Jane', device: 'IOS Device', region: 'USA 1' },
      { timestamp: 'Jan 15, 2026, 10:22', failureType: 'Auth Failure', reason: 'MFA Failure', user: 'QWERTY', device: 'Android Device', region: 'India' },
    ],
  },
  Crest: {
    tunnelDrop: { values: [1450, 2240, 1980, 2100, 1100, 1680, 28], ratePct: 2.8, change: 0.3, tooltips: ['1450: Base', '2240: High', '1980: Mid', '2100: Peak', '1100: Low', '1680: Recover', '28: Current'] },
    authFailure: { ratePct: 5.2, change: 0.6, failures: 89, stacked: [[35, 55, 70, 50], [40, 60, 75, 55], [45, 65, 80, 60], [50, 70, 85, 65], [40, 60, 75, 55], [35, 55, 70, 50], [30, 50, 65, 45]] },
    events: [
      { timestamp: 'Jan 15, 2026, 12:05', failureType: 'Tunnel Drop', reason: 'Network Timeout', user: 'XCVBNM', device: 'Linux', region: 'UK' },
      { timestamp: 'Jan 15, 2026, 11:58', failureType: 'Auth Failure', reason: 'Token Expired', user: 'ASDFGH', device: 'Android Device', region: 'Canada' },
    ],
  },
  Slick: {
    tunnelDrop: { values: [1100, 1920, 1780, 1950, 950, 1420, 38], ratePct: 2.1, change: -0.5, tooltips: ['1100: Start', '1920: Up', '1780: Down', '1950: Peak', '950: Low', '1420: Mid', '38: Current'] },
    authFailure: { ratePct: 3.8, change: 0.2, failures: 245, stacked: [[28, 42, 52, 38], [32, 48, 58, 42], [38, 52, 62, 48], [42, 58, 68, 52], [32, 48, 58, 42], [28, 42, 52, 38], [22, 38, 48, 32]] },
    events: [
      { timestamp: 'Jan 15, 2026, 12:08', failureType: 'Auth Failure', reason: 'Certificate Error', user: 'ZXCVB', device: 'IOS Device', region: 'Australia' },
      { timestamp: 'Jan 15, 2026, 11:15', failureType: 'Tunnel Drop', reason: 'Server Overload', user: 'Admin User', device: 'Windows', region: 'USA 1' },
      { timestamp: 'Jan 15, 2026, 10:45', failureType: 'Auth Failure', reason: 'Invalid Credentials', user: 'POIUYT', device: 'Android Device', region: 'France' },
    ],
  },
  Fortivo: {
    tunnelDrop: { values: [1300, 2050, 2200, 1880, 1050, 1550, 25], ratePct: 2.5, change: -0.3, tooltips: ['1300: Base', '2050: Rise', '2200: Peak', '1880: Fall', '1050: Low', '1550: Recover', '25: Current'] },
    authFailure: { ratePct: 4.8, change: 0.5, failures: 678, stacked: [[32, 48, 58, 42], [38, 55, 65, 48], [42, 60, 70, 52], [48, 65, 75, 58], [38, 55, 65, 48], [32, 48, 58, 42], [28, 42, 52, 38]] },
    events: [
      { timestamp: 'Jan 15, 2026, 12:12', failureType: 'Tunnel Drop', reason: 'Network Timeout', user: 'John Snow (Admin)', device: 'IOS Device', region: 'USA 1' },
      { timestamp: 'Jan 15, 2026, 12:10', failureType: 'Auth Failure', reason: 'Invalid Credentials', user: 'DHOIRVS', device: 'Android Device', region: 'Canada' },
      { timestamp: 'Jan 15, 2026, 12:08', failureType: 'Auth Failure', reason: 'Token Expired', user: 'SAKJFHE', device: 'Android Device', region: 'UK' },
      { timestamp: 'Jan 15, 2026, 11:50', failureType: 'Tunnel Drop', reason: 'Connection Lost', user: 'TYUIO', device: 'Windows', region: 'Germany' },
    ],
  },
  Qucik: {
    tunnelDrop: { values: [850, 1620, 1450, 1720, 780, 1180, 42], ratePct: 1.7, change: -0.6, tooltips: ['850: Low', '1620: Up', '1450: Down', '1720: Peak', '780: Dip', '1180: Mid', '42: Current'] },
    authFailure: { ratePct: 2.9, change: -0.2, failures: 156, stacked: [[22, 38, 48, 32], [26, 42, 52, 36], [30, 48, 58, 42], [35, 52, 62, 46], [26, 42, 52, 36], [22, 38, 48, 32], [18, 32, 42, 28]] },
    events: [
      { timestamp: 'Jan 15, 2026, 11:55', failureType: 'Auth Failure', reason: 'Token Expired', user: 'MNBVC', device: 'Android Device', region: 'India' },
      { timestamp: 'Jan 15, 2026, 11:22', failureType: 'Tunnel Drop', reason: 'Maintenance', user: 'LKJHGF', device: 'IOS Device', region: 'Japan' },
    ],
  },
  Nexipher: {
    tunnelDrop: { values: [1600, 2380, 2120, 2280, 1250, 1820, 22], ratePct: 3.1, change: 0.4, tooltips: ['1600: Base', '2380: Peak', '2120: Fall', '2280: Spike', '1250: Low', '1820: Rise', '22: Current'] },
    authFailure: { ratePct: 5.6, change: 0.8, failures: 421, stacked: [[40, 60, 75, 55], [45, 65, 80, 60], [50, 70, 85, 65], [55, 75, 90, 70], [45, 65, 80, 60], [40, 60, 75, 55], [35, 55, 70, 50]] },
    events: [
      { timestamp: 'Jan 15, 2026, 12:15', failureType: 'Auth Failure', reason: 'MFA Failure', user: 'WERTYU', device: 'Windows', region: 'Brazil' },
      { timestamp: 'Jan 15, 2026, 12:00', failureType: 'Tunnel Drop', reason: 'Network Timeout', user: 'IUYTR', device: 'Android Device', region: 'Mexico' },
      { timestamp: 'Jan 15, 2026, 11:40', failureType: 'Auth Failure', reason: 'Certificate Error', user: 'EDCBA', device: 'IOS Device', region: 'Spain' },
    ],
  },
}

const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length
const sum = (arr) => arr.reduce((a, b) => a + b, 0)

const buildPortfolioData = () => {
  const tunnelValues = []
  const stackedPerDay = [[], [], [], [], [], [], []]
  let totalFailures = 0
  const allEvents = []

  for (let i = 0; i < 7; i++) {
    const dayVals = VPNS.map((v) => vpnData[v].tunnelDrop.values[i])
    tunnelValues.push(Math.round(avg(dayVals)))
  }

  for (let day = 0; day < 7; day++) {
    for (let seg = 0; seg < 4; seg++) {
      const segVals = VPNS.map((v) => vpnData[v].authFailure.stacked[day][seg])
      stackedPerDay[day][seg] = Math.round(avg(segVals))
    }
  }

  VPNS.forEach((v) => {
    totalFailures += vpnData[v].authFailure.failures
    allEvents.push(...vpnData[v].events)
  })

  allEvents.sort((a, b) => a.timestamp.localeCompare(b.timestamp))

  const tunnelRatePct = (avg(VPNS.map((v) => vpnData[v].tunnelDrop.ratePct))).toFixed(1)
  const tunnelChange = (avg(VPNS.map((v) => vpnData[v].tunnelDrop.change))).toFixed(1)
  const authRatePct = (avg(VPNS.map((v) => vpnData[v].authFailure.ratePct))).toFixed(1)
  const authChange = (avg(VPNS.map((v) => vpnData[v].authFailure.change))).toFixed(1)

  return {
    tunnelDrop: {
      values: tunnelValues,
      ratePct: tunnelRatePct,
      change: parseFloat(tunnelChange) >= 0 ? `+${tunnelChange}` : tunnelChange,
      tooltips: tunnelValues.map((v, i) => `${v}: Day ${i + 1}`),
    },
    authFailure: {
      ratePct: authRatePct,
      change: parseFloat(authChange) >= 0 ? `+${authChange}` : authChange,
      failures: totalFailures,
      stacked: stackedPerDay,
    },
    events: allEvents,
  }
}

const SCOPES = ['Portfolio', ...VPNS]
const portfolioData = buildPortfolioData()

const getReliabilityData = (scope) => {
  if (scope === 'Portfolio') {
    return portfolioData
  }
  const d = vpnData[scope]
  if (!d) return portfolioData
  return {
    tunnelDrop: {
      values: d.tunnelDrop.values,
      ratePct: String(d.tunnelDrop.ratePct),
      change: d.tunnelDrop.change >= 0 ? `+${d.tunnelDrop.change}` : String(d.tunnelDrop.change),
      tooltips: d.tunnelDrop.tooltips,
    },
    authFailure: {
      ratePct: String(d.authFailure.ratePct),
      change: d.authFailure.change >= 0 ? `+${d.authFailure.change}` : String(d.authFailure.change),
      failures: d.authFailure.failures,
      stacked: d.authFailure.stacked,
    },
    events: d.events,
  }
}

export { SCOPES, getReliabilityData }
