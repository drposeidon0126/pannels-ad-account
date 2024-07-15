export type SignUpFormType = {
  username?: string
  email?: string
  password?: string
}

export type SignInFormType = {
  email?: string
  password?: string
}

// Form Handling Type
export type TargetValuesType = { name: string; value: string }
export type TargetType = { target: TargetValuesType }
