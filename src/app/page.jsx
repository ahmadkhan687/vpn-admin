'use client'

import React from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import styles from './login.module.css'
import { useRouter } from 'next/navigation'
import { CircularProgress } from '@mui/material'
import { useToken } from '@/context/tokenContext'

function Login() {
  const router = useRouter()
  const { login } = useToken()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm()
  const [loading, setLoading] = React.useState(false)

  const loginUser = async (data) => {
    setLoading(true)
    console.log('login Details: ', data)
    try {
      const response = await axios.post(
        'https://admin.nexoralayer.com/Auth/Login',
        {
          email: data.email,
          password: data.password,
        }
      )
      console.log('response Details: ', response)
      if (response.status === 200) {
        const { accessToken } = response.data

        // Store access token using tokenContext
        login(accessToken)
        router.push('/dashboard')
      } else {
        console.error('Login unsuccessful', response.data)
        setError('apiError', { message: response.data.responseMessage })
        setLoading(false)
      }
    } catch (error) {
      console.error(
        'Login error:',
        error.response ? error.response.data : error.message
      )
      setError('apiError', {
        message: error.response
          ? error.response.data.responseMessage
          : error.message,
      })
      setLoading(false)
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginWrapper}>
        <div className={styles.loginHeadingContainer}>
          <h2 className={styles.loginHeading}>LOGIN</h2>
        </div>
        <form className={styles.loginForm} onSubmit={handleSubmit(loginUser)}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            type="email"
            id="email"
            className={styles.input}
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email && (
            <span className={styles.error}>{errors.email.message}</span>
          )}

          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            type="password"
            id="password"
            className={styles.input}
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && (
            <span className={styles.error}>{errors.password.message}</span>
          )}

          <button
            type="submit"
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'LOGIN'}
          </button>
          {errors.apiError && (
            <span className={styles.error}>{errors.apiError.message}</span>
          )}
        </form>
      </div>
    </div>
  )
}

export default Login
