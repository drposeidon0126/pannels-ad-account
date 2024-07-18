// ** React Imports
import { useState, useEffect, forwardRef } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
import Button from '@mui/material/Button'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Dialog from '@mui/material/Dialog'

// ** Third Party Imports
import { format, parseISO } from 'date-fns'
import { enGB } from 'date-fns/locale'
import { addHours } from 'date-fns'
import DatePicker from 'react-datepicker'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import FileCopyIcon from '@mui/icons-material/FileCopy'
// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { getMyTopup, CreateMyTopUp } from 'src/store/apps/balance'
import { useAuth } from 'src/hooks/useAuth'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { ThemeColor } from 'src/@core/layouts/types'
import { BalanceType } from 'src/types/apps/balanceType'
import { DateType } from 'src/types/forms/reactDatepickerTypes'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import apiConfig from 'src/configs/env'
import axios from 'axios'
// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'
import TableHeader from 'src/views/apps/invoice/list/TableHeader'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

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
  row: BalanceType
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
const renderClient = (row: BalanceType) => {
  if (row.avatar.length) {
    return <CustomAvatar src={row.avatar} sx={{ mr: 3, width: 30, height: 30 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={(row.avatarColor as ThemeColor) || ('primary' as ThemeColor)}
        sx={{ mr: 3, width: 30, height: 30, fontSize: '.8rem', lineHeight: 1.5 }}
      >
        {getInitials(row.name || 'John Doe')}
      </CustomAvatar>
    )
  }
}

const formatDate = dateString => {
  const date = parseISO(dateString)
  const gmt3Date = addHours(date, 3)
  return format(gmt3Date, 'd MMMM yyyy', { locale: enGB })
}

const defaultColumns: GridColDef[] = [
  {
    flex: 0.1,
    field: 'id',
    minWidth: 80,
    headerName: 'INVOICE',
    renderCell: ({ row }: CellType) => (
      <LinkStyled href={`/apps/invoice/preview/${row.invoiceId}`}>{`#${row.invoiceId}`}</LinkStyled>
    )
  },
  // {
  //   flex: 0.1,
  //   minWidth: 80,
  //   field: 'invoiceStatus',
  //   renderHeader: () => <Icon icon='bx:trending-up' fontSize={20} />,
  //   renderCell: ({ row }: CellType) => {
  //     const { dueDate, balance, invoiceStatus } = row

  //     const color = invoiceStatusObj[invoiceStatus] ? invoiceStatusObj[invoiceStatus].color : 'primary'

  //     return (
  //       <Tooltip
  //         title={
  //           <div>
  //             <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
  //               {invoiceStatus}
  //             </Typography>
  //             <br />
  //             <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
  //               Balance:
  //             </Typography>{' '}
  //             {balance}
  //             <br />
  //             <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
  //               Due Date:
  //             </Typography>{' '}
  //             {dueDate}
  //           </div>
  //         }
  //       >
  //         <CustomAvatar skin='light' color={color} sx={{ width: 30, height: 30 }}>
  //           <Icon fontSize='1rem' icon={invoiceStatusObj[invoiceStatus].icon} />
  //         </CustomAvatar>
  //       </Tooltip>
  //     )
  //   }
  // },
  {
    flex: 0.3,
    field: 'adacc',
    minWidth: 300,
    headerName: 'AD ACCOUNT',
    renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{`${row.accountName}`}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'total',
    headerName: 'Total',
    renderCell: ({ row }: CellType) => (
      <Typography sx={{ color: 'text.secondary' }}>{`$${row.total.toFixed(1) || 0}`}</Typography>
    )
  },
  {
    flex: 0.2,
    minWidth: 125,
    field: 'issuedDate',
    headerName: 'Issued Date',
    renderCell: ({ row }: CellType) => (
      <Typography sx={{ color: 'text.secondary' }}>{formatDate(row.update_at)}</Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'balance',
    headerName: 'Balance',

    renderCell: ({ row }: CellType) => {
      return row.status !== 'Paid' ? (
        <CustomChip rounded size='small' skin='light' color='warning' label='PENDING' style={{ cursor: 'pointer' }} />
      ) : (
        <CustomChip rounded size='small' skin='light' color='success' label='PAID' style={{ cursor: 'pointer' }} />
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

const AdBalances = () => {
  // ** State
  const [dates, setDates] = useState<Date[]>([])
  const [value, setValue] = useState<string>('')
  const [statusValue, setStatusValue] = useState<string>('')
  const [endDateRange, setEndDateRange] = useState<DateType>(null)
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [startDateRange, setStartDateRange] = useState<DateType>(null)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
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
  const [accounts, setAccounts] = useState([])
  const [createdTopUp, setCreatedTopUp] = useState<boolean>(false)
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.balance)
  const auth = useAuth()

  useEffect(() => {
    dispatch(
      getMyTopup({
        q: value,
        userId: auth.user._id
      })
    )
    setCreatedTopUp(false)
  }, [dispatch, value, createdTopUp])

  useEffect(() => {
    const API = apiConfig.API
    axios.get(`${API}/api/balances/`, {}).then(res => {
      if (res.data.balances.length > 0) {
        setPaymentCode(res.data.balances[res.data.balances.length - 1].paymentCode + 1)
      }
    })
    axios.get(`${API}/api/accounts/${auth.user._id}`, {}).then(res => {
      if (res.data.accounts.length > 0) {
        setAccounts(res.data.accounts)
      }
    })
  }, [])

  const handleFilter = (val: string) => {
    setValue(val)
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
    const acc = accounts.filter(row => row._id === topUpParas.account)
    const payload = {
      accountId: topUpParas.account,
      accountName: acc[0].name,
      total: topUpParas.amount * 0.96,
      userId: auth.user._id,
      paymentCode: paymentCode
    }
    dispatch(CreateMyTopUp(payload))
    setCreatedTopUp(true)

    setIsContinueToUp(false)
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

  const columns: GridColDef[] = [...defaultColumns]

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}></Grid>
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
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                  size='small'
                  value={value}
                  sx={{ mr: 4, mb: 2 }}
                  placeholder='Search...'
                  onChange={e => handleFilter(e.target.value)}
                />
                <Button
                  sx={{ mb: 2 }}
                  component={Link}
                  variant='contained'
                  href='#'
                  onClick={() => {
                    setShowTopUpMpdal(true)
                  }}
                >
                  + Request Top Up
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
                      {accounts.map((acc, i) => (
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
              <Button
                variant='contained'
                sx={{ mr: 1 }}
                onClick={continueTopUp}
                disabled={!topUpParas.amount || !topUpParas.account}
              >
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
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default AdBalances
