// Per-VPN data for Median Latency & Packet Loss.
// Portfolio = aggregate (avg) of all VPNs.
// TODO: Replace with backend/API data when available.

const VPNS = ['Steer Lucid', 'Crest', 'Slick', 'Fortivo', 'Qucik', 'Nexipher']

const vpnData = {
  'Steer Lucid': {
    medianLatency: { valueMs: 95, changePct: 0.2, status: 'healthy', thresholdMs: 160, withinSLA: true },
    packetLoss: { valuePct: 2.1, changePct: -0.3, failures: 180, status: 'healthy' },
  },
  Crest: {
    medianLatency: { valueMs: 142, changePct: 0.5, status: 'healthy', thresholdMs: 160, withinSLA: true },
    packetLoss: { valuePct: 5.8, changePct: 0.4, failures: 95, status: 'inRisk' },
  },
  Slick: {
    medianLatency: { valueMs: 118, changePct: -0.1, status: 'healthy', thresholdMs: 160, withinSLA: true },
    packetLoss: { valuePct: 3.2, changePct: -0.2, failures: 220, status: 'healthy' },
  },
  Fortivo: {
    medianLatency: { valueMs: 128, changePct: 0.3, status: 'healthy', thresholdMs: 160, withinSLA: true },
    packetLoss: { valuePct: 4.3, changePct: 0.4, failures: 512, status: 'inRisk' },
  },
  Qucik: {
    medianLatency: { valueMs: 88, changePct: -0.2, status: 'healthy', thresholdMs: 160, withinSLA: true },
    packetLoss: { valuePct: 1.5, changePct: -0.5, failures: 45, status: 'healthy' },
  },
  Nexipher: {
    medianLatency: { valueMs: 155, changePct: 0.6, status: 'atRisk', thresholdMs: 160, withinSLA: false },
    packetLoss: { valuePct: 6.2, changePct: 0.8, failures: 380, status: 'inRisk' },
  },
}

const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length
const sum = (arr) => arr.reduce((a, b) => a + b, 0)

const buildPortfolioData = () => {
  const latencyValues = VPNS.map((v) => vpnData[v].medianLatency.valueMs)
  const latencyChanges = VPNS.map((v) => vpnData[v].medianLatency.changePct)
  const packetValues = VPNS.map((v) => vpnData[v].packetLoss.valuePct)
  const packetChanges = VPNS.map((v) => vpnData[v].packetLoss.changePct)
  const totalFailures = sum(VPNS.map((v) => vpnData[v].packetLoss.failures))
  const withinSLACount = VPNS.filter((v) => vpnData[v].medianLatency.withinSLA).length
  const inRiskCount = VPNS.filter((v) => vpnData[v].packetLoss.status === 'inRisk').length

  return {
    medianLatency: {
      valueMs: Math.round(avg(latencyValues)),
      changePct: (avg(latencyChanges)).toFixed(1),
      status: withinSLACount === VPNS.length ? 'healthy' : withinSLACount > 0 ? 'atRisk' : 'inRisk',
      thresholdMs: 160,
      withinSLA: withinSLACount === VPNS.length,
    },
    packetLoss: {
      valuePct: (avg(packetValues)).toFixed(1),
      changePct: (avg(packetChanges)).toFixed(1),
      failures: totalFailures,
      status: inRiskCount > 0 ? 'inRisk' : 'healthy',
    },
  }
}

const portfolioData = buildPortfolioData()

const getPerformanceQualityData = (scope) => {
  if (scope === 'Portfolio') {
    return portfolioData
  }
  const d = vpnData[scope]
  if (!d) return portfolioData
  return {
    medianLatency: {
      valueMs: d.medianLatency.valueMs,
      changePct: String(d.medianLatency.changePct),
      status: d.medianLatency.status,
      thresholdMs: d.medianLatency.thresholdMs,
      withinSLA: d.medianLatency.withinSLA,
    },
    packetLoss: {
      valuePct: String(d.packetLoss.valuePct),
      changePct: String(d.packetLoss.changePct),
      failures: d.packetLoss.failures,
      status: d.packetLoss.status,
    },
  }
}

export { getPerformanceQualityData }
