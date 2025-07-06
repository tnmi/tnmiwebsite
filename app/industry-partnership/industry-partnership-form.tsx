"use client"

import { useActionState } from "react"
import { submitForm, type FormState } from "@/app/actions/submit-form"
import { FormField, SubmitButton } from "@/components/ui/form-elements"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const initialState: FormState | null = null

const companySizeOptions = [
  { value: "<50", label: "Small (<50 employees)" },
  { value: "50-500", label: "Medium (50-500 employees)" },
  { value: "500-5000", label: "Large (500-5000 employees)" },
  { value: "5000+", label: "Enterprise (5000+ employees)" },
]

const budgetRangeOptions = [
  { value: "< $50K", label: "Under $50,000 CAD" },
  { value: "$50K - $250K", label: "$50,000 - $250,000 CAD" },
  { value: "$250K - $1M", label: "$250,000 - $1 Million CAD" },
  { value: "$1M+", label: "Over $1 Million CAD" },
  { value: "Flexible", label: "Flexible / To be determined" },
]

const decisionMakingOptions = [
  { value: "I'm the decision maker", label: "I'm the primary decision maker" },
  { value: "I influence decisions", label: "I significantly influence decisions" },
  { value: "I'm researching", label: "I'm gathering information for decision makers" },
  { value: "Part of a committee", label: "Part of a decision-making committee" },
]

export default function IndustryPartnershipForm() {
  const [state, formAction, isPending] = useActionState(submitForm, initialState)

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="formType" value="Industry Partnership" />
      <div className="grid md:grid-cols-2 gap-6">
        <FormField
          id="companyName"
          name="companyName"
          label="Company Name"
          placeholder="Your company's name"
          state={state}
        />
        <FormField
          id="contactNameTitle"
          name="contactNameTitle"
          label="Contact Name & Title"
          placeholder="e.g., Mr. John Smith, R&D Director"
          state={state}
        />
      </div>
      <FormField
        id="email"
        name="email"
        type="email"
        label="Business Email"
        placeholder="your.email@company.com"
        state={state}
      />
      <FormField
        id="industry"
        name="industry"
        label="Industry"
        placeholder="e.g. Chemicals & Specialty Materials"
        state={state}
      />
      <FormField
        id="companySize"
        name="companySize"
        label="Company Size"
        type="select"
        options={companySizeOptions}
        placeholder="Select company size"
        state={state}
      />
      <FormField
        id="applicationNeed"
        name="applicationNeed"
        type="textarea"
        label="Application Need"
        placeholder="Describe the specific application or product where new materials/insights are needed."
        state={state}
      />
      <FormField
        id="currentMaterialsChallenge"
        name="currentMaterialsChallenge"
        type="textarea"
        label="Current Materials Challenge"
        placeholder="What are the key material-related challenges or limitations you are currently facing?"
        state={state}
      />
      <div className="grid md:grid-cols-2 gap-6">
        <FormField
          id="projectTimeline"
          name="projectTimeline"
          label="Project Timeline"
          placeholder="e.g., 6-12 months, Urgent, Exploratory"
          state={state}
        />
        <FormField
          id="budgetRange"
          name="budgetRange"
          label="Budget Range for AI/Materials Project"
          type="select"
          options={budgetRangeOptions}
          placeholder="Select approximate budget"
          state={state}
        />
      </div>
      <FormField
        id="decisionMakingProcess"
        name="decisionMakingProcess"
        label="Your Role in Decision-Making"
        type="select"
        options={decisionMakingOptions}
        placeholder="Select your role"
        state={state}
      />

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