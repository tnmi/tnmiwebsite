"use client"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-md">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400 font-medium">Back to Home</span>
          </Link>
          <span className="text-xl font-bold text-emerald-400 tracking-tight">TrueNorth</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="prose prose-invert prose-emerald max-w-none"
          >
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-white via-slate-300 to-slate-500 bg-clip-text text-transparent mb-4">
                Privacy Policy
              </h1>
              <p className="text-emerald-400 text-lg">True North Materials Innovations Inc.</p>
              <p className="text-slate-400">Effective Date: June 10, 2025</p>
            </div>

            {/* Content */}
            <div className="space-y-8 text-slate-300 leading-relaxed">
              <section>
                <h2 className="text-2xl font-semibold text-emerald-400 mb-4">Introduction</h2>
                <p>
                  Welcome to True North Materials Innovations Inc. ("TNMI," "we," "us," or "our"). We are committed to protecting your privacy and handling your data in an open and transparent manner. This Privacy Policy outlines our practices concerning the collection, use, and disclosure of your information through our website, our NorthStar Agentic AI platform, and other related services (collectively, our "Services").
                </p>
                <p>
                  Our mission is to connect and strengthen Canada's advanced material, critical mineral, and manufacturing infrastructure. This policy is designed to help you understand what information we collect, why we collect it, how we use it, and the choices you have. We value data sovereignty and are committed to upholding the privacy of our Canadian clients.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-emerald-400 mb-4">1. Information We Collect</h2>
                <p>
                  We collect information to provide and improve our Services, to communicate with you, and to ensure the security of our platform. We collect information in the following ways:
                </p>
                
                <h3 className="text-xl font-medium text-white mt-6 mb-3">a. Information You Provide to Us:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account Information:</strong> When you create an account on the NorthStar platform, we collect information such as your name, email address, phone number, company name, and job title.</li>
                  <li><strong>Company Data:</strong> To fully utilize our Agentic AI Agents, you may provide us with internal company data, including but not limited to, research and development data, financial information, sales data, quality assurance and control metrics, and technical specifications of your materials and processes.</li>
                  <li><strong>Communications:</strong> If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.</li>
                  <li><strong>Payment Information:</strong> If you purchase services from us, we collect billing information, including credit card details and billing addresses. Payment processing is handled by secure third-party payment processors who comply with PCI-DSS standards.</li>
                </ul>

                <h3 className="text-xl font-medium text-white mt-6 mb-3">b. Information We Collect Automatically:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Usage Information:</strong> We collect information about your interactions with our Services, such as the AI agents you use, the queries you make, the pages you visit, and the dates and times of your visits.</li>
                  <li><strong>Device and Connection Information:</strong> We collect information about the computer or mobile device you use to access our Services, including the hardware model, operating system and version, unique device identifiers, and network information.</li>
                  <li><strong>Log Data:</strong> Our servers automatically record information ("Log Data") created by your use of the Services. Log Data may include information such as your IP address, browser type, the referring domain, pages visited, and search terms.</li>
                  <li><strong>Cookies and Similar Technologies:</strong> We use cookies, web beacons, and similar tracking technologies to collect information about your browsing activities and to enhance your experience on our platform. See Section 10 below for more details.</li>
                </ul>

                <h3 className="text-xl font-medium text-white mt-6 mb-3">c. Information We Receive from Other Sources:</h3>
                <p>
                  Our platform is designed to access and analyze external data sources to provide comprehensive insights. These sources may include academic literature, market research reports, patent databases, regulatory standards (e.g., ASTMs/ISOs), and public information from conferences, trade shows, and competitor websites. We do not collect personal information from these sources, but rather aggregate and analyze the data to enhance our Services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-emerald-400 mb-4">2. How We Use Your Information</h2>
                <p>We use the information we collect for various purposes, including:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li><strong>To Provide and Improve Our Services:</strong> We use your information to operate, maintain, and enhance our NorthStar platform, including developing new AI agents and features. The data you provide allows our AI to generate personalized and relevant insights, such as identifying market opportunities, improving processes, and finding collaborators.</li>
                  <li><strong>To Personalize Your Experience:</strong> We use your information to tailor the Services to your company's specific needs and interests.</li>
                  <li><strong>For Research and Development:</strong> We may use anonymized and aggregated data to improve our AI models and to better understand the Canadian materials and manufacturing ecosystem. We are committed to using this data to strengthen Canada's internal value chains and will not use your specific, identifiable data for these broader analyses without your explicit consent.</li>
                  <li><strong>To Communicate with You:</strong> We use your contact information to send you updates, security alerts, support messages, and promotional communications (with your consent).</li>
                  <li><strong>For Security and Compliance:</strong> We use your information to protect the security and integrity of our Services and to comply with legal obligations.</li>
                  <li><strong>For Analytics:</strong> We analyze usage patterns to improve our Services and develop new features.</li>
                  <li><strong>To Process Transactions:</strong> We use your payment information to process purchases and provide receipts.</li>
                </ul>

                <h3 className="text-xl font-medium text-white mt-6 mb-3">Legal Basis for Processing (for users in jurisdictions requiring this disclosure):</h3>
                <p>We process your personal information based on the following legal grounds:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Performance of a contract with you</li>
                  <li>Your consent (which you may withdraw at any time)</li>
                  <li>Compliance with legal obligations</li>
                  <li>Our legitimate business interests (such as improving our Services and ensuring security)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-emerald-400 mb-4">3. Data Sharing and Disclosure</h2>
                <p>
                  We understand the sensitivity of your data, particularly your intellectual property and internal processes. We do not sell your personal or company data. We may share your information in the following limited circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li><strong>With Your Consent:</strong> We may share your information with third parties when we have your explicit consent to do so. For example, our platform may identify a potential partner in the value chain, and we would only facilitate an introduction with your permission.</li>
                  <li><strong>Service Providers:</strong> We may share your information with trusted third-party service providers who assist us in operating our Services, including cloud hosting providers (servers located in Canada), payment processors, email service providers, customer support tools, and analytics providers. These service providers are contractually obligated to protect your information and use it only for the purposes for which we disclose it to them.</li>
                  <li><strong>For Legal Reasons:</strong> We may disclose your information if we believe it is reasonably necessary to comply with a law, regulation, legal process, or governmental request, including to meet national security or law enforcement requirements.</li>
                  <li><strong>To Enforce Our Rights:</strong> We may disclose information to enforce our agreements, policies, and terms of service, or to protect the rights, property, or safety of TNMI, our users, or others.</li>
                  <li><strong>Business Transfers:</strong> If we are involved in a merger, acquisition, financing, reorganization, bankruptcy, or asset sale, your information may be transferred as part of that transaction. We will notify you via email and/or a prominent notice on our website of any such deal and outline your choices regarding your information.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-emerald-400 mb-4">4. Data Security and Sovereignty</h2>
                <p>We take the security of your data very seriously and have implemented robust measures to protect it.</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li><strong>Canadian Data Storage:</strong> In line with our commitment to data sovereignty, all client data is stored on servers located exclusively within Canada. We use Canadian-based cloud infrastructure providers.</li>
                  <li><strong>Private AI Models:</strong> We utilize private, secure AI models. Your data is not used for public training of large language models. The insights and analyses are generated within our secure environment.</li>
                  <li><strong>Encryption:</strong> We use industry-standard encryption (TLS 1.3 or higher) to protect your data both in transit and at rest (AES-256 encryption).</li>
                  <li><strong>Access Controls:</strong> We have strict access controls in place to ensure that only authorized personnel have access to your data. We use multi-factor authentication and role-based access controls.</li>
                  <li><strong>Regular Security Audits:</strong> We conduct regular security assessments and vulnerability testing to identify and address potential security risks.</li>
                  <li><strong>Data Breach Response:</strong> In the event of a data breach that affects your personal information, we will notify you and applicable regulatory authorities within the timeframes required by law (as soon as possible).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-emerald-400 mb-4">5. International Data Transfers</h2>
                <p>
                  Your data is stored and processed exclusively in Canada. However, if you access our Services from outside Canada, your information may be transferred to, stored, and processed in Canada. By using our Services, you consent to the transfer of your information to Canada, which may have different data protection laws than your jurisdiction. We ensure that any such transfers comply with applicable data protection regulations.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-emerald-400 mb-4">6. Data Retention and Deletion</h2>
                <p>
                  We retain your information for as long as your account is active or as needed to provide you with our Services. You have the right to delete your account and all associated data from our platform at any time by contacting us at <a href="mailto:peti@truenorthmaterials.com" className="text-emerald-400 hover:text-emerald-300">peti@truenorthmaterials.com</a>. When you delete your account, we will take steps to delete your information from our active servers and AI cache within 30 days. Please note that information will be permanently deleted.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-emerald-400 mb-4">7. Your Rights and Choices</h2>
                <p>You have certain rights regarding the personal information we hold about you:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li><strong>Access:</strong> You can request a copy of the personal information we hold about you. We will provide this within 30 days of your request.</li>
                  <li><strong>Correction:</strong> You can request that we correct any inaccurate or incomplete personal information. You may also update most information directly through your account settings.</li>
                  <li><strong>Deletion:</strong> You can request that we delete your personal information.</li>
                  <li><strong>Portability:</strong> You can request a copy of your data in a structured, commonly used, and machine-readable format.</li>
                  <li><strong>Objection:</strong> You can object to our processing of your personal information.</li>
                  <li><strong>Restriction:</strong> You can request that we restrict the processing of your personal information in certain circumstances.</li>
                  <li><strong>Withdraw Consent:</strong> Where we rely on your consent to process your information, you may withdraw that consent at any time.</li>
                  <li><strong>Marketing Communications:</strong> You can opt out of receiving promotional emails from us by clicking the "unsubscribe" link in any marketing email or by contacting us directly. Please note that even if you opt out of marketing communications, we will still send you transactional and service-related messages.</li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, please contact us at <a href="mailto:peti@truenorthmaterials.com" className="text-emerald-400 hover:text-emerald-300">peti@truenorthmaterials.com</a>. We will respond to your request within 30 days.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-emerald-400 mb-4">8. Automated Decision-Making</h2>
                <p>
                  Our NorthStar AI platform uses automated processing to generate insights and recommendations. These automated analyses are designed to assist your decision-making processes, not replace human judgment. You always retain control over final decisions regarding your business operations. If you have concerns about any automated recommendations, please contact us.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-emerald-400 mb-4">9. Children's Privacy</h2>
                <p>
                  Our Services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will take steps to delete such information within 48 hours. If you believe we have collected information from a child, please contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-emerald-400 mb-4">10. Cookies and Tracking Technologies</h2>
                <p>We use cookies and similar tracking technologies to enhance your experience on our platform. Cookies are small data files stored on your device that help us recognize you and remember your preferences.</p>
                
                <h3 className="text-xl font-medium text-white mt-6 mb-3">Types of Cookies We Use:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Essential Cookies:</strong> Required for the operation of our Services (e.g., authentication, security)</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our Services (e.g., Google Analytics)</li>
                  <li><strong>Functionality Cookies:</strong> Remember your preferences and settings</li>
                  <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertising (only with your consent)</li>
                </ul>

                <h3 className="text-xl font-medium text-white mt-6 mb-3">Your Cookie Choices:</h3>
                <p>
                  You can control cookies through your browser settings. Most browsers allow you to refuse cookies or delete existing cookies. However, disabling essential cookies may impact the functionality of our Services.
                </p>
                <p>
                  <strong>Do Not Track:</strong> Currently, our Services do not respond to "Do Not Track" browser signals, as there is no industry standard for how to respond to such signals. However, you can control cookies and tracking as described above.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-emerald-400 mb-4">11. Additional Privacy Rights</h2>
                
                <h3 className="text-xl font-medium text-white mt-6 mb-3">California Residents (CCPA):</h3>
                <p>If you are a California resident, you have additional rights under the California Consumer Privacy Act:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Right to know what personal information is collected, used, shared, or sold</li>
                  <li>Right to delete personal information (with certain exceptions)</li>
                  <li>Right to opt-out of the sale of personal information (we do not sell personal information)</li>
                  <li>Right to non-discrimination for exercising your CCPA rights</li>
                </ul>
                <p className="mt-2">To exercise these rights, contact us at <a href="mailto:peti@truenorthmaterials.com" className="text-emerald-400 hover:text-emerald-300">peti@truenorthmaterials.com</a>.</p>

                <h3 className="text-xl font-medium text-white mt-6 mb-3">European Residents (GDPR):</h3>
                <p>If you are in the European Economic Area, you have rights under the General Data Protection Regulation as outlined in Section 7. Additionally:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>You have the right to lodge a complaint with your local data protection authority</li>
                  <li>We will obtain your explicit consent before transferring your data outside the EEA</li>
                  <li>You can request information about the safeguards we use for international data transfers</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-emerald-400 mb-4">12. Changes to This Privacy Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or for other reasons. If we make any material changes, we will notify you by email (to the email address associated with your account) and/or by posting a prominent notice on our website at least 30 days prior to the change becoming effective. We encourage you to review this Privacy Policy periodically. Your continued use of our Services after any changes indicates your acceptance of the updated Privacy Policy.
                </p>
                <p className="mt-4">The "Effective Date" at the top of this policy indicates when it was last revised.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-emerald-400 mb-4">13. Contact Us</h2>
                <p>If you have any questions, concerns, or complaints about this Privacy Policy or our data practices, please contact us at:</p>
                <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                  <p><strong>True North Materials Innovations Inc.</strong></p>
                  <p>55 Merchants Wharf</p>
                  <p>Toronto, Ontario, Canada</p>
                  <p>Email: <a href="mailto:peti@truenorthmaterials.com" className="text-emerald-400 hover:text-emerald-300">peti@truenorthmaterials.com</a></p>
                </div>
                <p className="mt-4">
                  <strong>Response Time:</strong> We will respond to all inquiries within 5 business days.
                </p>
                <p>
                  <strong>Privacy Officer:</strong> If you have specific concerns about how we handle your personal information, you may contact our Privacy Officer at the email address above.
                </p>
                <p className="mt-4">
                  If you are not satisfied with our response, you have the right to lodge a complaint with the Office of the Privacy Commissioner of Canada at <a href="https://www.priv.gc.ca" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300">www.priv.gc.ca</a>.
                </p>
              </section>

              <div className="text-center mt-12 pt-8 border-t border-white/10">
                <p className="text-slate-400">This Privacy Policy was last updated on June 10, 2025.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
