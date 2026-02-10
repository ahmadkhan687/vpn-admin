// Retention / Churn data per VPN scope
// Portfolio = aggregated data across all VPNs (overall)

export const retentionData = {
  Portfolio: {
    churnUsers: 233,
    churnTrend: [8, 12, 15, 18, 14],
    churnMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    byAccountType: { free: 72, paid: 23 },
    byRegion: [
      { region: 'North America', pct: 18 },
      { region: 'Europe', pct: 27 },
      { region: 'Asia', pct: 36 },
      { region: 'South America', pct: 28 },
    ],
    byDevice: [
      { device: 'Android', pct: 22 },
      { device: 'iOS', pct: 28 },
      { device: 'Windows', pct: 18 },
      { device: 'Other', pct: 15 },
    ],
  },
  'Steer Lucid': {
    churnUsers: 68,
    churnTrend: [6, 10, 12, 15, 11],
    churnMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    byAccountType: { free: 48, paid: 20 },
    byRegion: [
      { region: 'North America', pct: 14 },
      { region: 'Europe', pct: 22 },
      { region: 'Asia', pct: 30 },
      { region: 'South America', pct: 24 },
    ],
    byDevice: [
      { device: 'Android', pct: 18 },
      { device: 'iOS', pct: 24 },
      { device: 'Windows', pct: 14 },
      { device: 'Other', pct: 12 },
    ],
  },
  Crest: {
    churnUsers: 42,
    churnTrend: [10, 14, 18, 20, 16],
    churnMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    byAccountType: { free: 28, paid: 14 },
    byRegion: [
      { region: 'North America', pct: 20 },
      { region: 'Europe', pct: 28 },
      { region: 'Asia', pct: 38 },
      { region: 'South America', pct: 30 },
    ],
    byDevice: [
      { device: 'Android', pct: 24 },
      { device: 'iOS', pct: 30 },
      { device: 'Windows', pct: 20 },
      { device: 'Other', pct: 16 },
    ],
  },
  Slick: {
    churnUsers: 95,
    churnTrend: [5, 8, 10, 12, 9],
    churnMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    byAccountType: { free: 62, paid: 33 },
    byRegion: [
      { region: 'North America', pct: 12 },
      { region: 'Europe', pct: 20 },
      { region: 'Asia', pct: 32 },
      { region: 'South America', pct: 22 },
    ],
    byDevice: [
      { device: 'Android', pct: 16 },
      { device: 'iOS', pct: 22 },
      { device: 'Windows', pct: 12 },
      { device: 'Other', pct: 10 },
    ],
  },
  Fortivo: {
    churnUsers: 55,
    churnTrend: [7, 11, 14, 17, 13],
    churnMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    byAccountType: { free: 38, paid: 17 },
    byRegion: [
      { region: 'North America', pct: 16 },
      { region: 'Europe', pct: 24 },
      { region: 'Asia', pct: 34 },
      { region: 'South America', pct: 26 },
    ],
    byDevice: [
      { device: 'Android', pct: 20 },
      { device: 'iOS', pct: 26 },
      { device: 'Windows', pct: 16 },
      { device: 'Other', pct: 14 },
    ],
  },
  Qucik: {
    churnUsers: 28,
    churnTrend: [4, 6, 8, 10, 7],
    churnMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    byAccountType: { free: 18, paid: 10 },
    byRegion: [
      { region: 'North America', pct: 10 },
      { region: 'Europe', pct: 18 },
      { region: 'Asia', pct: 28 },
      { region: 'South America', pct: 20 },
    ],
    byDevice: [
      { device: 'Android', pct: 14 },
      { device: 'iOS', pct: 20 },
      { device: 'Windows', pct: 10 },
      { device: 'Other', pct: 8 },
    ],
  },
  Nexipher: {
    churnUsers: 18,
    churnTrend: [12, 16, 20, 24, 18],
    churnMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    byAccountType: { free: 14, paid: 4 },
    byRegion: [
      { region: 'North America', pct: 22 },
      { region: 'Europe', pct: 30 },
      { region: 'Asia', pct: 40 },
      { region: 'South America', pct: 32 },
    ],
    byDevice: [
      { device: 'Android', pct: 26 },
      { device: 'iOS', pct: 32 },
      { device: 'Windows', pct: 22 },
      { device: 'Other', pct: 18 },
    ],
  },
}
