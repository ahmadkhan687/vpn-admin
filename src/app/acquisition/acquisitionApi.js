/**
 * Acquisition API - fetches real-time user data
 * Data structure: main array of users, each user has full details
 * Simulates API response - replace fetch URL with real endpoint when backend is ready
 */

const API_BASE = process.env.NEXT_PUBLIC_ACQUISITION_API || '/api/acquisition'

/**
 * Mock user data - structure as returned from real API
 * Main array: users[], each user object has id, basic info, and details
 */
const MOCK_USERS_RESPONSE = {
  users: [
    {
      id: 'u1',
      name: 'itzlb',
      email: 'eedbb003124b66da@nexipher.com',
      status: 'Free',
      device: 'a03',
      lastActive: '18-January-2026 (06:58 AM)',
      country: 'Africa',
      vpn: 'Portfolio',
      details: {
        devicePlatform: 'Android',
        monthlyBarData: [6, 8, 4, 10, 8, 12, 22, 14, 3, 6, 4, 22],
        isNewUser: true,
        isFrequentUser: false,
      },
    },
    {
      id: 'u2',
      name: 'iQtzlb',
      email: 'a1b2c3d4@nexipher.com',
      status: 'Free',
      device: 'a01',
      lastActive: '18-January-2026 (06:58 AM)',
      country: 'Pakistan',
      vpn: 'Portfolio',
      details: {
        devicePlatform: 'Windows',
        monthlyBarData: [4, 5, 2, 6, 5, 8, 14, 9, 2, 4, 3, 14],
        isNewUser: true,
        isFrequentUser: true,
      },
    },
    {
      id: 'u3',
      name: 'itWzlb',
      email: 'e5f6g7h8@nexipher.com',
      status: 'Free',
      device: 'a02',
      lastActive: '18-January-2026 (06:58 AM)',
      country: 'India',
      vpn: 'Portfolio',
      details: {
        devicePlatform: 'iOS',
        monthlyBarData: [4, 5, 2, 6, 5, 8, 14, 9, 2, 4, 3, 14],
        isNewUser: false,
        isFrequentUser: true,
      },
    },
    {
      id: 'u4',
      name: 'itFzlb',
      email: 'i9j0k1l2@nexipher.com',
      status: 'Paid',
      device: 'b01',
      lastActive: '17-January-2026 (02:15 PM)',
      country: 'USA',
      vpn: 'Portfolio',
      details: {
        devicePlatform: 'Windows',
        monthlyBarData: [1, 2, 1, 3, 2, 3, 6, 4, 1, 1, 1, 6],
        isNewUser: false,
        isFrequentUser: true,
      },
    },
    {
      id: 'u5',
      name: 'iDStzlb',
      email: 'm3n4o5p6@nexipher.com',
      status: 'Free',
      device: 'a04',
      lastActive: '18-January-2026 (06:58 AM)',
      country: 'UK',
      vpn: 'Portfolio',
      details: {
        devicePlatform: 'Android',
        monthlyBarData: [4, 5, 2, 6, 5, 8, 14, 9, 2, 4, 3, 14],
        isNewUser: true,
        isFrequentUser: false,
      },
    },
    {
      id: 'u6',
      name: 'tr1al',
      email: 'q7r8s9t0@nexipher.com',
      status: 'Trial',
      device: 'c01',
      lastActive: '18-January-2026 (01:10 PM)',
      country: 'Pakistan',
      vpn: 'Portfolio',
      details: {
        devicePlatform: 'iOS',
        monthlyBarData: [1, 1, 1, 1, 1, 1, 2, 1, 0, 1, 0, 2],
        isNewUser: true,
        isFrequentUser: false,
      },
    },
    {
      id: 'u7',
      name: 'xYzlb',
      email: 'xyz@nexipher.com',
      status: 'Free',
      device: 'a02',
      lastActive: '15-January-2026 (09:30 AM)',
      country: 'India',
      vpn: 'Portfolio',
      details: {
        devicePlatform: 'Linux',
        monthlyBarData: [2, 3, 1, 2, 2, 4, 6, 4, 1, 2, 2, 8],
        isNewUser: false,
        isFrequentUser: true,
      },
    },
    {
      id: 'u8',
      name: 'pAid1',
      email: 'paid1@nexipher.com',
      status: 'Paid',
      device: 'b02',
      lastActive: '18-January-2026 (08:20 AM)',
      country: 'USA',
      vpn: 'Portfolio',
      details: {
        devicePlatform: 'Windows',
        monthlyBarData: [1, 1, 1, 2, 1, 2, 4, 3, 1, 1, 1, 4],
        isNewUser: false,
        isFrequentUser: true,
      },
    },
    {
      id: 'u9',
      name: 'pAid2',
      email: 'paid2@nexipher.com',
      status: 'Paid',
      device: 'b01',
      lastActive: '14-January-2026 (04:45 PM)',
      country: 'UK',
      vpn: 'Portfolio',
      details: {
        devicePlatform: 'iOS',
        monthlyBarData: [0, 1, 0, 1, 1, 1, 2, 1, 0, 0, 0, 2],
        isNewUser: false,
        isFrequentUser: false,
      },
    },
    {
      id: 'u10',
      name: 'tr2al',
      email: 'trial2@nexipher.com',
      status: 'Trial',
      device: 'c02',
      lastActive: '12-January-2026 (10:00 AM)',
      country: 'Africa',
      vpn: 'Portfolio',
      details: {
        devicePlatform: 'Android',
        monthlyBarData: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        isNewUser: true,
        isFrequentUser: false,
      },
    },
  ],
}

/**
 * Fetch acquisition users from API
 * Returns: { users: User[] } - main array, each user has full details
 * @param {Object} options - { vpn?: string, startDate?: Date, endDate?: Date }
 */
export async function fetchAcquisitionUsers(options = {}) {
  const { vpn = 'Portfolio', startDate, endDate } = options

  // Simulate API delay - remove when using real API
  await new Promise((r) => setTimeout(r, 300))

  // When real API is ready, use:
  // const params = new URLSearchParams({ vpn, ...(startDate && { start: startDate.toISOString() }), ...(endDate && { end: endDate.toISOString() }) })
  // const res = await fetch(`${API_BASE}/users?${params}`)
  // if (!res.ok) throw new Error('Failed to fetch acquisition users')
  // return res.json()

  return { ...MOCK_USERS_RESPONSE, users: [...MOCK_USERS_RESPONSE.users] }
}

export default fetchAcquisitionUsers
