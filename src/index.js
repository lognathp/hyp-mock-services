const express = require('express');
const { PORT } = require('./config/env');

const app = express();
app.use(express.json());

// Global middleware
app.use(require('./utils/metrics'));
app.use(require('./utils/delay'));

// Routes
app.use('/mock/otp', require('./routes/otp'));
app.use('/mock/petpooja', require('./routes/petpooja'));
app.use('/mock/pidge', require('./routes/pidge'));

// Health
app.get('/health', (_, res) => {
  res.json({ status: 'healthy', service: 'hyp-mock-gateway' });
});

app.listen(PORT, () =>
  console.log(`🚀 Mock Gateway running on port ${PORT}`)
);