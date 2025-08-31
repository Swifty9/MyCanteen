'use client'

import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState, useCallback } from "react";

export default function AdminDashboard() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState(null)

  // Fetch users from Supabase profiles table
  const loadUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("profiles_new")
        .select("id, user_id, full_name, email, contact_number, department, academic_year, role, last_poll_at, created_at")
        .neq('role', 'admin')
        .order("created_at", { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (err) {
      console.error("Error loading users:", err)
      setError(err.message || 'Failed to load users')
      setUsers([])
    }
  }, [supabase])  // ✅ supabase added

  const handleSearch = async (value) => {
    setSearchTerm(value)

    if (!value.trim()) {
      await loadUsers()
      return
    }

    try {
      const { data, error } = await supabase
        .from("profiles_new")
        .select("id, email, full_name, role, created_at, contact_number, department, academic_year")
        .or(`full_name.ilike.%${value}%, email.ilike.%${value}%`)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Search error:", error)
        return
      }

      setUsers(data)
    } catch (err) {
      console.error("Unexpected error during search:", err)
    }
  }

  // const checkAuthAndLoadData = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  //     if (sessionError || !session) throw new Error('Please login');

  //     const { data: profile } = await supabase
  //       .from('profiles')
  //       .select('*')
  //       .eq('id', session.user.id)
  //       .maybeSingle();

  //     if (!profile) throw new Error('Profile not found');
  //     if (profile.role !== 'admin') throw new Error('Admin access required');

  //     setCurrentUser({ 
  //       id: session.user.id, 
  //       email: session.user.email, 
  //       name: profile.full_name, 
  //       role: profile.role 
  //     });

  //     await loadUsers();
  //   } catch (err) {
  //     console.error(err);
  //     setError(err.message);
  //     if (!err.message.includes('profile')) router.push('/login');
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [router, loadUsers, supabase]);  // ✅ supabase added

  // useEffect(() => {
  //   checkAuthAndLoadData();
  // }, [checkAuthAndLoadData]);

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Filter users based on search input
  const filteredUsers = users.filter(user =>
    user.user_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // if (loading) return (
  //   <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  //   </div>
  // )

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
              // onClick={handleLogout} 
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{users.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Active Users</h3>
            {/* Placeholder: all users considered active for now */}
            <p className="text-3xl font-bold text-green-600 mt-2">{users.length}</p>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Registered Users</h2>
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="p-6">
            {users.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No users registered yet.</p>
                <button
                  onClick={() => router.push('/admin/create-user')}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Create First User
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map(user => (

                  <div
                    key={user.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow"
                    onClick={() => setSelectedUser(user)}
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.full_name || user.email.split("@")[0]}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Joined: {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-3">
                      <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        {user.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

            {/* View/Edit Card */}
      {selectedUser && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md p-6 bg-white rounded-lg shadow-lg border">
          <button 
            onClick={() => setSelectedUser(null)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
          <h2 className="text-xl font-bold mb-2">{selectedUser.full_name}</h2>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Contact:</strong> {selectedUser.contact_number || 'N/A'}</p>
          <p><strong>Department:</strong> {selectedUser.department || 'N/A'}</p>
          <p><strong>Year:</strong> {selectedUser.academic_year || 'N/A'}</p>
          <p><strong>Last Poll:</strong> {selectedUser.last_poll_at ? new Date(selectedUser.last_poll_at).toLocaleString() : 'N/A'}</p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => router.push(`/admin/edit-user/${selectedUser.id}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              onClick={() => setSelectedUser(null)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>

      </main>
    </div>
  )
}
