'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { 
  Building2, UserCheck, Phone, Sparkles, BarChart3, Settings2, ArrowRight, CheckCircle, 
  Zap, Target, TrendingUp, Users, Shield, Clock, Star, Rocket, Globe, Brain,
  Play, ChevronDown, Menu, X, FileText, BookOpen, Video, ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation/Navigation"
import { DarkChart, sampleChartData } from "@/components/charts/DarkChart"
import { useAuth } from '@/lib/auth-context'

const dashboards = [
  {
    title: "Manager Dashboard",
    description: "Complete oversight of your sales team with real-time analytics, training progress tracking, and performance management tools",
    href: "/dashboard/agency",
    icon: Building2,
    gradient: "from-violet-600 via-purple-600 to-indigo-600",
    glowColor: "shadow-purple-500/25",
    features: ["Team Analytics", "Training Progress", "Performance Reports"]
  },
  {
    title: "Sales Rep Dashboard", 
    description: "Individual performance tracking, daily reporting, and goal achievement with personalized training insights",
    href: "/dashboard/sales-rep",
    icon: UserCheck,
    gradient: "from-blue-600 via-indigo-600 to-purple-600",
    glowColor: "shadow-blue-500/25",
    features: ["Personal Metrics", "Daily Reports", "Goal Tracking"]
  },
  {
    title: "Appointment Setter",
    description: "Specialized tracking for appointment setting activities, call metrics, and conversion optimization with training support", 
    href: "/dashboard/setter",
    icon: Phone,
    gradient: "from-emerald-600 via-teal-600 to-cyan-600",
    glowColor: "shadow-emerald-500/25",
    features: ["Call Analytics", "Booking Rates", "Training Modules"]
  }
]

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

const floatingVariants = {
  float: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      ease: "easeInOut",
      repeat: Infinity
    }
  }
}

// Additional animation variants
const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
}

const slideUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.25, 0.25, 0.75]
    }
  }
}

