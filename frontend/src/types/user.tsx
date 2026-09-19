export type User = {
  id?: number
  email: string
  name: string
  password: string
  passwordConfirmation: string
  avatarImage: File | null
}

export type CuurentUser = {
  id: number
  name: string
  avatarImage: string | null
}
