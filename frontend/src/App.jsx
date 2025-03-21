import { useState, useEffect } from 'react'
import StockChart from './components/Chart'
import api from './api'
import './App.css'

function App() {
  // State management
  const [stockData, setStockData] = useState([])
  const [currentPrice, setCurrentPrice] = useState(null)
  const [userPosition, setUserPosition] = useState({ cashBalance: 0, shares: 0 })
  const [tradeAmount, setTradeAmount] = useState(1)
  const [notification, setNotification] = useState({ message: '', type: '' })
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true)
        // Get historical stock data
        const historyData = await api.getStockHistory()
        setStockData(historyData)

        // Get current stock info
        const stockInfo = await api.getStockInfo()
        if (stockInfo) {
          setCurrentPrice(stockInfo.price)
        }

        // Get user position
        const position = await api.getUserPosition()
        if (position) {
          setUserPosition(position)
        }
      } catch (error) {
        console.error('Error fetching initial data:', error)
        showNotification('Failed to load initial data. Please refresh.', 'error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  // Set up socket listeners
  useEffect(() => {
    // Handle real-time stock updates
    const unsubscribeStockUpdate = api.onStockUpdate((data) => {
      setCurrentPrice(data.price)
      setStockData(prevData => {
        // Add new price to history
        const newData = [...prevData, { 
          price: data.price, 
          timestamp: new Date().toISOString() 
        }]
        
        // Keep only the last 30 points for performance
        if (newData.length > 30) {
          return newData.slice(newData.length - 30)
        }
        
        return newData
      })
    })

    // Handle user position updates
    const unsubscribePositionUpdate = api.onPositionUpdate((data) => {
      setUserPosition(data)
    })

    // Handle trade results
    const unsubscribeTradeResult = api.onTradeResult((result) => {
      if (result.success) {
        showNotification('Trade executed successfully!', 'success')
      } else {
        showNotification(result.message, 'error')
      }
    })

    // Handle connection status
    const unsubscribeConnect = api.onConnect(() => {
      setIsConnected(true)
      showNotification('Connected to server', 'success')
    })

    const unsubscribeDisconnect = api.onDisconnect(() => {
      setIsConnected(false)
      showNotification('Disconnected from server', 'error')
    })

    // Check initial connection state
    setIsConnected(api.isConnected())

    // Clean up listeners on unmount
    return () => {
      unsubscribeStockUpdate()
      unsubscribePositionUpdate()
      unsubscribeTradeResult()
      unsubscribeConnect()
      unsubscribeDisconnect()
    }
  }, [])

  // Helper to display notifications
  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: '', type: '' })
    }, 3000)
  }

  // Handle trade execution
  const executeTrade = async (action) => {
    if (tradeAmount <= 0) {
      showNotification('Please enter a valid amount', 'error')
      return
    }

    try {
      // Using WebSocket for trade execution (more responsive)
      api.emitTrade(action, tradeAmount)
      
      // Show pending notification
      showNotification(`Processing ${action} order...`, 'info')
    } catch (error) {
      console.error('Error executing trade:', error)
      showNotification('Failed to execute trade', 'error')
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>TALAVERA Stock Trader</h1>
        <div className="connection-status">
          <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </header>

      <main>
        {isLoading ? (
          <div className="loading">Loading stock data...</div>
        ) : (
          <>
            <section className="chart-container">
              <StockChart data={stockData} latestPrice={currentPrice} />
            </section>

            <section className="trading-panel">
              <div className="stock-info">
                <h2>TALAVERA</h2>
                <div className="price">
                  <span className="current-price">${currentPrice ? currentPrice.toFixed(2) : '0.00'}</span>
                </div>
              </div>

              <div className="user-position">
                <div className="balance-info">
                  <div className="info-item">
                    <h3>Cash Balance</h3>
                    <p>${userPosition.cashBalance.toFixed(2)}</p>
                  </div>
                  <div className="info-item">
                    <h3>Shares Owned</h3>
                    <p>{userPosition.shares}</p>
                  </div>
                  <div className="info-item">
                    <h3>Portfolio Value</h3>
                    <p>${(userPosition.shares * (currentPrice || 0)).toFixed(2)}</p>
                  </div>
                  <div className="info-item">
                    <h3>Total Value</h3>
                    <p>${(userPosition.cashBalance + (userPosition.shares * (currentPrice || 0))).toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="trade-controls">
                <div className="shares-input">
                  <label htmlFor="shares">Shares:</label>
                  <input
                    id="shares"
                    type="number"
                    min="1"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(Math.max(1, parseInt(e.target.value) || 0))}
                  />
                </div>

                <div className="trade-cost">
                  {currentPrice && (
                    <p>Cost: ${(tradeAmount * currentPrice).toFixed(2)}</p>
                  )}
                </div>

                <div className="trade-buttons">
                  <button 
                    className="buy-button"
                    onClick={() => executeTrade('buy')}
                    disabled={!isConnected || isLoading}
                  >
                    Buy
                  </button>
                  <button 
                    className="sell-button"
                    onClick={() => executeTrade('sell')}
                    disabled={!isConnected || isLoading || userPosition.shares < tradeAmount}
                  >
                    Sell
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {notification.message && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}
      </main>

      <footer>
        <p>Real-Time Stock Trading Demo</p>
      </footer>
    </div>
  )
}

export default App
