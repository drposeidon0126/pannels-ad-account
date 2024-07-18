// ** React Imports
import { useState, ReactNode, MouseEvent } from 'react'
import { signIn } from 'next-auth/react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import FormControlLabel from '@mui/material/FormControlLabel'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import AuthIllustrationWrapper from 'src/views/pages/auth/AuthIllustrationWrapper'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import useBgColor, { UseBgColorType } from 'src/@core/hooks/useBgColor'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Styled Components
const LoginIllustration = styled('img')({
  height: 'auto',
  maxWidth: '100%'
})

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(6),
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('lg')]: {
    maxWidth: 480
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 635
  },
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(12)
  }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(5).required()
})

const defaultValues = {
  password: '',
  email: ''
}

interface FormData {
  email: string
  password: string
}

const LoginPage = () => {
  const [rememberMe, setRememberMe] = useState<boolean>(true)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()
  const { settings } = useSettings()
  const bgColors: UseBgColorType = useBgColor()
  const hidden = useMediaQuery(theme.breakpoints.down('lg'))

  // ** Var
  const { skin } = settings

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: FormData) => {
    const { email, password } = data
    auth.login({ email, password, rememberMe }, () => {
      setError('email', {
        type: 'manual',
        message: 'Email or Password is invalid'
      })
    })
  }

  return (
    <Box className='content-center'>
      {/* {!hidden ? (
        <Box sx={{ p: 12, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LoginIllustration
            width={700}
            alt='login-illustration'
            src={`/images/pages/boy-with-rocket-${theme.palette.mode}.png`}
          />
        </Box>
      ) : null} */}
      <AuthIllustrationWrapper>
        <Card>
          <CardContent sx={{ p: `${theme.spacing(8, 8, 7)} !important` }}>
            <Box sx={{ mx: 'auto', maxWidth: 400 }}>
              <Box sx={{ mb: 8, display: 'flex', alignItems: 'center' }}>
                <img src='/images/uproas-logo-white1.svg' style={{ width: '70%' }} />

                {/* <Typography
                  variant='h5'
                  sx={{
                    ml: 2,
                    lineHeight: 1,
                    fontWeight: 700,
                    letterSpacing: '-0.45px',
                    textTransform: 'lowercase',
                    fontSize: '1.75rem !important'
                  }}
                >
                  {themeConfig.templateName}
                </Typography> */}
              </Box>
              <Typography variant='h6' sx={{ mb: 1.5 }}>
                Log in to {themeConfig.templateName}! 👋🏻
              </Typography>
              {/* <Typography sx={{ mb: 6, color: 'text.secondary' }}>
                Rockads is not platform. It is a focused partner to grow your business
              </Typography> */}

              <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name='email'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        autoFocus
                        label='Email'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.email)}
                        placeholder='admin@test.com'
                      />
                    )}
                  />
                  {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                    Password
                  </InputLabel>
                  <Controller
                    name='password'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <OutlinedInput
                        value={value}
                        onBlur={onBlur}
                        label='Password'
                        onChange={onChange}
                        id='auth-login-v2-password'
                        error={Boolean(errors.password)}
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <Icon fontSize={20} icon={showPassword ? 'bx:show' : 'bx:hide'} />
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    )}
                  />
                  {errors.password && (
                    <FormHelperText sx={{ color: 'error.main' }} id=''>
                      {errors.password.message}
                    </FormHelperText>
                  )}
                </FormControl>
                <Box
                  sx={{
                    mb: 4,
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between'
                  }}
                >
                  <FormControlLabel
                    label='Remember Me'
                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem', color: 'text.secondary' } }}
                    control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
                  />
                  <LinkStyled href='/forgot-password'>Forgot Password?</LinkStyled>
                </Box>
                <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 4 }}>
                  Sign in
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Typography variant='body2' sx={{ mr: 2 }}>
                    New on our platform?
                  </Typography>
                  <Typography>
                    <LinkStyled href='/register'>Create an account</LinkStyled>
                  </Typography>
                </Box>
                <Divider sx={{ my: `${theme.spacing(6)} !important` }}>or</Divider>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* <IconButton
                    href='/'
                    component={Link}
                    sx={{ color: '#497ce2' }}
                    onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                  >
                    <Icon icon='bxl:facebook-circle' />
                  </IconButton>
                  <IconButton
                    href='/'
                    component={Link}
                    sx={{ color: '#1da1f2' }}
                    onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                  >
                    <Icon icon='bxl:twitter' />
                  </IconButton>
                  <IconButton
                    href='/'
                    component={Link}
                    onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                    sx={{ color: theme.palette.mode === 'light' ? '#272727' : 'grey.300' }}
                  >
                    <Icon icon='bxl:github' />
                  </IconButton> */}
                  <IconButton
                    href='/'
                    component={Link}
                    sx={{ color: '#db4437' }}
                    onClick={(e: MouseEvent<HTMLElement>) => {
                      e.preventDefault()
                      signIn('google')
                    }}
                  >
                    <Icon icon='bxl:google' />
                  </IconButton>
                </Box>
              </form>
            </Box>
          </CardContent>
        </Card>
      </AuthIllustrationWrapper>
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginPage.guestGuard = true

export default LoginPage
