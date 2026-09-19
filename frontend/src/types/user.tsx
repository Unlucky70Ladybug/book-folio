export type User = {
  id?: number
  email: string
  name: string
  password: string
  passwordConfirmation: string
  avatarImage: File | null
}
