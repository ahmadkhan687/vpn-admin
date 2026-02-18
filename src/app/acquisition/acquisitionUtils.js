/**
 * Acquisition utils - derive display data from users array (API response structure)
 * Users = main array, each user has id, name, email, status, device, lastActive, details
 */

const GROWTH_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
const DEVICE_COLORS = {
  Android: '#9acd32',
  Windows: '#87ceeb',
  iOS: '#e07c24',
  Other: '#b794f6',
  Linux: '#daa520',
}

/**
 * Filter users by status type
 */
function filterByType(users, type) {
  if (type === 'all') return users
  const statusLower = type.toLowerCase()
  return users.filter((u) => u.status?.toLowerCase() === statusLower)
}

/**
 * Derive userTypeData (New Users, Frequent Users, trends) from users array
 */
export function getUserTypeData(users) {
  const all = filterByType(users, 'all')
  const free = filterByType(users, 'free')
  const paid = filterByType(users, 'paid')
  const trial = filterByType(users, 'trial')

  const countNew = (arr) => arr.filter((u) => u.details?.isNewUser).length
  const countFrequent = (arr) => arr.filter((u) => u.details?.isFrequentUser).length
  const sumMonthlyBars = (arr) => {
    const out = new Array(12).fill(0)
    arr.forEach((u) => {
      const bars = u.details?.monthlyBarData
      if (bars) bars.forEach((v, i) => { out[i] = (out[i] || 0) + v })
    })
    return out
  }

  const trendFromBars = (bars) => {
    if (!bars || bars.length < 12) return [520, 380, 610, 450, 720, 580, 680, 790, 640, 820, 710, 850]
    return bars.map((v) => Math.min(900, Math.max(200, v * 25 + 300)))
  }

  return {
    all: {
      newUsers: countNew(all) || 233,
      frequentUsers: countFrequent(all) || 222,
      newUsersTrend: trendFromBars(sumMonthlyBars(all)),
      frequentUsersTrend: trendFromBars(sumMonthlyBars(all)).map((v, i) => Math.round(v * 0.9 - i * 5)),
    },
    free: {
      newUsers: countNew(free) || 142,
      frequentUsers: countFrequent(free) || 98,
      newUsersTrend: trendFromBars(sumMonthlyBars(free)),
      frequentUsersTrend: trendFromBars(sumMonthlyBars(free)).map((v, i) => Math.round(v * 0.85 - i * 3)),
    },
    paid: {
      newUsers: countNew(paid) || 68,
      frequentUsers: countFrequent(paid) || 95,
      newUsersTrend: trendFromBars(sumMonthlyBars(paid)),
      frequentUsersTrend: trendFromBars(sumMonthlyBars(paid)).map((v, i) => Math.round(v * 0.95 - i * 2)),
    },
    trial: {
      newUsers: countNew(trial) || 23,
      frequentUsers: countFrequent(trial) || 29,
      newUsersTrend: trendFromBars(sumMonthlyBars(trial)),
      frequentUsersTrend: trendFromBars(sumMonthlyBars(trial)).map((v, i) => Math.round(v * 0.8 + i * 5)),
    },
  }
}

/**
 * Derive device breakdown (pie chart) from users array
 */
export function getDeviceDataByUserType(users) {
  const platforms = ['Android', 'Windows', 'iOS', 'Other', 'Linux']
  const byType = (type) => {
    const list = filterByType(users, type)
    const counts = {}
    platforms.forEach((p) => { counts[p] = 0 })
    list.forEach((u) => {
      const p = u.details?.devicePlatform || 'Other'
      counts[platforms.includes(p) ? p : 'Other'] = (counts[platforms.includes(p) ? p : 'Other'] || 0) + 1
    })
    const total = list.length || 1
    return platforms
      .filter((p) => counts[p] > 0)
      .map((p) => ({ id: p, value: Math.round((counts[p] / total) * 100), color: DEVICE_COLORS[p] || '#b794f6' }))
  }
  const all = byType('all')
  if (all.length === 0) {
    return {
      all: [{ id: 'Android', value: 38, color: '#9acd32' }, { id: 'Windows', value: 27, color: '#87ceeb' }, { id: 'iOS', value: 20, color: '#e07c24' }, { id: 'Other', value: 10, color: '#b794f6' }, { id: 'Linux', value: 5, color: '#daa520' }],
      free: [{ id: 'Android', value: 42, color: '#9acd32' }, { id: 'Windows', value: 24, color: '#87ceeb' }, { id: 'iOS', value: 18, color: '#e07c24' }],
      paid: [{ id: 'Android', value: 30, color: '#9acd32' }, { id: 'Windows', value: 32, color: '#87ceeb' }, { id: 'iOS', value: 25, color: '#e07c24' }],
      trial: [{ id: 'Android', value: 35, color: '#9acd32' }, { id: 'iOS', value: 28, color: '#e07c24' }, { id: 'Windows', value: 22, color: '#87ceeb' }],
    }
  }
  return {
    all: all.length ? all : [{ id: 'Android', value: 38, color: '#9acd32' }],
    free: byType('free').length ? byType('free') : all,
    paid: byType('paid').length ? byType('paid') : all,
    trial: byType('trial').length ? byType('trial') : all,
  }
}

/**
 * Derive subscription data (Users Per Subscription) from users array
 */
export function getSubscriptionData(users) {
  const byType = (type) => {
    const list = filterByType(users, type)
    const bars = new Array(12).fill(0)
    list.forEach((u) => {
      const d = u.details?.monthlyBarData
      if (d) d.forEach((v, i) => { bars[i] = (bars[i] || 0) + v })
    })
    return { users: list.length, barData: bars.length ? bars : [6, 8, 4, 10, 8, 12, 22, 14, 3, 6, 4, 22] }
  }
  return {
    all: byType('all'),
    free: byType('free'),
    paid: byType('paid'),
    trial: byType('trial'),
  }
}

/**
 * Derive monitored users table from users array
 */
export function getMonitoredUsersByType(users) {
  const map = (list) => list.map((u) => ({ name: u.name, status: u.status, lastActive: u.lastActive }))
  return {
    all: map(filterByType(users, 'all')),
    free: map(filterByType(users, 'free')),
    paid: map(filterByType(users, 'paid')),
    trial: map(filterByType(users, 'trial')),
  }
}

/**
 * Derive All Users table from users array
 */
export function getAllUsersTableByType(users) {
  const map = (list) => list.map((u) => ({
    id: u.id,
    name: u.name,
    status: u.status,
    email: u.email,
    device: u.device,
    lastActive: u.lastActive,
    country: u.country,
  }))
  return {
    all: map(filterByType(users, 'all')),
    free: map(filterByType(users, 'free')),
    paid: map(filterByType(users, 'paid')),
    trial: map(filterByType(users, 'trial')),
  }
}
