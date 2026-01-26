'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken') || null
    }
    return null
  })

  const login = (token) => {
    setAccessToken(token)
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token)
    }
  }

  const logout = () => {
    setAccessToken(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
    }
  }

  useEffect(() => {
    if (accessToken) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', accessToken)
      }
    } else {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken')
      }
    }
  }, [accessToken])

  return (
    <AuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useToken = () => useContext(AuthContext)
