import { Resend } from 'resend'

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json()

    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Use the existing Resend email service
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const emailTo = "tobias@truenorthmaterials.com"

      const emailSubject = `Support Request: ${subject}`

      const emailBodyHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10b981;">Support Request</h1>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px;">
            <div style="margin-bottom: 15px;">
              <strong style="color: #334155;">Name:</strong><br>
              <span style="color: #64748b;">${name}</span>
            </div>
            <div style="margin-bottom: 15px;">
              <strong style="color: #334155;">Email:</strong><br>
              <span style="color: #64748b;">${email}</span>
            </div>
            <div style="margin-bottom: 15px;">
              <strong style="color: #334155;">Subject:</strong><br>
              <span style="color: #64748b;">${subject}</span>
            </div>
            <div style="margin-bottom: 15px;">
              <strong style="color: #334155;">Message:</strong><br>
              <span style="color: #64748b;">${message.replace(/\n/g, '<br>')}</span>
            </div>
          </div>
          <p style="color: #64748b; font-size: 12px; margin-top: 20px;">
            This email was sent from the NorthStar support form.
          </p>
        </div>
      `

      try {
        const { data, error } = await resend.emails.send({
          from: "TrueNorth Platform <tobias@truenorthmaterials.com>",
          to: [emailTo],
          cc: "peti@truenorthmaterials.com",
          subject: emailSubject,
          html: emailBodyHtml,
        })

        if (error) {
          console.error("Error sending support email with Resend:", error)
          return new Response(JSON.stringify({ error: 'Failed to send email' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          })
        } else {
    
          return new Response(JSON.stringify({
            success: true,
            message: 'Email sent successfully'
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      } catch (e) {
        console.error("Exception sending support email:", e)
        return new Response(JSON.stringify({ error: 'Failed to send email' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    } else {

      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

  } catch (error) {
    console.error('Support email error:', error)
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
} 