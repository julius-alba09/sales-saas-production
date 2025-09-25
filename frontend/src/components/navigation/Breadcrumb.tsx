'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface BreadcrumbItem {
  name: string
  href?: string
  current?: boolean
}

export function Breadcrumb() {
  const pathname = usePathname()
  
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [
      { name: 'Home', href: '/' }
    ]
    
    // Map paths to readable names
    const pathMap: Record<string, string> = {
      'dashboard': 'Dashboards',
      'agency': 'Agency Dashboard',
      'sales-rep': 'Sales Rep Dashboard',
      'setter': 'Appointment Setter',
      'products': 'Products & Offers',
      'features': 'Features',
      'revenue': 'Revenue Analytics'
    }
    
    let currentPath = ''
    paths.forEach((path, index) => {
      currentPath += `/${path}`
      const isLast = index === paths.length - 1
      
      breadcrumbs.push({
        name: pathMap[path] || path.charAt(0).toUpperCase() + path.slice(1),
        href: isLast ? undefined : currentPath,
        current: isLast
      })
    })
    
    return breadcrumbs
  }
  
  const breadcrumbs = getBreadcrumbs()
  
  if (pathname === '/') {
    return null // Don't show breadcrumbs on home page
  }
  
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400 mb-4"
      aria-label="Breadcrumb"
    >
      {breadcrumbs.map((item, index) => (
        <div key={item.name} className="flex items-center space-x-2">
          {index > 0 && (
            <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
          )}
          
          {item.href ? (
            <Link
              href={item.href}
              className="flex items-center space-x-1 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200 rounded-md px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {index === 0 && <Home className="w-3 h-3" />}
              <span>{item.name}</span>
            </Link>
          ) : (
            <span className="flex items-center space-x-1 text-slate-900 dark:text-slate-100 font-medium px-2 py-1">
              {index === 0 && <Home className="w-3 h-3" />}
              <span>{item.name}</span>
            </span>
          )}
        </div>
      ))}
    </motion.nav>
  )
}

// Alternative: Simple "Back to Home" button for specific pages
interface BackToHomeProps {
  className?: string
}

export function BackToHomeButton({ className = "" }: BackToHomeProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center space-x-2 px-3 py-2 text-sm bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 shadow-sm hover:shadow-md ${className}`}
    >
      <Home className="w-4 h-4" />
      <span>Back to Home</span>
    </Link>
  )
}