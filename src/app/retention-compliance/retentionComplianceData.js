// Retention compliance data per VPN and aggregate for Portfolio

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const baseRetention = {
  'Steer Lucid': {
    region: 'North America',
    retentionMonths: 18,
    hasPolicy: true,
    legalHolds: 2,
    deletionBacklogK: 8,
    status: 'Compliant',
    // Retention requests / SLA metrics
    requestsProcessed: 233,
    retentionRequests: 2,
    complianceRatePct: 99.2,
    slaUsedPct: 99.6,
    slaWithinCount: 69,
    slaBreachedCount: 5,
    slaComplianceHours: 16,
    trendMonths: MONTHS,
    trendValues: [7, 7.4, 7.1, 7.8, 8.2, 8.5, 8.9, 9.1, 8.7, 8.4, 8.2, 8.0],
    logs: [
      {
        id: 'LRWR-2456',
        type: 'Retention Type',
        receivedDate: 'Jan 15, 2026, 09:34 AM',
        slaDeadline: 'Jan 15, 2026, 09:34 AM',
        responseTime: '2h 30min',
        status: 'Allowed',
      },
      {
        id: 'LRWR-2457',
        type: 'Legal Request',
        receivedDate: 'Jan 15, 2026, 10:02 AM',
        slaDeadline: 'Jan 15, 2026, 10:32 AM',
        responseTime: '1hr 20min',
        status: 'Allowed',
      },
    ],
  },
  Crest: {
    region: 'Europe',
    retentionMonths: 12,
    hasPolicy: true,
    legalHolds: 0,
    deletionBacklogK: 10,
    status: 'Needs Review',
    requestsProcessed: 120,
    retentionRequests: 1,
    complianceRatePct: 97.8,
    slaUsedPct: 98.9,
    slaWithinCount: 40,
    slaBreachedCount: 3,
    slaComplianceHours: 18,
    trendMonths: MONTHS,
    trendValues: [6.3, 6.8, 7.0, 7.4, 7.9, 7.6, 7.8, 8.0, 7.7, 7.3, 7.1, 6.9],
    logs: [
      {
        id: 'LRWR-2480',
        type: 'Legal Request',
        receivedDate: 'Jan 14, 2026, 11:15 AM',
        slaDeadline: 'Jan 14, 2026, 11:45 AM',
        responseTime: '1hr 10min',
        status: 'Allowed',
      },
    ],
  },
  Slick: {
    region: 'Asia',
    retentionMonths: 24,
    hasPolicy: true,
    legalHolds: 3,
    deletionBacklogK: 6,
    status: 'Compliant',
    requestsProcessed: 180,
    retentionRequests: 3,
    complianceRatePct: 99.5,
    slaUsedPct: 99.8,
    slaWithinCount: 55,
    slaBreachedCount: 2,
    slaComplianceHours: 15,
    trendMonths: MONTHS,
    trendValues: [8.2, 8.6, 8.9, 9.1, 9.4, 9.0, 9.3, 9.6, 9.2, 8.9, 8.7, 8.5],
    logs: [
      {
        id: 'LRWR-2520',
        type: 'Retention Type',
        receivedDate: 'Jan 13, 2026, 03:40 PM',
        slaDeadline: 'Jan 13, 2026, 04:10 PM',
        responseTime: '45min',
        status: 'Allowed',
      },
    ],
  },
  Fortivo: {
    region: 'South America',
    retentionMonths: 12,
    hasPolicy: true,
    legalHolds: 2,
    deletionBacklogK: 5,
    status: 'Compliant',
    requestsProcessed: 90,
    retentionRequests: 1,
    complianceRatePct: 98.5,
    slaUsedPct: 99.1,
    slaWithinCount: 30,
    slaBreachedCount: 2,
    slaComplianceHours: 17,
    trendMonths: MONTHS,
    trendValues: [6.9, 7.2, 7.5, 7.9, 8.1, 7.8, 8.0, 8.3, 8.1, 7.7, 7.4, 7.2],
    logs: [
      {
        id: 'LRWR-2601',
        type: 'Legal Request',
        receivedDate: 'Jan 12, 2026, 01:22 PM',
        slaDeadline: 'Jan 12, 2026, 01:52 PM',
        responseTime: '1hr 05min',
        status: 'Allowed',
      },
    ],
  },
  Qucik: {
    region: 'Middle East',
    retentionMonths: 6,
    hasPolicy: false,
    legalHolds: 1,
    deletionBacklogK: 3,
    status: 'Needs Review',
    requestsProcessed: 60,
    retentionRequests: 1,
    complianceRatePct: 94.3,
    slaUsedPct: 99.7,
    slaWithinCount: 20,
    slaBreachedCount: 4,
    slaComplianceHours: 20,
    trendMonths: MONTHS,
    trendValues: [5.5, 5.9, 6.1, 6.4, 6.7, 6.3, 6.6, 6.9, 6.5, 6.2, 6.0, 5.8],
    logs: [
      {
        id: 'LRWR-2702',
        type: 'Retention Type',
        receivedDate: 'Jan 11, 2026, 09:05 AM',
        slaDeadline: 'Jan 11, 2026, 09:35 AM',
        responseTime: '1hr 35min',
        status: 'Breached',
      },
    ],
  },
  Nexipher: {
    region: 'APAC',
    retentionMonths: 12,
    hasPolicy: true,
    legalHolds: 0,
    deletionBacklogK: 2,
    status: 'Compliant',
    requestsProcessed: 110,
    retentionRequests: 1,
    complianceRatePct: 99.1,
    slaUsedPct: 98.5,
    slaWithinCount: 28,
    slaBreachedCount: 1,
    slaComplianceHours: 15,
    trendMonths: MONTHS,
    trendValues: [7.8, 8.1, 8.4, 8.8, 9.0, 8.7, 8.9, 9.2, 8.8, 8.5, 8.3, 8.1],
    logs: [
      {
        id: 'LRWR-2803',
        type: 'Legal Request',
        receivedDate: 'Jan 10, 2026, 04:50 PM',
        slaDeadline: 'Jan 10, 2026, 05:20 PM',
        responseTime: '40min',
        status: 'Allowed',
      },
    ],
  },
}

