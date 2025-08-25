'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, QrCode, BarChart3, User } from 'lucide-react'

export default function BottomNavbar() {
  const pathname = usePathname()

  const isActive = (path) => pathname === path ? 'text-blue-600' : 'text-gray-500'

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t shadow-sm z-50 md:hidden">
      <div className="flex justify-around py-2">
        <Link href="/user/dashboard">
          <div className={`flex flex-col items-center text-xs ${isActive('/')}`}>
            <Home size={20} />
            <span>Dashboard</span>
          </div>
        </Link>
        <Link href="/qr">
          <div className={`flex flex-col items-center text-xs ${isActive('/qr')}`}>
            <QrCode size={20} />
            <span>QR</span>
          </div>
        </Link>
        <Link href="/poll">
          <div className={`flex flex-col items-center text-xs ${isActive('/poll')}`}>
            <BarChart3 size={20} />
            <span>Poll</span>
          </div>
        </Link>
        <Link href="/profile">
          <div className={`flex flex-col items-center text-xs ${isActive('/profile')}`}>
            <User size={20} />
            <span>Profile</span>
          </div>
        </Link>
      </div>
    </nav>
  )
}
