// Per-VPN data. Portfolio = aggregate across all VPNs.
const VPNS = ['Steer Lucid', 'Crest', 'Slick', 'Fortivo', 'Qucik', 'Nexipher']

const ALL_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const basePatterns = [
  [3200, 12500, 18500, 8200],
  [4200, 14200, 19500, 9200],
  [3800, 13200, 17800, 8500],
  [4500, 15200, 21500, 10200],
  [3900, 12800, 18200, 8800],
  [4800, 16200, 22800, 11200],
  [4100, 13800, 19200, 9500],
  [4400, 14800, 20800, 9800],
  [3600, 12200, 17200, 7900],
  [4700, 15800, 22200, 10800],
  [4000, 13500, 18800, 9100],
  [3400, 11800, 16800, 7600],
]

const buildReconnectData = (mult) => {
  const out = []
  for (let m = 0; m < 12; m++) {
    for (let i = 0; i < 4; i++) {
      out.push({ month: ALL_MONTHS[m], value: Math.round(basePatterns[m][i] * mult) })
    }
  }
  return out
}

const baseMtuLocation = [
  { label: 'USA', value: 340, color: '#ea580c' },
  { label: 'Canada', value: 280, color: '#fb923c' },
  { label: 'UK', value: 240, color: '#c2410c' },
  { label: 'France', value: 260, color: '#3b82f6' },
]

const scaleMtu = (data, mults) =>
  data.map((d, i) => ({ ...d, value: Math.round(d.value * (mults[i] ?? 1)) }))

const vpnData = {
  'Steer Lucid': {
    reconnectData: buildReconnectData(0.9),
    reconnectsPerSession: '0.42',
    status: 'Stable',
    affectedSessions: '6.2%',
    mostImpactedRegion: 'APAC',
    mtuErrors: 1156,
    mtuChange: 12,
    mtuLocation: scaleMtu(baseMtuLocation, [1.1, 0.95, 1.05, 1.0]),
  },
  Crest: {
    reconnectData: buildReconnectData(1.15),
    reconnectsPerSession: '0.48',
    status: 'Stable',
    affectedSessions: '8.1%',
    mostImpactedRegion: 'EU-West',
    mtuErrors: 1420,
    mtuChange: 22,
    mtuLocation: scaleMtu(baseMtuLocation, [0.9, 1.2, 1.1, 1.15]),
  },
  Slick: {
    reconnectData: buildReconnectData(1.05),
    reconnectsPerSession: '0.39',
    status: 'Stable',
    affectedSessions: '5.8%',
    mostImpactedRegion: 'South America',
    mtuErrors: 1190,
    mtuChange: -8,
    mtuLocation: scaleMtu(baseMtuLocation, [1.05, 0.9, 1.0, 1.1]),
  },
  Fortivo: {
    reconnectData: buildReconnectData(1.25),
    reconnectsPerSession: '0.52',
    status: 'Elevated',
    affectedSessions: '9.4%',
    mostImpactedRegion: 'Middle East',
    mtuErrors: 1580,
    mtuChange: 28,
    mtuLocation: scaleMtu(baseMtuLocation, [1.2, 1.15, 1.05, 1.2]),
  },
  Qucik: {
    reconnectData: buildReconnectData(0.85),
    reconnectsPerSession: '0.35',
    status: 'Stable',
    affectedSessions: '4.2%',
    mostImpactedRegion: 'US-East',
    mtuErrors: 980,
    mtuChange: -5,
    mtuLocation: scaleMtu(baseMtuLocation, [0.85, 0.9, 0.95, 0.9]),
  },
  Nexipher: {
    reconnectData: buildReconnectData(1.1),
    reconnectsPerSession: '0.45',
    status: 'Stable',
    affectedSessions: '7.8%',
    mostImpactedRegion: 'South Asia',
    mtuErrors: 1350,
    mtuChange: 15,
    mtuLocation: scaleMtu(baseMtuLocation, [1.0, 1.1, 1.15, 1.05]),
  },
}

const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length

const buildPortfolioData = () => {
  const reconnectByMonth = []
  for (let m = 0; m < 12; m++) {
    for (let i = 0; i < 4; i++) {
      const idx = m * 4 + i
      const vals = VPNS.map((v) => vpnData[v].reconnectData[idx].value)
      reconnectByMonth.push({ month: ALL_MONTHS[m], value: Math.round(avg(vals)) })
    }
  }
  const reconnectsPerSession = (
    avg(VPNS.map((v) => parseFloat(vpnData[v].reconnectsPerSession)))
  ).toFixed(2)
  const affectedSessions = (
    avg(VPNS.map((v) => parseFloat(vpnData[v].affectedSessions)))
  ).toFixed(1) + '%'
  const mtuErrors = Math.round(avg(VPNS.map((v) => vpnData[v].mtuErrors)))
  const mtuChange = Math.round(avg(VPNS.map((v) => vpnData[v].mtuChange)))
  const mtuLocation = baseMtuLocation.map((loc, i) => ({
    ...loc,
    value: Math.round(avg(VPNS.map((v) => vpnData[v].mtuLocation[i].value))),
  }))
  return {
    reconnectData: reconnectByMonth,
    reconnectsPerSession,
    status: 'Stable',
    affectedSessions,
    mostImpactedRegion: 'South Asia',
    mtuErrors,
    mtuChange,
    mtuLocation,
  }
}

const portfolioData = buildPortfolioData()

export const getConnectionStabilityData = (scope) => {
  if (scope === 'Portfolio') return portfolioData
  return vpnData[scope] || portfolioData
}
