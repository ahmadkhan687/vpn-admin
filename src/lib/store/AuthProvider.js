// lib/store/AuthProvider.js
'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setAuthState,clearAuthState  } from '../features/auth/authSlice';

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
 
    const token = localStorage.getItem('accessToken');
    if (token) {
      dispatch(setAuthState({ accessToken: token }));
    } else {
      dispatch(clearAuthState());
    }
  }, [dispatch]);

  useEffect(() => {
    if (!accessToken) {
      router.push('/');
    }
  }, [accessToken, router]);

  return children;
};

export default AuthProvider;
