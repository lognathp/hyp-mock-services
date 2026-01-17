# hyp-mock-services

Unified mock gateway for load testing HYP backend services. Provides mock implementations of third-party APIs including PetPooja POS, Pidge delivery, and 2Factor SMS/OTP services.

## Features

- **Configurable response delays** - Simulate realistic network latency
- **Request metrics tracking** - Monitor request counts per service
- **Health check endpoints** - Monitor service availability
- **Docker support** - Easy containerized deployment

## Mock Services

### OTP Service (`/mock/otp`)
Mocks the 2Factor.in SMS gateway API.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/API/V1/:key/SMS/:mobile/:otp` | GET | Send OTP to mobile number |
| `/health` | GET | Service health check |

### PetPooja POS (`/mock/petpooja`)
Mocks the PetPooja restaurant POS integration.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/order/push` | POST | Push order to POS |
| `/order/status` | POST | Update order status |
| `/menu` | GET | Fetch menu data |
| `/health` | GET | Service health check |

### Pidge Delivery (`/mock/pidge`)
Mocks the Pidge delivery partner API.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1.0/store/auth/token` | POST | Get auth token |
| `/v1.0/store/channel/vendor/order` | POST | Create delivery order |
| `/v1.0/store/channel/vendor/order/fulfill` | POST | Fulfill delivery order |
| `/v1.0/store/channel/vendor/order/fulfill/smart` | POST | Smart fulfill |
| `/v1.0/store/channel/vendor/order/:orderId` | GET | Get order status |
| `/v1.0/store/channel/vendor/order/:orderId/cancel` | POST | Cancel order |
| `/v1.0/store/channel/vendor/quote` | POST | Get delivery quote |
| `/v1.0/store/quote` | POST | Legacy quote endpoint |
| `/v1.0/store/tracking/rider-location` | GET | Get rider location |
| `/health` | GET | Service health check |

## Quick Start

### Local Development

```bash
npm install
npm start
```

### Docker

```bash
docker build -t hyp-mock-services .
docker run -p 8090:8090 hyp-mock-services
```

## Configuration

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| `PORT` | `8090` | Server port |
| `RESPONSE_DELAY_MS` | `50` | Simulated response delay in milliseconds |

## Health Check

```bash
curl http://localhost:8090/health
```

Response:
```json
{
  "status": "healthy",
  "service": "hyp-mock-gateway"
}
```

## Project Structure

```
src/
├── index.js           # Main entry point
├── config/
│   └── env.js         # Environment configuration
├── routes/
│   ├── otp.js         # 2Factor SMS mock
│   ├── petpooja.js    # PetPooja POS mock
│   └── pidge.js       # Pidge delivery mock
└── utils/
    ├── delay.js       # Response delay middleware
    └── metrics.js     # Request counting middleware
```

## Usage with HYP Backend

Configure HYP backend to use mock services by adding to `.env` or `application.properties`:

```properties
# Pidge delivery mock
delivery.pidge.url=http://localhost:8090/mock/pidge

# PetPooja POS mock
pos.petpooja.url=http://localhost:8090/mock/petpooja

# SMS/OTP mock
sms.2factor.url=http://localhost:8090/mock/otp
```

## Load Testing

This service is designed for use with [hyp-api-k6](../hyp-api-k6) load testing suite.

```bash
# 1. Start mock services
npm start

# 2. Configure backend to use mocks (see above)

# 3. Run load tests
cd ../hyp-api-k6
./scripts/run-tests.sh lifecycle --restaurant 324672
```

## License

ISC