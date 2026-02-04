'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/sidebar/Sidebar'
import RealtimeReportSidebar from '@/components/realtime-report-sidebar/RealtimeReportSidebar'
import Header from '@/components/header/Header'
import styles from './all-users.module.css'

// Generate sample users - mix of Free, Paid, Trial for pagination (10 pages, 18 per page)
const countries = ['Pakistan', 'Africa', 'India', 'USA', 'UK']
const generateAllUsers = () => {
  const statuses = ['Free', 'Free', 'Free', 'Paid', 'Trial']
  const devices = ['a01', 'a02', 'a03', 'b01', 'b02', 'c01', 'c02']
  const lastActives = [
    '18-January-2026 (06:58 AM)',
    '18-January-2026 (08:20 AM)',
    '17-January-2026 (02:15 PM)',
    '16-January-2026 (11:22 AM)',
    '15-January-2026 (09:30 AM)',
    '14-January-2026 (04:45 PM)',
  ]
  const users = []
  for (let i = 0; i < 180; i++) {
    const status = statuses[i % statuses.length]
    users.push({
      id: i,
      name: i % 3 === 0 ? 'itzlb' : `user${i}`,
      status,
      email: `user${i}${status.toLowerCase()}@nexipher.com`,
      device: devices[i % devices.length],
      country: countries[i % countries.length],
      lastActive: lastActives[i % lastActives.length],
    })
  }
  return users
}

const ALL_USERS = generateAllUsers()
const ROWS_PER_PAGE = 18

const AllUsersPage = () => {
  const [selectedVPN, setSelectedVPN] = useState('Portfolio')
  const [filterType, setFilterType] = useState('all')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const scopeOptions = ['Portfolio', 'Steer Lucid', 'Crest', 'Slick', 'Fortivo', 'Qucik', 'Nexipher']

  const filteredUsers = ALL_USERS.filter((u) => {
    const matchType = filterType === 'all' || u.status.toLowerCase() === filterType
    const matchSearch =
      !searchQuery ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.device.toLowerCase().includes(searchQuery.toLowerCase())
    return matchType && matchSearch
  })

  const totalPages = Math.ceil(filteredUsers.length / ROWS_PER_PAGE) || 1
  const displayPage = Math.min(Math.max(1, currentPage), totalPages)
  const paginatedUsers = filteredUsers.slice(
    (displayPage - 1) * ROWS_PER_PAGE,
    displayPage * ROWS_PER_PAGE
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [filterType, searchQuery])

  const filterLabels = {
    all: 'All Users',
    free: 'Free Users',
    paid: 'Paid Users',
    trial: 'Trial Users',
  }

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
          <div className={styles.pageHeader}>
            <div className={styles.headerLeft}>
              <Link href="/acquisition" className={styles.backBtn} aria-label="Back to Acquisition">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M15 12H9m0 0l3-3m-3 3l3 3" />
                </svg>
              </Link>
              <div className={styles.dropdownWrap} ref={dropdownRef}>
                <button
                  type="button"
                  className={styles.titleBtn}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className={styles.titleLabel}>{filterLabels[filterType]}</span>
                  <span className={styles.titleArrow}>{isDropdownOpen ? '▲' : '▼'}</span>
                </button>
                {isDropdownOpen && (
                  <div className={styles.dropdown}>
                    {[
                      { id: 'all', label: 'All users' },
                      { id: 'free', label: 'Free users' },
                      { id: 'paid', label: 'Paid users' },
                      { id: 'trial', label: 'Trial users' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        className={styles.dropdownOption}
                        onClick={() => {
                          setFilterType(opt.id)
                          setIsDropdownOpen(false)
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className={styles.searchWrap}>
              <svg
                className={styles.searchIcon}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>User Name</th>
                    <th>Status</th>
                    <th>Email</th>
                    <th>Device</th>
                    <th>Last Active</th>
                    <th>View Profile</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((row) => (
                    <tr key={row.id}>
                      <td>{row.name}</td>
                      <td>{row.status}</td>
                      <td>{row.email}</td>
                      <td>{row.device}</td>
                      <td>{row.lastActive}</td>
                      <td>
                        <Link
                          href={`/acquisition/profile/${row.id}?name=${encodeURIComponent(row.name)}&email=${encodeURIComponent(row.email)}&device=${encodeURIComponent(row.device)}&country=${encodeURIComponent(row.country || '—')}&status=${encodeURIComponent(row.status)}`}
                          className={styles.profileHistoryBtn}
                        >
                          Profile/History
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.pagination}>
              <span className={styles.paginationText}>
                Page {displayPage} of {totalPages}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllUsersPage
