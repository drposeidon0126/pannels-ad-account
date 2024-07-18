// ** React Imports
import { useState, useEffect, forwardRef } from 'react'
import { useRouter } from 'next/router'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports

import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { SelectChangeEvent } from '@mui/material/Select'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import { IconContext } from 'react-icons'
import { SiGoogleads } from 'react-icons/si'
import { SiTiktok } from 'react-icons/si'
import { SiMeta } from 'react-icons/si'
// ** Third Party Imports
import format from 'date-fns/format'
import useBgColor, { UseBgColorType } from 'src/@core/hooks/useBgColor'
import toast, { ToastBar } from 'react-hot-toast'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import { Tooltip } from '@mui/material'
import axios from 'axios'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import TimezoneSelect, { type ITimezone, allTimezones } from 'react-timezone-select'
// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchData, CreateMyAccount, fetchMyData } from 'src/store/apps/accounts'
import { CreateTopUp } from 'src/store/apps/balance'
// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { ThemeColor } from 'src/@core/layouts/types'
import { AccoutType } from 'src/types/apps/accountType'
import { DateType } from 'src/types/forms/reactDatepickerTypes'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import apiConfig from 'src/configs/env'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'
import TableHeader from 'src/views/apps/invoice/list/TableHeader'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import next from 'next'
import { useAuth } from 'src/hooks/useAuth'

interface InvoiceStatusObj {
  [key: string]: {
    icon: string
    color: ThemeColor
  }
}

interface CustomInputProps {
  dates: Date[]
  label: string
  end: number | Date
  start: number | Date
  setDates?: (value: Date[]) => void
}

