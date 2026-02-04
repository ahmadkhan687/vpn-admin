'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import Sidebar from '@/components/sidebar/Sidebar'
import RealtimeReportSidebar from '@/components/realtime-report-sidebar/RealtimeReportSidebar'
import Header from '@/components/header/Header'
import styles from './profile.module.css'

// Fallback when no query params (e.g. direct URL)
const getProfileDataFallback = (id) => ({
  username: id || '—',
  email: '—',
  device: '—',
  country: '—',
  accountType: '—',
})

// Generate login logs using user's country
const getLoginLogs = (country) => [
  { loginTime: '16-November-2025 (11:21 AM)', logoutTime: '16-November-2025 (11:51 AM)', device: 'Iphone', appName: 'Unknown', country: country || 'Africa', subscription: 'Free', ipAddress: '-' },
  { loginTime: '17-November-2025 (09:15 AM)', logoutTime: '17-November-2025 (10:42 AM)', device: 'Iphone', appName: 'Unknown', country: country || 'Africa', subscription: 'Free', ipAddress: '-' },
  { loginTime: '18-November-2025 (02:30 PM)', logoutTime: '18-November-2025 (04:05 PM)', device: 'Iphone', appName: 'Unknown', country: country || 'Africa', subscription: 'Free', ipAddress: '-' },
  { loginTime: '20-November-2025 (08:00 AM)', logoutTime: '20-November-2025 (09:22 AM)', device: 'Iphone', appName: 'Unknown', country: country || 'Africa', subscription: 'Free', ipAddress: '-' },
  { loginTime: '22-November-2025 (11:45 AM)', logoutTime: '22-November-2025 (01:10 PM)', device: 'Iphone', appName: 'Unknown', country: country || 'Africa', subscription: 'Free', ipAddress: '-' },
  { loginTime: '25-November-2025 (06:20 PM)', logoutTime: '25-November-2025 (07:55 PM)', device: 'Iphone', appName: 'Unknown', country: country || 'Africa', subscription: 'Free', ipAddress: '-' },
]

// Session logs - location/country based on user profile (user-specific data)
const getSessionLogs = (profile) => {
  const country = profile?.country || '—'
  const locationMap = {
    Pakistan: 'Pakistan/Lahore',
    Africa: 'Africa/Lagos',
    India: 'India/Mumbai',
    USA: 'USA/New York',
    UK: 'UK/London',
  }
  const location = country === '—' ? '—' : (locationMap[country] || `${country}/—`)
  const servers = ['UK', 'USA', 'Germany', 'Singapore', 'Japan']
  return [1, 2, 3, 4, 5].map((no, i) => ({
    no,
    serverName: servers[i % servers.length],
    internalIP: `10.9.0.${20 + i}`,
    publicIP: `10.94.33.22.${23 + i} 424`,
    phoneNumber: '-',
    country: location,
    location,
    connectedTime: '27-January-2026 (2:26 AM)',
    disconnectedTime: '27-January-2026 (6:11 AM)',
    timeDuration: '3h 44m 13s',
  }))
}

const ROWS_PER_PAGE = 6
const TOTAL_PAGES = 10

// Monitor Traffic: File Details table (user-specific country)
const getFileDetailsData = (profile) =>
  [1, 2, 3, 4].map((_, i) => ({
    time: 'Apr 23 08:21:22',
    usage: '2.1GB',
    destination: 'we.tl',
    country: profile?.country || 'Pakistan',
    protocolPort: 'TCP/443',
    vpnNode: `AM5${i}`,
    sessionId: `5QCJS${i}...DA`,
  }))

// Monitor Traffic: Search by URLs table
const getSearchUrlsData = (profile) =>
  [
    { destination: 'drive.google.com', category: 'Cloud', hits: 212, usage: '1.2 GB', sessions: 12, firstSeen: '08:12', lastSeen: '09:21', countryPort: 'QUIC/443' },
    { destination: 'docs.google.com', category: 'Cloud', hits: 156, usage: '0.8 GB', sessions: 8, firstSeen: '07:45', lastSeen: '09:10', countryPort: 'QUIC/443' },
    { destination: 'youtube.com', category: 'Streaming', hits: 89, usage: '2.4 GB', sessions: 5, firstSeen: '08:00', lastSeen: '09:30', countryPort: 'TCP/443' },
  ].map((r, i) => ({ ...r, countryPort: r.countryPort }))

