import { motion } from 'framer-motion'
import { Activity, Brain, Heart, Sparkles, ArrowRight, Github } from 'lucide-react'
import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-purple-500/30 font-sans antialiased">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-blue-900/20 blur-[100px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Rehaby<span className="text-purple-400">AI</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Platform</a>
          <a href="#" className="hover:text-white transition-colors">Solutions</a>
          <a href="#" className="hover:text-white transition-colors">Research</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-gray-400 hover:text-white">Sign In</Button>
          <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-6 transition-all duration-300">Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-8"
          >
            <Sparkles className="w-3 h-3" />
            <span>Next Generation AI Rehabilitation</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-4xl bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent"
          >
            Empowering Recovery with Artificial Intelligence
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed"
          >
            RehabyAI combines advanced biomechanics with deep learning to provide personalized rehabilitation paths for every patient.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 h-12 text-base group">
              Start Your Journey
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="border-gray-800 hover:bg-gray-900 rounded-full px-8 h-12 text-base text-white">
              Watch Demo
            </Button>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32">
          {[
            {
              icon: <Activity className="w-6 h-6 text-blue-400" />,
              title: "Real-time Tracking",
              description: "Monitor movement precision with computer vision technology."
            },
            {
              icon: <Brain className="w-6 h-6 text-purple-400" />,
              title: "Adaptive Learning",
              description: "Exercises that evolve based on your daily progress."
            },
            {
              icon: <Heart className="w-6 h-6 text-rose-400" />,
              title: "Patient-Centric",
              description: "Designed by therapists for the best clinical outcomes."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className="p-8 rounded-3xl bg-gray-900/40 border border-gray-800 backdrop-blur-sm hover:border-gray-700 transition-colors group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm md:text-base">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-900 bg-[#030712]/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            <span className="font-semibold tracking-tight text-white">RehabyAI</span>
          </div>
          <p className="text-sm text-gray-500">© 2026 RehabyAI Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-500 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
