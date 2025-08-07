"use client"

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Globe, Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuthStore } from '@/lib/store'
import { useLanguage } from '@/lib/i18n'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'
  const { login } = useAuthStore()
  const { language, setLanguage, t } = useLanguage()

  const [isLogin, setIsLogin] = useState(true)
  const [isResetMode, setIsResetMode] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
    setSuccess('')
  }

  const handleLanguageChange = (newLanguage: 'en' | 'fr') => {
    setLanguage(newLanguage)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isResetMode) {
        // Password reset
        await sendPasswordResetEmail(auth, formData.email)
        setSuccess(t('passwordResetSent'))
        setIsResetMode(false)
      } else if (isLogin) {
        // Login
        await login(formData.email, formData.password)
        router.push(redirect)
      } else {
        // Sign up
        if (formData.password !== formData.confirmPassword) {
          setError(t('passwordsDontMatch'))
          return
        }
        
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
        
        // Update profile with display name
        if (formData.firstName || formData.lastName) {
          const displayName = `${formData.firstName} ${formData.lastName}`.trim()
          if (displayName) {
            await updateProfile(userCredential.user, { displayName })
          }
        }
        
        // Login after successful signup
        await login(formData.email, formData.password)
        router.push(redirect)
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      if (isResetMode) {
        setError(t('passwordResetError'))
      } else if (isLogin) {
        setError(t('loginError'))
      } else {
        setError(t('signupError'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: ''
    })
    setError('')
    setSuccess('')
    setIsResetMode(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-emerald-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Language Selector */}
        <div className="flex justify-end mb-6">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-32 bg-white/10 backdrop-blur-sm border border-white/20 text-white">
              <Globe className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl p-8 font-satoshi">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">
              {isResetMode ? t('resetPassword') : (isLogin ? t('signIn') : t('createAccount'))}
            </h1>
            <p className="text-white/80 font-light tracking-wide">
              {isResetMode 
                ? t('forgotYourPassword')
                : (isLogin ? t('alreadyHaveAccount') : t('dontHaveAccount'))
              }
            </p>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-emerald-400/20 border border-emerald-400/30 rounded-xl text-emerald-300 font-light tracking-wide">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-pink-400/20 border border-pink-400/30 rounded-xl text-pink-300 font-light tracking-wide">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && !isResetMode && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium text-white/90 tracking-wide">{t('firstName')}</label>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder={t('firstName')}
                    className="w-full p-3 border border-emerald-400 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder-white/50"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-white/90 tracking-wide">{t('lastName')}</label>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder={t('lastName')}
                    className="w-full p-3 border border-emerald-400 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder-white/50"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block mb-2 font-medium text-white/90 tracking-wide">{t('email')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5 pointer-events-none" />
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t('email')}
                  className="w-full pl-14 p-3 border border-emerald-400 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder-white/50"
                  required
                />
              </div>
            </div>

            {!isResetMode && (
              <div>
                <label className="block mb-2 font-medium text-white/90 tracking-wide">{t('password')}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5 pointer-events-none" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={t('password')}
                    className="w-full pl-14 pr-12 p-3 border border-emerald-400 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder-white/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {!isLogin && !isResetMode && (
              <div>
                <label className="block mb-2 font-medium text-white/90 tracking-wide">{t('confirmPassword')}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5 pointer-events-none" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder={t('confirmPassword')}
                    className="w-full pl-14 pr-12 p-3 border border-emerald-400 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder-white/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-400 hover:bg-emerald-500 text-black font-semibold tracking-wide transition-all duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
              ) : (
                <>
                  {isResetMode ? t('resetPassword') : (isLogin ? t('signIn') : t('signUp'))}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-4">
            {isResetMode ? (
              <button
                onClick={resetForm}
                className="text-emerald-400 hover:text-emerald-300 font-medium tracking-wide transition-colors"
              >
                ← {t('back')}
              </button>
            ) : (
              <>
                {isLogin && (
                  <button
                    onClick={() => setIsResetMode(true)}
                    className="block text-emerald-400 hover:text-emerald-300 font-medium tracking-wide transition-colors"
                  >
                    {t('forgotYourPassword')}
                  </button>
                )}
                
                <div className="text-white/80 font-light tracking-wide">
                  {isLogin ? t('dontHaveAccount') : t('alreadyHaveAccount')}{' '}
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin)
                      resetForm()
                    }}
                    className="text-emerald-400 hover:text-emerald-300 font-medium tracking-wide transition-colors"
                  >
                    {isLogin ? t('signUp') : t('signIn')}
                  </button>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
} 