// Engagement data per VPN scope
// Portfolio = aggregated data across all VPNs (overall)
// Individual VPNs = their specific engagement data

const SESSION_LABELS = [
  { label: '1', valueKey: 's1' },
  { label: '2-3', valueKey: 's2_3' },
  { label: '4-6', valueKey: 's4_6' },
  { label: '7-10', valueKey: 's7_10' },
  { label: '10+', valueKey: 's10p' },
]

export const engagementData = {
  Portfolio: {
    dau: 233,
    mau: 92,
    dauTrend: [22, 18, 15, 12, 10, 14, 28, 45, 52, 48, 55, 62, 55, 60, 58, 52, 48, 65, 70, 62, 55, 45, 35, 28],
    mauTrend: [12, 18, 15, 22, 20, 28, 35, 42, 38, 45, 50, 55],
    sessions: { s1: 20, s2_3: 22, s4_6: 72, s7_10: 20, s10p: 8 },
  },
  'Steer Lucid': {
    dau: 68,
    mau: 42,
    dauTrend: [18, 14, 12, 10, 8, 12, 22, 38, 45, 42, 48, 55, 50, 52, 48, 45, 42, 58, 62, 55, 48, 38, 28, 22],
    mauTrend: [8, 12, 10, 15, 14, 18, 22, 28, 25, 30, 35, 42],
    sessions: { s1: 8, s2_3: 10, s4_6: 22, s7_10: 8, s10p: 4 },
  },
  Crest: {
    dau: 42,
    mau: 28,
    dauTrend: [12, 10, 8, 6, 5, 8, 18, 28, 32, 30, 35, 40, 35, 38, 35, 32, 30, 42, 45, 40, 35, 28, 20, 15],
    mauTrend: [5, 8, 6, 10, 9, 12, 16, 20, 18, 22, 25, 28],
    sessions: { s1: 5, s2_3: 6, s4_6: 12, s7_10: 4, s10p: 2 },
  },
  Slick: {
    dau: 95,
    mau: 58,
    dauTrend: [25, 20, 16, 12, 10, 16, 32, 52, 58, 55, 62, 68, 62, 65, 60, 55, 52, 68, 72, 65, 58, 48, 38, 30],
    mauTrend: [14, 20, 16, 24, 22, 30, 38, 45, 42, 48, 52, 58],
    sessions: { s1: 12, s2_3: 14, s4_6: 28, s7_10: 10, s10p: 5 },
  },
  Fortivo: {
    dau: 55,
    mau: 35,
    dauTrend: [14, 12, 10, 8, 6, 10, 22, 35, 40, 38, 42, 48, 42, 45, 42, 38, 35, 48, 52, 45, 40, 32, 24, 18],
    mauTrend: [8, 12, 10, 14, 13, 18, 22, 28, 25, 30, 32, 35],
    sessions: { s1: 7, s2_3: 8, s4_6: 16, s7_10: 6, s10p: 3 },
  },
  Qucik: {
    dau: 112,
    mau: 72,
    dauTrend: [28, 22, 18, 14, 12, 18, 38, 58, 65, 62, 68, 75, 68, 72, 65, 60, 58, 75, 80, 72, 65, 52, 42, 32],
    mauTrend: [16, 24, 18, 28, 25, 35, 45, 55, 50, 58, 65, 72],
    sessions: { s1: 14, s2_3: 16, s4_6: 32, s7_10: 12, s10p: 6 },
  },
  Nexipher: {
    dau: 28,
    mau: 18,
    dauTrend: [8, 6, 5, 4, 3, 6, 12, 18, 22, 20, 24, 28, 24, 26, 24, 22, 20, 28, 30, 26, 22, 18, 12, 10],
    mauTrend: [4, 6, 5, 8, 7, 10, 12, 16, 14, 18, 20, 18],
    sessions: { s1: 4, s2_3: 4, s4_6: 6, s7_10: 2, s10p: 1 },
  },
}

export const getSessionsPerUserData = (vpnKey) => {
  const data = engagementData[vpnKey] || engagementData.Portfolio
  const s = data.sessions
  return SESSION_LABELS.map(({ label, valueKey }) => ({
    label,
    value: s[valueKey] ?? 0,
  }))
}
