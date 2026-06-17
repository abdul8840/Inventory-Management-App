import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import preferencesReducer from './preferencesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    preferences: preferencesReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