// Monitor Traffic: Telegram / WhatsApp Calls table (user device & region)
const getCallsData = (profile) => [
  { timestamp: 'Jan 14, 09:32', type: 'Voice', direction: 'Incoming', duration: '1hr 3min 30s', usage: '1.2 GB', region: 'UK' },
  { timestamp: 'Jan 14, 08:21', type: 'Video', direction: 'Outgoing', duration: '1hr 3min 30s', usage: '1.2 GB', region: 'USA' },
  { timestamp: 'Jan 13, 14:15', type: 'Voice', direction: 'Outgoing', duration: '45min 12s', usage: '0.6 GB', region: profile?.country || 'UK' },
]

// Monitor Traffic: WhatsApp Media table (user device)
const getWhatsAppMediaData = (profile) => [
  { timestamp: 'Jan 14, 09:32', type: 'Photo', direction: 'Incoming', usage: '1.2 GB', device: profile?.device || 'Infinix', region: 'UK', sessionId: 'S-8C1D12' },
  { timestamp: 'Jan 14, 08:21', type: 'Video', direction: 'Outgoing', usage: '1.2 GB', device: profile?.device || 'Infinix', region: 'USA', sessionId: 'S-8C1D12' },
  { timestamp: 'Jan 13, 11:00', type: 'Document', direction: 'Incoming', usage: '0.3 GB', device: profile?.device || 'Infinix', region: profile?.country || 'UK', sessionId: 'S-9D2E34' },
]

const MONITOR_SUB_TABS = [
  { id: 'fileDetails', label: 'File Details', searchPlaceholder: 'Search By Time...', icon: 'file' },
  { id: 'searchUrls', label: 'Search by URLs', searchPlaceholder: 'Search By URL...', icon: 'search' },
  { id: 'telegramCalls', label: 'Show Telegram Calls', searchPlaceholder: 'Search By Time...', icon: 'telegram' },
  { id: 'whatsappMedia', label: 'WhatsApp Media', searchPlaceholder: 'Search By Time...', icon: 'whatsapp' },
  { id: 'whatsappCalls', label: 'WhatsApp Calls', searchPlaceholder: 'Search By Time...', icon: 'whatsapp' },
]

