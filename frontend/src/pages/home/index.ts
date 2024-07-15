import { useState, useEffect, MouseEvent } from 'react'
import { useRouter } from 'next/router'
// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Util Import
import getHomeRoute from 'src/layouts/components/acl/getHomeRoute'
const Home = () => {
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (auth.user && auth.user.role && router.route === '/') {
      const homeRoute = getHomeRoute(auth.user.role)
      router.replace(homeRoute)
    } else {
      router.replace('/login')
    }
  }, [auth.user, router])
}

export default Home
