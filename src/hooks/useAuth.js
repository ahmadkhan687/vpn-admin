import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Get the token from localStorage
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null

    // If no token, redirect to login
    if (!token) {
      router.push('/')
    } else {
      setIsAuthenticated(true) // Set authenticated to true if token exists
    }
  }, [router])

  return isAuthenticated
}

export default useAuth
