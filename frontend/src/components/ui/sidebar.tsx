'use client'

import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  BarChart3, 
  Users, 
  Target, 
  Settings, 
  HelpCircle, 
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Activity,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { ThemeToggle } from "../theme-provider"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  badge?: string | number
  children?: NavItem[]
}

interface SidebarProps {
  items: NavItem[]
  className?: string
  defaultCollapsed?: boolean
}

const sidebarVariants = {
  expanded: { width: 280 },
  collapsed: { width: 80 }
}

const contentVariants = {
  expanded: { opacity: 1, x: 0 },
  collapsed: { opacity: 0, x: -10 }
}

export function Sidebar({ items, className, defaultCollapsed = false }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="glass"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen glass-card border-r border-white/10 backdrop-blur-xl lg:relative lg:z-0",
          "lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className
        )}
        variants={sidebarVariants}
        animate={isCollapsed ? "collapsed" : "expanded"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
            <motion.div
              className="flex items-center gap-3"
              variants={contentVariants}
              animate={isCollapsed ? "collapsed" : "expanded"}
              transition={{ duration: 0.2 }}
            >
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              {!isCollapsed && (
                <div>
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Sales SaaS
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Dashboard
                  </p>
                </div>
              )}
            </motion.div>
            
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex w-8 h-8"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4">
            {items.map((item, index) => {
              const Icon = item.icon
              const active = isActive(item.href)
              
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 group relative overflow-hidden",
                      active
                        ? "bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-600 dark:text-purple-400 shadow-lg shadow-purple-500/10"
                        : "text-slate-600 dark:text-slate-400 hover:bg-white/10 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-100"
                    )}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {/* Active indicator */}
                    {active && (
                      <motion.div
                        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-r-full"
                        layoutId="active-indicator"
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      />
                    )}
                    
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                    
                    <div className={cn(
                      "flex items-center justify-center w-5 h-5 relative z-10",
                      active && "text-purple-600 dark:text-purple-400"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <motion.span
                      className="relative z-10 font-medium"
                      variants={contentVariants}
                      animate={isCollapsed ? "collapsed" : "expanded"}
                      transition={{ duration: 0.2 }}
                    >
                      {!isCollapsed && item.title}
                    </motion.span>
                    
                    {item.badge && !isCollapsed && (
                      <motion.span
                        className="ml-auto px-2 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                      >
                        {item.badge}
                      </motion.span>
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-white/10 p-4">
            <motion.div
              className="flex items-center gap-3"
              variants={contentVariants}
              animate={isCollapsed ? "collapsed" : "expanded"}
              transition={{ duration: 0.2 }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                JD
              </div>
              {!isCollapsed && (
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    John Doe
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Agency Manager
                  </p>
                </div>
              )}
              <ThemeToggle className={isCollapsed ? "ml-0" : ""} />
            </motion.div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

// Breadcrumb Component
interface BreadcrumbItem {
  title: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn("flex items-center space-x-2 text-sm", className)}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <motion.div
              className="text-slate-400 dark:text-slate-500"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              /
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            {item.href ? (
              <Link
                href={item.href}
                className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
              >
                {item.title}
              </Link>
            ) : (
              <span className="text-slate-900 dark:text-slate-100 font-medium">
                {item.title}
              </span>
            )}
          </motion.div>
        </React.Fragment>
      ))}
    </nav>
  )
}

// Navigation items for different dashboard types
export const agencyNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard/agency",
    icon: Home
  },
  {
    title: "Analytics",
    href: "/dashboard/agency/analytics",
    icon: BarChart3,
    badge: "New"
  },
  {
    title: "Team",
    href: "/dashboard/agency/team",
    icon: Users,
    badge: 18
  },
  {
    title: "Goals",
    href: "/dashboard/agency/goals",
    icon: Target
  },
  {
    title: "Settings",
    href: "/dashboard/agency/settings",
    icon: Settings
  },
  {
    title: "Help",
    href: "/help",
    icon: HelpCircle
  }
]

export const salesRepNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard/sales-rep",
    icon: Home
  },
  {
    title: "My Performance",
    href: "/dashboard/sales-rep/performance",
    icon: Activity
  },
  {
    title: "EOD Reports",
    href: "/dashboard/sales-rep/eod",
    icon: BarChart3,
    badge: 3
  },
  {
    title: "Goals",
    href: "/dashboard/sales-rep/goals",
    icon: Target
  },
  {
    title: "Settings",
    href: "/dashboard/sales-rep/settings",
    icon: Settings
  },
  {
    title: "Help",
    href: "/help",
    icon: HelpCircle
  }
]

export const setterNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard/setter",
    icon: Home
  },
  {
    title: "Call Analytics",
    href: "/dashboard/setter/calls",
    icon: BarChart3
  },
  {
    title: "Bookings",
    href: "/dashboard/setter/bookings",
    icon: Target,
    badge: 12
  },
  {
    title: "Quality Scores",
    href: "/dashboard/setter/quality",
    icon: Activity
  },
  {
    title: "Settings",
    href: "/dashboard/setter/settings",
    icon: Settings
  },
  {
    title: "Help",
    href: "/help",
    icon: HelpCircle
  }
]
