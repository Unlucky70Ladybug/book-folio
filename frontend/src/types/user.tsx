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

// 読書傾向の比較APIで返るユーザー
export type ComparisonUser = {
  id: number
  name: string
  avatar_image: { url: string | null } | null
}

export type SimilarUser = {
  similar_users: ComparisonUser[]
  middle_users: ComparisonUser[]
  different_users: ComparisonUser[]
}