interface CellType {
  row: AccoutType
}
interface TopUpParas {
  account: string
  amount: string
  total: string
}
// ** Styled components
const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '1rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const Timezones_List = [
  {
    name: '(GMT-11:00) Midway Island',
    timezone: 'Pacific/Midway'
  },
  {
    name: '(GMT-11:00) Samoa',
    timezone: 'US/Samoa'
  },
  {
    name: '(GMT-10:00) Hawaii',
    timezone: 'US/Hawaii'
  },
  {
    name: '(GMT-09:00) Alaska',
    timezone: 'US/Alaska'
  },
  {
    name: '(GMT-08:00) Pacific Time (US & Canada)',
    timezone: 'US/Pacific'
  },
  {
    name: '(GMT-08:00) Tijuana',
    timezone: 'America/Tijuana'
  },
  {
    name: '(GMT-07:00) Arizona',
    timezone: 'US/Arizona'
  },
  {
    name: '(GMT-07:00) Mountain Time (US & Canada)',
    timezone: 'US/Mountain'
  },
  {
    name: '(GMT-07:00) Chihuahua',
    timezone: 'America/Chihuahua'
  },
  {
    name: '(GMT-07:00) Mazatlan',
    timezone: 'America/Mazatlan'
  },
  {
    name: '(GMT-06:00) Mexico City',
    timezone: 'America/Mexico_City'
  },
  {
    name: '(GMT-06:00) Monterrey',
    timezone: 'America/Monterrey'
  },
  {
    name: '(GMT-06:00) Saskatchewan',
    timezone: 'Canada/Saskatchewan'
  },
  {
    name: '(GMT-06:00) Central Time (US & Canada)',
    timezone: 'US/Central'
  },
  {
    name: '(GMT-05:00) Eastern Time (US & Canada)',
    timezone: 'US/Eastern'
  },
  {
    name: '(GMT-05:00) Indiana (East)',
    timezone: 'US/East-Indiana'
  },
  {
    name: '(GMT-05:00) Bogota',
    timezone: 'America/Bogota'
  },
  {
    name: '(GMT-05:00) Lima',
    timezone: 'America/Lima'
  },
  {
    name: '(GMT-04:30) Caracas',
    timezone: 'America/Caracas'
  },
  {
    name: '(GMT-04:00) Atlantic Time (Canada)',
    timezone: 'Canada/Atlantic'
  },
  {
    name: '(GMT-04:00) La Paz',
    timezone: 'America/La_Paz'
  },
  {
    name: '(GMT-04:00) Santiago',
    timezone: 'America/Santiago'
  },
  {
    name: '(GMT-03:30) Newfoundland',
    timezone: 'Canada/Newfoundland'
  },
  {
    name: '(GMT-03:00) Buenos Aires',
    timezone: 'America/Buenos_Aires'
  },
  {
    name: '(GMT-03:00) Greenland',
    timezone: 'Greenland'
  },
  {
    name: '(GMT-02:00) Stanley',
    timezone: 'Atlantic/Stanley'
  },
  {
    name: '(GMT-01:00) Azores',
    timezone: 'Atlantic/Azores'
  },
  {
    name: '(GMT-01:00) Cape Verde Is.',
    timezone: 'Atlantic/Cape_Verde'
  },
  {
    name: '(GMT) Casablanca',
    timezone: 'Africa/Casablanca'
  },
  {
    name: '(GMT) Dublin',
    timezone: 'Europe/Dublin'
  },
  {
    name: '(GMT) Lisbon',
    timezone: 'Europe/Lisbon'
  },
  {
    name: '(GMT) London',
    timezone: 'Europe/London'
  },
  {
    name: '(GMT) Monrovia',
    timezone: 'Africa/Monrovia'
  },
  {
    name: '(GMT+01:00) Amsterdam',
    timezone: 'Europe/Amsterdam'
  },
  {
    name: '(GMT+01:00) Belgrade',
    timezone: 'Europe/Belgrade'
  },
  {
    name: '(GMT+01:00) Berlin',
    timezone: 'Europe/Berlin'
  },
  {
    name: '(GMT+01:00) Bratislava',
    timezone: 'Europe/Bratislava'
  },
  {
    name: '(GMT+01:00) Brussels',
    timezone: 'Europe/Brussels'
  },
  {
    name: '(GMT+01:00) Budapest',
    timezone: 'Europe/Budapest'
  },
  {
    name: '(GMT+01:00) Copenhagen',
    timezone: 'Europe/Copenhagen'
  },
  {
    name: '(GMT+01:00) Ljubljana',
    timezone: 'Europe/Ljubljana'
  },
  {
    name: '(GMT+01:00) Madrid',
    timezone: 'Europe/Madrid'
  },
  {
    name: '(GMT+01:00) Paris',
    timezone: 'Europe/Paris'
  },
  {
    name: '(GMT+01:00) Prague',
    timezone: 'Europe/Prague'
  },
  {
    name: '(GMT+01:00) Rome',
    timezone: 'Europe/Rome'
  },
  {
    name: '(GMT+01:00) Sarajevo',
    timezone: 'Europe/Sarajevo'
  },
  {
    name: '(GMT+01:00) Skopje',
    timezone: 'Europe/Skopje'
  },
  {
    name: '(GMT+01:00) Stockholm',
    timezone: 'Europe/Stockholm'
  },
  {
    name: '(GMT+01:00) Vienna',
    timezone: 'Europe/Vienna'
  },
  {
    name: '(GMT+01:00) Warsaw',
    timezone: 'Europe/Warsaw'
  },
  {
    name: '(GMT+01:00) Zagreb',
    timezone: 'Europe/Zagreb'
  },
  {
    name: '(GMT+02:00) Athens',
    timezone: 'Europe/Athens'
  },
  {
    name: '(GMT+02:00) Bucharest',
    timezone: 'Europe/Bucharest'
  },
  {
    name: '(GMT+02:00) Cairo',
    timezone: 'Africa/Cairo'
  },
  {
    name: '(GMT+02:00) Harare',
    timezone: 'Africa/Harare'
  },
  {
    name: '(GMT+02:00) Helsinki',
    timezone: 'Europe/Helsinki'
  },
  {
    name: '(GMT+02:00) Istanbul',
    timezone: 'Europe/Istanbul'
  },
  {
    name: '(GMT+02:00) Jerusalem',
    timezone: 'Asia/Jerusalem'
  },
  {
    name: '(GMT+02:00) Kyiv',
    timezone: 'Europe/Kiev'
  },
  {
    name: '(GMT+02:00) Minsk',
    timezone: 'Europe/Minsk'
  },
  {
    name: '(GMT+02:00) Riga',
    timezone: 'Europe/Riga'
  },
  {
    name: '(GMT+02:00) Sofia',
    timezone: 'Europe/Sofia'
  },
  {
    name: '(GMT+02:00) Tallinn',
    timezone: 'Europe/Tallinn'
  },
  {
    name: '(GMT+02:00) Vilnius',
    timezone: 'Europe/Vilnius'
  },
  {
    name: '(GMT+03:00) Baghdad',
    timezone: 'Asia/Baghdad'
  },
  {
    name: '(GMT+03:00) Kuwait',
    timezone: 'Asia/Kuwait'
  },
  {
    name: '(GMT+03:00) Nairobi',
    timezone: 'Africa/Nairobi'
  },
  {
    name: '(GMT+03:00) Riyadh',
    timezone: 'Asia/Riyadh'
  },
  {
    name: '(GMT+03:00) Moscow',
    timezone: 'Europe/Moscow'
  },
  {
    name: '(GMT+03:30) Tehran',
    timezone: 'Asia/Tehran'
  },
  {
    name: '(GMT+04:00) Baku',
    timezone: 'Asia/Baku'
  },
  {
    name: '(GMT+04:00) Volgograd',
    timezone: 'Europe/Volgograd'
  },
  {
    name: '(GMT+04:00) Muscat',
    timezone: 'Asia/Muscat'
  },
  {
    name: '(GMT+04:00) Tbilisi',
    timezone: 'Asia/Tbilisi'
  },
  {
    name: '(GMT+04:00) Yerevan',
    timezone: 'Asia/Yerevan'
  },
  {
    name: '(GMT+04:30) Kabul',
    timezone: 'Asia/Kabul'
  },
  {
    name: '(GMT+05:00) Karachi',
    timezone: 'Asia/Karachi'
  },
  {
    name: '(GMT+05:00) Tashkent',
    timezone: 'Asia/Tashkent'
  },
  {
    name: '(GMT+05:30) Kolkata',
    timezone: 'Asia/Kolkata'
  },
  {
    name: '(GMT+05:45) Kathmandu',
    timezone: 'Asia/Kathmandu'
  },
  {
    name: '(GMT+06:00) Ekaterinburg',
    timezone: 'Asia/Yekaterinburg'
  },
  {
    name: '(GMT+06:00) Almaty',
    timezone: 'Asia/Almaty'
  },
  {
    name: '(GMT+06:00) Dhaka',
    timezone: 'Asia/Dhaka'
  },
  {
    name: '(GMT+07:00) Novosibirsk',
    timezone: 'Asia/Novosibirsk'
  },
  {
    name: '(GMT+07:00) Bangkok',
    timezone: 'Asia/Bangkok'
  },
  {
    name: '(GMT+07:00) Jakarta',
    timezone: 'Asia/Jakarta'
  },
  {
    name: '(GMT+08:00) Krasnoyarsk',
    timezone: 'Asia/Krasnoyarsk'
  },
  {
    name: '(GMT+08:00) Chongqing',
    timezone: 'Asia/Chongqing'
  },
  {
    name: '(GMT+08:00) Hong Kong',
    timezone: 'Asia/Hong_Kong'
  },
  {
    name: '(GMT+08:00) Kuala Lumpur',
    timezone: 'Asia/Kuala_Lumpur'
  },
  {
    name: '(GMT+08:00) Perth',
    timezone: 'Australia/Perth'
  },
  {
    name: '(GMT+08:00) Singapore',
    timezone: 'Asia/Singapore'
  },
  {
    name: '(GMT+08:00) Taipei',
    timezone: 'Asia/Taipei'
  },
  {
    name: '(GMT+08:00) Ulaan Bataar',
    timezone: 'Asia/Ulaanbaatar'
  },
  {
    name: '(GMT+08:00) Urumqi',
    timezone: 'Asia/Urumqi'
  },
  {
    name: '(GMT+09:00) Irkutsk',
    timezone: 'Asia/Irkutsk'
  },
  {
    name: '(GMT+09:00) Seoul',
    timezone: 'Asia/Seoul'
  },
  {
    name: '(GMT+09:00) Tokyo',
    timezone: 'Asia/Tokyo'
  },
  {
    name: '(GMT+09:30) Adelaide',
    timezone: 'Australia/Adelaide'
  },
  {
    name: '(GMT+09:30) Darwin',
    timezone: 'Australia/Darwin'
  },
  {
    name: '(GMT+10:00) Yakutsk',
    timezone: 'Asia/Yakutsk'
  },
  {
    name: '(GMT+10:00) Brisbane',
    timezone: 'Australia/Brisbane'
  },
  {
    name: '(GMT+10:00) Canberra',
    timezone: 'Australia/Canberra'
  },
  {
    name: '(GMT+10:00) Guam',
    timezone: 'Pacific/Guam'
  },
  {
    name: '(GMT+10:00) Hobart',
    timezone: 'Australia/Hobart'
  },
  {
    name: '(GMT+10:00) Melbourne',
    timezone: 'Australia/Melbourne'
  },
  {
    name: '(GMT+10:00) Port Moresby',
    timezone: 'Pacific/Port_Moresby'
  },
  {
    name: '(GMT+10:00) Sydney',
    timezone: 'Australia/Sydney'
  },
  {
    name: '(GMT+11:00) Vladivostok',
    timezone: 'Asia/Vladivostok'
  },
  {
    name: '(GMT+12:00) Magadan',
    timezone: 'Asia/Magadan'
  },
  {
    name: '(GMT+12:00) Auckland',
    timezone: 'Pacific/Auckland'
  },
  {
    name: '(GMT+12:00) Fiji',
    timezone: 'Pacific/Fiji'
  }
]

