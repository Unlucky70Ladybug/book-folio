import { type User } from './user'

export type RelationshipStats = {
  following: User[]
  followers: User[]
  follow_status?: null
}
