import { Resend } from 'resend'

export async function POST(request) {
  try {
    // Validate authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json()
    
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured')
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const emailTo = "tobias@truenorthmaterials.com"
    const emailSubject = `NorthStar Support: ${subject}`

    const emailBodyHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0bb977, #0033ff); padding: 30px; border-radius: 12px; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">NorthStar Support Request</h1>
        </div>
        
        <div style="background-color: #f8fafc; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0;">
          <div style="margin-bottom: 20px;">
            <strong style="color: #1e293b; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">From:</strong><br>
            <span style="color: #475569; font-size: 16px; font-weight: 500;">${name}</span><br>
            <span style="color: #64748b; font-size: 14px;">${email}</span>
          </div>
          
          <div style="margin-bottom: 20px;">
            <strong style="color: #1e293b; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Subject:</strong><br>
            <span style="color: #475569; font-size: 16px; font-weight: 500;">${subject}</span>
          </div>
          
          <div style="margin-bottom: 20px;">
            <strong style="color: #1e293b; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Message:</strong><br>
            <div style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 8px; padding: 16px; background: white; border-radius: 8px; border: 1px solid #e2e8f0;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
        </div>
        
        <div style="margin-top: 20px; padding: 16px; background: #f1f5f9; border-radius: 8px; border-left: 4px solid #0bb977;">
          <p style="color: #64748b; font-size: 12px; margin: 0;">
            📧 Sent from NorthStar Support Form<br>
            🕒 ${new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' })} (Toronto Time)
          </p>
        </div>
      </div>
    `

    try {
      const { data, error } = await resend.emails.send({
        from: "NorthStar Support <tobias@truenorthmaterials.com>",
        to: [emailTo],
        cc: ["peti@truenorthmaterials.com"],
        subject: emailSubject,
        html: emailBodyHtml,
        reply_to: email, // Allow direct reply to the user
      })

      if (error) {
        console.error("Resend API error:", error)
        return new Response(JSON.stringify({ 
          error: 'Failed to send support email',
          details: error.message || 'Unknown error'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'Support email sent successfully',
        id: data?.id
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })

    } catch (resendError) {
      console.error("Exception in Resend send:", resendError)
      return new Response(JSON.stringify({ 
        error: 'Email service error',
        details: resendError.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

  } catch (error) {
    console.error('Support email API error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
} 