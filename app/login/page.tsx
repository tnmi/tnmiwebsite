"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { useAuthStore } from "@/lib/store"

export default function LoginSignUpPage() {
  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const [showReset, setShowReset] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [signupError, setSignupError] = useState("")
  const [signupLoading, setSignupLoading] = useState(false)
  const [resetError, setResetError] = useState("")
  const [resetSuccess, setResetSuccess] = useState("")
  const [resetLoading, setResetLoading] = useState(false)
  const login = useAuthStore((state) => state.login)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const loading = useAuthStore((state) => state.loading)
  const error = useAuthStore((state) => state.error)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams?.get("redirect") || "/dashboard"

  // Sign up logic
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignupError("")
    setSignupLoading(true)
    try {
      const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth")
      const { auth } = await import("@/lib/firebase")
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`
      })
      setSignupLoading(false)
    } catch (err: any) {
      setSignupError(err.message)
      setSignupLoading(false)
    }
  }

  // Login logic
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
  }

  // Reset password logic
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetError("")
    setResetSuccess("")
    setResetLoading(true)
    try {
      const { sendPasswordResetEmail } = await import("firebase/auth")
      const { auth } = await import("@/lib/firebase")
      await sendPasswordResetEmail(auth, email)
      setResetSuccess("Password reset email sent! Check your inbox.")
      setResetLoading(false)
    } catch (err: any) {
      setResetError(err.message)
      setResetLoading(false)
    }
  }

  if (isAuthenticated) {
    router.push(redirectPath)
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-emerald-900">
      <div className="bg-white/10 p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col gap-4">
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 rounded-l-2xl font-semibold transition-colors ${tab === 'login' ? 'bg-emerald-400 text-black' : 'bg-white/10 text-white'}`}
            onClick={() => setTab('login')}
            disabled={tab === 'login'}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 rounded-r-2xl font-semibold transition-colors ${tab === 'signup' ? 'bg-emerald-400 text-black' : 'bg-white/10 text-white'}`}
            onClick={() => setTab('signup')}
            disabled={tab === 'signup'}
          >
            Sign Up
          </button>
        </div>
        {tab === 'login' ? (
          showReset ? (
            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              <p className="text-white text-sm mb-2">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-3 rounded border border-emerald-400 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
              {resetError && <p className="text-pink-500 text-sm">{resetError}</p>}
              {resetSuccess && <p className="text-emerald-400 text-sm">{resetSuccess}</p>}
              <button
                type="submit"
                className="bg-emerald-400 text-black font-semibold py-2 rounded hover:bg-emerald-500 transition disabled:opacity-60"
                disabled={resetLoading}
              >
                {resetLoading ? "Sending..." : "Send Reset Link"}
              </button>
              <button
                type="button"
                onClick={() => setShowReset(false)}
                className="text-emerald-400 text-sm hover:underline"
              >
                ← Back to Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-3 rounded border border-emerald-400 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-3 rounded border border-emerald-400 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
              {error && <p className="text-pink-500 text-sm">{error}</p>}
              <button
                type="submit"
                className="bg-emerald-400 text-black font-semibold py-2 rounded hover:bg-emerald-500 transition disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Login"}
              </button>
              <button
                type="button"
                onClick={() => setShowReset(true)}
                className="text-emerald-400 text-sm hover:underline"
              >
                Reset Password
              </button>
            </form>
          )
        ) : (
          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="p-3 rounded border border-emerald-400 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 w-1/2"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="p-3 rounded border border-emerald-400 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 w-1/2"
                required
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 rounded border border-emerald-400 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 rounded border border-emerald-400 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              required
            />
            {signupError && <p className="text-pink-500 text-sm">{signupError}</p>}
            <button
              type="submit"
              className="bg-emerald-400 text-black font-semibold py-2 rounded hover:bg-emerald-500 transition disabled:opacity-60"
              disabled={signupLoading}
            >
              {signupLoading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
} 