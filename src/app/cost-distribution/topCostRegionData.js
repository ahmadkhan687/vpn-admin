// Top Cost Region data per VPN scope
// Portfolio = overall aggregated cost, VPN = that VPN's cost data
// In production this would come from API

const baseRegionCosts = {
  'United States': 750000,
  'United States of America': 750000,
  'Canada': 420000,
  'United Kingdom': 580000,
  'Germany': 380000,
  'France': 320000,
  'India': 520000,
  'Japan': 450000,
  'Australia': 280000,
  'Brazil': 195000,
  'Mexico': 165000,
  'Spain': 220000,
  'Italy': 250000,
  'Netherlands': 180000,
  'South Korea': 310000,
  'China': 480000,
  'Russia': 145000,
  'Indonesia': 95000,
  'South Africa': 120000,
  'Saudi Arabia': 155000,
  'United Arab Emirates': 175000,
  'Turkey': 135000,
  'Singapore': 240000,
  'Pakistan': 85000,
  'Bangladesh': 72000,
  'Nigeria': 88000,
  'Vietnam': 92000,
  'Thailand': 110000,
  'Poland': 140000,
  'Argentina': 125000,
  'Egypt': 98000,
  'Malaysia': 132000,
  'Philippines': 78000,
  'Sweden': 165000,
  'Belgium': 145000,
  'Switzerland': 195000,
  'Austria': 128000,
  'Norway': 155000,
  'Israel': 142000,
  'Ireland': 138000,
  'Portugal': 115000,
  'Greece': 98000,
  'Czech Republic': 105000,
  'Romania': 82000,
  'Hungary': 88000,
  'Chile': 112000,
  'Colombia': 95000,
  'Peru': 78000,
}

// Scale region costs by factor for each VPN
const scaleRegionCosts = (factor) => {
  const result = {}
  for (const [key, val] of Object.entries(baseRegionCosts)) {
    result[key] = Math.round(val * factor)
  }
  return result
}

