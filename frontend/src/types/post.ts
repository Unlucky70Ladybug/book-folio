import { type User } from './user'
import { type BookshelfPost } from './bookshelf'
import { type Genre } from './genre'

export type Post = {
  id: number
  content: string
  has_spoiler: boolean | null
}

export type CreatePostParams = {
  content: string
  has_spoiler: boolean | null
}

type Posts = {
  user: User
  genres: Genre[]
  post: Post
}

export type PostsResponse = {
  current_user_info: BookshelfPost | null
  posts: Posts[] | null
  post_count: number
  
}

export const EMPTY_POST_DRAFT: CreatePostParams = { content: '', has_spoiler: null }

// コメント未登録(null)のときは空の入力値にする
export const toPostDraft = (post: Post | null): CreatePostParams =>
  post ? { content: post.content, has_spoiler: post.has_spoiler } : EMPTY_POST_DRAFT
