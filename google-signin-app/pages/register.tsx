'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Divider,
  Link,
  InputAdornment,
  CircularProgress,
  useTheme,
  alpha,
  LinearProgress
} from '@mui/material'
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  PersonAdd as PersonAddIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material'
import { registerWithEmail } from '../utils/emailAuth'
import { signInWithGoogle } from '../utils/googleAuth'
import { updateProfile } from 'firebase/auth'
import { useAuth } from '../context/AuthContext'

interface PasswordStrength {
  score: number
  label: string
  color: 'error' | 'warning' | 'info' | 'success'
}

export default function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const { setCurrentUser } = useAuth()
  const router = useRouter()
  const theme = useTheme()

  const getPasswordStrength = (password: string): PasswordStrength => {
    if (password.length === 0) return { score: 0, label: '', color: 'error' }
    if (password.length < 6) return { score: 25, label: 'Weak', color: 'error' }
    if (password.length < 8) return { score: 50, label: 'Fair', color: 'warning' }
    if (password.length < 12 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { score: 75, label: 'Good', color: 'info' }
    }
    if (password.length >= 12 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) {
      return { score: 100, label: 'Strong', color: 'success' }
    }
    return { score: 60, label: 'Fair', color: 'warning' }
  }

  const passwordStrength = getPasswordStrength(password)

  const validateForm = (): boolean => {
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required')
      return false
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return false
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }

    return true
  }

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const user = await registerWithEmail(email, password)
      await updateProfile(user, { displayName: name })
      setSuccessMessage('Account created successfully! Redirecting to login...')

      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (e) {
      setError('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    setError('')
    setIsLoading(true)
    try {
      const user = await signInWithGoogle()
      setCurrentUser(user)
      router.push('/')
    } catch (e) {
      setError('Google registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: alpha(theme.palette.secondary.main, 0.02),
        py: 6,
        px: 2
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              Create Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join us today and get started!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Already have an account?{' '}
              <Link href="/login" color="primary" sx={{ fontWeight: 600 }}>
                Sign in here
              </Link>
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              icon={<ErrorIcon />}
              sx={{ 
                mb: 3,
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  fontSize: '1.2rem'
                }
              }}
            >
              {error}
            </Alert>
          )}

          {successMessage && (
            <Alert 
              severity="success" 
              icon={<CheckCircleIcon />}
              sx={{ 
                mb: 3,
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  fontSize: '1.2rem'
                }
              }}
            >
              {successMessage}
            </Alert>
          )}

          <Box component="form" onSubmit={handleRegister} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              id="name"
              name="name"
              type="text"
              label="Full Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.secondary.main,
                  }
                }
              }}
            />

            <TextField
              fullWidth
              id="email"
              name="email"
              type="email"
              label="Email Address"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={isLoading}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.secondary.main,
                  }
                }
              }}
            />

            <TextField
              fullWidth
              id="password"
              name="password"
              type="password"
              label="Password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              sx={{ mb: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.secondary.main,
                  }
                }
              }}
            />

            {password && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Password Strength
                  </Typography>
                  <Typography variant="caption" color={`${passwordStrength.color}.main`} sx={{ fontWeight: 600 }}>
                    {passwordStrength.label}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={passwordStrength.score}
                  color={passwordStrength.color}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.grey[300], 0.3)
                  }}
                />
              </Box>
            )}

            <TextField
              fullWidth
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              sx={{ mb: 3 }}
              error={confirmPassword.length > 0 && password !== confirmPassword}
              helperText={
                confirmPassword.length > 0 && password !== confirmPassword
                  ? 'Passwords do not match'
                  : ''
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.secondary.main,
                  }
                }
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : <PersonAddIcon />}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: '1rem',
                background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                boxShadow: `0 8px 32px ${alpha(theme.palette.secondary.main, 0.3)}`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
                  boxShadow: `0 12px 40px ${alpha(theme.palette.secondary.main, 0.4)}`,
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Or continue with
            </Typography>
          </Divider>

          <Button
            fullWidth
            variant="outlined"
            onClick={handleGoogleRegister}
            disabled={isLoading}
            startIcon={
              <Box
                component="svg"
                sx={{ width: 20, height: 20 }}
                viewBox="0 0 24 24"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </Box>
            }
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              borderColor: alpha(theme.palette.divider, 0.3),
              '&:hover': {
                borderColor: theme.palette.secondary.main,
                backgroundColor: alpha(theme.palette.secondary.main, 0.04),
                transform: 'translateY(-1px)',
                boxShadow: `0 4px 20px ${alpha(theme.palette.grey[500], 0.2)}`
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            Sign up with Google
          </Button>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'block',
              textAlign: 'center',
              mt: 3,
              lineHeight: 1.4
            }}
          >
            By registering, you agree to our{' '}
            <Link href="#" color="secondary" sx={{ fontWeight: 500 }}>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" color="secondary" sx={{ fontWeight: 500 }}>
              Privacy Policy
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}