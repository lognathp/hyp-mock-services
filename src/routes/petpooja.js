const express = require('express');
const router = express.Router();

const DELAY_MS = parseInt(process.env.RESPONSE_DELAY_MS || '50', 10);
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let requestCount = 0;

// Health check
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'mock-petpooja',
        requests: requestCount
    });
});

// Push order to POS
router.post('/order/push', async (req, res) => {
    requestCount++;
    await delay(DELAY_MS);

    res.json({
        success: true,
        order_id: req.body.order_id || `PP-${Date.now()}`,
        pos_order_id: `POS-${Date.now()}`,
        message: 'Order received successfully'
    });
});

// Menu sync
router.get('/menu', async (req, res) => {
    requestCount++;
    await delay(DELAY_MS);

    res.json({
        success: true,
        menu: {
            categories: [],
            items: [],
            last_updated: new Date().toISOString()
        }
    });
});

// Order status update
router.post('/order/status', async (req, res) => {
    requestCount++;
    await delay(DELAY_MS);

    res.json({
        success: true,
        status: 'ACCEPTED'
    });
});

// Catch-all
router.all('*', async (req, res) => {
    requestCount++;
    await delay(DELAY_MS);

    res.json({
        success: true,
        mock: true,
        path: req.path,
        method: req.method
    });
});

module.exports = router;