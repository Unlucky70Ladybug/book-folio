import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import SignUpForm from './signup-form'
import { useAuth } from '../../hooks/use-auth'

export default function SignUpContainer() {
  const { signUp } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  })

  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await signUp(formData)
    } catch (err) {
      console.error('Request failed', err)
      setError(err.message)
    }
  }

  return (
    <div className="mx-auto my-16 max-w-[720px]">
      <h1 className="text-3xl font-bold">新規登録</h1>
      <SignUpForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        error={error}
      />
      <div className="mt-4">
        <Link to="/" className="btn btn-neutral">
          前の画面に戻る
        </Link>
      </div>
    </div>
  )
}
