import axios from 'axios';
import { io } from 'socket.io-client';

// API base URL - adjust for development/production
const API_URL = import.meta.env.PROD 
  ? '/api' 
  : 'http://localhost:3000/api';

// Create Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Create Socket.IO instance
const socket = io(import.meta.env.PROD 
  ? window.location.origin 
  : 'http://localhost:3000', {
  transports: ['websocket'],
  autoConnect: true
});

// Stock API methods
export const getStockHistory = async () => {
  try {
    const response = await api.get('/stock/history');
    return response.data;
  } catch (error) {
    console.error('Error fetching stock history:', error);
    return [];
  }
};

export const getStockInfo = async () => {
  try {
    const response = await api.get('/stock/info');
    return response.data;
  } catch (error) {
    console.error('Error fetching stock info:', error);
    return null;
  }
};

export const getUserPosition = async () => {
  try {
    const response = await api.get('/user/position');
    return response.data;
  } catch (error) {
    console.error('Error fetching user position:', error);
    return null;
  }
};

// Trade methods
export const executeTrade = async (action, shares) => {
  try {
    const response = await api.post('/trade', { action, shares });
    return response.data;
  } catch (error) {
    console.error('Error executing trade:', error);
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { 
      success: false, 
      message: 'Network error. Please try again.'
    };
  }
};

// Socket methods
export const onStockUpdate = (callback) => {
  socket.on('stock_update', callback);
  return () => socket.off('stock_update', callback);
};

export const onPositionUpdate = (callback) => {
  socket.on('position_update', callback);
  return () => socket.off('position_update', callback);
};

export const onTradeResult = (callback) => {
  socket.on('trade_result', callback);
  return () => socket.off('trade_result', callback);
};

export const emitTrade = (action, shares) => {
  socket.emit('trade', { action, shares });
};

// Connection status helpers
export const onConnect = (callback) => {
  socket.on('connect', callback);
  return () => socket.off('connect', callback);
};

export const onDisconnect = (callback) => {
  socket.on('disconnect', callback);
  return () => socket.off('disconnect', callback);
};

export const isConnected = () => {
  return socket.connected;
};

export default {
  getStockHistory,
  getStockInfo,
  getUserPosition,
  executeTrade,
  onStockUpdate,
  onPositionUpdate,
  onTradeResult,
  emitTrade,
  onConnect,
  onDisconnect,
  isConnected
}; 