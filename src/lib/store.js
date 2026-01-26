// lib/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice'; 

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
};


export const AppStore = makeStore();
export const RootState = AppStore.getState();
export const AppDispatch = AppStore.dispatch;
