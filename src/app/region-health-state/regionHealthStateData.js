// Per-VPN data. Portfolio = aggregate across all VPNs.
const VPNS = ['Steer Lucid', 'Crest', 'Slick', 'Fortivo', 'Qucik', 'Nexipher']

const BASE_REGION_BARS = [
  [820, 910, 1050, 1180, 1320, 1280, 1150, 980, 920, 1050, 1180, 1020],
  [780, 880, 1020, 1150, 1280, 1250, 1120, 950, 880, 980, 1100, 950],
  [420, 480, 520, 580, 620, 590, 510, 380, 320, 410, 480, 450],
  [800, 890, 1040, 1170, 1300, 1270, 1140, 970, 910, 1010, 1130, 990],
  [810, 900, 1040, 1170, 1310, 1280, 1150, 980, 920, 1020, 1140, 1000],
]

const regionsTemplates = [
  { name: 'India 1', city: 'Mumbai', status: 'healthy', activeTunnels: 3320 },
  { name: 'Germany', city: 'Frankfurt', status: 'degraded', activeTunnels: 3320 },
  { name: 'USA 1', city: 'Los Angeles', status: 'alert', activeTunnels: 320 },
  { name: 'UK', city: 'London', status: 'healthy', activeTunnels: 3320 },
  { name: 'Canada', city: 'Toronto', status: 'healthy', activeTunnels: 3320 },
]

const scaleBars = (bars, mult) => bars.map((row) => row.map((v) => Math.round(v * mult)))

const vpnData = {}
const mults = [1.1, 0.9, 1.05, 1.15, 0.95, 1.0]
const statusOverrides = [
  ['healthy', 'degraded', 'alert', 'healthy', 'healthy'],
  ['healthy', 'healthy', 'degraded', 'healthy', 'degraded'],
  ['degraded', 'healthy', 'healthy', 'healthy', 'healthy'],
  ['healthy', 'degraded', 'alert', 'degraded', 'healthy'],
  ['healthy', 'healthy', 'healthy', 'healthy', 'degraded'],
  ['degraded', 'alert', 'healthy', 'healthy', 'healthy'],
]
VPNS.forEach((vpn, i) => {
  vpnData[vpn] = {
    regionBarValues: scaleBars(BASE_REGION_BARS, mults[i]),
    regions: regionsTemplates.map((r, j) => ({
      ...r,
      status: statusOverrides[i][j] || r.status,
      activeTunnels: Math.round(r.activeTunnels * mults[i]),
    })),
  }
})

const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length
const buildPortfolioData = () => ({
  regionBarValues: BASE_REGION_BARS,
  regions: regionsTemplates,
})

const portfolioData = buildPortfolioData()

export const getRegionHealthStateData = (scope) => {
  if (scope === 'Portfolio') return portfolioData
  return vpnData[scope] || portfolioData
}
