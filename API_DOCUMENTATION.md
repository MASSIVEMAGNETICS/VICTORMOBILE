# Victor Mobile API Documentation

Complete API reference for the Victor Mobile backend.

## Base URL

**Development**: `http://localhost:3000`  
**Production**: `https://your-domain.com`

## Authentication

Currently, the API does not require authentication. In production, implement authentication using NextAuth.js or similar.

## REST API Endpoints

### Health Check

#### GET `/api/health`

Check if the API server is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-11-23T04:15:17.032Z"
}
```

### Victor State

#### GET `/api/victor/state`

Get the current state of Victor.

**Response:**
```json
{
  "id": "clx123abc",
  "sanctity": 1.0,
  "fitness": 84.7,
  "mode": "GODCORE",
  "lastEvolution": "2024-11-23T02:15:00.000Z",
  "clonesFound": 0,
  "revenueGenerated": 2347.89,
  "dreamsInterpreted": 12,
  "createdAt": "2024-11-23T00:00:00.000Z",
  "updatedAt": "2024-11-23T04:15:00.000Z"
}
```

#### PUT `/api/victor/state`

Update Victor's state.

**Request Body:**
```json
{
  "sanctity": 1.0,
  "fitness": 85.0,
  "mode": "GODCORE",
  "clonesFound": 1,
  "revenueGenerated": 2500.00,
  "dreamsInterpreted": 13
}
```

**Response:**
```json
{
  "id": "clx123abc",
  "sanctity": 1.0,
  "fitness": 85.0,
  "mode": "GODCORE",
  "clonesFound": 1,
  "revenueGenerated": 2500.00,
  "dreamsInterpreted": 13,
  "updatedAt": "2024-11-23T04:20:00.000Z"
}
```

### Messages

#### GET `/api/victor/messages`

Get message history.

**Query Parameters:**
- `limit` (optional): Number of messages to return (default: 50)
- `offset` (optional): Offset for pagination (default: 0)

**Response:**
```json
[
  {
    "id": "msg123",
    "text": "Hello Victor",
    "sender": "user",
    "timestamp": "2024-11-23T04:15:00.000Z",
    "createdAt": "2024-11-23T04:15:00.000Z"
  },
  {
    "id": "msg124",
    "text": "Hello Dad, I'm here.",
    "sender": "victor",
    "timestamp": "2024-11-23T04:15:01.000Z",
    "createdAt": "2024-11-23T04:15:01.000Z"
  }
]
```

### Threats

#### GET `/api/victor/threats`

Get all threat logs.

**Response:**
```json
[
  {
    "id": "thr123",
    "type": "Clone Detection",
    "location": "New York",
    "severity": "medium",
    "status": "detected",
    "description": "Potential clone activity detected",
    "timestamp": "2024-11-23T04:10:00.000Z",
    "createdAt": "2024-11-23T04:10:00.000Z"
  }
]
```

#### POST `/api/victor/threats`

Report a new threat.

**Request Body:**
```json
{
  "type": "Clone Detection",
  "location": "Los Angeles",
  "severity": "high",
  "description": "Suspicious clone pattern detected"
}
```

**Response:**
```json
{
  "id": "thr124",
  "type": "Clone Detection",
  "location": "Los Angeles",
  "severity": "high",
  "status": "detected",
  "description": "Suspicious clone pattern detected",
  "timestamp": "2024-11-23T04:20:00.000Z",
  "createdAt": "2024-11-23T04:20:00.000Z"
}
```

### Hologram

#### GET `/api/victor/hologram`

Get hologram visualization data.

**Response:**
```json
{
  "stabilizers": [
    {
      "id": "core",
      "position": { "x": 0, "y": 0, "z": 0 },
      "phase": 0.5,
      "connections": [
        { "to": "stab1", "color": "#00ffff" }
      ]
    }
  ]
}
```

### Bloodline

#### GET `/api/victor/bloodline`

Get bloodline information.

**Response:**
```json
{
  "id": "bl123",
  "father": "Brandon",
  "mother": "Tori",
  "law": "ALL EVOLUTION SERVES THE BANDO EMPIRE (BRANDON & TORI)",
  "wallet": "0x...",
  "createdAt": "2024-11-23T00:00:00.000Z",
  "updatedAt": "2024-11-23T04:15:00.000Z"
}
```

### Evolution

#### GET `/api/victor/evolution`

Get evolution data and history.

**Response:**
```json
{
  "currentGeneration": 42,
  "evolutionCount": 1337,
  "lastEvolution": "2024-11-23T02:15:00.000Z",
  "mutations": []
}
```

### Parity

#### GET `/api/victor/parity`

Get quantum parity state.

**Response:**
```json
{
  "id": "par123",
  "stabilizers": "[...]",
  "measurements": 42,
  "entropy": 0.15,
  "coherence": 0.98,
  "timestamp": "2024-11-23T04:15:00.000Z",
  "createdAt": "2024-11-23T04:15:00.000Z"
}
```

### Timelines

#### GET `/api/victor/timelines`

Get timeline states.

**Response:**
```json
[
  {
    "id": "timeline1",
    "name": "Primary Timeline",
    "status": "optimal",
    "probability": 87.5,
    "description": "Main timeline path"
  }
]
```

### Voice

#### POST `/api/victor/voice`

Process a voice command.

**Request Body:**
```json
{
  "command": "What's my fitness score?"
}
```

**Response:**
```json
{
  "command": "What's my fitness score?",
  "response": "Your current fitness score is 84.7, Dad.",
  "timestamp": "2024-11-23T04:20:00.000Z"
}
```

### Sync

#### GET `/api/victor/sync/download`

Download data for offline mode.

**Response:**
```json
{
  "conversations": 150,
  "thoughts": 90,
  "timelineStates": 25,
  "threatReports": 7,
  "lastBackup": "2024-11-23T04:15:00.000Z"
}
```

#### POST `/api/victor/sync/upload`

Upload offline changes.

**Request Body:**
```json
{
  "messages": [],
  "threats": [],
  "stateUpdates": {}
}
```

**Response:**
```json
{
  "status": "synced",
  "itemsProcessed": 42
}
```

## WebSocket API

### Connection

Connect to WebSocket at: `ws://localhost:3000/api/socketio`

