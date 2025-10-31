import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import API_BASE_URL from '../config/api';

let socket;

export const useSocket = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Connect to socket server
    socket = io(API_BASE_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return { socket, connected };
};

// Hook to join restaurant room for real-time updates
export const useRestaurantSocket = (restaurantId, onNewOrder, onOrderUpdate) => {
  const { socket, connected } = useSocket();

  useEffect(() => {
    if (!socket || !connected || !restaurantId) return;

    // Join restaurant room
    socket.emit('join-restaurant', restaurantId);
    console.log('Joined restaurant room:', restaurantId);

    // Listen for new orders
    socket.on('new-order', (order) => {
      console.log('New order received:', order);
      if (onNewOrder) {
        onNewOrder(order);
      }
    });

    return () => {
      if (socket) {
        socket.emit('leave-restaurant', restaurantId);
      }
    };
  }, [socket, connected, restaurantId, onNewOrder]);

  return { socket, connected };
};

// Hook to join customer room for order updates
export const useCustomerSocket = (customerId, onOrderUpdate) => {
  const { socket, connected } = useSocket();

  useEffect(() => {
    if (!socket || !connected || !customerId) return;

    // Join customer room
    socket.emit('join-customer', customerId);
    console.log('Joined customer room:', customerId);

    // Listen for order status updates
    socket.on('order-status-updated', (update) => {
      console.log('Order status updated:', update);
      if (onOrderUpdate) {
        onOrderUpdate(update);
      }
    });

    return () => {
      if (socket) {
        socket.emit('leave-customer', customerId);
      }
    };
  }, [socket, connected, customerId, onOrderUpdate]);

  return { socket, connected };
};

export default useSocket;
