"use client"

import { useActionState } from "react"
import { submitForm, type FormState } from "@/app/actions/submit-form"
import { FormField, SubmitButton } from "@/components/ui/form-elements"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const initialState: FormState | null = null

const organizationTypeOptions = [
  { value: "Government - Federal", label: "Federal Government Agency" },
  { value: "Government - Provincial", label: "Provincial Government Agency" },
  { value: "Innovation Centre", label: "Innovation Centre / Hub" },
  { value: "Non-Profit", label: "Non-Profit Organization" },
  { value: "Research Institute", label: "Research Institute" },
  { value: "University", label: "University / Academic Institution" },
  { value: "Economic Development", label: "Economic Development Agency" },
  { value: "Industry Association", label: "Industry Association" },
  { value: "Other", label: "Other" },
]

export default function CanadianPartnershipsForm() {
  const [state, formAction, isPending] = useActionState(submitForm, initialState)

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="formType" value="Canadian Partnerships" />
      
      {/* Organization Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-emerald-400">Organization Information</h3>
        <FormField
          id="organizationName"
          name="organizationName"
          label="Organization Name"
          placeholder="e.g., Ontario Centre of Innovation, NRC-IRAP"
          state={state}
        />
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            id="organizationType"
            name="organizationType"
            label="Organization Type"
            type="select"
            options={organizationTypeOptions}
            placeholder="Select organization type"
            state={state}
          />
          <FormField
            id="location"
            name="location"
            label="Location (Province/Territory)"
            placeholder="e.g., Ontario, British Columbia"
            state={state}
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-emerald-400">Contact Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            id="contactName"
            name="contactName"
            label="Contact Name"
            placeholder="Your full name"
            state={state}
          />
          <FormField
            id="contactTitle"
            name="contactTitle"
            label="Title/Position"
            placeholder="e.g., Director of Innovation Programs"
            state={state}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            id="email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="your.email@organization.ca"
            state={state}
          />
          <FormField
            id="phone"
            name="phone"
            label="Phone Number (Optional)"
            placeholder="+1 (xxx) xxx-xxxx"
            required={false}
            state={state}
          />
        </div>
      </div>

      {/* Partnership Details */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-emerald-400">Partnership Opportunity</h3>
        <FormField
          id="areaOfInterest"
          name="areaOfInterest"
          label="Primary Area of Collaboration"
          placeholder="e.g., Critical minerals strategy, Clean technology commercialization, Regional innovation ecosystem"
          state={state}
        />
        <FormField
          id="partnershipScope"
          name="partnershipScope"
          type="textarea"
          label="Partnership Scope & Objectives"
          placeholder="Describe the type of partnership you're interested in and what you hope to achieve. For example: joint funding applications, technology commercialization programs, regional innovation initiatives, policy development support, etc."
          state={state}
        />
        <FormField
          id="targetSectors"
          name="targetSectors"
          label="Target Sectors/Industries"
          placeholder="e.g., Mining & minerals, Clean energy, Advanced manufacturing"
          state={state}
        />
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            id="fundingPrograms"
            name="fundingPrograms"
            label="Related Funding Programs (If any)"
            placeholder="e.g., IRAP, SDTC, NSERC Alliance"
            required={false}
            state={state}
          />
          <FormField
            id="timeline"
            name="timeline"
            label="Proposed Timeline"
            placeholder="e.g., Q2 2025 start, 2-year program"
            state={state}
          />
        </div>
      </div>

      {/* Canadian Innovation Context */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-emerald-400">Strategic Alignment</h3>
        <FormField
          id="strategicAlignment"
          name="strategicAlignment"
          type="textarea"
          label="How does this align with Canadian innovation priorities?"
          placeholder="Describe how this partnership supports Canadian priorities such as: critical minerals strategy, net-zero targets, regional economic development, Indigenous partnerships, or bridging the valley of death in materials innovation."
          state={state}
        />
        <FormField
          id="existingPartners"
          name="existingPartners"
          label="Existing Partners/Stakeholders (Optional)"
          placeholder="e.g., Universities, industry partners, other government agencies"
          required={false}
          state={state}
        />
        <FormField
          id="additionalInfo"
          name="additionalInfo"
          type="textarea"
          label="Additional Information (Optional)"
          placeholder="Any other relevant information about your organization or the proposed partnership"
          required={false}
          state={state}
        />
      </div>

      {state?.message && (
        <p className={`text-sm ${state.success ? "text-emerald-400" : "text-red-400"}`}>{state.message}</p>
      )}
      {state?.success ? (
        <Button
          variant="outline"
          asChild
          className="w-full border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-slate-900"
        >
          <Link href="/">Return to Homepage</Link>
        </Button>
      ) : (
        <SubmitButton isPending={isPending} text="Submit Partnership Inquiry" />
      )}
    </form>
  )
}