'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Building,
  Users,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'

type RegistrationType = 'organization' | 'join'

export default function RegisterPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [registrationType, setRegistrationType] = useState<RegistrationType | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    inviteCode: ''
  })

  const handleBack = () => {
    if (registrationType) {
      setRegistrationType(null)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        organizationName: '',
        inviteCode: ''
      })
      setError('')
      setSuccess('')
    } else {
      router.back()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const validateForm = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('First name and last name are required.')
      return false
    }
    
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address.')
      return false
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return false
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return false
    }
    
    if (registrationType === 'organization' && !formData.organizationName.trim()) {
      setError('Organization name is required.')
      return false
    }

    return true
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const userData = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        organization_name: registrationType === 'organization' ? formData.organizationName.trim() : undefined,
        role: registrationType === 'organization' ? 'manager' as const : 'sales_rep' as const,
      }

      const { data, error: signUpError } = await signUp(
        formData.email.trim(),
        formData.password,
        userData
      )

      if (signUpError) {
        throw signUpError
      }

      if (data?.user) {
        if (data.user.email_confirmed_at) {
          // User is already verified (local development)
          setSuccess('Registration successful! You are now logged in. Redirecting to your dashboard...')
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
        } else {
          // User needs email verification (production)
          setSuccess('Registration successful! Please check your email to verify your account, then you can sign in.')
          setTimeout(() => {
            router.push('/auth/login')
          }, 4000)
        }
        
        // Clear form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          organizationName: '',
          inviteCode: ''
        })
      }
    } catch (err: any) {
      console.error('Registration error:', err)
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
      <motion.div 
        className="w-full max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="wait">
          {!registrationType ? (
            // Registration Type Selection
            <motion.div
              key="type-selection"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="text-center"
            >
              <div className="mb-8">
                <motion.div variants={itemVariants}>
                  <Link href="/auth/login" className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Link>
                </motion.div>
                
                <motion.h1 
                  className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4"
                  variants={itemVariants}
                >
                  Get Started
                </motion.h1>
                
                <motion.p 
                  className="text-lg text-slate-600 dark:text-slate-400 mb-8"
                  variants={itemVariants}
                >
                  Choose how you'd like to get started with our platform
                </motion.p>
              </div>

              <motion.div 
                className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto"
                variants={containerVariants}
              >
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setRegistrationType('organization')}
                  className="cursor-pointer"
                >
                  <Card className="h-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Building className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        Create Organization
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Start a new organization and become a manager. Perfect for agency owners and team leaders.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setRegistrationType('join')}
                  className="cursor-pointer"
                >
                  <Card className="h-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        Join Team
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Join an existing organization with an invite code. For sales reps and setters.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            // Registration Form
            <motion.div
              key="registration-form"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="max-w-md mx-auto"
            >
              <div className="text-center mb-8">
                <motion.button
                  onClick={handleBack}
                  className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors mb-6"
                  variants={itemVariants}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </motion.button>

                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {registrationType === 'organization' ? 'Create Organization' : 'Join Team'}
                </h1>
                
                <p className="text-slate-600 dark:text-slate-400">
                  {registrationType === 'organization' 
                    ? 'Set up your sales organization' 
                    : 'Join an existing sales team'
                  }
                </p>
              </div>

              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                <CardContent className="p-6">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-slate-700 dark:text-slate-300 font-medium">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="John"
                          required
                          className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-slate-700 dark:text-slate-300 font-medium">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Doe"
                          required
                          className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        required
                        className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>

                    {registrationType === 'organization' && (
                      <div>
                        <Label htmlFor="organizationName" className="text-slate-700 dark:text-slate-300 font-medium">
                          Organization Name
                        </Label>
                        <Input
                          id="organizationName"
                          name="organizationName"
                          type="text"
                          value={formData.organizationName}
                          onChange={handleInputChange}
                          placeholder="Your Sales Agency"
                          required
                          className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                    )}

                    {registrationType === 'join' && (
                      <div>
                        <Label htmlFor="inviteCode" className="text-slate-700 dark:text-slate-300 font-medium">
                          Invite Code (Optional)
                        </Label>
                        <Input
                          id="inviteCode"
                          name="inviteCode"
                          type="text"
                          value={formData.inviteCode}
                          onChange={handleInputChange}
                          placeholder="Enter invite code if you have one"
                          className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-medium">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Create a strong password"
                          required
                          className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword" className="text-slate-700 dark:text-slate-300 font-medium">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm your password"
                          required
                          className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm"
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                      </motion.div>
                    )}

                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm"
                      >
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        {success}
                      </motion.div>
                    )}

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-lg h-11"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Creating Account...
                        </div>
                      ) : (
                        `Create ${registrationType === 'organization' ? 'Organization' : 'Account'}`
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Already have an account?{' '}
                      <Link 
                        href="/auth/login" 
                        className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}