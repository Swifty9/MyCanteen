'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// 🧠 Import server action from local file
import { createUserServerAction } from './server'

export default function CreateUser() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isPending, startTransition] = useTransition()

  // Role check
  useEffect(() => {
    

    
  }, [router, supabase])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.name || !formData.email || formData.password.length < 6) {
      setError('All fields required. Password must be ≥ 6 characters.')
      return
    }

    startTransition(async () => {
      const result = await createUserServerAction(formData)

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess('User created successfully.')
        setFormData({ name: '', email: '', password: '' })
      }
    })
  }

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create New User</h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}
      {success && <p className="text-green-600 mb-3">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="w-full text-black px-4 py-2 border rounded"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full text-black px-4 py-2 border rounded"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
          minLength={6}
          className="w-full text-black px-4 py-2 border rounded"
        />
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {isPending ? 'Creating...' : 'Create User'}
        </button>
      </form>
    </div>
  )
}
