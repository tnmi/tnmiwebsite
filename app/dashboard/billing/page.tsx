"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function BillingPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 font-satoshi px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900 tracking-wide">Billing</h1>
        <p className="text-gray-600 text-base sm:text-lg font-light tracking-wide">
          Manage your subscription and billing preferences
        </p>
      </div>

      {/* Free Plan Notice */}
      <Card className="bg-gradient-to-r from-tn-primary-green/10 via-tn-accent-green/10 to-tn-primary-blue/10 border border-tn-primary-green/20 shadow-xl mb-8">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-tn-primary-green tracking-wide">
            🎉 NorthStar is free... for now... 🎉
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-700 text-lg font-light tracking-wide leading-relaxed mb-4">
            Enjoy unlimited access to all NorthStar features while we're in beta!
          </p>
          <p className="text-gray-600 text-sm font-light tracking-wide">
            We'll notify you well in advance before any billing changes take effect.
          </p>
        </CardContent>
      </Card>

      {/* Future Billing Section */}
      <Card className="bg-white/95 backdrop-blur-2xl border border-white/30 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800 tracking-wide">
            Billing Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-2 tracking-wide">Current Plan</h3>
              <p className="text-2xl font-bold text-tn-primary-green tracking-wide">Free Beta</p>
              <p className="text-gray-600 text-sm font-light tracking-wide mt-1">
                Full access to all features
              </p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-2 tracking-wide">Usage</h3>
              <p className="text-gray-600 font-light tracking-wide">
                Unlimited uploads, AI analysis, and product management during beta
              </p>
            </div>

            <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-medium text-blue-800 mb-2 tracking-wide">What's Coming</h3>
              <p className="text-blue-700 font-light tracking-wide leading-relaxed">
                We're working on flexible pricing plans that will scale with your needs. 
                As a beta user, you'll get early access to premium features and special pricing.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 