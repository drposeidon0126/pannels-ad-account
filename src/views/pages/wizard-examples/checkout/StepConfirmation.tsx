// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import List, { ListProps } from '@mui/material/List'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const StyledList = styled(List)<ListProps>(({ theme }) => ({
  padding: 0,
  '& .MuiListItem-root': {
    padding: theme.spacing(3, 4),
    border: `1px solid ${theme.palette.divider}`,
    '&:first-of-type': {
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8
    },
    '&:last-of-type': {
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8
    },
    '&:not(:last-of-type)': {
      borderBottom: 0
    },
    '& .MuiListItemText-root': {
      marginTop: 0,
      marginBottom: theme.spacing(0.5),
      '& .MuiTypography-root': {
        color: theme.palette.text.secondary
      }
    },
    '& .remove-item': {
      top: '0.5rem',
      right: '0.625rem',
      position: 'absolute',
      color: theme.palette.text.disabled
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    },
    '& .MuiListItemAvatar-root': {
      display: 'flex',
      marginRight: theme.spacing(2)
    }
  }
}))

const HorizontalList = styled(List)<ListProps>(({ theme }) => ({
  padding: 0,
  marginTop: theme.spacing(2),
  display: 'flex',
  borderRadius: 6,
  border: `1px solid ${theme.palette.divider}`,
  '& .MuiListItem-root': {
    padding: theme.spacing(4, 5),
    '&:not(:last-of-type)': {
      borderRight: `1px solid ${theme.palette.divider}`
    }
  },
  [theme.breakpoints.down('md')]: {
    display: 'block',
    '& .MuiListItem-root': {
      '&:not(:last-of-type)': {
        borderRight: 0,
        borderBottom: `1px solid ${theme.palette.divider}`
      }
    }
  }
}))