export const topCostRegionDataByScope = {
  Portfolio: {
    topCostValue: '$110.00',
    regionCosts: baseRegionCosts,
    monthlyBarData: [
      { month: 'Jan', value: 1200, tooltip: '1,200: Standard usage in January' },
      { month: 'Feb', value: 980, tooltip: '980: Lower traffic in February' },
      { month: 'Mar', value: 1850, tooltip: '1,850: Peak in March' },
      { month: 'Apr', value: 4500, tooltip: '4,500: High usage in April' },
      { month: 'May', value: 2100, tooltip: '2,100: Seasonal uptick in May' },
      { month: 'Jun', value: 3800, tooltip: '3,800: Summer peak in June' },
      { month: 'Jul', value: 750, tooltip: '750: Low activity in July' },
      { month: 'Aug', value: 45, tooltip: '45: Low sales in August' },
      { month: 'Sep', value: 5200, tooltip: '5,200: Highest in September' },
      { month: 'Oct', value: 3200, tooltip: '3,200: Fall increase in October' },
      { month: 'Nov', value: 1650, tooltip: '1,650: Pre-holiday rise in November' },
      { month: 'Dec', value: 2400, tooltip: '2,400: Year-end surge in December' },
    ],
  },
  'Steer Lucid': {
    topCostValue: '$128.00',
    regionCosts: scaleRegionCosts(0.42),
    monthlyBarData: [
      { month: 'Jan', value: 850, tooltip: '850: Steer Lucid usage in January' },
      { month: 'Feb', value: 720, tooltip: '720: Steer Lucid in February' },
      { month: 'Mar', value: 1100, tooltip: '1,100: Steer Lucid peak in March' },
      { month: 'Apr', value: 2800, tooltip: '2,800: Steer Lucid high in April' },
      { month: 'May', value: 1400, tooltip: '1,400: Steer Lucid in May' },
      { month: 'Jun', value: 2200, tooltip: '2,200: Steer Lucid in June' },
      { month: 'Jul', value: 520, tooltip: '520: Steer Lucid low in July' },
      { month: 'Aug', value: 35, tooltip: '35: Steer Lucid low in August' },
      { month: 'Sep', value: 3100, tooltip: '3,100: Steer Lucid peak in September' },
      { month: 'Oct', value: 1950, tooltip: '1,950: Steer Lucid in October' },
      { month: 'Nov', value: 980, tooltip: '980: Steer Lucid in November' },
      { month: 'Dec', value: 1650, tooltip: '1,650: Steer Lucid in December' },
    ],
  },
  Crest: {
    topCostValue: '$72.00',
    regionCosts: scaleRegionCosts(0.22),
    monthlyBarData: [
      { month: 'Jan', value: 450, tooltip: '450: Crest usage in January' },
      { month: 'Feb', value: 380, tooltip: '380: Crest in February' },
      { month: 'Mar', value: 620, tooltip: '620: Crest in March' },
      { month: 'Apr', value: 1650, tooltip: '1,650: Crest high in April' },
      { month: 'May', value: 780, tooltip: '780: Crest in May' },
      { month: 'Jun', value: 1250, tooltip: '1,250: Crest in June' },
      { month: 'Jul', value: 280, tooltip: '280: Crest low in July' },
      { month: 'Aug', value: 22, tooltip: '22: Crest low in August' },
      { month: 'Sep', value: 1850, tooltip: '1,850: Crest peak in September' },
      { month: 'Oct', value: 1100, tooltip: '1,100: Crest in October' },
      { month: 'Nov', value: 520, tooltip: '520: Crest in November' },
      { month: 'Dec', value: 920, tooltip: '920: Crest in December' },
    ],
  },
  Slick: {
    topCostValue: '$145.00',
    regionCosts: scaleRegionCosts(0.52),
    monthlyBarData: [
      { month: 'Jan', value: 1050, tooltip: '1,050: Slick usage in January' },
      { month: 'Feb', value: 890, tooltip: '890: Slick in February' },
      { month: 'Mar', value: 1420, tooltip: '1,420: Slick in March' },
      { month: 'Apr', value: 3400, tooltip: '3,400: Slick high in April' },
      { month: 'May', value: 1680, tooltip: '1,680: Slick in May' },
      { month: 'Jun', value: 2650, tooltip: '2,650: Slick in June' },
      { month: 'Jul', value: 620, tooltip: '620: Slick low in July' },
      { month: 'Aug', value: 48, tooltip: '48: Slick low in August' },
      { month: 'Sep', value: 3850, tooltip: '3,850: Slick peak in September' },
      { month: 'Oct', value: 2450, tooltip: '2,450: Slick in October' },
      { month: 'Nov', value: 1180, tooltip: '1,180: Slick in November' },
      { month: 'Dec', value: 1980, tooltip: '1,980: Slick in December' },
    ],
  },
  Fortivo: {
    topCostValue: '$88.00',
    regionCosts: scaleRegionCosts(0.28),
    monthlyBarData: [
      { month: 'Jan', value: 580, tooltip: '580: Fortivo usage in January' },
      { month: 'Feb', value: 490, tooltip: '490: Fortivo in February' },
      { month: 'Mar', value: 820, tooltip: '820: Fortivo in March' },
      { month: 'Apr', value: 2100, tooltip: '2,100: Fortivo high in April' },
      { month: 'May', value: 1050, tooltip: '1,050: Fortivo in May' },
      { month: 'Jun', value: 1680, tooltip: '1,680: Fortivo in June' },
      { month: 'Jul', value: 380, tooltip: '380: Fortivo low in July' },
      { month: 'Aug', value: 28, tooltip: '28: Fortivo low in August' },
      { month: 'Sep', value: 2480, tooltip: '2,480: Fortivo peak in September' },
      { month: 'Oct', value: 1520, tooltip: '1,520: Fortivo in October' },
      { month: 'Nov', value: 720, tooltip: '720: Fortivo in November' },
      { month: 'Dec', value: 1180, tooltip: '1,180: Fortivo in December' },
    ],
  },
  Qucik: {
    topCostValue: '$165.00',
    regionCosts: scaleRegionCosts(0.58),
    monthlyBarData: [
      { month: 'Jan', value: 1180, tooltip: '1,180: Qucik usage in January' },
      { month: 'Feb', value: 1020, tooltip: '1,020: Qucik in February' },
      { month: 'Mar', value: 1680, tooltip: '1,680: Qucik in March' },
      { month: 'Apr', value: 4200, tooltip: '4,200: Qucik high in April' },
      { month: 'May', value: 1980, tooltip: '1,980: Qucik in May' },
      { month: 'Jun', value: 3150, tooltip: '3,150: Qucik in June' },
      { month: 'Jul', value: 720, tooltip: '720: Qucik low in July' },
      { month: 'Aug', value: 55, tooltip: '55: Qucik low in August' },
      { month: 'Sep', value: 4650, tooltip: '4,650: Qucik peak in September' },
      { month: 'Oct', value: 2980, tooltip: '2,980: Qucik in October' },
      { month: 'Nov', value: 1420, tooltip: '1,420: Qucik in November' },
      { month: 'Dec', value: 2380, tooltip: '2,380: Qucik in December' },
    ],
  },
  Nexipher: {
    topCostValue: '$52.00',
    regionCosts: scaleRegionCosts(0.18),
    monthlyBarData: [
      { month: 'Jan', value: 380, tooltip: '380: Nexipher usage in January' },
      { month: 'Feb', value: 320, tooltip: '320: Nexipher in February' },
      { month: 'Mar', value: 520, tooltip: '520: Nexipher in March' },
      { month: 'Apr', value: 1350, tooltip: '1,350: Nexipher high in April' },
      { month: 'May', value: 650, tooltip: '650: Nexipher in May' },
      { month: 'Jun', value: 1050, tooltip: '1,050: Nexipher in June' },
      { month: 'Jul', value: 240, tooltip: '240: Nexipher low in July' },
      { month: 'Aug', value: 18, tooltip: '18: Nexipher low in August' },
      { month: 'Sep', value: 1520, tooltip: '1,520: Nexipher peak in September' },
      { month: 'Oct', value: 920, tooltip: '920: Nexipher in October' },
      { month: 'Nov', value: 450, tooltip: '450: Nexipher in November' },
      { month: 'Dec', value: 750, tooltip: '750: Nexipher in December' },
    ],
  },
}

// Get color for cost value based on ranges
export const getCostColor = (cost) => {
  if (!cost || cost < 50000) return '#DBB2FF' // lightest
  if (cost < 200000) return '#BB86FC'
  if (cost < 350000) return '#7F39FB'
  if (cost < 500000) return '#5600E8'
  return '#30009C' // darkest
}
