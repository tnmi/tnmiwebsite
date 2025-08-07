"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { User, Mail, Shield, Save, Loader2, Lock, Eye, EyeOff, Download, Trash2 } from 'lucide-react'
import { auth } from '@/lib/firebase'
import { updateProfile, updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential, getIdToken } from 'firebase/auth'
import { useAuthStore } from '@/lib/store'
import { useLanguage } from '@/lib/i18n'

export default function SettingsPage() {
  const { user } = useAuthStore()
  const { t } = useLanguage()
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    general: ''
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  
  // Export and Delete state
  const [isExporting, setIsExporting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Load user data from Firebase on component mount
  useEffect(() => {
    if (user) {
      const displayName = user.displayName || ''
      const nameParts = displayName.split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''
      
      setUserData({
        firstName,
        lastName,
        email: user.email || ''
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData(prev => ({
      ...prev,
      [name]: value
    }))
    setErrorMessage('')
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear specific field error when user starts typing
    setPasswordErrors(prev => ({
      ...prev,
      [name]: '',
      general: ''
    }))
    setErrorMessage('')
  }

  // Real-time password validation
  const validatePassword = () => {
    const errors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      general: ''
    }

    // Validate current password
    if (!passwordData.currentPassword.trim()) {
      errors.currentPassword = t('fieldRequired')
    }

    // Validate new password
    if (!passwordData.newPassword.trim()) {
      errors.newPassword = t('fieldRequired')
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = t('passwordTooShort')
    }

    // Validate confirm password
    if (!passwordData.confirmPassword.trim()) {
      errors.confirmPassword = t('fieldRequired')
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = t('passwordsDontMatch')
    }

    // Check if new password is different from current
    if (passwordData.newPassword && passwordData.currentPassword && 
        passwordData.newPassword === passwordData.currentPassword) {
      errors.newPassword = t('passwordMustBeDifferent')
    }

    setPasswordErrors(errors)
    return !Object.values(errors).some(error => error !== '')
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleSaveProfile = async () => {
    if (!user) return

    setIsSaving(true)
    setSaveStatus('idle')
    setErrorMessage('')

    try {
      const updates: any = {}
      let needsReauth = false

      // Check if email changed
      if (userData.email !== user.email) {
        updates.email = userData.email
        needsReauth = true
      }

      // Check if display name changed
      const newDisplayName = `${userData.firstName} ${userData.lastName}`.trim()
      if (newDisplayName !== user.displayName) {
        updates.displayName = newDisplayName
      }

      // Update profile information
      if (updates.displayName) {
        await updateProfile(user, {
          displayName: updates.displayName
        })
      }

      // Update email if changed
      if (updates.email) {
        await updateEmail(user, updates.email)
      }

      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error: any) {
      console.error('Error updating profile:', error)
      setErrorMessage(error.message || t('profileUpdateError'))
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdatePassword = async () => {
    if (!user) return

    // Validate all password fields
    if (!validatePassword()) {
      setSaveStatus('error')
      return
    }

    setIsSaving(true)
    setSaveStatus('idle')
    setErrorMessage('')

    try {
      // Re-authenticate user before password change
      const credential = EmailAuthProvider.credential(
        user.email!,
        passwordData.currentPassword
      )
      
      console.log('Re-authenticating user...')
      await reauthenticateWithCredential(user, credential)
      console.log('User re-authenticated successfully')

      // Update password using Firebase
      console.log('Updating password...')
      await updatePassword(user, passwordData.newPassword)
      console.log('Password updated successfully')

      // Clear password fields after successful update
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })

      // Reset password visibility and errors
      setShowPasswords({
        current: false,
        new: false,
        confirm: false
      })
      
      setPasswordErrors({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        general: ''
      })

      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error: any) {
      console.error('Error updating password:', error)
      
      // Handle specific Firebase auth errors
      let errorMsg = ''
      switch (error.code) {
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          errorMsg = t('currentPasswordIncorrect')
          setPasswordErrors(prev => ({ ...prev, currentPassword: errorMsg }))
          break
        case 'auth/weak-password':
          errorMsg = t('passwordTooWeak')
          setPasswordErrors(prev => ({ ...prev, newPassword: errorMsg }))
          break
        case 'auth/requires-recent-login':
          errorMsg = t('requiresRecentLogin')
          setPasswordErrors(prev => ({ ...prev, general: errorMsg }))
          break
        case 'auth/too-many-requests':
          errorMsg = t('tooManyAttempts')
          setPasswordErrors(prev => ({ ...prev, general: errorMsg }))
          break
        default:
          errorMsg = error.message || t('passwordUpdateError')
          setPasswordErrors(prev => ({ ...prev, general: errorMsg }))
      }
      
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 5000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportData = async () => {
    if (!user) return

    setIsExporting(true)
    setExportStatus('idle')
    setErrorMessage('')

    try {
      const token = await getIdToken(user)
      
      const response = await fetch('/api/user/export', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to export data')
      }

      // Create a blob from the response and download it
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'user-data-export.zip'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setExportStatus('success')
      setTimeout(() => setExportStatus('idle'), 3000)
    } catch (error: any) {
      console.error('Export error:', error)
      setErrorMessage(error.message || t('exportError'))
      setExportStatus('error')
      setTimeout(() => setExportStatus('idle'), 5000)
    } finally {
      setIsExporting(false)
    }
  }

  const handleDeleteAllData = async () => {
    if (!user) return

    // Show confirmation dialog
    const confirmed = window.confirm(t('deleteConfirmation'))
    if (!confirmed) return

    setIsDeleting(true)
    setDeleteStatus('idle')
    setErrorMessage('')

    try {
      const token = await getIdToken(user)
      
      const response = await fetch('/api/user/delete', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete data')
      }

      const result = await response.json()
      
      setDeleteStatus('success')
      setTimeout(() => setDeleteStatus('idle'), 3000)
      
      // Optionally redirect to login or show a message
      alert(t('dataDeletedSuccessfully'))
    } catch (error: any) {
      console.error('Delete error:', error)
      setErrorMessage(error.message || t('deleteError'))
      setDeleteStatus('error')
      setTimeout(() => setDeleteStatus('idle'), 5000)
    } finally {
      setIsDeleting(false)
    }
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="text-center">
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-gray-900 tracking-wide">{t('settings')}</h1>
        <p className="text-gray-600 text-base sm:text-lg font-light tracking-wide">
          {t('accountSettings')}
        </p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* User Information */}
        <Card className="bg-white/95 backdrop-blur-2xl border border-white/30 shadow-2xl p-6 sm:p-8 font-satoshi">
          <div className="flex items-center mb-6">
            <User className="w-6 h-6 text-tn-primary-blue mr-3" />
            <h2 className="text-2xl font-semibold text-gray-800 tracking-wide">{t('personalInformation')}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700 tracking-wide">{t('firstName')}</label>
              <Input
                type="text"
                name="firstName"
                value={userData.firstName}
                onChange={handleInputChange}
                placeholder={t('firstName')}
                className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700 tracking-wide">{t('lastName')}</label>
              <Input
                type="text"
                name="lastName"
                value={userData.lastName}
                onChange={handleInputChange}
                placeholder={t('lastName')}
                className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 placeholder-gray-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block mb-2 font-medium text-gray-700 tracking-wide">{t('email')}</label>
            <Input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              placeholder={t('email')}
              className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 placeholder-gray-500"
            />
          </div>

          <div className="mt-6 flex justify-center sm:justify-end">
            <Button 
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="bg-tn-primary-blue hover:bg-tn-primary-blue/90 text-white font-medium tracking-wide transition-all duration-200 flex items-center text-sm sm:text-base"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('saving')}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {t('save')}
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Password Update */}
        <Card className="bg-white/95 backdrop-blur-2xl border border-white/30 shadow-2xl p-6 sm:p-8 font-satoshi">
          <div className="flex items-center mb-6">
            <Lock className="w-6 h-6 text-tn-primary-blue mr-3" />
            <h2 className="text-2xl font-semibold text-gray-800 tracking-wide">{t('changePassword')}</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700 tracking-wide">{t('currentPassword')}</label>
              <div className="relative">
                <Input
                  type={showPasswords.current ? "text" : "password"}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder={t('currentPassword')}
                  className={`w-full p-3 pr-12 border rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 placeholder-gray-500 ${
                    passwordErrors.currentPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordErrors.currentPassword && (
                <p className="text-red-500 text-sm mt-1 font-light tracking-wide">{passwordErrors.currentPassword}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700 tracking-wide">{t('newPassword')}</label>
              <div className="relative">
                <Input
                  type={showPasswords.new ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder={t('newPassword')}
                  className={`w-full p-3 pr-12 border rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 placeholder-gray-500 ${
                    passwordErrors.newPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p className="text-red-500 text-sm mt-1 font-light tracking-wide">{passwordErrors.newPassword}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700 tracking-wide">{t('confirmPassword')}</label>
              <div className="relative">
                <Input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder={t('confirmPassword')}
                  className={`w-full p-3 pr-12 border rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 placeholder-gray-500 ${
                    passwordErrors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordErrors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1 font-light tracking-wide">{passwordErrors.confirmPassword}</p>
              )}
            </div>

            {passwordErrors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-light tracking-wide">{passwordErrors.general}</p>
              </div>
            )}

            <div className="flex justify-center sm:justify-end">
              <Button 
                onClick={handleUpdatePassword}
                disabled={isSaving}
                className="bg-tn-primary-blue hover:bg-tn-primary-blue/90 text-white font-medium tracking-wide transition-all duration-200 flex items-center text-sm sm:text-base"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('updating')}
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    {t('update')}
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Data Privacy Section */}
        <Card className="bg-white/95 backdrop-blur-2xl border border-white/30 shadow-2xl p-6 sm:p-8 font-satoshi">
          <div className="flex items-center mb-6">
            <Shield className="w-6 h-6 text-tn-primary-blue mr-3" />
            <h2 className="text-2xl font-semibold text-gray-800 tracking-wide">{t('dataPrivacy')}</h2>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 tracking-wide">{t('yourDataIsYours')}</h3>
            <p className="text-blue-800 font-light tracking-wide leading-relaxed mb-4">
              {t('dataPrivacyDescription')}
            </p>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-blue-800 font-light tracking-wide">
                  <strong>{t('youAreAlwaysInControl')}</strong>
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-blue-800 font-light tracking-wide">
                  <strong>{t('clearAndHonestCommunication')}</strong>
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-blue-800 font-light tracking-wide">
                  <strong>{t('noHiddenMotives')}</strong>
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-blue-800 font-light tracking-wide">
                  <strong>{t('respectForYourChoices')}</strong>
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-200">
              <p className="text-blue-800 font-light tracking-wide leading-relaxed">
                {t('privacyQuestions')}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              onClick={handleExportData}
              disabled={isExporting}
              variant="outline" 
              className="border-gray-300 text-gray-700 font-medium tracking-wide flex items-center justify-center text-sm sm:text-base"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('processing')}
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  {t('exportData')}
                </>
              )}
            </Button>
            <Button 
              onClick={handleDeleteAllData}
              disabled={isDeleting}
              variant="outline" 
              className="border-red-300 text-red-700 font-medium tracking-wide flex items-center justify-center text-sm sm:text-base"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('processing')}
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('deleteAllData')}
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Status Messages */}
        {saveStatus === 'success' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 font-light tracking-wide">
            {t('success')}
          </div>
        )}

        {saveStatus === 'error' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-light tracking-wide">
            {errorMessage || t('error')}
          </div>
        )}

        {/* Export Status Messages */}
        {exportStatus === 'success' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 font-light tracking-wide">
            {t('success')}
          </div>
        )}

        {exportStatus === 'error' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-light tracking-wide">
            {errorMessage || t('error')}
          </div>
        )}

        {/* Delete Status Messages */}
        {deleteStatus === 'success' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 font-light tracking-wide">
            {t('success')}
          </div>
        )}

        {deleteStatus === 'error' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-light tracking-wide">
            {errorMessage || t('error')}
          </div>
        )}
      </div>
    </div>
  )
} 