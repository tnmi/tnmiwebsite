import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { Resend } from "resend"
import { NextRequest, NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("cv") as File
    const jobId = formData.get("jobId") as string

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save file locally (optional)
    const uploadsDir = join(process.cwd(), "public", "uploads", "cvs")
    await mkdir(uploadsDir, { recursive: true })
    const filename = `${Date.now()}_${file.name}`
    const filepath = join(uploadsDir, filename)
    await writeFile(filepath, buffer)

    // Send email to Tobias with the CV
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: "TrueNorth Platform <tobias@truenorthmaterials.com>",
          to: ["tobias@truenorthmaterials.com"],
          subject: `New CV Submission${jobId !== "general" ? ` - ${jobId}` : ""}`,
          html: `
            <h2>New CV Submission</h2>
            <p><strong>Job Position:</strong> ${jobId}</p>
            <p><strong>File:</strong> ${file.name}</p>
            <p>Please find the attached CV below.</p>
          `,
          attachments: [
            {
              filename: file.name,
              content: buffer,
            }
          ]
        })
      } catch (emailError) {
        console.error("Email sending error:", emailError)
        // Still return success even if email fails, file is saved
      }
    }

    return NextResponse.json(
      { success: true, message: "CV uploaded successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("CV upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload CV" },
      { status: 500 }
    )
  }
}
