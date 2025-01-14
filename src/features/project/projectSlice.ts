import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { store } from 'app/store'

import { ProjectInfoModel } from 'models/ProjectInfoModel'

interface ProjectState {
  project: ProjectInfoModel
}

const initialState: ProjectState = {
  project: {} as ProjectInfoModel,
}

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    // setProject
    setProject: (state, action: PayloadAction<ProjectState>) => {
      return {
        ...state,
        ...action.payload,
      }
    },
    // clearProject
    clearProject: state => {
      return {
        ...state,
        project: {} as ProjectInfoModel,
      }
    },
  },
})

export const { setProject, clearProject } = projectSlice.actions

export default projectSlice.reducer
