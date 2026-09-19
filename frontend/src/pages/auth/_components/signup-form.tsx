import React, { useEffect, useState } from 'react'
import { type User } from '../../../types/user'
import defaultUserImage from '../../../assets/default_user_image.png'

type SignUpFormProps = {
  formData: User
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onAvatarChange: (file: File | null) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export default function SignUpForm({
  formData,
  onChange,
  onAvatarChange,
  onSubmit,
}: SignUpFormProps) {
  const [avatarImage, setAvatarImage] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>(defaultUserImage)

  useEffect(() => {
    if (!avatarImage) {
      setAvatarPreview(defaultUserImage)
      return
    }
    const objectUrl = URL.createObjectURL(avatarImage)
    setAvatarPreview(objectUrl)

    // useEffect終了後 URL.revokeObjectURL(objectUrl)を実行
    // URL.revokeObjectURL(objectUrl)を使用して、
    return () => URL.revokeObjectURL(objectUrl)
  }, [avatarImage])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setAvatarImage(file)
    onAvatarChange(file)
  }

  return (
    <form
      onSubmit={onSubmit}
      className="card my-8 w-full border border-base-300 bg-base-100 shadow-lg"
    >
      <div className="card-body gap-4">
        <fieldset className="fieldset items-center">
          <legend className="fieldset-legend">ユーザーアイコン</legend>
          <div className="avatar">
            <div className="w-24 rounded-full">
              <img src={avatarPreview} alt="ユーザーアイコンのプレビュー" />
            </div>
          </div>
          <input
            id="avatar_image"
            type="file"
            name="avatar_image"
            accept="image/*"
            onChange={handleAvatarChange}
            className="file-input file-input-primary mt-2 w-full"
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">名前</legend>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="山田 太郎"
            value={formData.name}
            onChange={onChange}
            required
            className="input input-primary w-full"
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">メールアドレス</legend>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={onChange}
            required
            className="input input-secondary w-full"
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">パスワード</legend>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="8文字以上で入力してください"
            value={formData.password}
            onChange={onChange}
            required
            className="input input-accent w-full"
          />
          {formData.password.length < 8 && (
            <p className="fieldset-label text-error">※8文字以上で入力してください</p>
          )}
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">パスワード（確認）</legend>
          <input
            id="passwordConfirmation"
            type="password"
            name="passwordConfirmation"
            placeholder="もう一度入力してください"
            value={formData.passwordConfirmation}
            onChange={onChange}
            required
            className="input input-accent w-full"
          />
        </fieldset>

        <button type="submit" className="btn btn-primary btn-lg mt-2 w-full">
          登録する
        </button>
      </div>
    </form>
  )
}
