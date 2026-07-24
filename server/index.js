const express = require('express');
const cors = require('cors');
const { calendar: googleCalendar, auth: googleAuth } = require('@googleapis/calendar');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

let keyFile = null;
const keyCandidates = [
  path.join(__dirname, 'gcp-key.json'),
  path.join(process.cwd(), 'server', 'gcp-key.json'),
  path.join(process.cwd(), 'gcp-key.json')
];
for (const cand of keyCandidates) {
  if (fs.existsSync(cand)) {
    try {
      keyFile = JSON.parse(fs.readFileSync(cand, 'utf8'));
      break;
    } catch (e) {
      console.error('Could not parse gcp-key.json:', e.message);
    }
  }
}

const PORT = process.env.PORT || 3000;
const TIMEZONE = process.env.TIMEZONE || 'Europe/Nicosia';
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'shutterpack395@gmail.com';
const CLIENT_EMAIL = (keyFile ? keyFile.client_email : null) || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = (keyFile ? keyFile.private_key : null) || (process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : null);

function getCalendarClient() {
  if (!CALENDAR_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
    return null;
  }
  const jwt = new googleAuth.JWT({
    email: CLIENT_EMAIL,
    key: PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/calendar']
  });
  return googleCalendar({ version: 'v3', auth: jwt });
}

function getEmailTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = process.env.SMTP_SECURE !== 'false';
  const user = process.env.SMTP_USER || process.env.GOOGLE_CALENDAR_ID;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });
}

async function sendBookingEmails(bookingDetails) {
  const { serviceName, durationMinutes, price, date, time, fullName, email, phone, matter, notes, bookingId } = bookingDetails;
  const senderEmail = process.env.SMTP_USER || process.env.GOOGLE_CALENDAR_ID;
  const practiceEmail = process.env.NOTIFY_EMAIL || senderEmail;

  const clientHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #222; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #1e293b; color: #ffffff; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Booking Confirmed</h1>
        <p style="margin: 4px 0 0 0; color: #cbd5e1;">Nikolas Leontides Legal Consultation</p>
      </div>
      <div style="padding: 24px;">
        <p>Dear <strong>${fullName}</strong>,</p>
        <p>Your appointment has been successfully scheduled. Here are your booking details:</p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px; font-weight: bold; color: #64748b;">Booking Reference:</td><td style="padding: 10px; font-weight: bold;">${bookingId}</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px; font-weight: bold; color: #64748b;">Consultation:</td><td style="padding: 10px;">${serviceName} (${durationMinutes} mins)</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px; font-weight: bold; color: #64748b;">Date & Time:</td><td style="padding: 10px;">${date} at ${time} (Cyprus Time)</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px; font-weight: bold; color: #64748b;">Type:</td><td style="padding: 10px;">In-person consultation at Nikolas's office</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px; font-weight: bold; color: #64748b;">Fee:</td><td style="padding: 10px;">€${price || 'Payable at consultation'}</td></tr>
        </table>

        <p style="color: #475569; font-size: 14px; background: #f8fafc; padding: 12px; border-left: 4px solid #3b82f6; margin-top: 20px;">
          <strong>Office Location:</strong> Nikolas Leontides Law Office, Cyprus.<br/>
          Please arrive 5 minutes prior to your scheduled consultation time.
        </p>

        <p style="margin-top: 24px; color: #64748b; font-size: 13px;">If you need to reschedule or cancel, please contact the practice directly.</p>
      </div>
    </div>
  `;

  const practiceHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #222; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #0f172a; color: #ffffff; padding: 20px;">
        <h2 style="margin: 0;">New Appointment Booked</h2>
      </div>
      <div style="padding: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; font-weight: bold; width: 140px;">Booking Ref:</td><td style="padding: 8px;">${bookingId}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Client Name:</td><td style="padding: 8px;">${fullName}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Client Email:</td><td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Client Phone:</td><td style="padding: 8px;">${phone || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Service:</td><td style="padding: 8px;">${serviceName} (${durationMinutes} min)</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Date & Time:</td><td style="padding: 8px;">${date} at ${time}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">General Topic:</td><td style="padding: 8px;">${matter || 'General'}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Notes:</td><td style="padding: 8px;">${notes || 'None'}</td></tr>
        </table>
      </div>
    </div>
  `;

  // Option A: Resend API Key
  if (process.env.RESEND_API_KEY) {
    try {
      const fromAddr = process.env.RESEND_FROM || 'Nikolas Law Office <onboarding@resend.dev>';
      
      const clientRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: fromAddr, to: [email], subject: `Booking Confirmed: ${serviceName} — Nikolas Leontides`, html: clientHtml })
      });
      const clientData = await clientRes.json();
      if (!clientRes.ok) {
        console.error('[Resend Client Email Error]', clientRes.status, clientData);
      }

      const practiceRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: fromAddr, to: [practiceEmail], subject: `[New Appointment] ${fullName} — ${serviceName} on ${date} at ${time}`, html: practiceHtml })
      });
      const practiceData = await practiceRes.json();
      if (!practiceRes.ok) {
        console.error('[Resend Practice Email Error]', practiceRes.status, practiceData);
      }

      if (clientRes.ok || practiceRes.ok) {
        console.log(`[Resend Dispatch] Email process finished. Client (${email}): ${clientRes.ok ? 'Sent' : 'Failed'}, Practice (${practiceEmail}): ${practiceRes.ok ? 'Sent' : 'Failed'}`);
        return true;
      }
    } catch (err) {
      console.error('[Resend Error] Failed to send email notifications via Resend:', err.message);
    }
  }

  // Option B: Nodemailer SMTP
  const transporter = getEmailTransporter();
  if (!transporter) {
    console.log('[Email Notice] Neither RESEND_API_KEY nor SMTP_PASS configured in server/.env. Skipping email dispatch.');
    return false;
  }

  try {
    await transporter.sendMail({
      from: `"Nikolas Leontides Law Office" <${senderEmail}>`,
      to: email,
      subject: `Booking Confirmed: ${serviceName} — Nikolas Leontides`,
      html: clientHtml
    });
    await transporter.sendMail({
      from: `"Legal Booking System" <${senderEmail}>`,
      to: practiceEmail,
      subject: `[New Appointment] ${fullName} — ${serviceName} on ${date} at ${time}`,
      html: practiceHtml
    });
    console.log(`[SMTP Dispatch] Confirmation emails successfully sent to client (${email}) and practice (${practiceEmail})!`);
    return true;
  } catch (err) {
    console.error('[SMTP Error] Failed to send email notifications:', err.message);
    return false;
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const calendar = getCalendarClient();
  const emailTransporter = getEmailTransporter();
  res.json({
    status: 'ok',
    resendConnected: Boolean(process.env.RESEND_API_KEY),
    googleCalendarConnected: Boolean(calendar),
    emailNotificationsConnected: Boolean(emailTransporter || process.env.RESEND_API_KEY),
    calendarId: CALENDAR_ID,
    clientEmail: CLIENT_EMAIL,
    timezone: TIMEZONE
  });
});

