// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiConfig from 'src/configs/env'

// ** Axios Imports
import axios from 'axios'

interface DataParams {
  q: string
  userId?: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

const API = apiConfig.API

// ** Fetch Accounts
export const getTopups = createAsyncThunk('appBalance/fetchData', async (params: DataParams) => {
  const response = await axios.get(`${API}/api/balances`, {
    params
  })

  return response.data
})

export const getMyTopup = createAsyncThunk('appBalance/fetchData', async (params: DataParams) => {
  const response = await axios.get(`${API}/api/balances/${params.userId}`, {
    params: { q: params.q }
  })

  return response.data
})
export const CreateTopUp = createAsyncThunk(
  'appBalance/CreateTopUp',
  async (payload, { getState, dispatch }: Redux) => {
    const response = await axios.post(`${API}/api/balances/create`, payload)
    await dispatch(getTopups(getState().balances.params))

    return response.data
  }
)
export const CreateMyTopUp = createAsyncThunk(
  'appBalance/CreateMyTopUp',
  async (payload, { getState, dispatch }: Redux) => {
    const response = await axios.post(`${API}/api/balances/create`, payload)
    await dispatch(getMyTopup(getState().balances.params))

    return response.data
  }
)

export const UpdateBalance = createAsyncThunk(
  'appBalance/UpdateBalance',
  async (payload, { getState, dispatch }: Redux) => {
    const response = await axios.put(`${API}/api/balances/update`, payload)
    await dispatch(getTopups(getState().balances.params))

    return response.data
  }
)

export const deleteTopup = createAsyncThunk(
  'appBalance/deleteData',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await axios.delete(`${API}/api/balances/delete/${id}`)
    await dispatch(getTopups(getState().balances.params))

    return response.data
  }
)

export const appBalancesSlice = createSlice({
  name: 'appBalance',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getMyTopup.fulfilled, (state, action) => {
      state.data = action.payload.balances
      state.params = action.payload.params
      state.allData = action.payload.allData
      state.total = action.payload.total
    })
  }
})

export default appBalancesSlice.reducer
