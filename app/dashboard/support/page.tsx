"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Mail, Send, Loader2 } from 'lucide-react'

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/support-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          to: 'tobias@truenorthmaterials.com'
        }),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-gray-900 tracking-wide">Support</h1>
        <p className="text-gray-600 text-base sm:text-lg font-light tracking-wide">
          Need help? Contact our support team and we'll get back to you as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Contact Form */}
        <Card className="bg-white/95 backdrop-blur-2xl border border-white/30 shadow-2xl p-6 sm:p-8 font-satoshi">
          <div className="flex items-center mb-6">
            <Mail className="w-6 h-6 text-tn-primary-blue mr-3" />
            <h2 className="text-2xl font-semibold text-gray-800 tracking-wide">Send us a message</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium text-gray-700 tracking-wide">Name</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 placeholder-gray-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 tracking-wide">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 placeholder-gray-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700 tracking-wide">Subject</label>
              <Input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="What can we help you with?"
                className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 font-light tracking-wide text-gray-800 placeholder-gray-500"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700 tracking-wide">Message</label>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Please describe your issue or question in detail..."
                rows={6}
                className="w-full p-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tn-primary-blue/30 focus:border-tn-primary-blue/50 transition-all duration-200 resize-none font-light tracking-wide leading-relaxed text-gray-800 placeholder-gray-500"
                required
              />
            </div>

            {submitStatus === 'success' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 font-light tracking-wide">
                Thank you! Your message has been sent successfully. We'll get back to you soon.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-light tracking-wide">
                Sorry, there was an error sending your message. Please try again or contact us directly.
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-tn-primary-blue hover:bg-tn-primary-blue/90 text-white font-medium tracking-wide transition-all duration-200 flex items-center justify-center text-sm sm:text-base"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Contact Information */}
        <div className="space-y-6">
          <Card className="bg-white/95 backdrop-blur-2xl border border-white/30 shadow-2xl p-6 sm:p-8 font-satoshi">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 tracking-wide">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2 tracking-wide">Email</h4>
                <p className="text-gray-600 font-light tracking-wide">tobias@truenorthmaterials.com</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2 tracking-wide">Response Time</h4>
                <p className="text-gray-600 font-light tracking-wide">We typically respond within 24 hours during business days.</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white/95 backdrop-blur-2xl border border-white/30 shadow-2xl p-6 sm:p-8 font-satoshi">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 tracking-wide">Common Support Topics</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600 font-light tracking-wide">
                <div className="w-2 h-2 bg-tn-primary-blue rounded-full mr-3"></div>
                Product information and specifications
              </div>
              <div className="flex items-center text-gray-600 font-light tracking-wide">
                <div className="w-2 h-2 bg-tn-primary-blue rounded-full mr-3"></div>
                Technical support and troubleshooting
              </div>
              <div className="flex items-center text-gray-600 font-light tracking-wide">
                <div className="w-2 h-2 bg-tn-primary-blue rounded-full mr-3"></div>
                Account and billing questions
              </div>
              <div className="flex items-center text-gray-600 font-light tracking-wide">
                <div className="w-2 h-2 bg-tn-primary-blue rounded-full mr-3"></div>
                Partnership and collaboration inquiries
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 