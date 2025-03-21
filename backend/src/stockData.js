// Stock data simulation with trading logic
const DEFAULT_STOCK_PRICE = 100.00;
const DEFAULT_CASH_BALANCE = 10000.00;
const STOCK_SYMBOL = 'TALAVERA';
const PRICE_VOLATILITY = 0.01; // 1% max change per interval

// Initial state
let stockState = {
  currentPrice: DEFAULT_STOCK_PRICE,
  previousPrices: [],  // Historical prices
  userPosition: {
    cashBalance: DEFAULT_CASH_BALANCE,
    shares: 0
  },
  transactions: []
};

// Generate random price change (up or down)
const generatePriceChange = () => {
  const changePercent = (Math.random() * 2 - 1) * PRICE_VOLATILITY;
  const rawPrice = stockState.currentPrice * (1 + changePercent);
  return parseFloat(rawPrice.toFixed(2));
};

// Update price and save history
const updateStockPrice = () => {
  const newPrice = generatePriceChange();
  
  // Keep history limited to 100 points for demo purposes
  if (stockState.previousPrices.length >= 100) {
    stockState.previousPrices.shift();
  }
  
  stockState.previousPrices.push({
    price: stockState.currentPrice,
    timestamp: new Date().toISOString()
  });
  
  stockState.currentPrice = newPrice;
  
  return {
    symbol: STOCK_SYMBOL,
    price: newPrice,
    change: newPrice - stockState.previousPrices[stockState.previousPrices.length - 1].price,
    changePercent: ((newPrice / stockState.previousPrices[stockState.previousPrices.length - 1].price) - 1) * 100
  };
};

// Get current stock info
const getStockInfo = () => {
  return {
    symbol: STOCK_SYMBOL,
    price: stockState.currentPrice,
    change: stockState.previousPrices.length > 0 
      ? stockState.currentPrice - stockState.previousPrices[stockState.previousPrices.length - 1].price 
      : 0,
    changePercent: stockState.previousPrices.length > 0 
      ? ((stockState.currentPrice / stockState.previousPrices[stockState.previousPrices.length - 1].price) - 1) * 100
      : 0
  };
};

// Get price history
const getStockHistory = () => {
  return stockState.previousPrices;
};

// Execute a trade
const executeTrade = (action, shares) => {
  // Convert shares to number
  shares = parseInt(shares);
  
  // Validate shares is a positive number
  if (isNaN(shares) || shares <= 0) {
    return { 
      success: false, 
      message: 'Invalid number of shares. Must be a positive number.' 
    };
  }
  
  if (action === 'buy') {
    const cost = shares * stockState.currentPrice;
    
    // Check if user has enough cash
    if (cost > stockState.userPosition.cashBalance) {
      return { 
        success: false, 
        message: 'Insufficient funds for this purchase.' 
      };
    }
    
    // Execute buy
    stockState.userPosition.cashBalance -= cost;
    stockState.userPosition.shares += shares;
    
    // Record transaction
    stockState.transactions.push({
      type: 'buy',
      shares,
      price: stockState.currentPrice,
      total: cost,
      timestamp: new Date().toISOString()
    });
    
    return {
      success: true,
      position: stockState.userPosition,
      transaction: stockState.transactions[stockState.transactions.length - 1]
    };
  } 
  else if (action === 'sell') {
    // Check if user has enough shares
    if (shares > stockState.userPosition.shares) {
      return { 
        success: false, 
        message: 'Not enough shares to sell.' 
      };
    }
    
    // Execute sell
    const revenue = shares * stockState.currentPrice;
    stockState.userPosition.cashBalance += revenue;
    stockState.userPosition.shares -= shares;
    
    // Record transaction
    stockState.transactions.push({
      type: 'sell',
      shares,
      price: stockState.currentPrice,
      total: revenue,
      timestamp: new Date().toISOString()
    });
    
    return {
      success: true,
      position: stockState.userPosition,
      transaction: stockState.transactions[stockState.transactions.length - 1]
    };
  }
  
  return { success: false, message: 'Invalid action. Use "buy" or "sell".' };
};

// Get user position
const getUserPosition = () => {
  return {
    ...stockState.userPosition,
    portfolioValue: stockState.userPosition.shares * stockState.currentPrice,
    totalValue: stockState.userPosition.cashBalance + (stockState.userPosition.shares * stockState.currentPrice)
  };
};

// Seed initial historical data (past 30 data points)
const seedHistoricalData = () => {
  // Clear existing data
  stockState.previousPrices = [];
  
  // Start from 30 intervals ago
  let mockPrice = DEFAULT_STOCK_PRICE;
  const now = new Date();
  
  for (let i = 30; i > 0; i--) {
    const timestamp = new Date(now.getTime() - (i * 1000));
    
    // Random walk with similar volatility
    const changePercent = (Math.random() * 2 - 1) * PRICE_VOLATILITY;
    mockPrice = parseFloat((mockPrice * (1 + changePercent)).toFixed(2));
    
    stockState.previousPrices.push({
      price: mockPrice,
      timestamp: timestamp.toISOString()
    });
  }
  
  // Set current price to last generated price
  stockState.currentPrice = mockPrice;
};

// Initialize with some historical data
seedHistoricalData();

module.exports = {
  updateStockPrice,
  getStockInfo,
  getStockHistory,
  executeTrade,
  getUserPosition
}; 