// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiConfig from 'src/configs/env'

// ** Axios Imports
import axios from 'axios'

interface DataParams {
  q: string
  // role: string
  // status: string
  // currentPlan: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}
const API = apiConfig.API

// ** Fetch Users
export const getUsers = createAsyncThunk('appUsers/getUsers', async (params: DataParams) => {
  const response = await axios.get(`${API}/api/users/list`, {
    params
  })

  return response.data
})

// ** Add User
export const addUser = createAsyncThunk(
  'appUsers/addUser',
  async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
    const response = await axios.post(`${API}/api/users/`, {
      data
    })
    dispatch(getUsers(getState().user.params))
    return response.data
  }
)

//** Update User */
export const upateUser = createAsyncThunk(
  'appUsers/upateUser',
  async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
    const response = await axios.put(`${API}/api/users/`, {
      data
    })
    dispatch(getUsers(getState().user.params))
    return response.data
  }
)
// ** Delete User
export const deleteUser = createAsyncThunk(
  'appUsers/deleteUser',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await axios.delete(`${API}/api/users/${id}`)
    dispatch(getUsers(getState().user.params))

    return response.data
  }
)

export const appUsersSlice = createSlice({
  name: 'appUsers',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getUsers.fulfilled, (state, action) => {
      state.data = action.payload.users
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
  }
})

export default appUsersSlice.reducer
