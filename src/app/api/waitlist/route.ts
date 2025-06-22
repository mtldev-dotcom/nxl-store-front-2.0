import { NextRequest, NextResponse } from "next/server"
import { sdk } from "@lib/config"

interface WaitlistData {
    name: string
    email: string
    locale: string
    countryCode: string
    source?: string
    subscribedAt?: string
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate required fields
        if (!body.name || !body.email) {
            return NextResponse.json(
                { error: "Name and email are required" },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(body.email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            )
        }

        // Prepare waitlist entry data
        const waitlistEntry = {
            name: body.name.trim(),
            email: body.email.trim().toLowerCase(),
            locale: body.locale || 'en',
            countryCode: body.countryCode || 'ca',
            subscribedAt: new Date().toISOString(),
        }

        // TODO: Store in MedusaJS backend
        // TODO: Send welcome email
        // TODO: Send admin notification

        console.log('New waitlist signup:', waitlistEntry)

        return NextResponse.json({
            success: true,
            message: "Successfully joined the waitlist!",
        })

    } catch (error) {
        console.error('Waitlist API error:', error)

        return NextResponse.json(
            { error: "Failed to join waitlist. Please try again." },
            { status: 500 }
        )
    }
}

// Send welcome email to the subscriber
async function sendWelcomeEmail(data: any) {
    // This is a placeholder for email sending logic
    // You can integrate with services like:
    // - SendGrid
    // - Mailgun  
    // - Resend
    // - AWS SES

    const emailData = {
        to: data.email,
        subject: "Welcome to Next X Level - You're In! 🏆",
        html: generateWelcomeEmailHTML(data),
    }

    // Example with a hypothetical email service
    // await emailService.send(emailData)

    console.log('Welcome email would be sent to:', data.email)
    console.log('Email data:', emailData)
}

// Send notification to admin about new signup
async function sendAdminNotification(data: any) {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@nextxlevel.com"

    const emailData = {
        to: adminEmail,
        subject: `New Waitlist Signup: ${data.name}`,
        html: `
      <h2>New Waitlist Signup</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Country:</strong> ${data.countryCode?.toUpperCase()}</p>
      <p><strong>Locale:</strong> ${data.locale}</p>
      <p><strong>Source:</strong> ${data.source}</p>
      <p><strong>Subscribed At:</strong> ${new Date(data.subscribedAt).toLocaleString()}</p>
    `,
    }

    // Send admin notification
    console.log('Admin notification would be sent:', emailData)
}

// Generate welcome email HTML template
function generateWelcomeEmailHTML(data: any): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Next X Level</title>
      <style>
        body { 
          font-family: 'Georgia', serif; 
          line-height: 1.6; 
          color: #F8F6F1; 
          background: linear-gradient(135deg, #0A0A0A 0%, #1E2A3A 50%, #1A2B20 100%);
          margin: 0;
          padding: 20px;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: rgba(10,10,10,0.9); 
          border: 1px solid rgba(212,182,96,0.3);
          border-radius: 8px;
          overflow: hidden;
        }
        .header { 
          background: linear-gradient(135deg, #D4B660 0%, #B8983E 100%);
          color: #0A0A0A; 
          padding: 30px; 
          text-align: center; 
        }
        .header h1 { 
          margin: 0; 
          font-size: 28px; 
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .content { 
          padding: 40px 30px; 
        }
        .content h2 { 
          color: #D4B660; 
          font-size: 24px;
          margin-bottom: 20px;
        }
        .benefits { 
          background: rgba(212,182,96,0.05); 
          border: 1px solid rgba(212,182,96,0.2);
          border-radius: 6px;
          padding: 25px; 
          margin: 25px 0; 
        }
        .benefit-item { 
          display: flex; 
          align-items: center; 
          margin: 15px 0; 
        }
        .benefit-icon { 
          color: #D4B660; 
          margin-right: 12px; 
          font-size: 18px;
        }
        .cta-button { 
          display: inline-block; 
          background: #D4B660; 
          color: #0A0A0A; 
          padding: 15px 30px; 
          text-decoration: none; 
          border-radius: 6px; 
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 20px 0;
        }
        .footer { 
          background: rgba(30,42,58,0.5); 
          padding: 25px; 
          text-align: center; 
          font-size: 14px; 
          color: rgba(248,246,241,0.7);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Next X Level</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Luxury Streetwear. Elevated Performance.</p>
        </div>
        
        <div class="content">
          <h2>Welcome to the Club, ${data.name}! 🏆</h2>
          
          <p>You're officially part of the Next X Level family. Thank you for joining our exclusive waitlist – you're now first in line for our luxury streetwear launch on <strong>June 25, 2025</strong>.</p>
          
          <div class="benefits">
            <h3 style="color: #D4B660; margin-top: 0;">Your Exclusive Benefits:</h3>
            
            <div class="benefit-item">
              <span class="benefit-icon">✓</span>
              <span><strong>24-Hour Early Access</strong> - Shop before anyone else</span>
            </div>
            
            <div class="benefit-item">
              <span class="benefit-icon">✓</span>
              <span><strong>15% Launch Discount</strong> - Exclusive pricing for waitlist members</span>
            </div>
            
            <div class="benefit-item">
              <span class="benefit-icon">✓</span>
              <span><strong>Behind-the-Scenes Content</strong> - Sneak peeks and exclusive updates</span>
            </div>
            
            <div class="benefit-item">
              <span class="benefit-icon">✓</span>
              <span><strong>Premium Materials First</strong> - Access to limited edition pieces</span>
            </div>
          </div>
          
          <p>Our collection features Japanese cotton blends, technical performance fabrics, and Canadian craftsmanship. From chalet to city, every piece is designed to elevate your style and performance.</p>
          
          <p>We'll send you updates as we approach the launch date, including exclusive previews and your personal early access link.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" class="cta-button">Follow Our Journey</a>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Next X Level</strong><br>
          Premium Athletic Streetwear<br>
          Montreal, Canada</p>
          
          <p style="margin-top: 20px; font-size: 12px;">
            You're receiving this because you signed up for our waitlist. 
            We respect your privacy and will never spam you.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
} 