const StepConfirmation = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box
          sx={{
            pt: 2,
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            px: { lg: 30, xs: 6 },
            flexDirection: 'column'
          }}
        >
          <Typography variant='h6' sx={{ mb: 2.5, fontSize: '1.375rem !important' }}>
            Thank You! 😇
          </Typography>
          <Typography sx={{ mb: 2.5, color: 'text.secondary' }}>
            Your order{' '}
            <Box
              href='/'
              component={Link}
              onClick={e => e.preventDefault()}
              sx={{ color: 'primary.main', textDecoration: 'none' }}
            >
              #1536548131
            </Box>{' '}
            has been placed!
          </Typography>
          <Typography sx={{ mb: 2.5, color: 'text.secondary' }}>
            We sent an email to{' '}
            <Box
              href='/'
              component={Link}
              onClick={e => e.preventDefault()}
              sx={{ color: 'primary.main', textDecoration: 'none' }}
            >
              john.doe@example.com
            </Box>{' '}
            with your order confirmation and receipt. If the email hasn't arrived within two minutes, please check your
            spam folder to see if the email was routed there.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
            <Icon icon='bx:time-five' fontSize={20} />
            <Typography sx={{ ml: 1.5, color: 'text.secondary' }}>
              <Box component='span' sx={{ fontWeight: 600 }}>
                Time placed:
              </Box>{' '}
              25/05/2020 13:35pm
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <HorizontalList>
          <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Box sx={{ mr: 1, display: 'flex', color: 'text.secondary' }}>
                <Icon icon='bx:map' fontSize={20} />
              </Box>
              <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>Shipping</Typography>
            </Box>
            <Typography sx={{ color: 'text.secondary' }}>John Doe</Typography>
            <Typography sx={{ color: 'text.secondary' }}>4135 Parkway Street,</Typography>
            <Typography sx={{ color: 'text.secondary' }}>Los Angeles, CA 90017,</Typography>
            <Typography sx={{ color: 'text.secondary' }}>USA</Typography>
            <Typography sx={{ color: 'text.secondary' }}>+123456789</Typography>
          </ListItem>
          <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Box sx={{ mr: 1, display: 'flex', color: 'text.secondary' }}>
                <Icon icon='bx:credit-card' fontSize={20} />
              </Box>
              <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>Billing Address</Typography>
            </Box>
            <Typography sx={{ color: 'text.secondary' }}>John Doe</Typography>
            <Typography sx={{ color: 'text.secondary' }}>4135 Parkway Street,</Typography>
            <Typography sx={{ color: 'text.secondary' }}>Los Angeles, CA 90017,</Typography>
            <Typography sx={{ color: 'text.secondary' }}>USA</Typography>
            <Typography sx={{ color: 'text.secondary' }}>+123456789</Typography>
          </ListItem>
          <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Box sx={{ mr: 1, display: 'flex', color: 'text.secondary' }}>
                <Icon icon='bx:train' fontSize={20} />
              </Box>
              <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>Shipping Method</Typography>
            </Box>
            <Typography sx={{ color: 'text.secondary' }}>Preferred Method:</Typography>
            <Typography sx={{ color: 'text.secondary' }}>Standard Delivery</Typography>
            <Typography sx={{ color: 'text.secondary' }}>(Normally 3-4 business days)</Typography>
          </ListItem>
        </HorizontalList>
      </Grid>
      <Grid item xs={12} md={8} xl={9}>
        <StyledList>
          <ListItem>
            <ListItemAvatar>
              <img width={80} src='/images/products/google-home.png' alt='Google Home' />
            </ListItemAvatar>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={8}>
                <ListItemText primary='Google - Google Home - White' />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ mr: 1, color: 'text.disabled' }}>Sold By:</Typography>
                  <Typography
                    href='/'
                    component={Link}
                    onClick={e => e.preventDefault()}
                    sx={{ mr: 2.5, color: 'primary.main', textDecoration: 'none' }}
                  >
                    Google
                  </Typography>
                  <CustomChip rounded size='small' skin='light' color='success' label='In Stock' />
                </Box>
              </Grid>
              <Grid
                item
                sm={4}
                xs={12}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}
              >
                <Typography sx={{ color: 'primary.main' }}>$299</Typography>
                <Typography sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>/$359</Typography>
              </Grid>
            </Grid>
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <img width={80} src='/images/products/iphone-11.png' alt='iphone 11' />
            </ListItemAvatar>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={8}>
                <ListItemText primary='Apple iPhone 11 (64GB, Black)' />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ mr: 1, color: 'text.disabled' }}>Sold By:</Typography>
                  <Typography
                    href='/'
                    component={Link}
                    onClick={e => e.preventDefault()}
                    sx={{ mr: 2.5, color: 'primary.main', textDecoration: 'none' }}
                  >
                    Apple
                  </Typography>
                  <CustomChip rounded size='small' skin='light' color='success' label='In Stock' />
                </Box>
              </Grid>
              <Grid
                item
                sm={4}
                xs={12}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}
              >
                <Typography sx={{ color: 'primary.main' }}>$899</Typography>
                <Typography sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>/$999</Typography>
              </Grid>
            </Grid>
          </ListItem>
        </StyledList>
      </Grid>
      <Grid item xs={12} md={4} xl={3}>
        <Box sx={{ mb: 4, borderRadius: 1, border: theme => `1px solid ${theme.palette.divider}` }}>
          <CardContent sx={{ p: theme => `${theme.spacing(4)} !important` }}>
            <Typography sx={{ mb: 3.5, fontWeight: 600, color: 'text.secondary' }}>Price Details</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box
                sx={{
                  gap: 2,
                  mb: 2.5,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography sx={{ color: 'text.secondary' }}>Order Total</Typography>
                <Typography sx={{ color: 'text.secondary' }}>$1198.00</Typography>
              </Box>
              <Box
                sx={{
                  gap: 2,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography sx={{ color: 'text.secondary' }}>Delivery Charges</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography sx={{ mr: 1.5, textDecoration: 'line-through', color: 'text.disabled' }}>
                    $5.00
                  </Typography>
                  <CustomChip rounded size='small' skin='light' color='success' label='Free' />
                </Box>
              </Box>
            </Box>
          </CardContent>
          <Divider sx={{ m: '0 !important' }} />
          <CardContent sx={{ py: theme => `${theme.spacing(3.5)} !important` }}>
            <Box
              sx={{ gap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Typography sx={{ fontWeight: 700, color: 'text.secondary' }}>Total</Typography>
              <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>$1198.00</Typography>
            </Box>
          </CardContent>
        </Box>
      </Grid>
    </Grid>
  )
}

export default StepConfirmation
