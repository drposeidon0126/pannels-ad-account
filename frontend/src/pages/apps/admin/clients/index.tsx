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
import EditIcon from '@mui/icons-material/Edit'
import DialogTitle from '@mui/material/DialogTitle'

import DialogContentText from '@mui/material/DialogContentText'
// ** Third Party Imports
import format from 'date-fns/format'
import useBgColor, { UseBgColorType } from 'src/@core/hooks/useBgColor'
import toast, { ToastBar } from 'react-hot-toast'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import { Tooltip } from '@mui/material'
import axios from 'axios'
// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { getUsers, addUser, deleteUser, upateUser } from 'src/store/apps/user'
// ** Types Imports
import { RootState, AppDispatch, store } from 'src/store'
import { ThemeColor } from 'src/@core/layouts/types'
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
import { UsersType } from 'src/types/apps/userTypes'

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
  row: UsersType
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
const renderClient = (row: UsersType) => {
  if (row?.profile_image) {
    return <CustomAvatar src={row.avatar} sx={{ mr: 3, width: 30, height: 30 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={'info' as ThemeColor}
        sx={{ mr: 3, width: 30, height: 30, fontSize: '.8rem', lineHeight: 1.5 }}
      >
        {getInitials(row.username || 'John Doe')}
      </CustomAvatar>
    )
  }
}

const defaultColumns: GridColDef[] = [
  {
    flex: 0.3,
    minWidth: 300,
    field: 'name',
    headerName: 'Name',
    renderCell: ({ row }: CellType) => {
      const { username, email } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>{username}</Typography>
            <Typography noWrap variant='caption' sx={{ color: 'text.disabled' }}>
              {email}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.3,
    minWidth: 300,
    field: 'phonenumber',
    headerName: 'Phone Number',
    renderCell: ({ row }: CellType) => (
      <Typography sx={{ color: 'text.secondary' }}>{`${row.phonenumber || ''}`}</Typography>
    )
  },

  {
    flex: 0.2,
    minWidth: 125,
    field: 'companyanme',
    headerName: 'Company Name',
    renderCell: ({ row }: CellType) => (
      <Typography sx={{ color: 'text.secondary' }}>{`${row.companyanme || ''}`}</Typography>
    )
  },
  {
    flex: 0.3,
    minWidth: 300,
    field: 'country',
    headerName: 'Country/Region',
    renderCell: ({ row }: CellType) => (
      <Typography sx={{ color: 'text.secondary' }}>{`${row.country || ''}`}</Typography>
    )
  },

  {
    flex: 0.2,
    minWidth: 125,
    field: 'role',
    headerName: 'STATUS',
    renderCell: ({ row }: CellType) => {
      return row.role === 'client' ? (
        <CustomChip rounded size='small' skin='light' color='success' label='Client' style={{ cursor: 'pointer' }} />
      ) : (
        <CustomChip rounded size='small' skin='light' color='warning' label='Lead' style={{ cursor: 'pointer' }} />
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

const ClientsList = () => {
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
  const [accountName, setAccountName] = useState<string>('')
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
  const store = useSelector((state: RootState) => state.user)
  const auth = useAuth()
  const { push } = useRouter()
  //*edit
  const [showEdit, setShowEdit] = useState<boolean>(false)
  const [userData, setUserData] = useState<any>({
    _id: '',
    username: '',
    email: '',
    password: '',
    role: 'lead',
    phonenumber: '',
    companyanme: '',
    country: '',
    monthlyadspend: '',
    goals: '',
    adplatformt: ''
  })
  //delete confirm modal
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false)
  const [seletedAcc, setSelectedAcc] = useState<string>('')

  useEffect(() => {
    dispatch(
      getUsers({
        q: value
      })
    )
  }, [dispatch, value])

  const createNewUser = () => {
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if (!userData.username) {
      toast.error('Full Name is required.')
    } else if (userData.email?.trim().length === 0 || !userData.email?.trim().match(mailFormat)) {
      toast.error('Please enter Email correctly.')
    } else if (!userData.companyanme) {
      toast.error('Company Name is required.')
    } else if (!userData.country) {
      toast.error('Country/Region is required.')
    } else {
      const payload = {
        username: userData.username,
        email: userData.email,
        role: userData.role,
        password: userData.password,
        phonenumber: userData.phonenumber,
        companyanme: userData.companyanme,
        country: userData.country,
        monthlyadspend: userData.monthlyadspend,
        goals: userData.goals,
        adplatformt: userData.adplatformt
      }
      dispatch(addUser(payload))
      setShow(false)
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

  const deleteClient = (id: string) => {
    setOpenConfirmModal(false)
    dispatch(deleteUser(id))
  }
  const editUser = (user: any) => {
    setUserData({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      password: user.password,
      phonenumber: user.phonenumber,
      companyanme: user.companyanme,
      country: user.country,
      monthlyadspend: user.monthlyadspend,
      goals: user.goals,
      adplatformt: user.adplatformt
    })
    setShowEdit(true)
  }

  const updateClient = () => {
    dispatch(upateUser(userData))
    setUserData({
      _id: '',
      username: '',
      email: '',
      password: '',
      role: 'lead',
      phonenumber: '',
      companyanme: '',
      country: '',
      monthlyadspend: '',
      goals: '',
      adplatformt: ''
    })
    setShowEdit(false)
  }

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Delete'>
            <IconButton
              size='small'
              onClick={() => {
                setSelectedAcc(row._id)
                setOpenConfirmModal(true)
              }}
            >
              <Icon icon='bx:trash-alt' fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Edit'>
            <IconButton size='small' onClick={() => editUser(row)}>
              <EditIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

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
                  placeholder='Search clients...'
                  onChange={e => handleFilter(e.target.value)}
                />
                <Button
                  sx={{ mb: 2, float: 'right' }}
                  component={Link}
                  onClick={() => setShow(true)}
                  variant='contained'
                  href=''
                >
                  Add User +
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
              getRowId={row => row._id}
            />
          </Card>
          {/* create ad */}
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
                  Add New Client
                </Typography>
              </Box>

              <Grid container spacing={6}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Full Name'
                    placeholder='John Doe'
                    value={userData.username}
                    onChange={e =>
                      setUserData({
                        ...userData,
                        username: e.target.value
                      })
                    }
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Phone Number'
                    placeholder='+2332343343'
                    value={userData.phonenumber}
                    onChange={e =>
                      setUserData({
                        ...userData,
                        phonenumber: e.target.value
                      })
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='invoice-status-select'>Status</InputLabel>
                    <Select
                      fullWidth
                      value={userData.role}
                      sx={{ mr: 4, mb: 2 }}
                      label='Status'
                      onChange={e => {
                        if (e.target.value === 'lead') {
                          setUserData({
                            ...userData,
                            role: e.target.value
                          })
                        } else {
                          setUserData({
                            ...userData,
                            role: e.target.value,
                            password: '123123123'
                          })
                        }
                      }}
                      labelId='invoice-status-select'
                    >
                      <MenuItem value='lead'>Lead</MenuItem>
                      <MenuItem value='client'>Client</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='Email'
                    placeholder='client@test.com'
                    value={userData.email}
                    onChange={e =>
                      setUserData({
                        ...userData,
                        email: e.target.value
                      })
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='Company Name'
                    placeholder='Company Name'
                    value={userData.companyanme}
                    onChange={e =>
                      setUserData({
                        ...userData,
                        companyanme: e.target.value
                      })
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='Country/Region'
                    placeholder='Country/Region'
                    value={userData.country}
                    onChange={e =>
                      setUserData({
                        ...userData,
                        country: e.target.value
                      })
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='Monthly Advertising Spend'
                    placeholder='Monthly Advertising Spend'
                    value={userData.monthlyadspend}
                    onChange={e =>
                      setUserData({
                        ...userData,
                        monthlyadspend: e.target.value
                      })
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='invoice-status-select'>Advertising Platform</InputLabel>
                    <Select
                      fullWidth
                      value={userData.adplatformt}
                      sx={{ mr: 4, mb: 2 }}
                      label='Advertising Platform'
                      onChange={e =>
                        setUserData({
                          ...userData,
                          adplatformt: e.target.value
                        })
                      }
                      labelId='invoice-status-select'
                      required
                    >
                      <MenuItem value='meta'>Meta</MenuItem>
                      <MenuItem value='tiktok'>TikTok</MenuItem>
                      <MenuItem value='google'>Google</MenuItem>
                    </Select>
                  </FormControl>
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
              <Button variant='outlined' color='secondary' onClick={() => setShow(false)}>
                Cancle
              </Button>
              <Button
                variant='contained'
                sx={{ mr: 1 }}
                onClick={createNewUser}
                disabled={
                  !userData.username ||
                  !userData.phonenumber ||
                  !userData.role ||
                  !userData.email ||
                  !userData.companyanme ||
                  !userData.country ||
                  !userData.monthlyadspend ||
                  !userData.adplatformt
                }
              >
                Add User
              </Button>
            </DialogActions>
          </Dialog>
          {/* edit ad */}
          <Dialog
            fullWidth
            open={showEdit}
            maxWidth='md'
            scroll='body'
            onClose={() => {
              setShowEdit(false)
            }}
            // TransitionComponent={Transition}
            onBackdropClick={() => {
              setShowEdit(false)
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
                  setShowEdit(false)
                }}
                sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
              >
                <Icon icon='bx:x' />
              </IconButton>
              <Box sx={{ mb: 8, textAlign: 'center' }}>
                <Typography variant='h5' sx={{ mb: 3 }}>
                  Edit Client
                </Typography>
              </Box>

              <Grid container spacing={6}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Full Name'
                    placeholder='John Doe'
                    value={userData.username}
                    onChange={e =>
                      setUserData({
                        ...userData,
                        username: e.target.value
                      })
                    }
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Phone Number'
                    placeholder='+2332343343'
                    value={userData.phonenumber}
                    onChange={e =>
                      setUserData({
                        ...userData,
                        phonenumber: e.target.value
                      })
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='invoice-status-select'>Status</InputLabel>
                    <Select
                      fullWidth
                      value={userData.role}
                      sx={{ mr: 4, mb: 2 }}
                      label='Status'
                      onChange={e => {
                        if (e.target.value === 'lead') {
                          setUserData({
                            ...userData,
                            role: e.target.value
                          })
                        } else {
                          setUserData({
                            ...userData,
                            role: e.target.value,
                            password: '123123123'
                          })
                        }
                      }}
                      labelId='invoice-status-select'
                      required
                    >
                      <MenuItem value='lead'>Lead</MenuItem>
                      <MenuItem value='client'>Client</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='Email'
                    placeholder='client@test.com'
                    value={userData.email}
                    onChange={e =>
                      setUserData({
                        ...userData,
                        email: e.target.value
                      })
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='Company Name'
                    placeholder='Company Name'
                    value={userData.companyanme}
                    onChange={e =>
                      setUserData({
                        ...userData,
                        companyanme: e.target.value
                      })
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='Country/Region'
                    placeholder='Country/Region'
                    value={userData.country}
                    onChange={e =>
                      setUserData({
                        ...userData,
                        country: e.target.value
                      })
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='Monthly Advertising Spend'
                    placeholder='Monthly Advertising Spend'
                    value={userData.monthlyadspend}
                    onChange={e =>
                      setUserData({
                        ...userData,
                        monthlyadspend: e.target.value
                      })
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='invoice-status-select'>Advertising Platform</InputLabel>
                    <Select
                      fullWidth
                      value={userData.adplatformt}
                      sx={{ mr: 4, mb: 2 }}
                      label='Advertising Platform'
                      onChange={e =>
                        setUserData({
                          ...userData,
                          adplatformt: e.target.value
                        })
                      }
                      labelId='invoice-status-select'
                      required
                    >
                      <MenuItem value='meta'>Meta</MenuItem>
                      <MenuItem value='tiktok'>TikTok</MenuItem>
                      <MenuItem value='google'>Google</MenuItem>
                    </Select>
                  </FormControl>
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
              <Button variant='outlined' color='secondary' onClick={() => setShowEdit(false)}>
                Cancle
              </Button>
              <Button
                variant='contained'
                sx={{ mr: 1 }}
                onClick={updateClient}
                disabled={
                  !userData.username ||
                  !userData.phonenumber ||
                  !userData.role ||
                  !userData.email ||
                  !userData.companyanme ||
                  !userData.country ||
                  !userData.monthlyadspend ||
                  !userData.adplatformt
                }
              >
                Update
              </Button>
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
                    >
                      {store.data.map((acc, i) => (
                        <MenuItem value={acc._id}>{acc.name}</MenuItem>
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
                    onChange={e =>
                      setTopUpParas({
                        ...topUpParas,
                        amount: e.target.value
                      })
                    }
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
              <Button variant='contained' sx={{ mr: 1 }} onClick={continueTopUp}>
                Continue
              </Button>
              <Button variant='outlined' color='secondary' onClick={() => setShowTopUpMpdal(false)}>
                Cancel
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
                    Swift Code:
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
                    Bank Address: <span style={{ color: 'white', float: 'right' }}>TURKIYEGARANTIBANKASIA.S</span>
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', marginBottom: '55px' }}>
                    Wise Address: <span style={{ color: 'white', float: 'right' }}>Rockads Reklam Anonim Sirketi</span>
                  </Typography>

                  <Typography sx={{ color: 'text.secondary', marginBottom: '15px' }}>
                    Rockads deos not make a direct debit form your account. You can make a <br />
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
              <Button variant='contained' sx={{ mr: 1 }} onClick={makeTransfer}>
                I made the transfer
              </Button>
              <Button variant='outlined' color='secondary' onClick={() => setIsContinueToUp(false)}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
          {/* confirm dialog */}
          <Dialog
            open={openConfirmModal}
            disableEscapeKeyDown
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
            onClose={(event, reason) => {
              if (reason !== 'backdropClick') {
                setOpenConfirmModal(false)
              }
            }}
          >
            <DialogContent>
              <DialogContentText id='alert-dialog-description'>Are you sure to remove this user?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button variant='outlined' color='secondary' onClick={() => setOpenConfirmModal(false)}>
                Disagree
              </Button>
              <Button variant='contained' onClick={() => deleteClient(seletedAcc)}>
                Agree
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default ClientsList