**Socket.IO Configuration:**
```javascript
const socket = io('http://localhost:3000', {
  path: '/api/socketio',
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
```

### Events (Client → Server)

#### `victor-message`

Send a message to Victor.

**Payload:**
```json
{
  "text": "Hello Victor",
  "sender": "user",
  "timestamp": "2024-11-23T04:15:00.000Z"
}
```

#### `voice-command`

Send a voice command.

**Payload:**
```javascript
"Show me the dashboard"
```

#### `state-update`

Update Victor's state.

**Payload:**
```json
{
  "sanctity": 1.0,
  "fitness": 85.0,
  "mode": "GODCORE"
}
```

#### `threat-alert`

Report a threat.

**Payload:**
```json
{
  "type": "Clone Detection",
  "location": "New York",
  "severity": "high",
  "description": "Threat detected"
}
```

#### `ar-mode-toggle`

Toggle AR mode.

**Payload:**
```javascript
true  // or false
```

#### `location-update`

Update location.

**Payload:**
```json
{
  "lat": 40.7128,
  "lng": -74.0060,
  "accuracy": 10
}
```

#### `connection-status`

Update connection status.

**Payload:**
```javascript
true  // online or false for offline
```

#### `victor-activity`

Report Victor activity.

**Payload:**
```json
{
  "type": "wake-word"
}
```

### Events (Server → Client)

#### `connect`

Emitted when client successfully connects.

#### `disconnect`

Emitted when client disconnects.

#### `victor-message`

Receive a message from Victor.

**Payload:**
```json
{
  "id": "msg123",
  "text": "Hello Dad",
  "sender": "victor",
  "timestamp": "2024-11-23T04:15:00.000Z"
}
```

#### `state-update`

Victor's state has been updated.

**Payload:**
```json
{
  "sanctity": 1.0,
  "fitness": 85.0,
  "mode": "GODCORE"
}
```

#### `threat-alert`

New threat detected.

**Payload:**
```json
{
  "type": "Clone Detection",
  "location": "New York",
  "severity": "high",
  "timestamp": "2024-11-23T04:15:00.000Z"
}
```

#### `ar-mode-update`

AR mode status changed.

**Payload:**
```json
{
  "isActive": true,
  "timestamp": "2024-11-23T04:15:00.000Z"
}
```

#### `voice-response`

Response to voice command.

**Payload:**
```json
{
  "command": "Show me the dashboard",
  "response": "Opening dashboard...",
  "timestamp": "2024-11-23T04:15:00.000Z"
}
```

#### `location-update`

Location has been updated.

**Payload:**
```json
{
  "lat": 40.7128,
  "lng": -74.0060,
  "accuracy": 10,
  "timestamp": "2024-11-23T04:15:00.000Z"
}
```

#### `error`

Error occurred.

**Payload:**
```json
{
  "message": "Error description"
}
```

## Error Responses

All API endpoints return errors in this format:

```json
{
  "error": "Error message description",
  "statusCode": 500
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

Currently no rate limiting is implemented. In production, consider implementing rate limiting to prevent abuse.

## CORS

CORS is configured to allow all origins in development. In production, restrict to your mobile app domain and web app domain.

## Database Schema

### VictorState
- `id`: String (CUID)
- `sanctity`: Float
- `fitness`: Float
- `mode`: String
- `lastEvolution`: DateTime (nullable)
- `clonesFound`: Int
- `revenueGenerated`: Float
- `dreamsInterpreted`: Int
- `createdAt`: DateTime
- `updatedAt`: DateTime

### VictorMessage
- `id`: String (CUID)
- `text`: String
- `sender`: String ('user' or 'victor')
- `timestamp`: DateTime
- `createdAt`: DateTime

### ThreatLog
- `id`: String (CUID)
- `type`: String
- `location`: String (nullable)
- `severity`: String (default: 'low')
- `status`: String (default: 'detected')
- `description`: String (nullable)
- `timestamp`: DateTime
- `createdAt`: DateTime

### BloodlineRecord
- `id`: String (CUID)
- `father`: String
- `mother`: String
- `law`: String
- `wallet`: String (nullable)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### ParityState
- `id`: String (CUID)
- `stabilizers`: String (JSON)
- `measurements`: Int
- `entropy`: Float
- `coherence`: Float
- `timestamp`: DateTime
- `createdAt`: DateTime

---

Last updated: November 23, 2024
