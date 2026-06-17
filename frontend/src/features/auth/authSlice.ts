import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createBackendSession, getCurrentUser, logoutBackend } from '../../api/authApi';
import {
  getFreshFirebaseIdToken,
  loginWithEmail,
  loginWithGoogle,
  logoutFirebase,
  registerWithEmail
} from '../../services/firebaseAuth';
import { clearSession, getStoredSession, saveSession } from '../../services/secureStorage';
import type { AppUser } from '../../types/user';

interface AuthState {
  user: AppUser | null;
  token: string | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  error?: string;
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: 'loading'
};

export const bootstrapAuth = createAsyncThunk('auth/bootstrap', async () => {
  const stored = await getStoredSession();
  if (!stored?.token) return null;

  try {
    const user = await getCurrentUser();
    const session = { token: stored.token, user };
    await saveSession(session);
    return session;
  } catch {
    await clearSession();
    return null;
  }
});

export const signInWithEmail = createAsyncThunk('auth/signInWithEmail', async (payload: { email: string; password: string }) => {
  await loginWithEmail(payload.email, payload.password);
  const idToken = await getFreshFirebaseIdToken();
  const session = await createBackendSession(idToken);
  await saveSession(session);
  return session;
});

export const signUpWithEmail = createAsyncThunk(
  'auth/signUpWithEmail',
  async (payload: { name: string; email: string; password: string }) => {
    await registerWithEmail(payload.name, payload.email, payload.password);
    const idToken = await getFreshFirebaseIdToken();
    const session = await createBackendSession(idToken);
    await saveSession(session);
    return session;
  }
);

export const signInWithGoogle = createAsyncThunk('auth/signInWithGoogle', async () => {
  await loginWithGoogle();
  const idToken = await getFreshFirebaseIdToken();
  const session = await createBackendSession(idToken);
  await saveSession(session);
  return session;
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await Promise.allSettled([logoutBackend(), logoutFirebase()]);
  await clearSession();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = undefined;
    }
  },
  extraReducers: (builder) => {
    const setPending = (state: AuthState) => {
      state.status = 'loading';
      state.error = undefined;
    };

    const setRejected = (state: AuthState, action: { error: { message?: string } }) => {
      state.status = 'unauthenticated';
      state.error = action.error.message;
    };

    builder
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.status = action.payload ? 'authenticated' : 'unauthenticated';
        state.user = action.payload?.user ?? null;
        state.token = action.payload?.token ?? null;
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        state.status = 'unauthenticated';
      })
      .addCase(signInWithEmail.pending, setPending)
      .addCase(signUpWithEmail.pending, setPending)
      .addCase(signInWithGoogle.pending, setPending)
      .addCase(signInWithEmail.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signUpWithEmail.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signInWithEmail.rejected, setRejected)
      .addCase(signUpWithEmail.rejected, setRejected)
      .addCase(signInWithGoogle.rejected, setRejected)
      .addCase(logout.fulfilled, (state) => {
        state.status = 'unauthenticated';
        state.user = null;
        state.token = null;
      });
  }
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
