# Real-Time Stock Trading App

A real-time stock trading simulator that allows users to buy and sell stocks with virtual money. This project demonstrates WebSocket-based real-time updates, charting with optimistic UI updates, and a responsive design.



## Features

- 📈 Real-time stock price updates via WebSockets (every second)
- 💰 Virtual cash balance starting at $10,000
- 📊 Interactive price chart with dynamic updates
- 🛒 Buy and sell stock shares with real-time feedback
- 💼 Portfolio tracking (shares owned, portfolio value)
- 📱 Responsive design for desktop and mobile
- 🔄 Optimistic UI updates with rollback on errors

## Technology Stack

### Backend
- Node.js with Express
- Socket.IO for real-time WebSocket communication
- RESTful API endpoints
- In-memory data simulation

### Frontend
- React (with Vite)
- Socket.IO client for WebSocket communication
- Chart.js for data visualization
- Optimistic UI updates
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

**Note**: To run the development servers locally, make sure you have the following global packages installed:
```bash
npm install -g vite nodemon
```

## API Documentation

### REST Endpoints

- `GET /api/stock/history` - Get historical stock data (last 50 price points)
- `GET /api/stock/info` - Get current stock information (symbol and price)
- `GET /api/user/position` - Get user's current position (cash, shares)
- `POST /api/trade` - Execute a trade

### WebSocket Events

- `stock_update` - Real-time stock price updates (every second)
- `position_update` - User position updates after trades
- `trade_result` - Trade execution result with success/error

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

## Trading Logic

- **Buy**: Verify user has sufficient cash before executing
- **Sell**: Verify user has sufficient shares before executing
- **Optimistic UI**: Updates immediately, rolls back on error response
- **Validation**: Server-side validation of all trade operations

## Scalability Considerations

This application is designed as a demonstration but could be scaled for production:

- **Database Integration**: Replace in-memory storage with MongoDB or Redis
- **Authentication**: Add JWT-based user authentication
- **Multiple Stocks**: Support for trading various stocks/assets
- **Horizontal Scaling**: Load balancing with multiple backend instances
- **WebSocket Clustering**: Redis adapter for Socket.IO to handle multiple instances
- **Kafka**: For real price ingestion from external sources

## Future Improvements

- [ ] User authentication via JWT
- [ ] Transaction history
- [ ] Order types (limit, stop loss)
- [ ] News feed integration
- [ ] Historical graph zoom functionality
- [ ] Multiple stock selection
- [ ] Persistence layer with MongoDB or Redis

## Test Cases

- App loads historical data (50 points)
- Chart auto-updates every second
- Price is readable and prominent
- "Buy" subtracts cash, adds shares (if valid)
- "Sell" subtracts shares, adds cash (if valid)
- Invalid trades are rejected + UI rollback
- Real-time behavior consistent across refresh

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This project was created as a demonstration of real-time web technologies and is not intended for actual trading.
- Built as part of a take-home coding challenge to be completed in 2-3 hours. 
