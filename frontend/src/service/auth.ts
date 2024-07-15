import axios from 'axios'
import * as authInterface from 'src/interface/auth'
const API_URL = process.env.NEXT_PUBLIC_API_URL

export const registerUser = async (params: authInterface.SignUpFormType) => {
  const { data } = await axios.post(`${API_URL}/users`, params)
  return data
}
export const signInUser = async (params: authInterface.SignInFormType) => {
  const { data } = await axios.post(`${API_URL}/users/login`, params)
  return data
}
