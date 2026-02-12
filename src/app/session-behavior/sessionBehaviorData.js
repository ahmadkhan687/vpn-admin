// Per-VPN data. Portfolio = aggregate (sum for total hours, avg for duration/egress).
// Egress: 24 hours from 12am to 11pm (low at night, peak midday/afternoon).
const VPNS = ['Steer Lucid', 'Crest', 'Slick', 'Fortivo', 'Qucik', 'Nexipher']

// 24-hour egress pattern: low night (0-5), rise morning (6-9), peak midday (10-18), decline evening (19-23)
const EGRESS_24H_PATTERN = [95, 88, 82, 78, 85, 92, 115, 155, 195, 235, 280, 320, 350, 385, 398, 375, 340, 295, 250, 210, 175, 145, 120, 102]

const buildEgress24h = (mult) => EGRESS_24H_PATTERN.map((v) => Math.round(v * mult))

const vpnData = {
  'Steer Lucid': {
    totalHours: 2850,
    avgSessionDuration: '2min 15s',
    avgSessionDurationChange: 3.2,
    avgSessionDurationValues: [6, 10, 8, 16, 14, 12, 15, 18, 16, 17, 20, 14],
    egressMB: 198,
    egressChange: '+18 MB',
    egressWindows: [
      buildEgress24h(1.0),
      buildEgress24h(0.95),
      buildEgress24h(1.08),
    ],
  },
  Crest: {
    totalHours: 1920,
    avgSessionDuration: '1min 50s',
    avgSessionDurationChange: -1.2,
    avgSessionDurationValues: [5, 9, 7, 14, 12, 11, 13, 16, 14, 15, 18, 12],
    egressMB: 245,
    egressChange: '+32 MB',
    egressWindows: [
      buildEgress24h(1.22),
      buildEgress24h(1.15),
      buildEgress24h(1.28),
    ],
  },
  Slick: {
    totalHours: 2240,
    avgSessionDuration: '2min 40s',
    avgSessionDurationChange: 5.1,
    avgSessionDurationValues: [9, 13, 11, 19, 17, 15, 18, 21, 19, 20, 23, 17],
    egressMB: 210,
    egressChange: '+22 MB',
    egressWindows: [
      buildEgress24h(1.1),
      buildEgress24h(1.02),
      buildEgress24h(1.15),
    ],
  },
  Fortivo: {
    totalHours: 4580,
    avgSessionDuration: '2min 55s',
    avgSessionDurationChange: 6.2,
    avgSessionDurationValues: [10, 14, 12, 20, 18, 16, 19, 22, 20, 21, 24, 18],
    egressMB: 235,
    egressChange: '+28 MB',
    egressWindows: [
      buildEgress24h(1.18),
      buildEgress24h(1.1),
      buildEgress24h(1.22),
    ],
  },
  Qucik: {
    totalHours: 1180,
    avgSessionDuration: '1min 35s',
    avgSessionDurationChange: -0.8,
    avgSessionDurationValues: [4, 8, 6, 12, 10, 9, 11, 14, 12, 13, 16, 10],
    egressMB: 175,
    egressChange: '+12 MB',
    egressWindows: [
      buildEgress24h(0.92),
      buildEgress24h(0.85),
      buildEgress24h(0.98),
    ],
  },
  Nexipher: {
    totalHours: 3150,
    avgSessionDuration: '2min 45s',
    avgSessionDurationChange: 4.8,
    avgSessionDurationValues: [8, 12, 10, 17, 15, 14, 17, 20, 18, 19, 22, 16],
    egressMB: 255,
    egressChange: '+35 MB',
    egressWindows: [
      buildEgress24h(1.28),
      buildEgress24h(1.2),
      buildEgress24h(1.35),
    ],
  },
}

const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length
const sum = (arr) => arr.reduce((a, b) => a + b, 0)

const buildPortfolioData = () => {
  const totalHours = sum(VPNS.map((v) => vpnData[v].totalHours))
  const avgDurations = VPNS.map((v) => {
    const d = vpnData[v].avgSessionDuration
    const match = d.match(/(\d+)min\s*(\d*)s?/)
    if (!match) return 150
    const min = parseInt(match[1], 10)
    const sec = parseInt(match[2] || 0, 10)
    return min * 60 + sec
  })
  const avgDurationSec = Math.round(avg(avgDurations))
  const avgDurationFormatted = `${Math.floor(avgDurationSec / 60)}min ${avgDurationSec % 60}s`
  const avgDurationChanges = VPNS.map((v) => vpnData[v].avgSessionDurationChange)
  const avgDurationValues = []
  for (let i = 0; i < 12; i++) {
    avgDurationValues.push(Math.round(avg(VPNS.map((v) => vpnData[v].avgSessionDurationValues[i]))))
  }
  const egressValues = VPNS.map((v) => vpnData[v].egressMB)
  const avgEgress = Math.round(avg(egressValues))
  const egressWindows = []
  for (let w = 0; w < 3; w++) {
    const win = []
    for (let i = 0; i < 24; i++) {
      win.push(Math.round(avg(VPNS.map((v) => vpnData[v].egressWindows[w][i]))))
    }
    egressWindows.push(win)
  }
  return {
    totalHours,
    avgSessionDuration: avgDurationFormatted,
    avgSessionDurationChange: (avg(avgDurationChanges)).toFixed(1),
    avgSessionDurationValues: avgDurationValues,
    egressMB: avgEgress,
    egressChange: '+23 MB',
    egressWindows,
  }
}

const portfolioData = buildPortfolioData()

const getSessionBehaviorData = (scope) => {
  if (scope === 'Portfolio') {
    return portfolioData
  }
  const d = vpnData[scope]
  if (!d) return portfolioData
  return {
    totalHours: d.totalHours,
    avgSessionDuration: d.avgSessionDuration,
    avgSessionDurationChange: String(d.avgSessionDurationChange),
    avgSessionDurationValues: [...d.avgSessionDurationValues],
    egressMB: d.egressMB,
    egressChange: d.egressChange,
    egressWindows: d.egressWindows.map((w) => [...w]),
  }
}

export { getSessionBehaviorData }
