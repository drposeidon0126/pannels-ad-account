// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

export type UsersType = {
  id: number
  role: string
  email: string
  password: string
  status: string
  phonenumber: string
  fullname: string
  companyanme: string
  companyregion: string
  monthlyadspend: string
  goals: string
  username: string
  adplatform: string
  profile_image?: ThemeColor
}

export type ProjectListDataType = {
  id: number
  img: string
  hours: string
  totalTask: string
  projectType: string
  projectTitle: string
  progressValue: number
  progressColor: ThemeColor
}
