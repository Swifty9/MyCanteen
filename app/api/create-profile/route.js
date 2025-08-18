 'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function UserDashboard() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          router.push('/login')
          return
        }

        if (user.user_metadata?.role !== 'user') {
          router.push('/unauthorized')
          return
        }

        setCurrentUser({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email.split('@')[0],
        })
      } catch (err) {
        console.error('Error fetching user:', err)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router,supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-700">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome, {currentUser?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Your Info</h3>
            <p className="mt-2 text-gray-700"><strong>Name:</strong> {currentUser?.name}</p>
            <p className="text-gray-700"><strong>Email:</strong> {currentUser?.email}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Canteen Usage</h3>
            <p className="text-sm text-gray-600 mt-2">Attendance tracking and menu insights will appear here soon.</p>
          </div>
        </div>

        {/* Placeholder for future features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center shadow hover:shadow-md transition">
            <h4 className="text-lg font-bold text-blue-700">Check Menu</h4>
            <p className="text-sm text-blue-600 mt-2">View today&apos;s and upcoming meals.</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center shadow hover:shadow-md transition">
            <h4 className="text-lg font-bold text-green-700">View Attendance</h4>
            <p className="text-sm text-green-600 mt-2">See your participation log.</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center shadow hover:shadow-md transition">
            <h4 className="text-lg font-bold text-yellow-700">Vote in Polls</h4>
            <p className="text-sm text-yellow-600 mt-2">Vote for tomorrow&apos;s menu.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

Admin/dashboard/page.js 'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AdminDashboard() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    checkAuthAndLoadData()
  }, [])

  const loadUsers = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("id, user_id, email, full_name, role, created_at, contact_number, department, academic_year")
        .order("created_at", { ascending: false })

      if (fetchError) throw fetchError
      setUsers(data || [])
    } catch (err) {
      setError(err.message || 'Failed to load users')
    }
  }

  const checkAuthAndLoadData = async () => {
    try {
      setLoading(true)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session) throw new Error('Please login')

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle()

      if (!profile) {
        // Create default profile if missing
        await fetch('/api/create-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.email.split('@')[0],
            role: 'user'
          })
        })
        window.location.reload()
        return
      }

      if (profile.role !== 'admin') throw new Error('Admin access required')

      setCurrentUser({ 
        id: session.user.id, 
        email: session.user.email, 
        name: profile.full_name, 
        role: profile.role 
      })

      await loadUsers()
    } catch (err) {
      setError(err.message)
      if (!err.message.includes('profile')) router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.user_id?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <div className="flex justify-center gap-2">
          <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Try Again</button>
          <button onClick={handleLogout} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Login Page</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, {currentUser?.name}</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => router.push('/admin/create-user')} 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add User
            </button>
            <button 
              onClick={handleLogout} 
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{users.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Active Users</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{users.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Admin Panel</h3>
            <p className="text-sm text-gray-600 mt-2">Manage your canteen system</p>
          </div>
        </div>

        {/* Search & Users */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-lg font-medium text-gray-900">Registered Users</h2>
          <input
            type="text"
            placeholder="Search by name, email, or User ID"
            className="border border-gray-300 p-2 rounded w-full md:w-64"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Web Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border">User ID</th>
                <th className="px-4 py-2 border">Full Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Dept</th>
                <th className="px-4 py-2 border">Year</th>
                <th className="px-4 py-2 border">Role</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{user.user_id}</td>
                  <td className="px-4 py-2 border">{user.full_name || "-"}</td>
                  <td className="px-4 py-2 border">{user.email || "-"}</td>
                  <td className="px-4 py-2 border">{user.department || "-"}</td>
                  <td className="px-4 py-2 border">{user.academic_year || "-"}</td>
                  <td className="px-4 py-2 border">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden grid grid-cols-1 gap-4">
          {filteredUsers.map(user => (
            <div
              key={user.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer bg-white"
              onClick={() => setSelectedUser(user)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{user.full_name || user.email.split('@')[0]}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                }`}>
                  {user.role}
                </span>
              </div>
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <span>ID: {user.user_id}</span>
                {user.department && <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded">{user.department}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* User Modal */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <button 
                onClick={() => setSelectedUser(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <div className="flex items-start space-x-4 mb-4">
                <div className="bg-blue-100 text-blue-800 rounded-full w-12 h-12 flex items-center justify-center">
                  {selectedUser.full_name ? selectedUser.full_name.charAt(0).toUpperCase() : selectedUser.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{selectedUser.full_name || selectedUser.email.split('@')[0]}</h2>
                  <p className="text-sm text-gray-500">User ID: {selectedUser.user_id}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm border-t pt-4">
                <div className="flex"><span className="text-gray-600 font-medium w-24">Email:</span><span className="text-gray-800">{selectedUser.email}</span></div>
                <div className="flex"><span className="text-gray-600 font-medium w-24">Contact:</span><span className="text-gray-800">{selectedUser.contact_number || "N/A"}</span></div>
                <div className="flex"><span className="text-gray-600 font-medium w-24">Department:</span><span className="text-gray-800">{selectedUser.department || "N/A"}</span></div>
                <div className="flex"><span className="text-gray-600 font-medium w-24">Year:</span><span className="text-gray-800">{selectedUser.academic_year || "N/A"}</span></div>
                <div className="flex"><span className="text-gray-600 font-medium w-24">Role:</span><span className={`px-2 py-1 text-xs rounded-full ${selectedUser.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>{selectedUser.role}</span></div>
                <div className="flex"><span className="text-gray-600 font-medium w-24">Joined:</span><span className="text-gray-800">{new Date(selectedUser.created_at).toLocaleString()}</span></div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => router.push(`/admin/edit-user/${selectedUser.id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Edit User
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

