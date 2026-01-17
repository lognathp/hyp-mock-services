/**
 * 2Factor SMS/OTP API Mock (Router)
 * Simulates 2factor.in SMS gateway for load testing
 *
 * Original URL format:
 *   https://2factor.in/API/V1/{key}/SMS/{mobile}/{otp}
 */

const express = require('express');
const crypto = require('crypto');

const router = express.Router();

const DELAY_MS = parseInt(process.env.RESPONSE_DELAY_MS || '50', 10);
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let requestCount = 0;
let otpStore = new Map(); // Store OTPs for verification

// Health check
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'mock-sms-2factor',
        requests: requestCount
    });
});

// Send OTP
// GET /API/V1/{key}/SMS/{mobile}/{otp}
router.get('/API/V1/:key/SMS/:mobile/:otp', async (req, res) => {
    requestCount++;
    await delay(DELAY_MS);

    const { mobile, otp } = req.params;

    // Store OTP
    otpStore.set(mobile, {
        otp,
        timestamp: Date.now(),
        verified: false
    });

    // Cleanup OTPs older than 10 minutes
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    for (const [m, data] of otpStore.entries()) {
        if (data.timestamp < tenMinutesAgo) {
            otpStore.delete(m);
        }
    }

    console.log(`📩 OTP sent to ${mobile.slice(-4)}: ${otp}`);

    res.json({
        Status: 'Success',
        Details: crypto.randomBytes(16).toString('hex'),
        OTP: otp // Included for load testing
    });
});


module.exports = router;