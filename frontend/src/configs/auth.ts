export default {
  meEndpoint: 'http://localhost:5000/api/users/me',
  loginEndpoint: 'http://localhost:5000/api/users/login',
  registerEndpoint: 'http://localhost:5000/api/users',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
