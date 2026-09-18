export type User = {
  id?: number
  email: string
  name: string
  password: string
  passwordConfirmation: string
  avatar_image: { url? : string | null}
}
