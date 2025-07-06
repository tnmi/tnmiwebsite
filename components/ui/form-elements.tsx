"use client"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { FormState } from "@/app/actions/submit-form"

interface FormFieldProps {
  id: string
  name: string
  label: string
  placeholder?: string
  required?: boolean
  type?: "text" | "email" | "tel" | "textarea" | "select"
  options?: { value: string; label: string }[]
  state: FormState | null
  className?: string
  defaultValue?: string
}

export function FormField({
  id,
  name,
  label,
  placeholder,
  required = false,
  type = "text",
  options,
  state,
  className,
  defaultValue,
}: FormFieldProps) {
  const errorMessages = state?.errors?.[name]

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="block text-sm font-medium text-slate-300">
        {label} {required && <span className="text-red-400">*</span>}
      </Label>
      {type === "textarea" ? (
        <Textarea
          id={id}
          name={name}
          placeholder={placeholder}
          required={required}
          className="w-full bg-slate-700 border border-slate-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 h-32"
          aria-describedby={errorMessages ? `${id}-error` : undefined}
          defaultValue={defaultValue}
        />
      ) : type === "select" && options ? (
        <Select name={name} required={required} defaultValue={defaultValue}>
          <SelectTrigger
            id={id}
            className="w-full bg-slate-700 border border-slate-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-describedby={errorMessages ? `${id}-error` : undefined}
          >
            <SelectValue placeholder={placeholder || "Select an option"} />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 text-white border-slate-600">
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value} className="hover:bg-slate-600 focus:bg-slate-600">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          required={required}
          className="w-full bg-slate-700 border border-slate-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-describedby={errorMessages ? `${id}-error` : undefined}
          defaultValue={defaultValue}
        />
      )}
      {errorMessages && (
        <div id={`${id}-error`} aria-live="polite" className="mt-1 text-xs text-red-400">
          {errorMessages.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
    </div>
  )
}

interface SubmitButtonProps {
  isPending: boolean
  text?: string
}
export function SubmitButton({ isPending, text = "Send Message" }: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      size="lg"
      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4"
      disabled={isPending}
    >
      {isPending ? "Submitting..." : text}
    </Button>
  )
}
