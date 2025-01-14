import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Timer = {
	project_id: string 
	startTime: Date | null
	stopTime: Date | null
	pauseTime: Date | null
	resumeTime: Date | null
	pauseDuration: number // 총 일시 정지 시간 (밀리초 단위)를 사용합니다. ( DB 연결 시에 변경 ) 
	isPaused: boolean
}

/**
 * pauseDuration: 총 일시 정지 시간 (밀리초 단위).
 * isPaused: 현재 타이머가 일시 정지 상태인지 여부를 추적합니다.
 * resumeTime: 타이머가 재개된 시간입니다.
 */
const initialState: Timer = {
	project_id: '',
	startTime: null,
	stopTime: null,
	pauseTime: null,
	resumeTime: null,
	pauseDuration: 0,
	isPaused: false
}

/**
 * pauseTimer: 타이머가 일시 정지되면 pauseTime을 기록하고 isPaused를 true로 설정합니다.
 * resumeTimer: 타이머가 재개되면 resumeTime을 기록하고, pauseTime과 현재 시간 간의 차이를 pauseDuration에 추가합니다. isPaused를 false로 설정합니다.
 * stopTimer: 타이머가 중지되면 stopTime을 기록합니다. 타이머가 일시 정지 상태일 경우, 총 일시 정지 시간을 고려하여 실제 종료 시간을 조정합니다.
 */
const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    /** 기록 시작을 의미하는 함수입니다. */
    startTimer: (state, action: PayloadAction<{project_id: string}>) => {
      return {
        ...state,
        project_id: action.payload.project_id,
        startTime: new Date(),
        stopTime: null,
        pauseTime: null,
        resumeTime: null,
        pauseDuration: 0,
        isPaused: false
      }
    },
    /** 기록 종료를 의미하는 함수입니다. */
    stopTimer: state => {
      if (!state.isPaused) {
        state.stopTime = new Date()
      } else {
        state.stopTime = new Date(new Date().getTime() - state.pauseDuration)
      }
    },
    /** 기록 일시정지를 의미하는 함수입니다. */
    pauseTimer: state => {
      if (!state.isPaused) {
        state.pauseTime = new Date()
        state.isPaused = true
      }
    },
    /** 기록 재개를 의미하는 함수입니다. */
    resumeTimer: state => {
      if (state.isPaused) {
        const now = new Date()
        state.resumeTime = now
        if (state.pauseTime) {
          state.pauseDuration += now.getTime() - state.pauseTime.getTime()
        }
        state.isPaused = false
      }
    },
		/** 타이머를 초기화합니다. */
		resetTimer: state => {
			return {
				...initialState
			}
		}
  },
})

export const { startTimer, stopTimer, pauseTimer, resumeTimer, resetTimer } = timerSlice.actions

export default timerSlice.reducer
