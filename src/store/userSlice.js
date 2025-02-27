// store/userSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  walletBalance: 0,
  initialized: false 
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state.user = action.payload
      state.walletBalance = action.payload?.walletBalance || 0
      state.initialized = true  // Set to true when user details are set
    },
    updateWalletBalance: (state, action) => {
      state.walletBalance = action.payload
    },
    logout: (state) => {
      state.user = null
      state.walletBalance = 0
      state.initialized = true  // Keep as true after logout since we know user state
    },
    // Add this new reducer
    initializeState: (state) => {
      state.initialized = true
    }
  }
})

export const { setUserDetails, updateWalletBalance, logout, initializeState   } = userSlice.actions
export default userSlice.reducer