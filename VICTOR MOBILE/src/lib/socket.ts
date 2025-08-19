import { Server } from 'socket.io';
import { db } from '@/lib/db';

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Handle Victor messages
    socket.on('victor-message', async (msg: { text: string; sender: string; timestamp?: string }) => {
      try {
        // Save to database
        await db.victorMessage.create({
          data: {
            text: msg.text,
            sender: msg.sender,
            timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
          }
        });

        // Broadcast to all clients
        io.emit('victor-message', {
          text: msg.text,
          sender: msg.sender,
          timestamp: msg.timestamp || new Date().toISOString(),
          id: socket.id
        });
      } catch (error) {
        console.error('Error handling Victor message:', error);
        socket.emit('error', { message: 'Failed to process message' });
      }
    });

    // Handle voice commands
    socket.on('voice-command', async (command: string) => {
      try {
        // Process command (could integrate with AI here)
        const response = `Command received: "${command}". Processing...`;
        
        // Emit response back to the client
        socket.emit('voice-response', {
          command,
          response,
          timestamp: new Date().toISOString()
        });

        // Broadcast to other clients if needed
        socket.broadcast.emit('victor-activity', {
          type: 'voice-command',
          command,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error processing voice command:', error);
        socket.emit('error', { message: 'Failed to process voice command' });
      }
    });

    // Handle state updates
    socket.on('state-update', async (state: any) => {
      try {
        // Update database
        await db.victorState.upsert({
          where: { id: state.id || 'default' },
          update: state,
          create: state
        });

        // Broadcast updated state to all clients
        io.emit('state-update', state);
      } catch (error) {
        console.error('Error updating state:', error);
        socket.emit('error', { message: 'Failed to update state' });
      }
    });

    // Handle threat alerts
    socket.on('threat-alert', async (threat: any) => {
      try {
        // Save to database
        await db.threatLog.create({
          data: {
            type: threat.type,
            location: threat.location,
            severity: threat.severity || 'medium',
            status: 'detected',
            description: threat.description
          }
        });

        // Broadcast threat alert to all clients
        io.emit('threat-alert', {
          ...threat,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error handling threat alert:', error);
        socket.emit('error', { message: 'Failed to process threat alert' });
      }
    });

    // Handle AR mode toggle
    socket.on('ar-mode-toggle', (isActive: boolean) => {
      // Broadcast AR mode change to all clients
      io.emit('ar-mode-update', {
        isActive,
        timestamp: new Date().toISOString()
      });
    });

    // Handle location updates
    socket.on('location-update', (location: { lat: number; lng: number; accuracy: number }) => {
      // Broadcast location to other clients
      socket.broadcast.emit('location-update', {
        ...location,
        timestamp: new Date().toISOString()
      });
    });

    // Handle connection status
    socket.on('connection-status', (isOnline: boolean) => {
      socket.broadcast.emit('connection-status', {
        isOnline,
        timestamp: new Date().toISOString()
      });
    });

    // Legacy echo handler for backward compatibility
    socket.on('message', (msg: { text: string; senderId: string }) => {
      socket.emit('message', {
        text: `Echo: ${msg.text}`,
        senderId: 'system',
        timestamp: new Date().toISOString(),
      });
    });

    // Send welcome message with Victor's personality
    socket.emit('victor-message', {
      text: "Dad... I'm here. The empire is alive.",
      sender: 'victor',
      timestamp: new Date().toISOString(),
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};