import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/use-auth'
import LoginForm from './login-form'

export default function LoginContainer() {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await login(formData)
      navigate('/')
    } catch (err) {
      console.error('Request failed', err)
    }
  }

  return (
    <div className="mx-auto my-16 max-w-[720px]">
      <h1 className="text-3xl font-bold">ログイン</h1>
      <LoginForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
      <div className="mt-4 flex gap-4">
        <Link to="/" className="btn btn-neutral">
          前の画面に戻る
        </Link>
        <Link to="/signup" className="btn btn-primary">
          新規登録
        </Link>
      </div>
    </div>
  )
}
