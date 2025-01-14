import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ILoginModel } from 'models/UserInfoModel'
import { deleteUserCookie } from 'utils/cookie'

interface UserState {
  user: ILoginModel // Default Value: undefined
  access_token: string
}

const initialState: UserState = {
  user: {} as ILoginModel,
  access_token: '',
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // setUser
    loginUser: (state, action: PayloadAction<UserState>) => {
      return {
        ...state,
        ...action.payload,
      }
    },
    // clearUser
    logoutUser: state => {
      deleteUserCookie()
      return {
        ...state,
        user: {} as ILoginModel,
        access_token: '',
      }
    },
  },
})

export const { loginUser, logoutUser } = userSlice.actions

export default userSlice.reducer
