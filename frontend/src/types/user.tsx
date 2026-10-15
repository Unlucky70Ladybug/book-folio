export type UserInfo = {
  id?: number
  email: string
  name: string
  password: string
  passwordConfirmation: string
  avatarImage: File | null
}

export type User = {
  id: number
  name: string
  avatarImage: string | null
}

export type SimilarUser = {
  similar_users: User | null
  middle_users: User | null
  different_users: User | null
}
