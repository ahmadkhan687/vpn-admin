// Per-VPN data. Portfolio = aggregate across all VPNs.
const VPNS = ['Steer Lucid', 'Crest', 'Slick', 'Fortivo', 'Qucik', 'Nexipher']

const BASE_HEATMAP = [
  [110, 160, 220, 210, 150, 130, 140],
  [90, 120, 180, 190, 130, 110, 120],
  [80, 100, 150, 160, 120, 100, 110],
  [100, 140, 250, 230, 180, 150, 160],
  [130, 190, 320, 280, 210, 160, 170],
  [150, 210, 360, 300, 240, 170, 180],
  [200, 280, 420, 360, 280, 190, 200],
  [220, 310, 460, 410, 520, 320, 260],
  [190, 270, 430, 520, 350, 260, 210],
  [160, 240, 390, 510, 300, 210, 190],
  [140, 200, 360, 300, 220, 150, 160],
  [120, 170, 280, 240, 200, 140, 150],
]

const scaleHeatmap = (grid, mult) => grid.map((row) => row.map((v) => Math.round(v * mult)))

const vpnData = {}
const mults = [1.05, 0.92, 1.08, 1.12, 0.88, 0.95]
const todayStats = ['5h 48m', '6h 42m', '5h 52m', '6h 58m', '5h 12m', '5h 56m']
const weekStats = ['32h 15m', '31h 28m', '36h 55m', '38h 22m', '30h 08m', '32h 45m']
const monthStats = ['118h 22m', '113h 48m', '133h 45m', '138h 34m', '109h 12m', '117h 35m']
VPNS.forEach((vpn, i) => {
  vpnData[vpn] = {
    heatmapValues: scaleHeatmap(BASE_HEATMAP, mults[i]),
    today: todayStats[i],
    thisWeek: weekStats[i],
    thisMonth: monthStats[i],
    todayChange: [2.1, -1.2, 3.5, 4.2, -0.8, 1.5][i],
    weekChange: [-8.5, -12.2, -6.1, -5.2, -14.1, -9.8][i],
    monthChange: [-2.8, -4.1, -1.5, -0.9, -5.5, -3.8][i],
  }
})

const portfolioData = {
  heatmapValues: BASE_HEATMAP,
  today: '6h 15m',
  thisWeek: '34h 12m',
  thisMonth: '123h 47m',
  todayChange: 2.3,
  weekChange: -10.1,
  monthChange: -3.2,
}

export const getLoadDemandData = (scope) => {
  if (scope === 'Portfolio') return portfolioData
  return vpnData[scope] || portfolioData
}
