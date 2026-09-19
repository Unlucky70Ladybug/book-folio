import React from 'react'

type LoginFormProps = {
  formData: { email: string; password: string }
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export default function LoginForm({ formData, onChange, onSubmit }: LoginFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="card my-8 w-full border border-base-300 bg-base-100 shadow-lg"
    >
      <div className="card-body gap-4">
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
            className="input input-primary w-full"
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">パスワード</legend>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="パスワード"
            value={formData.password}
            onChange={onChange}
            required
            className="input input-secondary w-full"
          />
        </fieldset>

        <button type="submit" className="btn btn-primary btn-lg mt-2 w-full">
          ログイン
        </button>
      </div>
    </form>
  )
}
