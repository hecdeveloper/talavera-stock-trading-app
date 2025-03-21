# Real-Time Stock Trading App

A real-time stock trading simulator that allows users to buy and sell stocks with virtual money. This project demonstrates WebSocket-based real-time updates, charting, and a responsive UI.

![Stock Trading App Screenshot](https://via.placeholder.com/800x400?text=Stock+Trading+App)

## Features

- 📈 Real-time stock price updates (every second)
- 💰 Virtual cash balance for trading
- 📊 Interactive price chart
- 🛒 Buy and sell stock shares
- 💼 Portfolio tracking (shares owned, portfolio value)
- 📱 Responsive design for desktop and mobile
- 🔄 WebSocket-based communication

## Technology Stack

### Backend
- Node.js with Express
- Socket.IO for real-time communication
- RESTful API endpoints
- In-memory data simulation

### Frontend
- React (with Vite)
- Socket.IO client
- Chart.js for data visualization
- Responsive CSS

### Infrastructure
- Docker & Docker Compose
- NGINX as reverse proxy
- Multi-container architecture

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development)

### Installation & Running (with Docker)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd stock-trading-app
   ```

2. Build and start the containers:
   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - Web UI: http://localhost
   - API: http://localhost/api
   
### Development Setup

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Documentation

### REST Endpoints

- `GET /api/stock/history` - Get historical stock data
- `GET /api/stock/info` - Get current stock information
- `GET /api/user/position` - Get user's current position (cash, shares)
- `POST /api/trade` - Execute a trade

### WebSocket Events

- `stock_update` - Real-time stock price updates
- `position_update` - User position updates after trades
- `trade_result` - Trade execution result

## Code Structure

```
project-root/
│
├── backend/                # Node.js server
│   ├── src/
│   │   ├── index.js        # Express + Socket.IO server
│   │   └── stockData.js    # Stock data simulation
│   └── Dockerfile
│
├── frontend/               # React application
│   ├── src/
│   │   ├── App.jsx         # Main component
│   │   ├── components/     # UI components
│   │   └── api.js          # API client
│   └── Dockerfile
│
├── nginx/                  # NGINX configuration
│   └── nginx.conf
│
└── docker-compose.yml      # Multi-container orchestration
```

## Scalability Considerations

This application is designed as a demo/prototype but could be scaled for production with the following enhancements:

- **Database Integration**: Replace in-memory storage with MongoDB or PostgreSQL
- **Authentication**: Add user authentication (JWT, OAuth)
- **Multiple Stocks**: Support for trading various stocks/assets
- **Horizontal Scaling**: Load balancing with multiple backend instances
- **Queue System**: RabbitMQ or Redis for trade processing
- **WebSocket Clustering**: Redis adapter for Socket.IO to handle multiple instances

## Future Improvements

- [ ] User authentication and accounts
- [ ] Transaction history
- [ ] Order types (limit, stop loss)
- [ ] News feed integration
- [ ] Mobile application (React Native)
- [ ] Comprehensive test suite
- [ ] CI/CD pipeline

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This project was created as a demonstration of real-time web technologies and is not intended for actual trading. 