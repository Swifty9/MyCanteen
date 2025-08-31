'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function UserDashboard() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const { data: { user } } = await supabase.auth.getUser()
  //       if (!user) {
  //         router.push('/login')
  //         return
  //       }

  //       const { data: profile, error } = await supabase
  //         .from('profiles')
  //         .select('role, full_name')
  //         .eq('id', user.id)
  //         .maybeSingle()

  //       if (error || !profile) {
  //         router.push('/unauthorized')  // 🔄 better than pushing to login
  //         return
  //       }

  //       if (profile.role !== 'user') {
  //         router.push('/unauthorized')
  //         return
  //       }

  //       setCurrentUser({
  //         id: user.id,
  //         email: user.email,
  //         name: profile.full_name || user.email.split('@')[0],
  //       })
  //     } catch (err) {
  //       console.error('Error fetching user:', err)
  //       router.push('/login')
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   checkAuth()
  // }, [router])  // ✅ only depend on router

  // const handleLogout = async () => {
  //   await supabase.auth.signOut()
  //   router.push('/login')
  // }

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center text-gray-700">
  //       Loading...
  //     </div>
  //   )
  // }

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
              // onClick={handleLogout}
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
