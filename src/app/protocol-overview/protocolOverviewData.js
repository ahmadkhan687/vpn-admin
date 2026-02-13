// Per-VPN data. Portfolio = aggregate (avg) across all VPNs.
const VPNS = ['Steer Lucid', 'Crest', 'Slick', 'Fortivo', 'Qucik', 'Nexipher']

const vpnData = {
  'Steer Lucid': [
    { label: 'HTTPS', value: 38.2 },
    { label: 'DNS', value: 28.1 },
    { label: 'TCP', value: 18.5 },
    { label: 'UDP', value: 11.2 },
    { label: 'Other', value: 4.0 },
  ],
  Crest: [
    { label: 'HTTPS', value: 44.5 },
    { label: 'DNS', value: 24.2 },
    { label: 'TCP', value: 17.8 },
    { label: 'UDP', value: 9.8 },
    { label: 'Other', value: 3.7 },
  ],
  Slick: [
    { label: 'HTTPS', value: 40.1 },
    { label: 'DNS', value: 26.8 },
    { label: 'TCP', value: 19.2 },
    { label: 'UDP', value: 10.1 },
    { label: 'Other', value: 3.8 },
  ],
  Fortivo: [
    { label: 'HTTPS', value: 39.5 },
    { label: 'DNS', value: 27.2 },
    { label: 'TCP', value: 20.1 },
    { label: 'UDP', value: 9.5 },
    { label: 'Other', value: 3.7 },
  ],
  Qucik: [
    { label: 'HTTPS', value: 42.3 },
    { label: 'DNS', value: 23.5 },
    { label: 'TCP', value: 21.2 },
    { label: 'UDP', value: 8.9 },
    { label: 'Other', value: 4.1 },
  ],
  Nexipher: [
    { label: 'HTTPS', value: 36.8 },
    { label: 'DNS', value: 29.4 },
    { label: 'TCP', value: 18.9 },
    { label: 'UDP', value: 11.5 },
    { label: 'Other', value: 3.4 },
  ],
}

const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length

const buildPortfolioData = () => {
  const labels = ['HTTPS', 'DNS', 'TCP', 'UDP', 'Other']
  return labels.map((label, i) => ({
    label,
    value: parseFloat((avg(VPNS.map((v) => vpnData[v][i].value))).toFixed(1)),
  }))
}

const portfolioData = buildPortfolioData()

export const getProtocolOverviewData = (scope) => {
  if (scope === 'Portfolio') return portfolioData
  return vpnData[scope] || portfolioData
}
