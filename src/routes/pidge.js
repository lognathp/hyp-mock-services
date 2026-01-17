/**
 * Pidge Delivery API Mock (Router)
 * Simulates the Pidge delivery partner API for load testing
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

const DELAY_MS = parseInt(process.env.RESPONSE_DELAY_MS || '50', 10);

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Request counter for metrics
let requestCount = 0;

// Health check
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'mock-pidge',
        requests: requestCount
    });
});

// Authentication - Token endpoint
router.post('/v1.0/store/auth/token', async (req, res) => {
    requestCount++;
    await delay(DELAY_MS);

    res.json({
        success: true,
        data: {
            token: `mock-pidge-token-${Date.now()}`,
            expires_in: 3600
        }
    });
});

// Create delivery order
router.post('/v1.0/store/channel/vendor/order', async (req, res) => {
    requestCount++;
    await delay(DELAY_MS);

    const trips = req.body?.trips || [];
    const responseData = {};

    trips.forEach(trip => {
        const sourceOrderId = trip.source_order_id;
        if (sourceOrderId) {
            const deliveryId =
                `${Date.now()}${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
            responseData[sourceOrderId] = deliveryId;
        }
    });

    if (Object.keys(responseData).length === 0) {
        const defaultId =
            `${Date.now()}${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        responseData.default = defaultId;
    }

    res.json({ data: responseData });
});

// Fulfill delivery order
router.post('/v1.0/store/channel/vendor/order/fulfill', async (req, res) => {
    requestCount++;
    await delay(DELAY_MS);

    res.json({
        data: {
            fulfilled: false,
            message: 'Allocation successful',
            quote: null,
            network_id: 0,
            network_name: null
        }
    });
});

// Smart fulfill
router.post('/v1.0/store/channel/vendor/order/fulfill/smart', async (req, res) => {
    requestCount++;
    await delay(DELAY_MS + 50);

    res.json({
        data: {
            fulfilled: false,
            message: 'Allocation successful',
            quote: null,
            network_id: 0,
            network_name: null
        }
    });
});

// Get order status
router.get('/v1.0/store/channel/vendor/order/:orderId', async (req, res) => {
    requestCount++;
    await delay(DELAY_MS);

    const statuses = ['CREATED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    res.json({
        success: true,
        data: {
            order_id: req.params.orderId,
            status: randomStatus,
            rider_location: {
                lat: 13.0827 + Math.random() * 0.05,
                lng: 80.2707 + Math.random() * 0.05
            },
            updated_at: new Date().toISOString()
        }
    });
});

// Get rider location
router.get('/v1.0/store/tracking/rider-location', async (req, res) => {
    requestCount++;
    await delay(DELAY_MS);

    res.json({
        success: true,
        data: {
            rider_id: req.query.rider_id || 'RIDER-001',
            location: {
                latitude: 13.0827 + Math.random() * 0.05,
                longitude: 80.2707 + Math.random() * 0.05
            }
        }
    });
});

// Cancel order
router.post('/v1.0/store/channel/vendor/order/:orderId/cancel', async (req, res) => {
    requestCount++;
    await delay(DELAY_MS);

    res.json({
        success: true,
        data: {
            order_id: req.params.orderId,
            status: 'CANCELLED',
            cancelled_at: new Date().toISOString()
        }
    });
});

// Delivery quote (primary)
router.post('/v1.0/store/channel/vendor/quote', async (req, res) => {
    requestCount++;
    await delay(DELAY_MS);

    const pickupTime = new Date(Date.now() + 15 * 60000).toISOString();
    const dropTime = new Date(Date.now() + 30 * 60000).toISOString();
    const dropRef = req.body?.drop?.[0]?.ref || `PGQ${Date.now()}`;
    const distanceMeters = Math.floor(Math.random() * 8000) + 2000;

    res.json({
        data: {
            distance: [{ ref: dropRef, distance: distanceMeters }],
            items: [
                {
                    network_id: 2,
                    network_name: 'wefast',
                    service: 'wefast',
                    pickup_now: true,
                    quote: {
                        price: 138.27,
                        distance: distanceMeters,
                        eta: {
                            pickup: pickupTime,
                            pickup_min: 15,
                            drop: dropTime,
                            drop_min: 30
                        }
                    },
                    error: null
                }
            ]
        }
    });
});

// Legacy quote endpoint
router.post('/v1.0/store/quote', async (req, res) => {
    requestCount++;
    await delay(DELAY_MS);

    res.json({
        success: true,
        data: {
            quote_id: `QUOTE-${uuidv4().substring(0, 8)}`,
            delivery_fee: Math.floor(Math.random() * 50) + 30,
            distance_km: Math.floor(Math.random() * 10) + 1,
            estimated_time_minutes: Math.floor(Math.random() * 30) + 20,
            valid_until: new Date(Date.now() + 10 * 60000).toISOString()
        }
    });
});

// Catch-all
router.all('*', async (req, res) => {
    requestCount++;
    await delay(DELAY_MS);

    res.status(200).json({
        success: true,
        message: 'Mock endpoint - not specifically implemented',
        path: req.path,
        method: req.method
    });
});

module.exports = router;