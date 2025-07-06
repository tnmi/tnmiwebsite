"use client"

import { useActionState } from "react"
import { submitForm, type FormState } from "@/app/actions/submit-form"
import { FormField, SubmitButton } from "@/components/ui/form-elements"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const initialState: FormState | null = null

const trlStageOptions = [
  { value: "TRL 1-2", label: "TRL 1-2: Basic research" },
  { value: "TRL 3", label: "TRL 3: Experimental proof of concept" },
  { value: "TRL 4", label: "TRL 4: Technology validated in lab" },
  { value: "TRL 5", label: "TRL 5: Technology validated in relevant environment" },
  { value: "TRL 6", label: "TRL 6: Technology demonstrated in relevant environment" },
  { value: "TRL 7+", label: "TRL 7+: System prototype demonstration or higher" },
]

export default function StartupPartnershipForm() {
  const [state, formAction, isPending] = useActionState(submitForm, initialState)

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="formType" value="Startup Partnership" />
      
      {/* Company Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-emerald-400">Company Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            id="companyName"
            name="companyName"
            label="Startup Name"
            placeholder="Your startup's name"
            required={false}
            state={state}
          />
          <FormField
            id="website"
            name="website"
            label="Website / LinkedIn (Optional)"
            placeholder="https://www.example.com"
            required={false}
            state={state}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            id="contactNameTitle"
            name="contactNameTitle"
            label="Contact Name & Title"
            placeholder="e.g., Dr. Jane Doe, CEO & Co-founder"
            required={false}
            state={state}
          />
          <FormField
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="your.email@startup.com"
            state={state}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            id="location"
            name="location"
            label="Headquarters Location"
            placeholder="e.g., Toronto, ON, Canada"
            required={false}
            state={state}
          />
          <FormField
            id="foundedYear"
            name="foundedYear"
            label="Year Founded (Optional)"
            placeholder="e.g., 2023"
            required={false}
            state={state}
          />
        </div>
      </div>

      {/* Technology & Materials Focus */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-emerald-400">Technology & Materials Focus</h3>
        <FormField
          id="materialsFocus"
          name="materialsFocus"
          label="Primary Materials/Technology Focus"
          placeholder="e.g., Carbon nanotube composites for aerospace applications"
          required={false}
          state={state}
        />
        <FormField
          id="technologyDescription"
          name="technologyDescription"
          type="textarea"
          label="Brief Technology Description"
          placeholder="Describe your core technology or innovation in 2-3 sentences. What makes it unique?"
          required={false}
          state={state}
        />
        <FormField
          id="currentTRLStage"
          name="currentTRLStage"
          label="Current TRL Stage"
          type="select"
          options={trlStageOptions}
          placeholder="Select your current TRL"
          required={false}
          state={state}
        />
      </div>

      {/* Team & Funding */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-emerald-400">Team & Resources</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            id="teamSize"
            name="teamSize"
            label="Team Size"
            placeholder="e.g., 8 (3 technical, 2 business, 3 advisors)"
            required={false}
            state={state}
          />
          <FormField
            id="fundingStatus"
            name="fundingStatus"
            label="Funding Status"
            placeholder="e.g., Seed funded ($2M), IRAP grant recipient"
            required={false}
            state={state}
          />
        </div>
      </div>

      {/* Partnership Goals */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-emerald-400">Partnership Goals</h3>
        <FormField
          id="primaryChallenge"
          name="primaryChallenge"
          type="textarea"
          label="Primary Challenge"
          placeholder="What's the main challenge where TrueNorth's AI platform could accelerate your progress? (e.g., optimizing material formulations, predicting long-term performance, identifying manufacturing partners)"
          required={false}
          state={state}
        />
        <FormField
          id="desiredOutcomes"
          name="desiredOutcomes"
          type="textarea"
          label="Desired Partnership Outcomes"
          placeholder="What specific outcomes would make this partnership successful for you? (e.g., reduce R&D time by 50%, achieve specific material properties, connect with industry partners)"
          required={false}
          state={state}
        />
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            id="idealPartnershipTimeline"
            name="idealPartnershipTimeline"
            label="Ideal Partnership Timeline"
            placeholder="e.g., 6-month pilot starting Q1 2025"
            required={false}
            state={state}
          />
          <FormField
            id="howDidYouHear"
            name="howDidYouHear"
            label="How did you hear about TrueNorth?"
            placeholder="e.g., MaRS Discovery District, LinkedIn, referral from..."
            required={false}
            state={state}
          />
        </div>
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
        <SubmitButton isPending={isPending} text="Submit Partnership Application" />
      )}
    </form>
  )
}