export default function Home() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { scrollY } = useScroll()
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150])
  const textY = useTransform(scrollY, [0, 300], [0, 50])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    if (!loading && user && profile) {
      // Redirect authenticated users to their appropriate dashboard
      switch (profile.role) {
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
  }, [user, profile, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated loading dots */}
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: backgroundY }}
      >
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      </motion.div>

      {/* Mouse follower */}
      <motion.div
        className="fixed w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />

      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <motion.section 
        className="relative z-10 min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-12 xl:px-16"
        style={{ y: textY }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div 
              variants={slideUp}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-8"
            >
              <motion.div
                variants={pulseVariants}
                animate="pulse"
                className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
              />
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-semibold text-white/80 tracking-wide">ELITE SALES TRAINING PLATFORM</span>
            </motion.div>

            {/* Main Headline */}
            <motion.div variants={slideUp} className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight text-white leading-none">
                Unlock Immediate
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Productivity
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl lg:text-3xl font-light text-white/70 max-w-4xl mx-auto leading-relaxed">
                Transform your sales team with 
                <span className="text-cyan-400 font-semibold">battle-tested workflows</span>, 
                elite virtual assistants, and 
                <span className="text-purple-400 font-semibold">plug-and-play systems</span>
              </p>
            </motion.div>

            {/* Subheading */}
            <motion.p 
              variants={slideUp}
              className="text-lg sm:text-xl text-white/60 max-w-3xl mx-auto font-medium leading-relaxed"
            >
              Tired of endless onboarding? Get seasoned professionals equipped with proven methodologies—ready to transform your business from day one.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={slideUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold px-12 py-6 text-lg rounded-2xl shadow-2xl shadow-cyan-500/25 border-0 transition-all duration-300"
                >
                  <Rocket className="w-6 h-6 mr-3" />
                  Get Started Now
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/5 font-semibold px-8 py-6 text-lg rounded-2xl backdrop-blur-sm transition-all duration-300"
                >
                  <Play className="w-5 h-5 mr-3" />
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={slideUp}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 max-w-4xl mx-auto"
            >
              {[
                { number: "75%", label: "Faster Content Scheduling" },
                { number: "40%", label: "More Client Capacity" },
                { number: "10+", label: "Hours Saved Weekly" },
                { number: "99%", label: "Client Satisfaction" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm sm:text-base text-white/60 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-6 h-6 text-white/40" />
          </motion.div>
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section 
        className="relative z-10 py-24 px-6 sm:px-8 lg:px-12 xl:px-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
              Our Signature
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"> Services</span>
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              Eliminate training friction with our complete suite of business acceleration solutions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Building2,
                title: "Project Management",
                description: "Streamlined workflows and task automation",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Users,
                title: "Social Media Management",
                description: "Content creation and community engagement",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Shield,
                title: "Admin & Email Support",
                description: "Professional communication and administration",
                color: "from-emerald-500 to-teal-500"
              },
              {
                icon: BarChart3,
                title: "Data Analysis",
                description: "Insights and reporting for better decisions",
                color: "from-orange-500 to-red-500"
              }
            ].map((service, index) => {
              const Icon = service.icon
              return (
                <motion.div
                  key={index}
                  className="group"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center hover:bg-white/10 transition-all duration-300">
                    <motion.div
                      className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${service.color} flex items-center justify-center`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
                    <p className="text-white/60 leading-relaxed">{service.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section 
        className="relative z-10 py-24 px-6 sm:px-8 lg:px-12 xl:px-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-8">
                Why Choose
                <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"> Outscaled?</span>
              </h2>
              
              <div className="space-y-6">
                {[
                  {
                    icon: Zap,
                    title: "Eliminate Training Friction",
                    description: "Our professionals come with SOPs and templates—ready to work from day one."
                  },
                  {
                    icon: Target,
                    title: "Scale Instantly",
                    description: "Add talent and proven systems in one package, accelerating your growth."
                  },
                  {
                    icon: Clock,
                    title: "Save Time & Resources",
                    description: "Skip the lengthy onboarding process and get immediate productivity gains."
                  }
                ].map((benefit, index) => {
                  const Icon = benefit.icon
                  return (
                    <motion.div
                      key={index}
                      className="flex items-start gap-4"
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      viewport={{ once: true }}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                        <p className="text-white/70 leading-relaxed">{benefit.description}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {/* Dashboard preview mockup */}
              <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  {dashboards.map((dashboard, index) => {
                    const Icon = dashboard.icon
                    return (
                      <motion.div
                        key={index}
                        className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center"
                        whileHover={{ scale: 1.05, y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link href={user ? dashboard.href : '/auth/login'}>
                          <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r ${dashboard.gradient} flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-sm font-bold text-white mb-2">{dashboard.title}</h3>
                          <p className="text-xs text-white/60 mb-4">{dashboard.description.slice(0, 50)}...</p>
                          <Button 
                            size="sm"
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold border-0 text-xs"
                          >
                            {user ? 'Access' : 'Sign In'}
                          </Button>
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>
                
                <motion.div
                  className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <CheckCircle className="w-5 h-5 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        className="relative z-10 py-24 px-6 sm:px-8 lg:px-12 xl:px-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
              What Our
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"> Clients Say</span>
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              Join hundreds of businesses that have accelerated their growth with Outscaled
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "CEO, TechStart",
                content: "Outscaled eliminated our training bottleneck completely. We went from weeks of onboarding to immediate productivity.",
                rating: 5
              },
              {
                name: "Michael Chen",
                role: "Founder, GrowthCo",
                content: "The combination of skilled talent and proven systems is unmatched. Our revenue doubled in just 6 months.",
                rating: 5
              },
              {
                name: "Emily Rodriguez",
                role: "VP Operations, ScalePlus",
                content: "Finally, a solution that actually delivers on its promises. The ROI was immediate and substantial.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 h-full hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-white/80 leading-relaxed mb-8 text-lg">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center font-bold text-white">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{testimonial.name}</h4>
                      <p className="text-white/60 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Free Resources Section */}
      <motion.section 
        className="relative z-10 py-24 px-6 sm:px-8 lg:px-12 xl:px-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
                Free Resources &
                <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"> Knowledge Base</span>
              </h2>
              <p className="text-xl text-white/70 mb-8 max-w-3xl mx-auto">
                Access our comprehensive library of business growth templates, SOPs, and proven strategies—completely free.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-10">
                {[
                  {
                    icon: FileText,
                    title: "SOP Templates",
                    description: "Ready-to-use standard operating procedures",
                    count: "50+ Templates"
                  },
                  {
                    icon: BookOpen,
                    title: "Growth Guides",
                    description: "Step-by-step business scaling strategies",
                    count: "25+ Guides"
                  },
                  {
                    icon: Video,
                    title: "Video Tutorials",
                    description: "Expert training sessions and masterclasses",
                    count: "100+ Hours"
                  }
                ].map((resource, index) => {
                  const Icon = resource.icon
                  return (
                    <motion.div
                      key={index}
                      className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
                      whileHover={{ scale: 1.05, y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{resource.title}</h3>
                      <p className="text-white/60 text-sm mb-3">{resource.description}</p>
                      <div className="text-cyan-400 font-semibold text-sm">{resource.count}</div>
                    </motion.div>
                  )
                })}
              </div>
              
              <Button 
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-10 py-4 rounded-2xl font-bold text-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Access Free Resources
                <ExternalLink className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Join Our Team CTA */}
      <motion.section 
        className="relative z-10 py-24 px-6 sm:px-8 lg:px-12 xl:px-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-12 lg:p-20 text-center">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform -translate-x-32 translate-y-32"></div>
            
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
                  Join Our Elite
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> Team</span>
                </h2>
                <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
                  Are you a top-tier professional looking to work with innovative companies? Join our network of elite talent.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <Button 
                    size="lg"
                    className="bg-white text-indigo-600 hover:bg-white/90 px-10 py-4 rounded-2xl font-bold text-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    Apply to Join
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 px-10 py-4 rounded-2xl font-bold text-lg backdrop-blur-sm transition-all duration-300"
                  >
                    View Open Positions
                    <ExternalLink className="w-5 h-5 ml-2" />
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  {[
                    { label: "Remote-First", value: "100%" },
                    { label: "Growth Rate", value: "300%" },
                    { label: "Team Members", value: "50+" }
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="text-3xl sm:text-4xl font-black text-white mb-2">{stat.value}</div>
                      <div className="text-white/70 font-medium">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-xl"
          animate={{
            x: [0, -120, 0],
            y: [0, 120, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    </div>
  )
}