const ProfilePage = () => {
  const params = useParams()
  const searchParams = useSearchParams()
  const id = params?.id || '0'
  const [selectedVPN, setSelectedVPN] = useState('Portfolio')
  const [activeTab, setActiveTab] = useState('loginLogs')
  const [monitorSubTab, setMonitorSubTab] = useState('fileDetails')
  const [currentPage, setCurrentPage] = useState(1)

  const profile = useMemo(() => {
    const name = searchParams.get('name')
    const email = searchParams.get('email')
    const device = searchParams.get('device')
    const country = searchParams.get('country')
    const status = searchParams.get('status')
    if (name || email || device || country || status) {
      return {
        username: name ?? '—',
        email: email ?? '—',
        device: device ?? '—',
        country: country ?? '—',
        accountType: status ?? '—',
      }
    }
    return getProfileDataFallback(id)
  }, [searchParams, id])

  const scopeOptions = ['Portfolio', 'Steer Lucid', 'Crest', 'Slick', 'Fortivo', 'Qucik', 'Nexipher']

  const tabs = [
    { id: 'loginLogs', label: 'Login Logs' },
    { id: 'sessionLogs', label: 'Session Logs' },
    { id: 'monitorTraffic', label: 'Monitor Traffic' },
  ]

  return (
    <div className={`${styles.dashboardContainer} ${styles.withRealtimeSidebar}`}>
      <Sidebar />
      <RealtimeReportSidebar />
      <div className={styles.mainContent}>
        <Header
          dropdownOptions={scopeOptions}
          defaultValue={selectedVPN}
          onValueChange={setSelectedVPN}
        />
        <div className={styles.content}>
          <Link href="/acquisition/all-users" className={styles.backBtn} aria-label="Back to All Users">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M15 12H9m0 0l3-3m-3 3l3 3" />
            </svg>
          </Link>

          <div className={styles.userInfoBanner}>
            <span className={styles.usernameLabel}>Username: {profile.username}</span>
          </div>

          <div className={styles.userDetails}>
            <div className={styles.userDetailItem}>
              <svg className={styles.detailIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>Email: {profile.email}</span>
            </div>
            <div className={styles.userDetailItem}>
              <svg className={styles.detailIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
              <span>Device: {profile.device}</span>
            </div>
            <div className={styles.userDetailItem}>
              <svg className={styles.detailIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>Country: {profile.country}</span>
            </div>
            <div className={styles.userDetailItem}>
              <svg className={styles.detailIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Account Type: {profile.accountType}</span>
            </div>
          </div>

          <div className={styles.tabsRow}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className={styles.tableCard}>
            {activeTab === 'loginLogs' && (
              <>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Login Time</th>
                        <th>Logout Time</th>
                        <th>Device</th>
                        <th>App Name</th>
                        <th>Country</th>
                        <th>Subscription</th>
                        <th>IP Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getLoginLogs(profile.country).map((row, i) => (
                        <tr key={i}>
                          <td>{row.loginTime}</td>
                          <td>{row.logoutTime}</td>
                          <td>{row.device}</td>
                          <td>{row.appName}</td>
                          <td>{row.country}</td>
                          <td>{row.subscription}</td>
                          <td>{row.ipAddress}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className={styles.pagination}>
              <span className={styles.paginationText}>
                Page <input type="number" min="1" max={TOTAL_PAGES} value={currentPage} onChange={(e) => setCurrentPage(Math.min(TOTAL_PAGES, Math.max(1, parseInt(e.target.value) || 1)))} className={styles.pageInput} /> of {TOTAL_PAGES}
              </span>
            </div>
              </>
            )}
            {activeTab === 'sessionLogs' && (
              <>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>Server Name</th>
                        <th>Internal IP</th>
                        <th>Public IP</th>
                        <th>Phone Number</th>
                        <th>Country</th>
                        <th>Location</th>
                        <th>Connected Time</th>
                        <th>Disconnected Time</th>
                        <th>Time Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getSessionLogs(profile).map((row) => (
                        <tr key={row.no}>
                          <td>{row.no}</td>
                          <td>{row.serverName}</td>
                          <td>{row.internalIP}</td>
                          <td>{row.publicIP}</td>
                          <td>{row.phoneNumber}</td>
                          <td>{row.country}</td>
                          <td>{row.location}</td>
                          <td>{row.connectedTime}</td>
                          <td>{row.disconnectedTime}</td>
                          <td className={styles.timeDuration}>{row.timeDuration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className={styles.pagination}>
                  <span className={styles.paginationText}>
                    Page <input type="number" min="1" max={TOTAL_PAGES} value={currentPage} onChange={(e) => setCurrentPage(Math.min(TOTAL_PAGES, Math.max(1, parseInt(e.target.value) || 1)))} className={styles.pageInput} /> of {TOTAL_PAGES}
                  </span>
                </div>
              </>
            )}
            {activeTab === 'monitorTraffic' && (
              <>
                <div className={styles.monitorSubTabsRow}>
                  <div className={styles.monitorSubTabs}>
                    {MONITOR_SUB_TABS.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        className={`${styles.monitorSubTab} ${monitorSubTab === tab.id ? styles.monitorSubTabActive : ''}`}
                        onClick={() => setMonitorSubTab(tab.id)}
                      >
                        {tab.icon === 'file' && (
                          <svg className={styles.monitorTabIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
                        )}
                        {tab.icon === 'search' && (
                          <svg className={styles.monitorTabIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                        )}
                        {tab.icon === 'telegram' && (
                          <svg className={styles.monitorTabIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" /></svg>
                        )}
                        {tab.icon === 'whatsapp' && (
                          <svg className={styles.monitorTabIcon} width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                        )}
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className={styles.monitorSearchWrap}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                    <input
                      type="text"
                      placeholder={MONITOR_SUB_TABS.find((t) => t.id === monitorSubTab)?.searchPlaceholder || 'Search...'}
                      className={styles.monitorSearchInput}
                    />
                  </div>
                </div>

                {monitorSubTab === 'fileDetails' && (
                  <>
                    <div className={styles.tableWrap}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Time</th>
                            <th>Usage</th>
                            <th>Destination</th>
                            <th>Country</th>
                            <th>Protocol/Port</th>
                            <th>VPN Node</th>
                            <th>Session ID</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFileDetailsData(profile).map((row, i) => (
                            <tr key={i}>
                              <td>{row.time}</td>
                              <td>{row.usage}</td>
                              <td>{row.destination}</td>
                              <td>{row.country}</td>
                              <td>{row.protocolPort}</td>
                              <td>{row.vpnNode}</td>
                              <td>{row.sessionId}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className={styles.pagination}>
                      <span className={styles.paginationText}>Page <input type="number" min="1" max={TOTAL_PAGES} value={currentPage} onChange={(e) => setCurrentPage(Math.min(TOTAL_PAGES, Math.max(1, parseInt(e.target.value) || 1)))} className={styles.pageInput} /> of {TOTAL_PAGES}</span>
                    </div>
                  </>
                )}

                {monitorSubTab === 'searchUrls' && (
                  <>
                    <div className={styles.tableWrap}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Destination (Domain / URL)</th>
                            <th>Category</th>
                            <th>Hits</th>
                            <th>Usage</th>
                            <th>Sessions</th>
                            <th>First Seen</th>
                            <th>Last Seen</th>
                            <th>Country/Port</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getSearchUrlsData(profile).map((row, i) => (
                            <tr key={i}>
                              <td>{row.destination}</td>
                              <td>{row.category}</td>
                              <td>{row.hits}</td>
                              <td>{row.usage}</td>
                              <td>{row.sessions}</td>
                              <td>{row.firstSeen}</td>
                              <td>{row.lastSeen}</td>
                              <td>{row.countryPort}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className={styles.pagination}>
                      <span className={styles.paginationText}>Page 1 of 1</span>
                    </div>
                  </>
                )}

                {monitorSubTab === 'telegramCalls' && (
                  <>
                    <div className={styles.tableWrap}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Timestamp</th>
                            <th>Type</th>
                            <th>Direction</th>
                            <th>Duration</th>
                            <th>Usage</th>
                            <th>Region</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getCallsData(profile).map((row, i) => (
                            <tr key={i}>
                              <td>{row.timestamp}</td>
                              <td>{row.type}</td>
                              <td>{row.direction}</td>
                              <td className={styles.timeDuration}>{row.duration}</td>
                              <td>{row.usage}</td>
                              <td>{row.region}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className={styles.pagination}>
                      <span className={styles.paginationText}>Page 1 of 1</span>
                    </div>
                  </>
                )}

                {monitorSubTab === 'whatsappMedia' && (
                  <>
                    <div className={styles.tableWrap}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Timestamp</th>
                            <th>Type</th>
                            <th>Direction</th>
                            <th>Usage</th>
                            <th>Device</th>
                            <th>Region</th>
                            <th>Session ID</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getWhatsAppMediaData(profile).map((row, i) => (
                            <tr key={i}>
                              <td>{row.timestamp}</td>
                              <td>{row.type}</td>
                              <td>{row.direction}</td>
                              <td>{row.usage}</td>
                              <td>{row.device}</td>
                              <td>{row.region}</td>
                              <td>{row.sessionId}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className={styles.pagination}>
                      <span className={styles.paginationText}>Page 1 of 1</span>
                    </div>
                  </>
                )}

                {monitorSubTab === 'whatsappCalls' && (
                  <>
                    <div className={styles.tableWrap}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Timestamp</th>
                            <th>Type</th>
                            <th>Direction</th>
                            <th>Duration</th>
                            <th>Usage</th>
                            <th>Region</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getCallsData(profile).map((row, i) => (
                            <tr key={i}>
                              <td>{row.timestamp}</td>
                              <td>{row.type}</td>
                              <td>{row.direction}</td>
                              <td className={styles.timeDuration}>{row.duration}</td>
                              <td>{row.usage}</td>
                              <td>{row.region}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className={styles.pagination}>
                      <span className={styles.paginationText}>Page 1 of 1</span>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
