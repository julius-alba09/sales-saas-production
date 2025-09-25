'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  Building2, 
  UserCheck, 
  Phone, 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  ChevronDown,
  Package,
  Users,
  Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-provider'
import { useAuth } from '@/hooks/useAuth'

const getNavigationItems = (isAuthenticated: boolean, userRole?: string) => {
  const publicItems = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
      description: 'Get started with Outscaled'
    },
    {
      name: 'Features',
      href: '/features',
      icon: Settings,
      description: 'Platform capabilities'
    }
  ]

  const authenticatedItems = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
      description: 'Dashboard selection'
    },
    {
      name: 'Dashboards',
      icon: BarChart3,
      description: 'Analytics & reporting',
      submenu: [
        {
          name: 'Agency Dashboard',
          href: '/dashboard/agency',
          icon: Building2,
          description: 'Team management & analytics'
        },
        {
          name: 'User Management',
          href: '/dashboard/agency/users',
          icon: Users,
          description: 'Invite and manage team members'
        },
        {
          name: 'Sales Rep Dashboard', 
          href: '/dashboard/sales-rep',
          icon: UserCheck,
          description: 'Personal performance tracking'
        },
        {
          name: 'Appointment Setter',
          href: '/dashboard/setter',
          icon: Phone,
          description: 'Call metrics & booking rates'
        }
      ]
    },
    {
      name: 'Products',
      href: '/products',
      icon: Package,
      description: 'Manage products & offers'
    },
    {
      name: 'Features',
      href: '/features',
      icon: Settings,
      description: 'Platform features'
    }
  ]

  // Add admin section for managers
  if (userRole === 'manager') {
    authenticatedItems.push({
      name: 'Admin',
      icon: Shield,
      description: 'System administration',
      submenu: [
        {
          name: 'User Monitor',
          href: '/admin/users',
          icon: Users,
          description: 'Monitor user base and registrations'
        }
      ]
    })
  }

  return isAuthenticated ? authenticatedItems : publicItems
}

interface NavigationProps {
  variant?: 'header' | 'sidebar'
}

export function Navigation({ variant = 'header' }: NavigationProps) {
  const { user, profile, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
  const pathname = usePathname()
  
  const navigationItems = getNavigationItems(!!user, profile?.role)

  const isActiveRoute = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const toggleSubmenu = (name: string) => {
    setExpandedMenu(expandedMenu === name ? null : name)
  }

  if (variant === 'sidebar') {
    return (
      <aside className="fixed left-0 top-0 h-full w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 z-40">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 px-6 py-5 border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors duration-200">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-900 dark:text-slate-100">Outscaled</span>
          </Link>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigationItems.map((item) => (
              <div key={item.name}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => toggleSubmenu(item.name)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200"
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium flex-1 text-left">{item.name}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedMenu === item.name ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {expandedMenu === item.name && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-6 mt-1 space-y-1"
                        >
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                isActiveRoute(subItem.href)
                                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                              }`}
                            >
                              <subItem.icon className="w-4 h-4" />
                              <span className="font-medium">{subItem.name}</span>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActiveRoute(item.href)
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Theme Toggle */}
          <div className="px-6 py-4 border-t border-slate-200/50 dark:border-slate-700/50">
            <ThemeToggle />
          </div>
        </div>
      </aside>
    )
  }

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-slate-900 dark:text-slate-100">Outscaled</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <div key={item.name} className="relative group">
                  {item.submenu ? (
                    <>
                      <button className="flex items-center gap-1 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200">
                        <item.icon className="w-4 h-4" />
                        <span className="font-medium">{item.name}</span>
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      
                      {/* Dropdown Menu */}
                      <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 backdrop-blur-xl">
                        <div className="p-2">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={`flex items-start gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                                isActiveRoute(subItem.href)
                                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                              }`}
                            >
                              <subItem.icon className="w-4 h-4 mt-0.5" />
                              <div>
                                <div className="font-medium text-sm">{subItem.name}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subItem.description}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                        isActiveRoute(item.href)
                          ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              
              {user && profile ? (
                <div className="hidden md:flex items-center gap-3">
                  {/* User Profile */}
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-100/50 dark:bg-slate-800/50">
                    {profile.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt={`${profile.first_name} ${profile.last_name}`}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                        {profile.first_name[0]}{profile.last_name[0]}
                      </div>
                    )}
                    <div className="text-sm">
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {profile.first_name} {profile.last_name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                        {profile.role.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  
                  {/* Sign Out Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut()}
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" asChild>
                    <Link href="/auth/login">Sign Up</Link>
                  </Button>
                </div>
              )}
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 md:hidden"
          >
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
              <nav className="container mx-auto px-6 py-4 space-y-2">
                {navigationItems.map((item) => (
                  <div key={item.name}>
                    {item.submenu ? (
                      <div>
                        <button
                          onClick={() => toggleSubmenu(item.name)}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200"
                        >
                          <item.icon className="w-4 h-4" />
                          <span className="font-medium flex-1 text-left">{item.name}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedMenu === item.name ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {expandedMenu === item.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="ml-6 mt-1 space-y-1"
                            >
                              {item.submenu.map((subItem) => (
                                <Link
                                  key={subItem.href}
                                  href={subItem.href}
                                  onClick={() => setIsOpen(false)}
                                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                    isActiveRoute(subItem.href)
                                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                                  }`}
                                >
                                  <subItem.icon className="w-4 h-4" />
                                  <span className="font-medium">{subItem.name}</span>
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          isActiveRoute(item.href)
                            ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}