// ** Vars
const invoiceStatusObj: InvoiceStatusObj = {
  Paid: { color: 'success', icon: 'bx:pie-chart-alt' },
  Sent: { color: 'secondary', icon: 'bx:paper-plane' },
  Downloaded: { color: 'info', icon: 'bx:down-arrow-circle' },
  Draft: { color: 'primary', icon: 'bxs:save' },
  'Past Due': { color: 'error', icon: 'bx:info-circle' },
  'Partial Payment': { color: 'warning', icon: 'bx:adjust' }
}

// ** renders client column
// const renderClient = (row: AccoutType) => {
//   if (row.avatar.length) {
//     return <CustomAvatar src={row.avatar} sx={{ mr: 3, width: 30, height: 30 }} />
//   } else {
//     return (
//       <CustomAvatar
//         skin='light'
//         color={(row.avatarColor as ThemeColor) || ('primary' as ThemeColor)}
//         sx={{ mr: 3, width: 30, height: 30, fontSize: '.8rem', lineHeight: 1.5 }}
//       >
//         {getInitials(row.name || 'John Doe')}
//       </CustomAvatar>
//     )
//   }
// }

const defaultColumns: GridColDef[] = [
  {
    flex: 0.1,
    field: 'id',
    minWidth: 80,
    headerName: '#',
    renderCell: ({ row }: CellType) => <LinkStyled href={`/}`}>{`#${row.id}`}</LinkStyled>
  },
  {
    flex: 0.1,
    minWidth: 80,
    field: 'platform',
    headerName: 'AD PLATFOEM',
    renderCell: ({ row }: CellType) => {
      if (row.platform === 'meta') {
        return (
          <IconContext.Provider value={{ size: '2em' }}>
            <div>
              <SiMeta />
            </div>
          </IconContext.Provider>
        )
      } else if (row.platform === 'tiktok') {
        return (
          <IconContext.Provider value={{ size: '2em' }}>
            <div>
              <SiTiktok />
            </div>
          </IconContext.Provider>
        )
      } else {
        return (
          <IconContext.Provider value={{ size: '2em' }}>
            <div>
              <SiGoogleads />
            </div>
          </IconContext.Provider>
        )
      }
    }
  },
  {
    flex: 0.3,
    field: 'name',
    minWidth: 300,
    headerName: 'ACCOUNT NAME',
    renderCell: ({ row }: CellType) => (
      <Typography sx={{ color: 'text.secondary' }}>{`test.com#${String(row.name).padStart(4, '0')}`}</Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'timezone',
    headerName: 'TIME ZONE',
    renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{`${row.timezone}`}</Typography>
  },
  {
    flex: 0.2,
    minWidth: 125,
    field: 'currency',
    headerName: 'CURRENCY',
    renderCell: ({ row }: CellType) => (
      <Typography sx={{ color: 'text.secondary' }}>{row.currency.toUpperCase()}</Typography>
    )
  },
  {
    flex: 0.2,
    minWidth: 125,
    field: 'status',
    headerName: 'STATUS',
    renderCell: ({ row }: CellType) => {
      return row.status === 'Submitted' ? (
        <CustomChip rounded size='small' skin='light' color='warning' label='Pending' style={{ cursor: 'pointer' }} />
      ) : row.status === 'Approved' ? (
        <CustomChip rounded size='small' skin='light' color='success' label='Approved' style={{ cursor: 'pointer' }} />
      ) : (
        <CustomChip rounded size='small' skin='light' color='error' label='Denied' style={{ cursor: 'pointer' }} />
      )
    }
  }
]

/* eslint-disable */
const CustomInput = forwardRef((props: CustomInputProps, ref) => {
  const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
  const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null

  const value = `${startDate}${endDate !== null ? endDate : ''}`
  props.start === null && props.dates.length && props.setDates ? props.setDates([]) : null
  const updatedProps = { ...props }
  delete updatedProps.setDates

  return <TextField fullWidth inputRef={ref} {...updatedProps} label={props.label || ''} value={value} />
})
/* eslint-enable */

const AdAccounts = () => {
  // ** State
  const [dates, setDates] = useState<Date[]>([])
  const [value, setValue] = useState<string>('')
  const [statusValue, setStatusValue] = useState<string>('')
  const [endDateRange, setEndDateRange] = useState<DateType>(null)
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [startDateRange, setStartDateRange] = useState<DateType>(null)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [show, setShow] = useState<boolean>(false)
  const [adplatform, setAdPlatform] = useState<'meta' | 'tiktok' | 'google'>('meta')
  const [currency, setCurrency] = useState<'usd' | 'eur' | 'try'>('usd')
  const [timeZone, setTimeZone] = useState<string>('')
  const [link, setLink] = useState<string>('')
  const [accountName, setAccountName] = useState<number>(1)
  const [nextStep, setNextStep] = useState<boolean>(false)
  const [bmId, setBmid] = useState<string>('')
  const [facebookPOne, setFacebookPOne] = useState<string>('')
  const [facebookPTwo, setFacebookPTwo] = useState<string>('')
  //topup/
  const [showTopUpModal, setShowTopUpMpdal] = useState<boolean>(false)
  const [selectAcc, setSelectAcc] = useState()
  const [topUpParas, setTopUpParas] = useState<TopUpParas>({
    account: '',
    amount: '0',
    total: '0'
  })
  const [isContinueToUp, setIsContinueToUp] = useState<boolean>(false)
  const [paymentCode, setPaymentCode] = useState<string>('36500')
  const [receiverName, setReceiverName] = useState<string>('Rockads Reklam Anonim Sirketi')
  const [accNumber, setAccnumber] = useState<string>('TR09 0006 2000 4320 0090 0198 49')
  const [swiftCode, setSwiftCode] = useState<string>('TGBATRISXXX')
  // ** Hooks

  const bgColors: UseBgColorType = useBgColor()
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.accounts)
  const auth = useAuth()
  const { push } = useRouter()

  const [isDispatch, setIsDispatch] = useState<boolean>(false)

  useEffect(() => {
    dispatch(
      fetchMyData({
        q: value,
        userId: auth.user._id
      })
    )
    setIsDispatch(false)
  }, [dispatch, value, isDispatch])

  useEffect(() => {
    const API = apiConfig.API
    axios
      .get(`${API}/api/accounts/`, {
        params: { q: value }
      })
      .then(res => {
        if (res.data.accounts.length > 0) {
          setAccountName(res.data.accounts[res.data.accounts.length - 1].name + 1)
        }
      })

    axios.get(`${API}/api/balances/`, {}).then(res => {
      if (res.data.balances.length > 0) {
        setPaymentCode(res.data.balances[res.data.balances.length - 1].paymentCode + 1)
      }
    })
  }, [])

  const createNewAcc = () => {
    if (!bmId) {
      toast.error('BM ID is required. if you don`t have a BM, then contact us and we will get it for you')
    } else {
      const payload = {
        platform: adplatform,
        timezone: timeZone,
        currency: currency,
        link: link,
        bmId: bmId,
        facebookOne: facebookPOne,
        facebookTwo: facebookPTwo,
        userId: auth.user._id
      }
      dispatch(CreateMyAccount(payload))
      setAccountName(accountName + 1)
      setShow(false)
      setNextStep(false)
      setIsDispatch(true)
    }
  }

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard !')
  }

  const continueTopUp = () => {
    setShowTopUpMpdal(false)
    setIsContinueToUp(true)
  }

  const makeTransfer = async () => {
    const acc = store.data.filter(row => row._id === topUpParas.account)
    console.log(acc, 'Acc')
    const payload = {
      accountId: topUpParas.account,
      accountName: acc[0].name,
      total: topUpParas.amount * 0.96,
      userId: auth.user._id,
      paymentCode: paymentCode
    }
    dispatch(CreateTopUp(payload))
    push(`/apps/ad-balance`)
    setIsContinueToUp(false)
  }

  const handleFilter = (val: string) => {
    setValue(val)
  }

  const handleStatusValue = (e: SelectChangeEvent) => {
    setStatusValue(e.target.value)
  }

  const handleOnChangeRange = (dates: any) => {
    const [start, end] = dates
    if (start !== null && end !== null) {
      setDates(dates)
    }
    setStartDateRange(start)
    setEndDateRange(end)
  }

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 100,
      maxWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Button
          sx={{ mb: 2, fontSize: '0.75rem', padding: '4px 8px' }} // Adjust padding and font size if needed
          component={Link}
          variant='contained'
          href={`#`}
          size='small' // Set the button size to small
          disabled={row.status === 'Submitted'}
          onClick={() => {
            setTopUpParas({
              ...topUpParas,
              account: row._id
            })
            setShowTopUpMpdal(true)
          }}
        >
          Top-up+
        </Button>
      )
    }
  ]

  console.log(new Date().getTimezoneOffset(), 'allTimezones')

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          {/* <Card>
            <CardHeader title='Filters' />
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id='invoice-status-select'>Invoice Status</InputLabel>
                    <Select
                      fullWidth
                      value={statusValue}
                      sx={{ mr: 4, mb: 2 }}
                      label='Invoice Status'
                      onChange={handleStatusValue}
                      labelId='invoice-status-select'
                    >
                      <MenuItem value=''>none</MenuItem>
                      <MenuItem value='downloaded'>Downloaded</MenuItem>
                      <MenuItem value='draft'>Draft</MenuItem>
                      <MenuItem value='paid'>Paid</MenuItem>
                      <MenuItem value='partial payment'>Partial Payment</MenuItem>
                      <MenuItem value='past due'>Past Due</MenuItem>
                      <MenuItem value='sent'>Sent</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    isClearable
                    selectsRange
                    monthsShown={2}
                    endDate={endDateRange}
                    selected={startDateRange}
                    startDate={startDateRange}
                    shouldCloseOnSelect={false}
                    id='date-range-picker-months'
                    onChange={handleOnChangeRange}
                    customInput={
                      <CustomInput
                        dates={dates}
                        setDates={setDates}
                        label='Invoice Date'
                        end={endDateRange as number | Date}
                        start={startDateRange as number | Date}
                      />
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card> */}
        </Grid>
        <Grid item xs={12}>
          <Card>
            <Box
              sx={{
                p: 5,
                pb: 3,
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                <TextField
                  size='small'
                  value={value}
                  sx={{ mr: 4, mb: 2 }}
                  placeholder='Search Accounts'
                  onChange={e => handleFilter(e.target.value)}
                />
                <Button
                  sx={{ mb: 2, float: 'right' }}
                  component={Link}
                  onClick={() => setShow(true)}
                  variant='contained'
                  href=''
                >
                  New Ad Account +
                </Button>
              </Box>
            </Box>
            <DataGrid
              autoHeight
              pagination
              rows={store.data}
              columns={columns}
              checkboxSelection
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              onRowSelectionModelChange={rows => setSelectedRows(rows)}
            />
          </Card>
          <Dialog
            fullWidth
            open={show}
            maxWidth='md'
            scroll='body'
            onClose={() => {
              setShow(false)
              setNextStep(false)
            }}
            // TransitionComponent={Transition}
            onBackdropClick={() => {
              setShow(false)
              setNextStep(false)
            }}
          >
            <DialogContent
              sx={{
                position: 'relative',
                pb: theme => `${theme.spacing(8)} !important`,
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              <IconButton
                size='small'
                onClick={() => {
                  setShow(false)
                  setNextStep(false)
                }}
                sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
              >
                <Icon icon='bx:x' />
              </IconButton>
              <Box sx={{ mb: 8, textAlign: 'center' }}>
                <Typography variant='h5' sx={{ mb: 3 }}>
                  Get New Ad Account
                </Typography>
                <Typography variant='body2'>Reach out to pending acount limit!</Typography>
              </Box>
              {!nextStep ? (
                <Grid container spacing={6}>
                  <Grid item sm={4} xs={12}>
                    <Box
                      onClick={() => setAdPlatform('meta')}
                      sx={{
                        py: 3,
                        px: 4,
                        borderRadius: 1,
                        cursor: 'pointer',
                        ...(adplatform === 'meta' ? { ...bgColors.primaryLight } : { backgroundColor: 'action.hover' }),
                        border: theme =>
                          `1px solid ${adplatform === 'meta' ? theme.palette.primary.main : theme.palette.divider}`
                      }}
                    >
                      <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                        <IconContext.Provider value={{ size: '2em' }}>
                          <div>
                            <SiMeta />
                          </div>
                        </IconContext.Provider>
                        <Typography variant='h6' sx={{ ...(adplatform === 'meta' ? { color: 'primary.main' } : {}) }}>
                          Meta
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <Box
                      onClick={() => setAdPlatform('tiktok')}
                      sx={{
                        py: 3,
                        px: 4,
                        borderRadius: 1,
                        cursor: 'pointer',
                        ...(adplatform === 'tiktok'
                          ? { ...bgColors.primaryLight }
                          : { backgroundColor: 'action.hover' }),
                        border: theme =>
                          `1px solid ${adplatform === 'tiktok' ? theme.palette.primary.main : theme.palette.divider}`
                      }}
                    >
                      <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                        <IconContext.Provider value={{ size: '2em' }}>
                          <div>
                            <SiTiktok />
                          </div>
                        </IconContext.Provider>
                        <Typography variant='h6' sx={{ ...(adplatform === 'tiktok' ? { color: 'primary.main' } : {}) }}>
                          Tiktok
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <Box
                      onClick={() => setAdPlatform('google')}
                      sx={{
                        py: 3,
                        px: 4,
                        borderRadius: 1,
                        cursor: 'pointer',
                        ...(adplatform === 'google'
                          ? { ...bgColors.primaryLight }
                          : { backgroundColor: 'action.hover' }),
                        border: theme =>
                          `1px solid ${adplatform === 'google' ? theme.palette.primary.main : theme.palette.divider}`
                      }}
                    >
                      <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                        <IconContext.Provider value={{ size: '2em' }}>
                          <div>
                            <SiGoogleads />
                          </div>
                        </IconContext.Provider>
                        <Typography variant='h6' sx={{ ...(adplatform === 'google' ? { color: 'primary.main' } : {}) }}>
                          Google Ads
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  {/* <Typography sx={{ mb: 3 }}>Account Currency</Typography> */}
                  <Grid item sm={2} xs={12}>
                    <Box
                      onClick={() => setCurrency('usd')}
                      sx={{
                        py: 3,
                        px: 4,
                        borderRadius: 1,
                        cursor: 'pointer',
                        ...(currency === 'usd' ? { ...bgColors.primaryLight } : { backgroundColor: 'action.hover' }),
                        border: theme =>
                          `1px solid ${currency === 'usd' ? theme.palette.primary.main : theme.palette.divider}`
                      }}
                    >
                      <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                        <Typography variant='h6' sx={{ ...(currency === 'usd' ? { color: 'primary.main' } : {}) }}>
                          USD
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  {/* <Grid item sm={2} xs={12}>
                    <Box
                      onClick={() => setCurrency('eur')}
                      sx={{
                        py: 3,
                        px: 4,
                        borderRadius: 1,
                        cursor: 'pointer',
                        ...(currency === 'eur' ? { ...bgColors.primaryLight } : { backgroundColor: 'action.hover' }),
                        border: theme =>
                          `1px solid ${currency === 'eur' ? theme.palette.primary.main : theme.palette.divider}`
                      }}
                    >
                      <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                        <Typography variant='h6' sx={{ ...(currency === 'eur' ? { color: 'primary.main' } : {}) }}>
                          EUR
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item sm={2} xs={12}>
                    <Box
                      onClick={() => setCurrency('try')}
                      sx={{
                        py: 3,
                        px: 4,
                        borderRadius: 1,
                        cursor: 'pointer',
                        ...(currency === 'try' ? { ...bgColors.primaryLight } : { backgroundColor: 'action.hover' }),
                        border: theme =>
                          `1px solid ${currency === 'try' ? theme.palette.primary.main : theme.palette.divider}`
                      }}
                    >
                      <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                        <Typography variant='h6' sx={{ ...(currency === 'try' ? { color: 'primary.main' } : {}) }}>
                          TRY
                        </Typography>
                      </Box>
                    </Box>
                  </Grid> */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label='Account Name'
                      placeholder='Account Name'
                      value={`test.com#${String(accountName).padStart(4, '0')}`}
                      // onChange={e => setAccountName(e.target.value)}
                      required
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id='invoice-status-select'>Time Zone</InputLabel>
                      <Select
                        fullWidth
                        value={timeZone}
                        sx={{ mr: 4, mb: 2 }}
                        label='Time Zone'
                        onChange={e => {
                          setTimeZone(e.target.value)
                        }}
                        labelId='invoice-status-select'
                      >
                        {Timezones_List.map(timezone => (
                          <MenuItem value={timezone.name}>{timezone.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label='Link'
                      placeholder='Website or App Store Link'
                      value={link}
                      onChange={e => setLink(e.target.value)}
                      required
                    />
                  </Grid>
                </Grid>
              ) : (
                <Grid container spacing={6}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label='BM ID'
                      placeholder='If you don`t have a BM, then contact us and we will get it for you'
                      value={bmId}
                      required
                      onChange={e => setBmid(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label='Faceboo Page link1'
                      placeholder='IF you don`t have facebook pages then reach out to us'
                      value={facebookPOne}
                      required
                      onChange={e => setFacebookPOne(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label='Faceboo Page link1'
                      placeholder='IF you don`t have facebook pages then reach out to us'
                      value={facebookPTwo}
                      required
                      onChange={e => setFacebookPTwo(e.target.value)}
                    />
                  </Grid>
                </Grid>
              )}
            </DialogContent>

            <DialogActions
              sx={{
                justifyContent: 'center',
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              {nextStep ? (
                <>
                  <Button variant='outlined' color='secondary' onClick={() => setNextStep(false)}>
                    Previous
                  </Button>
                  <Button
                    variant='contained'
                    sx={{ mr: 1 }}
                    onClick={createNewAcc}
                    disabled={!accountName || !timeZone || !link || !facebookPOne || !facebookPTwo || !bmId}
                  >
                    Submit
                  </Button>
                </>
              ) : (
                <Button
                  variant='contained'
                  sx={{ mr: 1 }}
                  disabled={!accountName || !timeZone || !link}
                  onClick={() => setNextStep(true)}
                >
                  Next
                </Button>
              )}
            </DialogActions>
          </Dialog>
          {/* top up */}
          <Dialog
            open={showTopUpModal}
            maxWidth='md'
            scroll='body'
            onClose={() => {
              setShowTopUpMpdal(false)
            }}
            // TransitionComponent={Transition}
            onBackdropClick={() => {
              setShowTopUpMpdal(false)
            }}
          >
            <DialogContent
              sx={{
                position: 'relative',
                pb: theme => `${theme.spacing(8)} !important`,
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              <IconButton
                size='small'
                onClick={() => {
                  setShowTopUpMpdal(false)
                }}
                sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
              >
                <Icon icon='bx:x' />
              </IconButton>
              <Box sx={{ mb: 8, textAlign: 'center' }}>
                <Typography variant='h5' sx={{ mb: 3 }}>
                  New Top Up
                </Typography>
              </Box>

              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='acc-select'>Add Account</InputLabel>
                    <Select
                      labelId='acc-select'
                      defaultValue={topUpParas.account}
                      label='Ad Account'
                      onChange={e =>
                        setTopUpParas({
                          ...topUpParas,
                          account: e.target.value
                        })
                      }
                      required
                    >
                      {store.data.map((acc, i) => (
                        <MenuItem value={acc._id}>{`test.com#${String(acc.name).padStart(4, '0')}`}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Amount'
                    placeholder='Amount'
                    value={topUpParas.amount}
                    onChange={e => {
                      setTopUpParas({
                        ...topUpParas,
                        amount: e.target.value
                      })
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={2}></Grid>
                <Grid item xs={4}>
                  <Typography sx={{ color: 'text.secondary', marginBottom: '15px' }}>
                    Top Up: <span style={{ color: 'white', float: 'right' }}>{topUpParas.amount}</span>
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', marginBottom: '15px' }}>
                    Fee(4%): <span style={{ color: 'white', float: 'right' }}>{topUpParas.amount * 0.04}</span>
                  </Typography>
                  <hr />
                  <Typography sx={{ color: 'text.secondary', marginBottom: '15px' }}>
                    Total:{' '}
                    <span style={{ color: 'white', float: 'right' }}>{(topUpParas.amount * 0.96).toFixed(1)}</span>
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions
              sx={{
                justifyContent: 'center',
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              <Button variant='outlined' color='secondary' onClick={() => setShowTopUpMpdal(false)}>
                Cancel
              </Button>
              <Button
                variant='contained'
                sx={{ mr: 1 }}
                onClick={continueTopUp}
                disabled={!topUpParas.amount || !topUpParas.account}
              >
                Continue
              </Button>
            </DialogActions>
          </Dialog>
          {/* make the transfer */}
          <Dialog
            open={isContinueToUp}
            maxWidth='md'
            scroll='body'
            onClose={() => {
              setIsContinueToUp(false)
            }}
            // TransitionComponent={Transition}
            onBackdropClick={() => {
              setIsContinueToUp(false)
            }}
          >
            <DialogContent
              sx={{
                position: 'relative',
                pb: theme => `${theme.spacing(8)} !important`,
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              <IconButton
                size='small'
                onClick={() => {
                  setShowTopUpMpdal(false)
                }}
                sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
              >
                <Icon icon='bx:x' />
              </IconButton>
              <Box sx={{ mb: 8, textAlign: 'center' }}>
                <Typography variant='h5' sx={{ mb: 3 }}>
                  Money transfer instructions
                </Typography>
              </Box>

              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <Typography sx={{ color: 'text.secondary', marginBottom: '15px' }}>
                    Write this in the payment description:
                    <span style={{ color: 'rgb(105 108 255)', float: 'right' }}>
                      {paymentCode}
                      <Tooltip title='Copy to clipboard'>
                        <IconButton
                          onClick={() => {
                            copyText(paymentCode)
                          }}
                          size='small'
                          sx={{ marginLeft: 1 }}
                        >
                          <FileCopyIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                    </span>
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', marginBottom: '15px' }}>
                    Receiver Name:
                    <span style={{ color: 'rgb(105 108 255)', float: 'right' }}>
                      {receiverName}
                      <Tooltip title='Copy to clipboard'>
                        <IconButton
                          onClick={() => {
                            copyText(receiverName)
                          }}
                          size='small'
                          sx={{ marginLeft: 1 }}
                        >
                          <FileCopyIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                    </span>
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', marginBottom: '15px' }}>
                    Account Number:
                    <span style={{ color: 'rgb(105 108 255)', float: 'right' }}>
                      {accNumber}
                      <Tooltip title='Copy to clipboard'>
                        <IconButton
                          onClick={() => {
                            copyText(accNumber)
                          }}
                          size='small'
                          sx={{ marginLeft: 1 }}
                        >
                          <FileCopyIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                    </span>
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', marginBottom: '15px' }}>
                    BIC:
                    <span style={{ color: 'rgb(105 108 255)', float: 'right' }}>
                      {swiftCode}
                      <Tooltip title='Copy to clipboard'>
                        <IconButton
                          onClick={() => {
                            copyText(swiftCode)
                          }}
                          size='small'
                          sx={{ marginLeft: 1 }}
                        >
                          <FileCopyIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                    </span>
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', marginBottom: '15px' }}>
                    Amount to send:{' '}
                    <span style={{ color: 'white', float: 'right' }}>${(topUpParas.amount * 0.96).toFixed(1)}</span>
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', marginBottom: '15px' }}>
                    Intermeiary BIC: <span style={{ color: 'white', float: 'right' }}>CHASGB2L</span>
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', marginBottom: '55px' }}>
                    Recipient Address:{' '}
                    <span style={{ color: 'white', float: 'right' }}>Parun Maantee 18, 10141, Tallinn, Estonia</span>
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', marginBottom: '15px' }}>
                    Bank Address: <span style={{ color: 'white', float: 'right' }}></span>
                  </Typography>

                  <Typography sx={{ color: 'text.secondary', marginBottom: '15px' }}>
                    Uproas deos not make a direct debit form your account. You can make a <br />
                    money transfer for Rockads via internet banking or your bank's mobile <br />
                    application. Make sure that the account to which the transfer is made <br />
                    belongs to your company
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions
              sx={{
                justifyContent: 'center',
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              <Button variant='outlined' color='secondary' onClick={() => setIsContinueToUp(false)}>
                Cancel
              </Button>
              <Button variant='contained' sx={{ mr: 1 }} onClick={makeTransfer}>
                I made the transfer
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default AdAccounts
