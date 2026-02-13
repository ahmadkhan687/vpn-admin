// Per-VPN data. Portfolio = aggregate across all VPNs.
const VPNS = ['Steer Lucid', 'Crest', 'Slick', 'Fortivo', 'Qucik', 'Nexipher']

const BASE_TUNNELS = [
  3500, 9200, 5200, 18200, 22100, 11500, 20800, 19800, 21000, 8800, 17500, 20400,
  19200, 10500, 22800, 17200, 20500, 14200, 18800, 21800, 16500, 19800, 11800, 19200,
  20500, 8200, 23200, 16800, 20200, 13200, 18500, 21200, 15800, 19500, 11200, 20800,
  17800, 21500, 13800, 19000, 20200, 9200, 17200, 20900, 17000, 19700, 12500, 20679,
]

const BASE_PEAK = [
  420, 380, 520, 680, 820, 750, 580, 410, 510, 620, 780, 910, 880, 720, 540, 480,
  580, 710, 850, 980, 1050, 920, 680, 550, 640, 760, 920, 1100, 1180, 1020, 780, 620,
  720, 850, 1000, 1200, 1280, 1150, 880, 700, 780, 920, 1080, 1320, 1420, 1250, 950, 780,
  850, 980, 1150, 1400, 1520, 1380, 1050, 850, 920, 1050, 1250, 1500, 1650, 1480, 1150, 920,
  980, 1120, 1320, 1580, 1780, 1620, 1280, 1020, 1050, 1200, 1420, 1700, 1920, 1750, 1380, 1100,
  1150, 1320, 1550, 1850, 2100, 1950, 1580, 3120, 880, 720, 680, 620, 580, 520, 480, 440,
]

const scale = (arr, mult) => arr.map((v) => Math.round(v * mult))

const vpnData = {}
VPNS.forEach((vpn, i) => {
  const tunnelsMult = 0.85 + (i * 0.05)
  const peakMult = 0.9 + (i * 0.02)
  vpnData[vpn] = {
    activeTunnelsValues: scale(BASE_TUNNELS, tunnelsMult),
    peakValues: scale(BASE_PEAK, peakMult),
  }
})

const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length
const buildPortfolioData = () => ({
  activeTunnelsValues: BASE_TUNNELS,
  peakValues: BASE_PEAK,
})

const portfolioData = buildPortfolioData()

export const getNetworkOverviewData = (scope) => {
  if (scope === 'Portfolio') return portfolioData
  return vpnData[scope] || portfolioData
}
