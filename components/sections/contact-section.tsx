"use client"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Linkedin, Mail } from "lucide-react"
import { useActionState } from "react"
import { submitForm, type FormState as ContactFormState } from "@/app/actions/submit-form" // Adjust path if needed
import { FormField, SubmitButton } from "@/components/ui/form-elements" // Adjust path if needed

const initialContactState: ContactFormState | null = null

export default function ContactSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [state, formAction, isPending] = useActionState(submitForm, initialContactState)
  const formRef = useRef<HTMLFormElement>(null)

  if (state?.success && formRef.current) {
    formRef.current.reset()
  }

  return (
    <section
      id="contact"
      ref={ref}
      className="min-h-screen bg-slate-900/80 backdrop-blur-3xl text-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-36 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 px-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-emerald-400">
            Get In Touch
          </h2>
          <p className="text-lg sm:text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed px-4">
            Ready to accelerate your materials innovation journey? Contact us to learn how our AI Core services can help
            bridge the valley of death and bring sustainable innovations to market.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
          
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-2xl border border-white/10 shadow-2xl hover:shadow-emerald-500/20 transition-all p-6 sm:p-8 rounded-2xl order-2 lg:order-1"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-emerald-400 mb-6 sm:mb-8">
              Contact Information
            </h3>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="ring-1 ring-emerald-300/30 backdrop-blur-sm p-2 sm:p-3 rounded-lg flex-shrink-0">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-base sm:text-lg font-semibold text-white mb-1">
                    General Inquiries
                  </h4>
                  <a
                    href="mailto:jason.deacon@truenorthmaterials.com"
                    className="text-slate-300 hover:text-emerald-400 transition-colors text-sm sm:text-base break-all"
                  >
                    jason.deacon@truenorthmaterials.com
                  </a>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-slate-700">
              <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
                Connect With Us
              </h4>
              <div className="flex space-x-3 sm:space-x-4">
                <a
                  href="https://www.linkedin.com/company/truenorth-material-innovations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-emerald-500/20 backdrop-blur-xl border border-white/10 p-2 sm:p-3 rounded-full shadow-md transition-all"
                  aria-label="TrueNorth LinkedIn"
                >
                  <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </a>
                <a
                  href="mailto:jason.deacon@truenorthmaterials.com"
                  className="bg-white/10 hover:bg-emerald-500/20 backdrop-blur-xl border border-white/10 p-2 sm:p-3 rounded-full shadow-md transition-all"
                  aria-label="Email TrueNorth"
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </a>
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="bg-white/10 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-emerald-300/20 shadow-xl mt-6 sm:mt-8">
              <h4 className="text-base sm:text-lg font-semibold text-emerald-300 mb-3 sm:mb-4">
                Why Choose TrueNorth?
              </h4>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-emerald-300 animate-pulse rounded-full flex-shrink-0"></div>
                  <span className="text-slate-200 text-sm sm:text-base">AI-Accelerated Innovation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-emerald-300 animate-pulse rounded-full flex-shrink-0"></div>
                  <span className="text-slate-200 text-sm sm:text-base">Materials Science Expertise</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-emerald-300 animate-pulse rounded-full flex-shrink-0"></div>
                  <span className="text-slate-200 text-sm sm:text-base">Industry-Ready Solutions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-emerald-300 animate-pulse rounded-full flex-shrink-0"></div>
                  <span className="text-slate-200 text-sm sm:text-base">Canadian Innovation Focus</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="bg-white/10 backdrop-blur-2xl border border-white/10 shadow-2xl hover:shadow-emerald-500/20 transition-all p-6 sm:p-8 rounded-2xl order-1 lg:order-2"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-emerald-400 mb-6 sm:mb-8">
              Send Us a Message
            </h3>
            
            <form ref={formRef} action={formAction} className="space-y-4 sm:space-y-6">
              <input type="hidden" name="formType" value="Contact Us" />
              
              <div className="space-y-4 sm:space-y-6">
                <FormField 
                  id="name" 
                  name="name" 
                  label="Name" 
                  placeholder="Your name" 
                  required 
                  state={state} 
                />
                
                <FormField
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="your.email@example.com"
                  required
                  state={state}
                />
                
                <FormField
                  id="organization"
                  name="organization"
                  label="Organization (Optional)"
                  placeholder="Your organization"
                  state={state}
                />
                
                <FormField
                  id="message"
                  name="message"
                  type="textarea"
                  label="Message"
                  placeholder="How can our AI Cores help you?"
                  required
                  state={state}
                />
              </div>

              {/* Status Messages */}
              {state?.message && (
                <div className="mt-4">
                  <p className={`text-sm ${state.success ? "text-emerald-400" : "text-red-400"}`}>
                    {state.message}
                  </p>
                </div>
              )}
              
              {/* Submit Button */}
              <div className="pt-2 sm:pt-4">
                {state?.success ? (
                  <div className="bg-emerald-900/50 border border-emerald-600 p-3 sm:p-4 rounded-lg">
                    <p className="text-emerald-400 text-sm sm:text-base font-medium">
                      ✓ Thank you! Your message has been sent successfully.
                    </p>
                  </div>
                ) : (
                  <div className="w-full">
                    <SubmitButton 
                      isPending={isPending} 
                      text="Send Message" 
                      className="bg-white/10 hover:bg-emerald-400/20 backdrop-blur-xl text-white px-8 py-4 rounded-xl border border-white/10 shadow-xl transition-all duration-300"
                    />
                  </div>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}