// GET /api/availability?date=YYYY-MM-DD&durationMinutes=30
app.get('/api/availability', async (req, res) => {
  const { date, durationMinutes = '30' } = req.query;

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Valid date parameter (YYYY-MM-DD) is required.' });
  }

  const duration = parseInt(durationMinutes, 10) || 30;
  const calendar = getCalendarClient();

  if (!calendar) {
    return res.json({
      configured: false,
      date,
      busyIntervals: []
    });
  }

  try {
    const timeMin = new Date(`${date}T00:00:00`).toISOString();
    const timeMax = new Date(`${date}T23:59:59`).toISOString();

    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        timeZone: TIMEZONE,
        items: [{ id: CALENDAR_ID }]
      }
    });

    const busy = response.data.calendars[CALENDAR_ID]?.busy || [];
    const busyIntervals = busy.map((item) => {
      const start = new Date(item.start);
      const end = new Date(item.end);
      const startMinute = start.getHours() * 60 + start.getMinutes();
      const durationMins = Math.round((end.getTime() - start.getTime()) / (60 * 1000));
      return {
        date,
        startMinute,
        durationMinutes: durationMins
      };
    });

    res.json({
      configured: true,
      date,
      busyIntervals
    });
  } catch (error) {
    console.error('Error fetching Google Calendar availability:', error.message);
    res.status(500).json({
      error: 'Failed to retrieve availability from Google Calendar.',
      details: error.message
    });
  }
});

// POST /api/bookings
app.post('/api/bookings', async (req, res) => {
  const {
    serviceName,
    durationMinutes,
    price,
    date,
    time,
    fullName,
    email,
    phone,
    matter,
    notes,
    website
  } = req.body;

  // Anti-bot honeypot check
  if (website) {
    return res.status(400).json({ error: 'Invalid submission.' });
  }

  if (!serviceName || !date || !time || !fullName || !email) {
    return res.status(400).json({ error: 'Missing required booking fields.' });
  }

  const calendar = getCalendarClient();
  const bookingId = `NK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  const payload = {
    serviceName,
    durationMinutes,
    price,
    date,
    time,
    fullName,
    email,
    phone,
    matter,
    notes,
    bookingId
  };

  // Dispatch email notifications asynchronously in background
  sendBookingEmails(payload).catch((err) => console.error('Email dispatch error:', err));

  if (!calendar) {
    return res.json({
      success: true,
      googleCalendarConnected: false,
      bookingId,
      message: 'Appointment saved locally.'
    });
  }

  try {
    const startDate = new Date(`${date}T${time.padStart(5, '0')}:00`);
    const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

    const event = {
      summary: `${serviceName} — ${fullName}`,
      location: "In-person consultation at office",
      description: [
        `Booking Reference: ${bookingId}`,
        `Type: In-Person Consultation`,
        `Client Name: ${fullName}`,
        `Client Email: ${email}`,
        `Client Phone: ${phone || 'N/A'}`,
        `Matter Area: ${matter || 'General'}`,
        notes ? `Client Notes: ${notes}` : ''
      ].filter(Boolean).join('\n'),
      start: {
        dateTime: startDate.toISOString(),
        timeZone: TIMEZONE
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: TIMEZONE
      }
    };

    const createdEvent = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      requestBody: event
    });

    res.json({
      success: true,
      googleCalendarConnected: true,
      bookingId,
      eventId: createdEvent.data.id,
      htmlLink: createdEvent.data.htmlLink
    });
  } catch (error) {
    console.error('Error creating Google Calendar event:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to create event in Google Calendar.',
      details: error.response?.data?.error?.message || error.message
    });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Nikolas Lawyer Booking Backend running on http://localhost:${PORT}`);
    console.log(`Google Calendar Configured: ${Boolean(CALENDAR_ID && CLIENT_EMAIL && PRIVATE_KEY)}`);
  });
}

module.exports = app;

