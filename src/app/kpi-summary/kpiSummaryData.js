// KPI Summary data for each VPN
export const kpiSummaryData = {
  Portfolio: {
    costAndUnitEconomics: {
      costPerActiveUser: { value: '2.6%', status: 'critical', trend: 'rising', trendValue: '' },
      egressGBPerMinute: { value: '2.6%', status: 'strained', trend: 'declining', trendValue: '+3%' },
      costPerGB: { value: '2.6%', status: 'healthy', trend: 'rising', trendValue: '+3%' },
      freeUserCostShare: { value: '2.6%', status: 'stable', trend: null, trendValue: '' },
    },
    growthAndPerformance: {
      newUsers: { value: '1,240', status: 'critical', trend: 'rising', trendValue: '' },
      newDevices: { value: '980', status: 'strained', trend: 'declining', trendValue: '+3%' },
      trailUsers: { value: '420', status: 'healthy', trend: 'rising', trendValue: '+3%' },
      trialToPaidConversion: { value: '2.6%', status: 'stable', trend: null, trendValue: '' },
    },
    networkHealth: {
      activeTunnels: { value: '43,800', status: 'critical', trend: 'rising', trendValue: '' },
      medianLatency: { value: '51 ms', status: 'strained', trend: 'declining', trendValue: '+3%' },
    },
    protocolAndTraffic: {
      avgSessionDuration: { value: '2.6 ms', status: 'healthy', trend: 'rising', trendValue: '+3%' },
      egressPerSession: { value: '2.6 GB', status: 'stable', trend: null, trendValue: '' },
    },
    capacityAndScaling: {
      currentUtilization: { value: '43,800', status: 'critical', trend: 'rising', trendValue: '' },
      sessionsPerNode: { value: '51%', status: 'strained', trend: 'declining', trendValue: '+3%' },
    },
    complianceAndGovernance: {
      ipdrAccessCount: { value: '2.6%', status: 'healthy', trend: 'rising', trendValue: '+3%' },
      legalRequestSLA: { value: '2.6 min', status: 'stable', trend: null, trendValue: '' },
    },
    liveSessions: {
      last5MinUpdated: '980',
      liveActiveTunnels: '52.2 K',
      currentlyConnectedUsers: '165,980',
      realTimeConnectivity: '2m30s',
      liveByVpn: {
        totalUsed: '26.98',
        unit: 'GB',
        vpns: [
          { name: 'Fortivo VPN', value: '11.5 GB', percentage: 42.6 },
          { name: 'SleekVPN', value: '7.15 GB', percentage: 26.5 },
          { name: 'Nexipher VPN', value: '2.5 GB', percentage: 9.3 },
          { name: 'Slick VPN', value: '5.83 GB', percentage: 21.6 },
          { name: 'Crest', value: '5.23 GB', percentage: 19.4 },
        ],
      },
      countryData: [
        { CountryName: 'United States', Count: 45230 },
        { CountryName: 'United Kingdom', Count: 28950 },
        { CountryName: 'India', Count: 18750 },
        { CountryName: 'Canada', Count: 12480 },
        { CountryName: 'Germany', Count: 15620 },
        { CountryName: 'France', Count: 9820 },
        { CountryName: 'Australia', Count: 8750 },
        { CountryName: 'Japan', Count: 11240 },
      ],
    },
  },
  'Steer Lucid': {
    costAndUnitEconomics: {
      costPerActiveUser: { value: '3.2%', status: 'critical', trend: 'rising', trendValue: '+2%' },
      egressGBPerMinute: { value: '1.8%', status: 'healthy', trend: 'rising', trendValue: '+1%' },
      costPerGB: { value: '2.1%', status: 'healthy', trend: 'rising', trendValue: '+2%' },
      freeUserCostShare: { value: '3.1%', status: 'strained', trend: 'declining', trendValue: '-1%' },
    },
    growthAndPerformance: {
      newUsers: { value: '2,150', status: 'healthy', trend: 'rising', trendValue: '+5%' },
      newDevices: { value: '1,420', status: 'healthy', trend: 'rising', trendValue: '+4%' },
      trailUsers: { value: '680', status: 'healthy', trend: 'rising', trendValue: '+6%' },
      trialToPaidConversion: { value: '3.2%', status: 'healthy', trend: 'rising', trendValue: '+1%' },
    },
    networkHealth: {
      activeTunnels: { value: '52,300', status: 'strained', trend: 'rising', trendValue: '+2%' },
      medianLatency: { value: '38 ms', status: 'healthy', trend: 'declining', trendValue: '-2%' },
    },
    protocolAndTraffic: {
      avgSessionDuration: { value: '3.1 ms', status: 'healthy', trend: 'rising', trendValue: '+2%' },
      egressPerSession: { value: '3.2 GB', status: 'healthy', trend: 'rising', trendValue: '+1%' },
    },
    capacityAndScaling: {
      currentUtilization: { value: '38,200', status: 'healthy', trend: 'rising', trendValue: '+3%' },
      sessionsPerNode: { value: '42%', status: 'healthy', trend: 'declining', trendValue: '-2%' },
    },
    complianceAndGovernance: {
      ipdrAccessCount: { value: '3.1%', status: 'healthy', trend: 'rising', trendValue: '+2%' },
      legalRequestSLA: { value: '2.1 min', status: 'healthy', trend: 'declining', trendValue: '-0.5%' },
    },
    liveSessions: {
      last5MinUpdated: '420',
      liveActiveTunnels: '18.5 K',
      currentlyConnectedUsers: '58,200',
      realTimeConnectivity: '1m45s',
      liveByVpn: {
        totalUsed: '12.3',
        unit: 'GB',
        vpns: [
          { name: 'Steer Lucid', value: '12.3 GB', percentage: 100 },
        ],
      },
      countryData: [
        { CountryName: 'United States', Count: 18500 },
        { CountryName: 'United Kingdom', Count: 11200 },
        { CountryName: 'India', Count: 8900 },
        { CountryName: 'Canada', Count: 6200 },
        { CountryName: 'Germany', Count: 6800 },
      ],
    },
  },
  Crest: {
    costAndUnitEconomics: {
      costPerActiveUser: { value: '4.1%', status: 'critical', trend: 'rising', trendValue: '+4%' },
      egressGBPerMinute: { value: '3.2%', status: 'strained', trend: 'declining', trendValue: '+5%' },
      costPerGB: { value: '2.8%', status: 'strained', trend: 'rising', trendValue: '+2%' },
      freeUserCostShare: { value: '2.9%', status: 'stable', trend: null, trendValue: '' },
    },
    growthAndPerformance: {
      newUsers: { value: '890', status: 'strained', trend: 'declining', trendValue: '-2%' },
      newDevices: { value: '720', status: 'strained', trend: 'declining', trendValue: '-3%' },
      trailUsers: { value: '310', status: 'strained', trend: 'declining', trendValue: '-1%' },
      trialToPaidConversion: { value: '1.9%', status: 'critical', trend: 'declining', trendValue: '-2%' },
    },
    networkHealth: {
      activeTunnels: { value: '28,500', status: 'critical', trend: 'declining', trendValue: '-5%' },
      medianLatency: { value: '65 ms', status: 'critical', trend: 'rising', trendValue: '+8%' },
    },
    protocolAndTraffic: {
      avgSessionDuration: { value: '1.8 ms', status: 'strained', trend: 'declining', trendValue: '+2%' },
      egressPerSession: { value: '2.1 GB', status: 'strained', trend: 'declining', trendValue: '+1%' },
    },
    capacityAndScaling: {
      currentUtilization: { value: '58,900', status: 'critical', trend: 'rising', trendValue: '+6%' },
      sessionsPerNode: { value: '68%', status: 'critical', trend: 'rising', trendValue: '+4%' },
    },
    complianceAndGovernance: {
      ipdrAccessCount: { value: '1.8%', status: 'strained', trend: 'declining', trendValue: '+1%' },
      legalRequestSLA: { value: '3.8 min', status: 'strained', trend: 'rising', trendValue: '+1%' },
    },
    liveSessions: {
      last5MinUpdated: '180',
      liveActiveTunnels: '8.2 K',
      currentlyConnectedUsers: '24,500',
      realTimeConnectivity: '2m15s',
      liveByVpn: {
        totalUsed: '5.23',
        unit: 'GB',
        vpns: [
          { name: 'Crest', value: '5.23 GB', percentage: 100 },
        ],
      },
      countryData: [
        { CountryName: 'United States', Count: 8200 },
        { CountryName: 'United Kingdom', Count: 5100 },
        { CountryName: 'India', Count: 4200 },
        { CountryName: 'Canada', Count: 3200 },
        { CountryName: 'Germany', Count: 2800 },
      ],
    },
  },
  Slick: {
    costAndUnitEconomics: {
      costPerActiveUser: { value: '1.9%', status: 'healthy', trend: 'declining', trendValue: '-1%' },
      egressGBPerMinute: { value: '1.5%', status: 'healthy', trend: 'declining', trendValue: '-2%' },
      costPerGB: { value: '1.8%', status: 'healthy', trend: 'declining', trendValue: '-1%' },
      freeUserCostShare: { value: '2.2%', status: 'healthy', trend: 'rising', trendValue: '+1%' },
    },
    growthAndPerformance: {
      newUsers: { value: '3,420', status: 'healthy', trend: 'rising', trendValue: '+8%' },
      newDevices: { value: '2,680', status: 'healthy', trend: 'rising', trendValue: '+7%' },
      trailUsers: { value: '1,120', status: 'healthy', trend: 'rising', trendValue: '+9%' },
      trialToPaidConversion: { value: '4.2%', status: 'healthy', trend: 'rising', trendValue: '+2%' },
    },
    networkHealth: {
      activeTunnels: { value: '67,800', status: 'healthy', trend: 'rising', trendValue: '+4%' },
      medianLatency: { value: '32 ms', status: 'healthy', trend: 'declining', trendValue: '-3%' },
    },
    protocolAndTraffic: {
      avgSessionDuration: { value: '4.2 ms', status: 'healthy', trend: 'rising', trendValue: '+3%' },
      egressPerSession: { value: '4.1 GB', status: 'healthy', trend: 'rising', trendValue: '+2%' },
    },
    capacityAndScaling: {
      currentUtilization: { value: '35,600', status: 'healthy', trend: 'rising', trendValue: '+2%' },
      sessionsPerNode: { value: '38%', status: 'healthy', trend: 'declining', trendValue: '-3%' },
    },
    complianceAndGovernance: {
      ipdrAccessCount: { value: '4.1%', status: 'healthy', trend: 'rising', trendValue: '+3%' },
      legalRequestSLA: { value: '1.8 min', status: 'healthy', trend: 'declining', trendValue: '-0.3%' },
    },
    liveSessions: {
      last5MinUpdated: '650',
      liveActiveTunnels: '24.8 K',
      currentlyConnectedUsers: '78,400',
      realTimeConnectivity: '1m20s',
      liveByVpn: {
        totalUsed: '5.83',
        unit: 'GB',
        vpns: [
          { name: 'Slick VPN', value: '5.83 GB', percentage: 100 },
        ],
      },
      countryData: [
        { CountryName: 'United States', Count: 24800 },
        { CountryName: 'United Kingdom', Count: 15200 },
        { CountryName: 'India', Count: 12800 },
        { CountryName: 'Canada', Count: 9800 },
        { CountryName: 'Germany', Count: 9200 },
        { CountryName: 'France', Count: 6600 },
      ],
    },
  },
  Fortivo: {
    costAndUnitEconomics: {
      costPerActiveUser: { value: '2.8%', status: 'strained', trend: 'rising', trendValue: '+3%' },
      egressGBPerMinute: { value: '2.4%', status: 'strained', trend: 'declining', trendValue: '+4%' },
      costPerGB: { value: '2.5%', status: 'strained', trend: 'rising', trendValue: '+2%' },
      freeUserCostShare: { value: '2.7%', status: 'stable', trend: null, trendValue: '' },
    },
    growthAndPerformance: {
      newUsers: { value: '1,680', status: 'strained', trend: 'rising', trendValue: '+3%' },
      newDevices: { value: '1,320', status: 'strained', trend: 'declining', trendValue: '+2%' },
      trailUsers: { value: '580', status: 'strained', trend: 'rising', trendValue: '+4%' },
      trialToPaidConversion: { value: '2.4%', status: 'strained', trend: 'declining', trendValue: '-1%' },
    },
    networkHealth: {
      activeTunnels: { value: '39,200', status: 'strained', trend: 'rising', trendValue: '+3%' },
      medianLatency: { value: '48 ms', status: 'strained', trend: 'declining', trendValue: '+2%' },
    },
    protocolAndTraffic: {
      avgSessionDuration: { value: '2.4 ms', status: 'strained', trend: 'rising', trendValue: '+2%' },
      egressPerSession: { value: '2.8 GB', status: 'strained', trend: 'declining', trendValue: '+1%' },
    },
    capacityAndScaling: {
      currentUtilization: { value: '45,300', status: 'strained', trend: 'rising', trendValue: '+4%' },
      sessionsPerNode: { value: '52%', status: 'strained', trend: 'declining', trendValue: '+3%' },
    },
    complianceAndGovernance: {
      ipdrAccessCount: { value: '2.5%', status: 'strained', trend: 'rising', trendValue: '+2%' },
      legalRequestSLA: { value: '2.9 min', status: 'strained', trend: 'rising', trendValue: '+1%' },
    },
    liveSessions: {
      last5MinUpdated: '520',
      liveActiveTunnels: '19.8 K',
      currentlyConnectedUsers: '62,300',
      realTimeConnectivity: '2m10s',
      liveByVpn: {
        totalUsed: '11.5',
        unit: 'GB',
        vpns: [
          { name: 'Fortivo VPN', value: '11.5 GB', percentage: 100 },
        ],
      },
      countryData: [
        { CountryName: 'United States', Count: 19800 },
        { CountryName: 'United Kingdom', Count: 12100 },
        { CountryName: 'India', Count: 10200 },
        { CountryName: 'Canada', Count: 7800 },
        { CountryName: 'Germany', Count: 7200 },
        { CountryName: 'France', Count: 5200 },
      ],
    },
  },
  Qucik: {
    costAndUnitEconomics: {
      costPerActiveUser: { value: '3.5%', status: 'critical', trend: 'rising', trendValue: '+5%' },
      egressGBPerMinute: { value: '2.9%', status: 'strained', trend: 'declining', trendValue: '+4%' },
      costPerGB: { value: '3.1%', status: 'strained', trend: 'rising', trendValue: '+3%' },
      freeUserCostShare: { value: '3.3%', status: 'critical', trend: 'rising', trendValue: '+2%' },
    },
    growthAndPerformance: {
      newUsers: { value: '950', status: 'critical', trend: 'declining', trendValue: '-4%' },
      newDevices: { value: '780', status: 'critical', trend: 'declining', trendValue: '-5%' },
      trailUsers: { value: '290', status: 'critical', trend: 'declining', trendValue: '-3%' },
      trialToPaidConversion: { value: '1.5%', status: 'critical', trend: 'declining', trendValue: '-3%' },
    },
    networkHealth: {
      activeTunnels: { value: '22,400', status: 'critical', trend: 'declining', trendValue: '-6%' },
      medianLatency: { value: '72 ms', status: 'critical', trend: 'rising', trendValue: '+10%' },
    },
    protocolAndTraffic: {
      avgSessionDuration: { value: '1.5 ms', status: 'critical', trend: 'declining', trendValue: '+3%' },
      egressPerSession: { value: '1.9 GB', status: 'critical', trend: 'declining', trendValue: '+2%' },
    },
    capacityAndScaling: {
      currentUtilization: { value: '62,100', status: 'critical', trend: 'rising', trendValue: '+7%' },
      sessionsPerNode: { value: '71%', status: 'critical', trend: 'rising', trendValue: '+5%' },
    },
    complianceAndGovernance: {
      ipdrAccessCount: { value: '1.6%', status: 'critical', trend: 'declining', trendValue: '+2%' },
      legalRequestSLA: { value: '4.2 min', status: 'critical', trend: 'rising', trendValue: '+2%' },
    },
    liveSessions: {
      last5MinUpdated: '95',
      liveActiveTunnels: '6.8 K',
      currentlyConnectedUsers: '18,200',
      realTimeConnectivity: '3m00s',
      liveByVpn: {
        totalUsed: '3.2',
        unit: 'GB',
        vpns: [
          { name: 'Qucik', value: '3.2 GB', percentage: 100 },
        ],
      },
      countryData: [
        { CountryName: 'United States', Count: 6800 },
        { CountryName: 'United Kingdom', Count: 4200 },
        { CountryName: 'India', Count: 3500 },
        { CountryName: 'Canada', Count: 2100 },
        { CountryName: 'Germany', Count: 1600 },
      ],
    },
  },
  Nexipher: {
    costAndUnitEconomics: {
      costPerActiveUser: { value: '2.3%', status: 'healthy', trend: 'rising', trendValue: '+1%' },
      egressGBPerMinute: { value: '2.0%', status: 'healthy', trend: 'declining', trendValue: '-1%' },
      costPerGB: { value: '2.2%', status: 'healthy', trend: 'rising', trendValue: '+1%' },
      freeUserCostShare: { value: '2.4%', status: 'healthy', trend: 'rising', trendValue: '+1%' },
    },
    growthAndPerformance: {
      newUsers: { value: '2,850', status: 'healthy', trend: 'rising', trendValue: '+6%' },
      newDevices: { value: '2,240', status: 'healthy', trend: 'rising', trendValue: '+5%' },
      trailUsers: { value: '920', status: 'healthy', trend: 'rising', trendValue: '+7%' },
      trialToPaidConversion: { value: '3.8%', status: 'healthy', trend: 'rising', trendValue: '+1.5%' },
    },
    networkHealth: {
      activeTunnels: { value: '58,600', status: 'healthy', trend: 'rising', trendValue: '+3%' },
      medianLatency: { value: '35 ms', status: 'healthy', trend: 'declining', trendValue: '-2%' },
    },
    protocolAndTraffic: {
      avgSessionDuration: { value: '3.8 ms', status: 'healthy', trend: 'rising', trendValue: '+2%' },
      egressPerSession: { value: '3.5 GB', status: 'healthy', trend: 'rising', trendValue: '+1%' },
    },
    capacityAndScaling: {
      currentUtilization: { value: '32,800', status: 'healthy', trend: 'rising', trendValue: '+2%' },
      sessionsPerNode: { value: '36%', status: 'healthy', trend: 'declining', trendValue: '-2%' },
    },
    complianceAndGovernance: {
      ipdrAccessCount: { value: '3.6%', status: 'healthy', trend: 'rising', trendValue: '+2%' },
      legalRequestSLA: { value: '2.0 min', status: 'healthy', trend: 'declining', trendValue: '-0.2%' },
    },
    liveSessions: {
      last5MinUpdated: '380',
      liveActiveTunnels: '15.2 K',
      currentlyConnectedUsers: '48,600',
      realTimeConnectivity: '1m50s',
      liveByVpn: {
        totalUsed: '2.5',
        unit: 'GB',
        vpns: [
          { name: 'Nexipher VPN', value: '2.5 GB', percentage: 100 },
        ],
      },
      countryData: [
        { CountryName: 'United States', Count: 15200 },
        { CountryName: 'United Kingdom', Count: 9200 },
        { CountryName: 'India', Count: 7800 },
        { CountryName: 'Canada', Count: 6200 },
        { CountryName: 'Germany', Count: 5800 },
        { CountryName: 'France', Count: 4400 },
      ],
    },
  },
}

