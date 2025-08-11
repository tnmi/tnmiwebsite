import { create as createZustand } from 'zustand'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User, AuthError } from 'firebase/auth'
import { auth } from './firebase'

const firebaseErrorMessages: Record<string, string> = {
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/user-not-found': 'No user found with this email.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/email-already-in-use': 'This email is already in use.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Please check your connection.',
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = createZustand<AuthState>((set) => {
  // Listen to Firebase auth state
  onAuthStateChanged(auth, (user) => {
    set({ user, isAuthenticated: !!user, loading: false })
  })

  return {
    user: null,
    isAuthenticated: false,
    loading: true, // <-- set to true initially
    error: null,
    login: async (email, password) => {
      set({ loading: true, error: null })
      try {
        await signInWithEmailAndPassword(auth, email, password)
        // TODO: Print JWT token when logging in to Firebase
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const token = await userCredential.user.getIdToken()
        // Send token to server to log in terminal
        fetch('/api/log-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        }).catch(err => console.error('Failed to log token:', err))
        set({ loading: false, error: null })
      } catch (error: any) {
        let message = 'An error occurred. Please try again.'
        if (error.code && firebaseErrorMessages[error.code]) {
          message = firebaseErrorMessages[error.code]
        }
        set({ loading: false, error: message })
      }
    },
    logout: async () => {
      set({ loading: true, error: null })
      try {
        await signOut(auth)
      } catch (error: any) {
        let message = 'An error occurred during logout.'
        if (error.code && firebaseErrorMessages[error.code]) {
          message = firebaseErrorMessages[error.code]
        }
        set({ error: message })
      }
      set({ loading: false, user: null, isAuthenticated: false })
    },
  }
})

const getInitialLang = () => {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('language') as 'en' | 'fr') || 'en'
  }
  return 'en'
}

export const useDashboardLangStore = createZustand<{ lang: 'en' | 'fr'; setLang: (lang: 'en' | 'fr') => void }>((set) => ({
  lang: getInitialLang(),
  setLang: (lang) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
    }
    set({ lang })
  },
})) 