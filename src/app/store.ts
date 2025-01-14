import { configureStore } from '@reduxjs/toolkit'
import userReducer from 'features/user/userSlice'
import projectReducer from 'features/project/projectSlice'
import timerReducer from 'features/test-management/testslice'

// [Load State Issue]
// Load State From Local Storage
function loadState() {
  try {
    const serializedState = localStorage.getItem('state')
    if (serializedState === null) {
      return undefined
    }
    return JSON.parse(serializedState)
  } catch (err) {
    return undefined
  }
}

// Save state to localStorage
function saveState(state: RootState) {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('state', serializedState)
  } catch {
    // TODO: Error Handle
  }
}

const preloadedState = loadState()

export const store = configureStore({
  reducer: {
    user: userReducer,
    project: projectReducer,
		timer: timerReducer
  },
  preloadedState,
})

store.subscribe(() => {
  saveState(store.getState())
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
