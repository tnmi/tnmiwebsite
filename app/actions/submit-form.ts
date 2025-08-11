/* ------------------------------------------------------------------
   submit-form.ts  –  all form handling & e-mail logic   (v2 2025-07-13)
   ------------------------------------------------------------------ */

"use server";

import { z } from "zod";
import { Resend } from "resend";

/* ──────────────────────────────────────────────────────────
   1.  SCHEMA DEFINITIONS – ONLY REQUIRED FIELDS BLOCK VALIDATION
   ────────────────────────────────────────────────────────── */

const requestDemoSchema = z.object({
  companyName:     z.string().min(1, "Company Name is required"),
  email:           z.string().email("Invalid email address"),
  materialsFocus:  z.string().min(1, "Materials Focus is required"),
  formType:        z.literal("Request a Demo"),
});

/*— Startup form:  only e-mail is mandatory —*/
const startupPartnershipSchema = z.object({
  email: z.string().email("Invalid email address"),
  formType: z.literal("Startup Partnership"),
}).partial().extend({
  // fields declared above stay required; all others optional via .partial()
});

/*— Industry form:  keep the two real-world essentials required, rest optional —*/
const industryPartnershipSchema = z.object({
  companyName:       z.string().min(1, "Company Name is required"),
  contactNameTitle:  z.string().min(1, "Contact Name & Title is required"),
  email:             z.string().email("Invalid email address"),
  formType:          z.literal("Industry Partnership"),
}).partial().extend({
  // the three keys above remain required (partial() made them optional – reverse it)
  companyName:      z.string().min(1, "Company Name is required"),
  contactNameTitle: z.string().min(1, "Contact Name & Title is required"),
  email:            z.string().email("Invalid email address"),
});

/*— Canadian partnerships:  *only* the truly essential details required —*/
const canadianPartnershipsSchema = z.object({
  organizationName : z.string().min(1, "Organization Name is required"),
  organizationType : z.enum([
    "Government - Federal","Government - Provincial","Innovation Centre","Non-Profit",
    "Research Institute","University","Economic Development","Industry Association","Other",
  ]),
  location         : z.string().min(1, "Location is required"),
  contactName      : z.string().min(1, "Contact Name is required"),
  contactTitle     : z.string().min(1, "Title/Position is required"),
  email            : z.string().email("Invalid email address"),
  formType         : z.literal("Canadian Partnerships"),
}).partial().extend({
  // keys above stay required
  organizationName : z.string().min(1),
  organizationType : z.enum([
    "Government - Federal","Government - Provincial","Innovation Centre","Non-Profit",
    "Research Institute","University","Economic Development","Industry Association","Other",
  ]),
  location     : z.string().min(1),
  contactName  : z.string().min(1),
  contactTitle : z.string().min(1),
  email        : z.string().email(),
});

/*— Contact us:  unchanged —*/
const contactUsSchema = z.object({
  name:     z.string().min(1, "Name is required"),
  email:    z.string().email("Invalid email address"),
  message:  z.string().min(1, "Message is required"),
  organization: z.string().optional(),
  formType: z.literal("Contact Us"),
});

const allFormsSchema = z.union([
  requestDemoSchema,
  startupPartnershipSchema,
  industryPartnershipSchema,
  canadianPartnershipsSchema,
  contactUsSchema,
]);

/* ------------------------------------------------------------------
   2.  TYPES
   ------------------------------------------------------------------ */
export interface FormState {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

/* ------------------------------------------------------------------
   3.  SERVER ACTION
   ------------------------------------------------------------------ */
export async function submitForm(
  _prevState: FormState | null,
  formData:   FormData
): Promise<FormState> {
  const formType = formData.get("formType") as string;
  const rawData  = Object.fromEntries(formData.entries());

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
  
        }
      } catch (e) {
        console.error("Exception sending email:", e)
      }
    } else {

    }

    return {
      success : false,
      message : "Validation failed. Please check your input.",
      errors  : fieldErrors,
    };
  }

  /* --------- business logic (e-mail) --------- */
  console.log("✅ Valid submission:", formType, parsed.data);

  if (process.env.RESEND_API_KEY) {
    try {
      const resend  = new Resend(process.env.RESEND_API_KEY);
      const toEmail = "tobias@truenorthmaterials.com";

      const subjectId =
        (parsed.data as any).companyName        ||
        (parsed.data as any).organizationName   ||
        (parsed.data as any).name               ||
        (parsed.data as any).contactName        ||
        "N/A";

      const { error } = await resend.emails.send({
        from   : "TrueNorth Platform <tobias@truenorthmaterials.com>",
        to     : [toEmail],
        cc     : "peti@truenorthmaterials.com",
        subject: `New Submission: ${formType} – ${subjectId}`,
        html   : buildHtmlBody(parsed.data),
      });
      if (error) console.error("✉️ Resend error:", error);
    } catch (err) {
      console.error("✉️ Resend exception:", err);
    }
  }

  return {
    success : true,
    message : `Thank you for your ${formType} submission! We'll be in touch shortly.`,
  };
}

/* ------------------------------------------------------------------
   4.  HELPER –  prettify payload for e-mail
   ------------------------------------------------------------------ */
function buildHtmlBody(data: Record<string, unknown>): string {
  let html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
                <h1 style="color:#10b981">New submission details</h1>
                <div style="background:#f9fafb;padding:20px;border-radius:8px">`;

  Object.entries(data).forEach(([k, v]) => {
    if (k === "formType") return;
    const key = k.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase());
    const val = String(v || "Not provided").replace(/\n/g, "<br>");
    html += `<p style="margin:0 0 12px"><strong>${key}:</strong><br>${val}</p>`;
  });

  html += `</div>
           <p style="color:#64748b;font-size:12px;margin-top:20px">
             Sent automatically from the TrueNorth Materials website.
           </p></div>`;
  return html;
}
