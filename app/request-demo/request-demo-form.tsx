"use client"

import { useActionState } from "react"
import { submitForm, type FormState } from "@/app/actions/submit-form"
import { FormField, SubmitButton } from "@/components/ui/form-elements"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const initialState: FormState | null = null

export default function RequestDemoForm() {
  const [state, formAction, isPending] = useActionState(submitForm, initialState)

  return (
    <form action={formAction} className="space-y-6 p-10  rounded-3xl ">
      <input type="hidden" name="formType" value="Request a Demo" />
      <FormField
        id="companyName"
        name="companyName"
        label="Company Name"
        placeholder="Your company's name"
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
        id="materialsFocus"
        name="materialsFocus"
        label="Materials Focus"
        placeholder="e.g., Carbon Nanotubes, Lithium-ion Batteries"
        required
        state={state}
      />

      {state?.message && (
        <p className={`text-sm font-medium tracking-wide ${state.success ? "text-emerald-400" : "text-pink-500"}`}>{state.message}</p>
      )}
      {state?.success ? (
        <Button
          variant="outline"
          asChild
          className="w-full border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-slate-900 transition-colors duration-300"
        >
          <Link href="/">Return to Homepage</Link>
        </Button>
      ) : (
        <SubmitButton isPending={isPending} text="Request Demo" />
      )}
    </form>
  )
}