export const getRetentionComplianceForScope = (scope) => {
  const entries = Object.entries(baseRetention)
  if (!scope || scope === 'Portfolio') {
    const totalVpns = entries.length
    const coveredCount = entries.filter(([, v]) => v.hasPolicy).length
    const coveragePct = totalVpns ? Math.round((coveredCount / totalVpns) * 1000) / 10 : 0
    const totalLegalHolds = entries.reduce((sum, [, v]) => sum + (v.legalHolds || 0), 0)
    const totalBacklogK = entries.reduce((sum, [, v]) => sum + (v.deletionBacklogK || 0), 0)
    const totalRequestsProcessed = entries.reduce((sum, [, v]) => sum + (v.requestsProcessed || 0), 0)
    const totalRetentionRequests = entries.reduce((sum, [, v]) => sum + (v.retentionRequests || 0), 0)
    const avgComplianceRate =
      totalVpns > 0 ? Math.round((entries.reduce((sum, [, v]) => sum + (v.complianceRatePct || 0), 0) / totalVpns) * 10) / 10 : 0
    const totalSlaWithin = entries.reduce((sum, [, v]) => sum + (v.slaWithinCount || 0), 0)
    const totalSlaBreached = entries.reduce((sum, [, v]) => sum + (v.slaBreachedCount || 0), 0)
    const avgSlaHours =
      totalVpns > 0
        ? Math.round((entries.reduce((sum, [, v]) => sum + (v.slaComplianceHours || 0), 0) / totalVpns) * 10) / 10
        : 0

    const rows = [
      {
        vpn: 'Portfolio',
        region: 'Global',
        retentionPolicy: 'Multiple',
        legalHold: `${totalLegalHolds} active`,
        status: coveragePct >= 95 ? 'Compliant' : 'Needs Review',
      },
      ...entries.map(([vpn, v]) => ({
        vpn,
        region: v.region,
        retentionPolicy: `${v.retentionMonths} months`,
        legalHold: v.legalHolds ? `${v.legalHolds} active` : '0',
        status: v.status,
      })),
    ]

    const trendMonths = MONTHS
    const trendValues = trendMonths.map((_, idx) => {
      const sumAtIdx = entries.reduce((sum, [, v]) => {
        const value = v.trendValues?.[idx]
        return sum + (typeof value === 'number' ? value : 0)
      }, 0)
      return totalVpns > 0 ? Math.round((sumAtIdx / totalVpns) * 10) / 10 : 0
    })

    const logs = entries.flatMap(([, v]) => v.logs || [])
    return {
      coveragePct,
      legalHolds: totalLegalHolds,
      deletionBacklogLabel: `${totalBacklogK}k`,
      rows,
      // New metrics for the redesigned dashboard
      requestsProcessed: totalRequestsProcessed,
      retentionRequests: totalRetentionRequests,
      complianceRatePct: avgComplianceRate,
      slaUsedPct: avgComplianceRate || 99.6,
      slaWithinCount: totalSlaWithin,
      slaBreachedCount: totalSlaBreached,
      slaComplianceHours: avgSlaHours || 16,
      trendMonths,
      trendValues,
      logs,
    }
  }

  const v = baseRetention[scope]
  if (!v) {
    return {
      coveragePct: 0,
      legalHolds: 0,
      deletionBacklogLabel: '0k',
      rows: [],
      requestsProcessed: 0,
      retentionRequests: 0,
      complianceRatePct: 0,
      slaUsedPct: 0,
      slaWithinCount: 0,
      slaBreachedCount: 0,
      slaComplianceHours: 0,
      trendMonths: MONTHS,
      trendValues: MONTHS.map(() => 0),
      logs: [],
    }
  }
  return {
    coveragePct: v.hasPolicy ? 100 : 0,
    legalHolds: v.legalHolds,
    deletionBacklogLabel: `${v.deletionBacklogK}k`,
    rows: [
      {
        vpn: scope,
        region: v.region,
        retentionPolicy: `${v.retentionMonths} months`,
        legalHold: v.legalHolds ? `${v.legalHolds} active` : '0',
        status: v.status,
      },
    ],
    requestsProcessed: v.requestsProcessed,
    retentionRequests: v.retentionRequests,
    complianceRatePct: v.complianceRatePct,
    slaUsedPct: v.slaUsedPct,
    slaWithinCount: v.slaWithinCount,
    slaBreachedCount: v.slaBreachedCount,
    slaComplianceHours: v.slaComplianceHours,
    trendMonths: v.trendMonths,
    trendValues: v.trendValues,
    logs: v.logs || [],
  }
}

