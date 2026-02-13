'use client'

import React, { useState, useRef, useEffect } from 'react'
import styles from './DateRangePicker.module.css'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const formatDate = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const getDaysInMonth = (year, month) => {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const startPad = first.getDay()
  const days = last.getDate()
  const result = []
  for (let i = 0; i < startPad; i++) result.push(null)
  for (let i = 1; i <= days; i++) result.push(new Date(year, month, i))
  return result
}

const isSameDay = (a, b) => a && b && a.getTime() === b.getTime()
const isInRange = (d, start, end) => {
  if (!d || !start || !end) return false
  const t = d.getTime()
  return t >= start.getTime() && t <= end.getTime()
}

const DateRangePicker = ({
  value = { startDate: new Date(2025, 11, 19), endDate: new Date(2026, 0, 15) },
  onChange,
  presets = ['Last 7 days', 'Last 14 days', 'Last 28 days', 'Last 90 days'],
  className = '',
}) => {
  const [open, setOpen] = useState(false)
  const [tempStart, setTempStart] = useState(value?.startDate || new Date(2025, 11, 19))
  const [tempEnd, setTempEnd] = useState(value?.endDate || new Date(2026, 0, 15))
  const [selecting, setSelecting] = useState('start') // 'start' | 'end'
  const [leftMonth, setLeftMonth] = useState(value?.startDate?.getMonth() ?? 11)
  const [leftYear, setLeftYear] = useState(value?.startDate?.getFullYear() ?? 2025)
  const containerRef = useRef(null)

  const startDate = value?.startDate ?? tempStart
  const endDate = value?.endDate ?? tempEnd
  const displayText = `${formatDate(startDate)} - ${formatDate(endDate)}`

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const handlePreset = (label) => {
    const end = new Date()
    const match = label.match(/\d+/)
    const days = match ? parseInt(match[0], 10) : 28
    const start = new Date(end)
    start.setDate(start.getDate() - (days - 1))
    onChange?.({ startDate: start, endDate: end })
    setTempStart(start)
    setTempEnd(end)
    setOpen(false)
  }

  const handleDateClick = (d) => {
    if (!d) return
    if (selecting === 'start') {
      setTempStart(d)
      setTempEnd(d)
      setSelecting('end')
    } else {
      let s = tempStart
      let e = d
      if (d.getTime() < tempStart.getTime()) {
        s = d
        e = tempStart
      }
      setTempStart(s)
      setTempEnd(e)
      setSelecting('start')
      onChange?.({ startDate: s, endDate: e })
      setOpen(false)
    }
  }

  const renderMonth = (year, month, isLeft) => {
    const days = getDaysInMonth(year, month)
    const start = selecting === 'end' ? tempStart : tempStart
    const end = selecting === 'end' ? tempEnd : tempEnd
    const rangeStart = start && end ? (start.getTime() <= end.getTime() ? start : end) : start
    const rangeEnd = start && end ? (start.getTime() <= end.getTime() ? end : start) : end

    return (
      <div className={styles.monthGrid} key={`${year}-${month}`}>
        <div className={styles.monthHeader}>
          <span>{MONTHS[month]} {year}</span>
        </div>
        <div className={styles.weekdayRow}>
          {DAYS.map((d) => (
            <div key={d} className={styles.weekday}>{d}</div>
          ))}
        </div>
        <div className={styles.daysGrid}>
          {days.map((d, i) => {
            if (!d) return <div key={`e-${i}`} className={styles.dayEmpty} />
            const isStart = isSameDay(d, rangeStart)
            const isEnd = isSameDay(d, rangeEnd)
            const inRange = isInRange(d, rangeStart, rangeEnd)
            return (
              <button
                key={d.getTime()}
                type="button"
                className={`${styles.day} ${isStart || isEnd ? styles.daySelected : ''} ${inRange ? styles.dayInRange : ''}`}
                onClick={() => handleDateClick(d)}
              >
                {d.getDate()}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const rightMonth = leftMonth === 11 ? 0 : leftMonth + 1
  const rightYear = leftMonth === 11 ? leftYear + 1 : leftYear

  return (
    <div className={`${styles.wrapper} ${className}`} ref={containerRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(!open)}
      >
        <span className={styles.triggerText}>{displayText}</span>
        <span className={styles.chevron}>▼</span>
      </button>
      {open && (
        <div className={styles.popover}>
          {presets.length > 0 && (
            <div className={styles.presets}>
              {presets.map((p) => (
                <button key={p} type="button" className={styles.presetBtn} onClick={() => handlePreset(p)}>
                  {p}
                </button>
              ))}
            </div>
          )}
          <div className={styles.calendars}>
            <div className={styles.calendarNav}>
              <button
                type="button"
                className={styles.navBtn}
                onClick={() => {
                  if (leftMonth === 0) {
                    setLeftMonth(11)
                    setLeftYear((y) => y - 1)
                  } else {
                    setLeftMonth((m) => m - 1)
                  }
                }}
              >
                ‹
              </button>
              <span>{MONTHS[leftMonth]} {leftYear} — {MONTHS[rightMonth]} {rightYear}</span>
              <button
                type="button"
                className={styles.navBtn}
                onClick={() => {
                  if (leftMonth === 11) {
                    setLeftMonth(0)
                    setLeftYear((y) => y + 1)
                  } else {
                    setLeftMonth((m) => m + 1)
                  }
                }}
              >
                ›
              </button>
            </div>
            <div className={styles.monthsRow}>
              {renderMonth(leftYear, leftMonth, true)}
              {renderMonth(rightYear, rightMonth, false)}
            </div>
            <div className={styles.hint}>
              {selecting === 'start' ? 'Select start date' : 'Select end date'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DateRangePicker
