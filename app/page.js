'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { 
  QrCode, 
  CreditCard, 
  BarChart3, 
  Users, 
  Clock, 
  Shield, 
  Zap, 
  CheckCircle,
  Menu,
  X,
  ArrowRight,
  Phone,
  Mail
} from 'lucide-react'

const supabase = createClientComponentClient()

const features = [
  {
    icon: QrCode,
    title: "QR-Based Attendance",
    description: "Instant scan-in system for seamless student tracking without manual entry."
  },
  {
    icon: CreditCard,
    title: "Automated Billing",
    description: "Smart billing system with automated reminders and payment tracking."
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Real-time insights into usage patterns, popular meals, and operational efficiency."
  },
  {
    icon: Users,
    title: "Multi-User Management",
    description: "Separate dashboards for administrators, staff, and students with role-based access."
  }
]

const benefits = [
  "Reduce food wastage by up to 40%",
  "Save 10+ staff hours weekly",
  "Increase student satisfaction",
  "Real-time operational insights",
  "Streamlined billing process",
  "Enhanced security & transparency"
]

export default function LandingPage() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      const session = data.session
      // Session logic remains the same
    }
    checkSession()
  }, [router])

  const handleGetStarted = async () => {
    const { data } = await supabase.auth.getSession()
    const session = data.session
    if (session) {
      const role = session.user?.user_metadata?.role
      if (role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/user/dashboard')
      }
    } else {
      router.push('/login')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              {/* Replace with actual logo once finalized */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-yellow-300 rounded"></div>
                </div>
                <div className="text-2xl font-bold text-orange-500">MyCanteen</div>
                 {/* <Image src="/public/MyCanteen-logo.jpeg" alt="MyCanteen" width={32} height={32} /> */}
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-700 transition font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-700 transition font-medium">How It Works</a>
              <a href="#benefits" className="text-gray-700 hover:text-blue-700 transition font-medium">Benefits</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-700 transition font-medium">Contact</a>
              <button
                onClick={handleGetStarted}
                className="bg-blue-700 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-800 transition shadow-lg"
              >
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 p-2"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-lg">
              <div className="px-4 py-6 space-y-4">
                <a href="#features" className="block text-gray-700 hover:text-blue-700 transition font-medium">Features</a>
                <a href="#how-it-works" className="block text-gray-700 hover:text-blue-700 transition font-medium">How It Works</a>
                <a href="#benefits" className="block text-gray-700 hover:text-blue-700 transition font-medium">Benefits</a>
                <a href="#contact" className="block text-gray-700 hover:text-blue-700 transition font-medium">Contact</a>
                <button
                  onClick={handleGetStarted}
                  className="w-full bg-blue-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-800 transition"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  🚀 India&apos;s Smart Canteen Solution
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Effortless Canteen
                  <span className="text-blue-700 block">Management</span>
                  <span className="text-gray-600 text-2xl md:text-3xl font-normal block mt-2">
                    for Modern Institutions
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Streamline dining operations, automate attendance tracking, and enhance student experience with our comprehensive canteen management platform.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGetStarted}
                  className="group bg-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-800 transition shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
                >
                  Get Started
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
                </button>
              </div>

              {/* Trust Indicators
              <div className="flex items-center gap-8 pt-8 border-t border-gray-100">
                <div className="text-sm text-gray-600">Trusted by leading institutions</div>
                <div className="flex items-center gap-4 opacity-60">
                  <div className="px-3 py-1 bg-gray-100 rounded text-xs font-medium">PVG COE</div>
                  <div className="px-3 py-1 bg-gray-100 rounded text-xs font-medium">NIT</div>
                  <div className="px-3 py-1 bg-gray-100 rounded text-xs font-medium">Universities</div>
                </div>
              </div> */}
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Today&apos;s Students</h3>
                    <div className="text-sm text-green-600 font-medium">● Live</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Rahul Sharma</div>
                        <div className="text-sm text-gray-600">Roll: CS101</div>
                      </div>
                      <div className="text-green-600 font-semibold">Full Meal</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Priya Patel</div>
                        <div className="text-sm text-gray-450">Roll: ME205</div>
                      </div>
                      <div className="text-yellow-500 font-semibold">Half Meal</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Amit Kumar</div>
                        <div className="text-sm text-gray-600">Roll: EC303</div>
                      </div>
                      <div className="text-green-600 font-semibold">Full Meal</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total Portions Today</span>
                      <span className="font-semibold text-blue-700">156 Full + 78 Half</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Background decoration */}
              <div className="absolute -top-6 -right-6 w-full h-full bg-gradient-to-br from-blue-200 to-indigo-300 rounded-2xl -z-10"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-yellow-200 rounded-full -z-10 opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Everything You Need to Run a
              <span className="text-blue-700"> Smart Canteen</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools designed for modern institutional dining management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 bg-white">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition">
                  <feature.icon className="w-6 h-6 text-blue-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              How MyCanteen <span className="text-blue-700">Works</span>
            </h2>
            <p className="text-xl text-gray-600">Simple setup, powerful results in 4 easy steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Sign Up & Setup", desc: "Create your canteen profile and configure basic settings" },
              { step: "2", title: "Add Students & Staff", desc: "Import user data and assign roles with bulk upload" },
              { step: "3", title: "Configure Menus", desc: "Set daily menus, prices, and portion availability" },
              { step: "4", title: "Go Live", desc: "Students scan QR codes, track meals, and enjoy seamless dining" }
            ].map((item, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Why Choose <span className="text-blue-700">MyCanteen?</span>
                </h2>
                <p className="text-xl text-gray-600">
                  Transform your canteen operations with measurable improvements in efficiency and user satisfaction.
                </p>
              </div>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-700">40%</div>
                  <div className="text-sm text-gray-600">Less Food Waste</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-700">10+</div>
                  <div className="text-sm text-gray-600">Hours Saved Weekly</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-700">95%</div>
                  <div className="text-sm text-gray-600">User Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">Real-Time Dashboard</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                      <span>Active Students</span>
                      <span className="font-bold">156</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                      <span>Today&apos;s Revenue</span>
                      <span className="font-bold">₹12,450</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                      <span>Food Utilization</span>
                      <span className="font-bold">87%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Transform Your Canteen?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Join hundreds of institutions already using MyCanteen to streamline their dining operations and enhance student satisfaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="bg-white text-blue-700 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition shadow-xl"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="text-2xl font-bold">MyCanteen</div>
              <p className="text-gray-400">
                Empowering institutions with smart canteen management solutions.
              </p>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span className="text-gray-400">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span className="text-gray-400">hello@mycanteen.com</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="font-semibold">Product</h3>
              <div className="space-y-2 text-gray-400">
                <div>Features</div>
                <div>Pricing</div>
                <div>Integration</div>
                <div>API</div>
              </div>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="font-semibold">Support</h3>
              <div className="space-y-2 text-gray-400">
                <div>Help Center</div>
                <div>Documentation</div>
                <div>Contact Us</div>
                <div>System Status</div>
              </div>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="font-semibold">Company</h3>
              <div className="space-y-2 text-gray-400">
                <div>About</div>
                <div>Blog</div>
                <div>Careers</div>
                <div>Privacy Policy</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} MyCanteen. All rights reserved. Built for modern institutions.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}