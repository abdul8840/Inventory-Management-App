import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface PreferencesState {
  hasCompletedOnboarding: boolean;
  themeMode: 'system' | 'light' | 'dark';
}

const initialState: PreferencesState = {
  hasCompletedOnboarding: false,
  themeMode: 'system'
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    completeOnboarding(state) {
      state.hasCompletedOnboarding = true;
    },
    setThemeMode(state, action: PayloadAction<PreferencesState['themeMode']>) {
      state.themeMode = action.payload;
    }
  }
});

export const { completeOnboarding, setThemeMode } = preferencesSlice.actions;
export default preferencesSlice.reducer;
