// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

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

const API = 'http://localhost:5000'

// ** Fetch Accounts
export const fetchData = createAsyncThunk('appAccounts/fetchData', async (params: DataParams) => {
  const response = await axios.get(`${API}/api/accounts`, {
    params
  })

  return response.data
})

export const fetchMyData = createAsyncThunk('appAccounts/fetchData', async (params: DataParams) => {
  const response = await axios.get(`${API}/api/accounts/${params.userId}`, {
    params: { q: params.q }
  })

  return response.data
})
export const CreateAccount = createAsyncThunk(
  'appAccounts/createAccount',
  async (payload, { getState, dispatch }: Redux) => {
    const response = await axios.post(`${API}/api/accounts/create`, payload)
    await dispatch(fetchData(getState().accounts.params))

    return response.data
  }
)

export const CreateMyAccount = createAsyncThunk(
  'appAccounts/createAccount',
  async (payload, { getState, dispatch }: Redux) => {
    const response = await axios.post(`${API}/api/accounts/create`, payload)
    await dispatch(fetchMyData(getState().accounts.params))

    return response.data
  }
)

export const UpdateAccount = createAsyncThunk(
  'appAccounts/updateAccount',
  async (payload, { getState, dispatch }: Redux) => {
    const response = await axios.put(`${API}/api/accounts/update`, payload)
    await dispatch(fetchData(getState().accounts.params))

    return response.data
  }
)

export const deleteAccounts = createAsyncThunk(
  'appAccounts/deleteData',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await axios.delete(`${API}/api/accounts/delete/${id}`)
    await dispatch(fetchData(getState().accounts.params))

    return response.data
  }
)

export const appAccountsSlice = createSlice({
  name: 'appAccounts',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchMyData.fulfilled, (state, action) => {
      state.data = action.payload.accounts
      state.params = action.payload.params
      state.allData = action.payload.allData
      state.total = action.payload.total
    })
  }
})

export default appAccountsSlice.reducer
