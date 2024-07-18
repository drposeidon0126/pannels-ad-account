/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = (role: string) => {
  if (role === 'client') return '/apps/ad-accounts'
  else return '/apps/admin/ad-accounts'
}

export default getHomeRoute
