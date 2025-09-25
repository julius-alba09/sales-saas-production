'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Building2, 
  UserCheck, 
  Phone, 
  ArrowLeft, 
  Eye, 
  EyeOff,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'

type UserRole = 'manager' | 'sales_rep' | 'setter'

interface RoleOption {
  id: UserRole
  title: string
  description: string
  icon: React.ElementType
  gradient: string
  glowColor: string
}

const roleOptions: RoleOption[] = [
  {
    id: 'manager',
    title: 'Manager',
    description: 'Access agency dashboard and manage your team',
    icon: Building2,
    gradient: 'from-violet-600 via-purple-600 to-indigo-600',
    glowColor: 'shadow-purple-500/25'
  },
  {
    id: 'sales_rep',
    title: 'Sales Rep',
    description: 'Track performance and submit daily reports',
    icon: UserCheck,
    gradient: 'from-blue-600 via-indigo-600 to-purple-600',
    glowColor: 'shadow-blue-500/25'
  },
  {
    id: 'setter',
    title: 'Appointment Setter',
    description: 'Monitor call metrics and booking rates',
    icon: Phone,
    gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    glowColor: 'shadow-emerald-500/25'
  }
]

export default function LoginPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Get user profile to determine role and redirect appropriately
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role, organization_id')
          .eq('id', user.id)
          .single()
        
        if (profile) {
          redirectToDashboard(profile.role)
        }
      }
    }
    
    checkAuth()
  }, [])

  const redirectToDashboard = (role: UserRole) => {
    switch (role) {
      case 'manager':
        router.push('/dashboard/agency')
        break
      case 'sales_rep':
        router.push('/dashboard/sales-rep')
        break
      case 'setter':
        router.push('/dashboard/setter')
        break
      default:
        router.push('/dashboard')
    }
  }

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    setError('')
    setSuccess('')
  }

  const handleBack = () => {
    setSelectedRole(null)
    setFormData({ email: '', password: '' })
    setError('')
    setSuccess('')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole) return

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Sign in user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })

      if (authError) {
        throw authError
      }

      if (!authData.user) {
        throw new Error('Authentication failed')
      }

      // Get user profile to verify role
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('role, organization_id, first_name, last_name')
        .eq('id', authData.user.id)
        .single()

      if (profileError || !profile) {
        throw new Error('Could not load user profile. Please contact your administrator.')
      }

      // Verify the selected role matches the user's actual role
      if (profile.role !== selectedRole) {
        await supabase.auth.signOut()
        throw new Error(`Access denied. Your account is not configured for ${roleOptions.find(r => r.id === selectedRole)?.title} access.`)
      }

      setSuccess(`Welcome back, ${profile.first_name}!`)
      
      // Small delay to show success message
      setTimeout(() => {
        redirectToDashboard(profile.role)
      }, 1000)

    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.')
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
          {!selectedRole ? (
            // Role Selection Step
            <motion.div
              key="role-selection"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="text-center"
            >
              <div className="mb-8">
                <motion.div variants={itemVariants}>
                  <Link href="/" className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Link>
                </motion.div>
                
                <motion.h1 
                  className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4"
                  variants={itemVariants}
                >
                  Welcome Back
                </motion.h1>
                
                <motion.p 
                  className="text-lg text-slate-600 dark:text-slate-400 mb-8"
                  variants={itemVariants}
                >
                  Select your role to continue to your dashboard
                </motion.p>
              </div>

              <motion.div 
                className="grid md:grid-cols-3 gap-6"
                variants={containerVariants}
              >
                {roleOptions.map((role) => {
                  const Icon = role.icon
                  return (
                    <motion.div
                      key={role.id}
                      variants={itemVariants}
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer"
                      onClick={() => handleRoleSelect(role.id)}
                    >
                      <Card className={`h-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl ${role.glowColor}`}>
                        <CardHeader className="pb-6">
                          <div className="flex items-center justify-center mb-6">
                            <div className={`p-4 rounded-xl bg-gradient-to-br ${role.gradient} shadow-lg`}>
                              <Icon className="w-8 h-8 text-white" />
                            </div>
                          </div>
                          <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                            {role.title}
                          </CardTitle>
                          <CardDescription className="text-slate-600 dark:text-slate-400">
                            {role.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-lg">
                            Sign In as {role.title}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </motion.div>
            </motion.div>
          ) : (
            // Login Form Step
            <motion.div
              key="login-form"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="max-w-md mx-auto"
            >
              <div className="text-center mb-8">
                <button
                  onClick={handleBack}
                  className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors mb-6"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Role Selection
                </button>
                
                <div className="mb-4">
                  {(() => {
                    const role = roleOptions.find(r => r.id === selectedRole)!
                    const Icon = role.icon
                    return (
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${role.gradient} shadow-lg mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    )
                  })()}
                </div>
                
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {roleOptions.find(r => r.id === selectedRole)?.title} Login
                </h1>
                
                <p className="text-slate-600 dark:text-slate-400">
                  Enter your credentials to access your dashboard
                </p>
              </div>

              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                <CardContent className="p-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                        className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-2">
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
                          placeholder="Enter your password"
                          required
                          className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
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
                          Signing In...
                        </div>
                      ) : (
                        `Sign In to ${roleOptions.find(r => r.id === selectedRole)?.title} Dashboard`
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Don't have an account?{' '}
                      <Link 
                        href="/auth/register" 
                        className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                      >
                        Sign Up Here
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