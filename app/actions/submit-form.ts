"use server"

import { z } from "zod"
import { Resend } from "resend"

// Define schemas for each form type
const requestDemoSchema = z.object({
  companyName: z.string().min(1, "Company Name is required"),
  email: z.string().email("Invalid email address"),
  materialsFocus: z.string().min(1, "Materials Focus is required"),
  formType: z.literal("Request a Demo"),
})

const startupPartnershipSchema = z.object({
  companyName: z.string().optional(),
  website: z.string().optional(),
  contactNameTitle: z.string().optional(),
  email: z.string().email("Invalid email address"),
  location: z.string().optional(),
  foundedYear: z.string().optional(),
  materialsFocus: z.string().optional(),
  technologyDescription: z.string().optional(),
  currentTRLStage: z.enum(["TRL 1-2", "TRL 3", "TRL 4", "TRL 5", "TRL 6", "TRL 7+"]).optional(),
  teamSize: z.string().optional(),
  fundingStatus: z.string().optional(),
  primaryChallenge: z.string().optional(),
  desiredOutcomes: z.string().optional(),
  idealPartnershipTimeline: z.string().optional(),
  howDidYouHear: z.string().optional(),
  formType: z.literal("Startup Partnership"),
})

const industryPartnershipSchema = z.object({
  companyName: z.string().min(1, "Company Name is required"),
  contactNameTitle: z.string().min(1, "Contact Name & Title is required"),
  email: z.string().email("Invalid email address"),
  industry: z.string().min(1, "Industry is required"),
  companySize: z.enum(["<50", "50-500", "500-5000", "5000+"]),
  applicationNeed: z.string().min(1, "Application Need is required"),
  currentMaterialsChallenge: z.string().min(1, "Materials Challenge is required"),
  projectTimeline: z.string().min(1, "Project Timeline is required"),
  budgetRange: z.enum(["< $50K", "$50K - $250K", "$250K - $1M", "$1M+", "Flexible"]),
  decisionMakingProcess: z.enum([
    "I'm the decision maker", 
    "I influence decisions", 
    "I'm researching",
    "Part of a committee"
  ]),
  formType: z.literal("Industry Partnership"),
})

const canadianPartnershipsSchema = z.object({
  organizationName: z.string().min(1, "Organization Name is required"),
  organizationType: z.enum([
    "Government - Federal",
    "Government - Provincial",
    "Innovation Centre",
    "Non-Profit",
    "Research Institute",
    "University",
    "Economic Development",
    "Industry Association",
    "Other"
  ]),
  location: z.string().min(1, "Location is required"),
  contactName: z.string().min(1, "Contact Name is required"),
  contactTitle: z.string().min(1, "Title/Position is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  areaOfInterest: z.string().min(1, "Area of Collaboration is required"),
  partnershipScope: z.string().min(1, "Partnership Scope is required"),
  targetSectors: z.string().min(1, "Target Sectors are required"),
  fundingPrograms: z.string().optional(),
  timeline: z.string().min(1, "Timeline is required"),
  strategicAlignment: z.string().min(1, "Strategic Alignment is required"),
  existingPartners: z.string().optional(),
  additionalInfo: z.string().optional(),
  formType: z.literal("Canadian Partnerships"),
})

const contactUsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  organization: z.string().optional(),
  message: z.string().min(1, "Message is required"),
  formType: z.literal("Contact Us"),
})

const allFormsSchema = z.union([
  requestDemoSchema,
  startupPartnershipSchema,
  industryPartnershipSchema,
  canadianPartnershipsSchema,
  contactUsSchema,
])

export interface FormState {
  message: string
  success: boolean
  errors?: Record<string, string[]>
}

export async function submitForm(prevState: FormState | null, formData: FormData): Promise<FormState> {
  const formType = formData.get("formType") as string
  const rawData = Object.fromEntries(formData.entries())

  let validatedData
  try {
    switch (formType) {
      case "Request a Demo":
        validatedData = requestDemoSchema.safeParse(rawData)
        break
      case "Startup Partnership":
        validatedData = startupPartnershipSchema.safeParse(rawData)
        break
      case "Industry Partnership":
        validatedData = industryPartnershipSchema.safeParse(rawData)
        break
      case "Canadian Partnerships":
        validatedData = canadianPartnershipsSchema.safeParse(rawData)
        break
      case "Contact Us":
        validatedData = contactUsSchema.safeParse(rawData)
        break
      default:
        return { success: false, message: "Invalid form type." }
    }

    if (!validatedData.success) {
      const fieldErrors: Record<string, string[]> = {}
      for (const issue of validatedData.error.issues) {
        fieldErrors[issue.path.join(".")] = [issue.message]
      }
      return {
        success: false,
        message: "Validation failed. Please check your input.",
        errors: fieldErrors,
      }
    }

    console.log("Form Data validated successfully:")
    console.log("Form Type:", formType)
    console.log("Data:", validatedData.data)

    // --- Production Email Sending Logic (Using Resend) ---
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const emailTo = "tobias@truenorthmaterials.com"

      // Attempt to get a company name or individual name for the subject line
      let subjectIdentifier = "N/A"
      if ("companyName" in validatedData.data && validatedData.data.companyName) {
        subjectIdentifier = validatedData.data.companyName as string
      } else if ("organizationName" in validatedData.data && validatedData.data.organizationName) {
        subjectIdentifier = validatedData.data.organizationName as string
      } else if ("name" in validatedData.data && validatedData.data.name) {
        subjectIdentifier = validatedData.data.name as string
      } else if ("contactName" in validatedData.data && validatedData.data.contactName) {
        subjectIdentifier = validatedData.data.contactName as string
      }

      const emailSubject = `New Submission: ${formType} - ${subjectIdentifier}`

      // Create a more formatted HTML email
      let emailBodyHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10b981;">New ${formType} Submission</h1>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px;">
      `
      
      for (const [key, value] of Object.entries(validatedData.data)) {
        if (key === "formType") continue; // Skip the formType field
        
        // Convert camelCase to Title Case
        const formattedKey = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())
          .trim()
        
        // Format the value (handle multiline text)
        const formattedValue = typeof value === 'string' && value.includes('\n') 
          ? value.split('\n').join('<br>') 
          : value
        
        emailBodyHtml += `
          <div style="margin-bottom: 15px;">
            <strong style="color: #334155;">${formattedKey}:</strong><br>
            <span style="color: #64748b;">${formattedValue || 'Not provided'}</span>
          </div>
        `
      }
      
      emailBodyHtml += `
          </div>
          <p style="color: #64748b; font-size: 12px; margin-top: 20px;">
            This email was sent from the TrueNorth Materials website contact form.
          </p>
        </div>
      `

      try {
        const { data, error } = await resend.emails.send({
          from: "TrueNorth Platform <tobias@truenorthmaterials.com>", // Replace with verified domain
          to: [emailTo],
          cc: "peti@truenorthmaterials.com",
          subject: emailSubject,
          html: emailBodyHtml,
        })

        if (error) {
          console.error("Error sending email with Resend:", error)
        } else {
          console.log("Email sent successfully via Resend:", data)
        }
      } catch (e) {
        console.error("Exception sending email:", e)
      }
    } else {
      console.warn("RESEND_API_KEY not found. Skipping email sending.")
    }

    return {
      success: true,
      message: `Thank you for your ${formType} submission! We'll be in touch within 24-48 hours.`,
    }
  } catch (error) {
    console.error("Error submitting form:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}