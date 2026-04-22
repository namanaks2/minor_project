const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// In-memory store for OTPs (In production, use Redis or a DB)
const otpStore = new Map();

// Configure Nodemailer (Using Ethereal or Gmail - recommending Ethereal for testing)
// For actual use, you should provide SMTP credentials in .env
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'reva.lang70@ethereal.email', // Replace with real credentials or use .env
        pass: '6m2y6T6Cg2tJvXfWjG'
    }
});

// Endpoint to generate and send OTP
app.post('/api/send-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes expiry

    otpStore.set(email, { otp, expiry });

    const mailOptions = {
        from: '"DrapeDrop Support" <noreply@drapedrop.com>',
        to: email,
        subject: 'Your Login OTP for DrapeDrop',
        html: `
            <div style="font-family: 'Poppins', sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #5b8cff;">Welcome to DrapeDrop!</h2>
                <p>Use the following 6-digit OTP to complete your login:</p>
                <div style="font-size: 24px; font-weight: bold; color: #00f5a0; margin: 20px 0;">${otp}</div>
                <p>This OTP is valid for 5 minutes. If you didn't request this, please ignore this email.</p>
                <hr>
                <p style="font-size: 12px; color: #888;">&copy; 2026 DrapeDrop - Official Campus Merchandise Platform</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP ${otp} sent to ${email}`);
        res.status(200).json({ success: true, message: 'OTP sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
});

// Endpoint to verify OTP
app.post('/api/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const storedData = otpStore.get(email);

    if (!storedData) {
        return res.status(400).json({ success: false, message: 'No OTP requested for this email' });
    }

    if (Date.now() > storedData.expiry) {
        otpStore.delete(email);
        return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    if (storedData.otp === otp) {
        otpStore.delete(email); // One-time use
        res.status(200).json({ success: true, message: 'Verification successful!' });
    } else {
        res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
});

app.listen(port, () => {
    console.log(`OTP Server running at http://localhost:${port}`);
});
