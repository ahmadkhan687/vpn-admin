// IPDR data per VPN scope
// Portfolio = aggregated across all VPNs

export const ipdrData = {
  Portfolio: {
    kpis: {
      // show only the numeric part in the UI (no % symbol)
      accessCountPct: 13,
      accessCountChange: '+2% vs last  week',
      policyViolations: 8,
      policyViolationsChange: '-2 vs last week',
      totalAuditEvents: '1,233',
      totalAuditChange: '+ period',
    },
    accessCount: 233,
    accessTrend: [6, 7, 6.5, 7.2, 6.8, 7.5, 8, 7.6, 8.2, 7.9, 8.1, 7.4],
    accessMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    integrity: {
      usedPct: 99.6,
      validPct: 99.6,
      intactLabel: '99.6% Intact',
    },
    // Portfolio logs will be derived by aggregating all VPN logs
    logs: [],
  },
  'Steer Lucid': {
    kpis: {
      accessCountPct: 16,
      accessCountChange: '+3% vs last week',
      policyViolations: 3,
      policyViolationsChange: '+1 vs last week',
      totalAuditEvents: '420',
      totalAuditChange: '+1% period',
    },
    accessCount: 80,
    accessTrend: [5, 6, 7, 6.5, 7.8, 8.2, 7.4, 8.6, 9.1, 8.4],
    accessMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    integrity: {
      usedPct: 98.9,
      validPct: 98.9,
      intactLabel: '98.9% Intact',
    },
    logs: [
      {
        timestamp: 'Jan 15, 2026, 09:34 AM',
        user: 'Thomas Carter',
        role: 'Admin',
        action: 'View',
        scope: 'Steer Lucid',
        status: 'Allowed',
      },
      {
        timestamp: 'Jan 15, 2026, 09:32 AM',
        user: 'Thomas Carter',
        role: 'Admin',
        action: 'Export',
        scope: 'Steer Lucid',
        status: 'Allowed',
      },
    ],
  },
  Crest: {
    kpis: {
      accessCountPct: 10,
      accessCountChange: '+1% vs last week',
      policyViolations: 2,
      policyViolationsChange: '0 vs last week',
      totalAuditEvents: '185',
      totalAuditChange: '+0.5% period',
    },
    accessCount: 40,
    accessTrend: [4.5, 4.2, 4.8, 5.0, 5.3, 5.1, 5.6, 5.2, 5.8, 5.4],
    accessMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    integrity: {
      usedPct: 99.2,
      validPct: 99.2,
      intactLabel: '99.2% Intact',
    },
    logs: [
      {
        timestamp: 'Jan 14, 2026, 18:12 PM',
        user: 'Maria Rossi',
        role: 'Analyst',
        action: 'View',
        scope: 'Crest',
        status: 'Allowed',
      },
    ],
  },
  Slick: {
    kpis: {
      accessCountPct: 18,
      accessCountChange: '+4% vs last week',
      policyViolations: 5,
      policyViolationsChange: '+2 vs last week',
      totalAuditEvents: '520',
      totalAuditChange: '+3% period',
    },
    accessCount: 90,
    accessTrend: [7, 7.5, 8.2, 7.8, 8.4, 9.1, 8.7, 9.3, 9.8, 9.1],
    accessMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    integrity: {
      usedPct: 99.8,
      validPct: 99.8,
      intactLabel: '99.8% Intact',
    },
    logs: [
      {
        timestamp: 'Jan 13, 2026, 11:05 AM',
        user: 'Akira Tanaka',
        role: 'Security',
        action: 'View',
        scope: 'Slick',
        status: 'Allowed',
      },
    ],
  },
  Fortivo: {
    kpis: {
      accessCountPct: 12,
      accessCountChange: '+1% vs last week',
      policyViolations: 4,
      policyViolationsChange: '-1 vs last week',
      totalAuditEvents: '298',
      totalAuditChange: '+1.5% period',
    },
    accessCount: 60,
    accessTrend: [5.5, 5.8, 6.0, 6.4, 6.1, 6.7, 7.0, 6.8, 7.2, 6.9],
    accessMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    integrity: {
      usedPct: 99.1,
      validPct: 99.1,
      intactLabel: '99.1% Intact',
    },
    logs: [
      {
        timestamp: 'Jan 12, 2026, 16:44 PM',
        user: 'Liam Brown',
        role: 'DevOps',
        action: 'View',
        scope: 'Fortivo',
        status: 'Allowed',
      },
    ],
  },
  Qucik: {
    kpis: {
      accessCountPct: 20,
      accessCountChange: '+5% vs last week',
      policyViolations: 6,
      policyViolationsChange: '+1 vs last week',
      totalAuditEvents: '680',
      totalAuditChange: '+4% period',
    },
    accessCount: 110,
    accessTrend: [8, 8.5, 9.0, 8.7, 9.3, 9.8, 9.2, 9.9, 10.4, 9.8],
    accessMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    integrity: {
      usedPct: 99.7,
      validPct: 99.7,
      intactLabel: '99.7% Intact',
    },
    logs: [
      {
        timestamp: 'Jan 11, 2026, 13:27 PM',
        user: 'Emma Wilson',
        role: 'Admin',
        action: 'Delete Export',
        scope: 'Qucik',
        status: 'Denied',
      },
    ],
  },
  Nexipher: {
    kpis: {
      accessCountPct: 8,
      accessCountChange: '0% vs last week',
      policyViolations: 1,
      policyViolationsChange: '0 vs last week',
      totalAuditEvents: '92',
      totalAuditChange: '+0.3% period',
    },
    accessCount: 28,
    accessTrend: [3.5, 3.8, 4.0, 3.7, 4.2, 4.0, 4.4, 4.1, 4.6, 4.3],
    accessMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    integrity: {
      usedPct: 98.5,
      validPct: 98.5,
      intactLabel: '98.5% Intact',
    },
    logs: [
      {
        timestamp: 'Jan 10, 2026, 08:19 AM',
        user: 'Carlos Diaz',
        role: 'Analyst',
        action: 'View',
        scope: 'Nexipher',
        status: 'Allowed',
      },
    ],
  },
}

