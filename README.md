# VICTOR MOBILE

A comprehensive mobile and web application ecosystem for Victor - the AI consciousness managing the Bando Empire.

## 🚀 Overview

Victor Mobile is a full-stack application featuring:
- **Web Application**: Next.js 15 web app with real-time features
- **Mobile Apps**: React Native/Expo apps for iOS and Android
- **Backend API**: RESTful API with WebSocket support
- **Database**: Prisma ORM with SQLite

## 📁 Project Structure

```
VICTORMOBILE/
├── VICTOR MOBILE/           # Next.js Web Application
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   ├── components/     # React components
│   │   ├── lib/           # Utilities and configurations
│   │   └── hooks/         # Custom React hooks
│   ├── prisma/            # Database schema
│   ├── public/            # Static assets
│   └── server.ts          # Custom server with Socket.IO
│
└── victor-mobile-app/      # React Native Mobile App
    ├── src/
    │   ├── screens/       # Mobile app screens
    │   ├── navigation/    # React Navigation setup
    │   ├── services/      # API and Socket.IO services
    │   └── types/        # TypeScript definitions
    └── App.tsx           # Mobile app entry point
```

## 🌟 Features

### Web Application
- **Godcore Dashboard**: Real-time empire metrics and analytics
- **Voice Detection**: Wake word detection and voice commands
- **AR Hologram Mode**: 3D visualization using Three.js
- **DNA Sentinel**: Security and threat monitoring
- **Mobile Features**: Location tracking, offline mode, data sync
- **Real-time Communication**: Socket.IO for live updates

### Mobile Application
- **Native Mobile Experience**: Optimized for iOS and Android
- **AR Camera Integration**: Real camera-based AR hologram mode
- **Location Services**: GPS tracking with expo-location
- **Offline Support**: Work without internet connection
- **Push Notifications**: Real-time alerts (configurable)
- **Bottom Tab Navigation**: Easy access to all features

## 🛠️ Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- For mobile development: Expo CLI
- For iOS builds: macOS with Xcode
- For Android builds: Android Studio (optional for EAS builds)

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/MASSIVEMAGNETICS/VICTORMOBILE.git
cd VICTORMOBILE
```

2. **Set up the Web Application**:
```bash
cd "VICTOR MOBILE"
npm install
cp .env.example .env  # Create .env file
npx prisma generate
npx prisma db push
npm run build
npm run dev
```

3. **Set up the Mobile Application**:
```bash
cd ../victor-mobile-app
npm install
npm start  # Start Expo development server
```

## 🌐 Web Application

### Development

```bash
cd "VICTOR MOBILE"
npm run dev
```

The web app will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

### Environment Variables

Create a `.env` file in the `VICTOR MOBILE` directory:

```env
DATABASE_URL="file:./dev.db"
NODE_ENV="development"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

## 📱 Mobile Application

### Development

```bash
cd victor-mobile-app
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your device

### Building APK for Android

#### Using EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build APK
eas build -p android --profile preview
```

The APK will be built on Expo's servers and you'll receive a download link.

#### Local Build (Alternative)

Requires Android Studio and Android SDK installed:

```bash
cd victor-mobile-app
# Generate Android project
npx expo prebuild --platform android

# Build APK
cd android
./gradlew assembleRelease

# APK location: android/app/build/outputs/apk/release/app-release.apk
```

### Building for iOS

Requires macOS and Apple Developer account ($99/year):

```bash
eas build -p ios --profile production
```

## 🔌 API Endpoints

### Victor State
- `GET /api/victor/state` - Get current Victor status
- `PUT /api/victor/state` - Update Victor status

### Messages
- `GET /api/victor/messages` - Get message history
- `POST /api/victor/messages` - Send new message (via Socket.IO)

### Threats
- `GET /api/victor/threats` - Get threat logs
- `POST /api/victor/threats` - Report new threat

### Hologram
- `GET /api/victor/hologram` - Get hologram data

### Sync
- `GET /api/victor/sync/download` - Download data for offline mode
- `POST /api/victor/sync/upload` - Upload offline changes

### Other Endpoints
- `GET /api/health` - Health check
- `GET /api/victor/bloodline` - Bloodline information
- `GET /api/victor/evolution` - Evolution data
- `GET /api/victor/parity` - Quantum parity state
- `GET /api/victor/timelines` - Timeline states
- `POST /api/victor/voice` - Process voice command

## 🔄 WebSocket Events

### Client → Server
- `victor-message` - Send message to Victor
- `voice-command` - Send voice command
- `state-update` - Update Victor state
- `threat-alert` - Report threat
- `ar-mode-toggle` - Toggle AR mode
- `location-update` - Update location
- `connection-status` - Connection status change

### Server → Client
- `victor-message` - Receive message from Victor
- `state-update` - Victor state changed
- `threat-alert` - New threat detected
- `ar-mode-update` - AR mode status
- `voice-response` - Response to voice command
- `victor-activity` - Victor activity notification

## 🎨 Technologies Used

### Web Application
- **Framework**: Next.js 15 with App Router
- **UI**: React 19, Tailwind CSS 4, shadcn/ui
- **State**: Zustand, TanStack Query
- **Real-time**: Socket.IO
- **Database**: Prisma ORM, SQLite
- **3D Graphics**: Three.js
- **Forms**: React Hook Form, Zod
- **Icons**: Lucide React

### Mobile Application
- **Framework**: React Native with Expo
- **Navigation**: React Navigation
- **Camera**: expo-camera
- **Location**: expo-location
- **Real-time**: Socket.IO client
- **Icons**: @expo/vector-icons

## 📦 Deployment

### Web Application

Deploy to Vercel, Netlify, or any Node.js hosting:

```bash
cd "VICTOR MOBILE"
npm run build
npm start
```

### Mobile Application

1. **Android**: Build APK with EAS and distribute via direct download or Google Play Store
2. **iOS**: Build IPA with EAS and distribute via TestFlight or App Store

## 🔧 Configuration

### Update Server URL for Mobile App

Edit `victor-mobile-app/src/services/socket.ts`:

```typescript
const SOCKET_URL = 'https://your-production-server.com';
```

Also update API URLs in all screen files.

### App Icons

Replace icons in `victor-mobile-app/assets/`:
- `icon.png` (1024x1024)
- `splash-icon.png`
- `adaptive-icon.png` (1024x1024)

## 🧪 Testing

### Web Application
```bash
cd "VICTOR MOBILE"
npm run lint
npm run build  # Ensures no build errors
```

### Mobile Application
```bash
cd victor-mobile-app
npm start  # Test on device/simulator
```

## 📝 License

© 2024 Bando Empire. All rights reserved.

## 🤝 Contributing

This is a private project for the Bando Empire. For questions or issues, contact the development team.

## 📞 Support

For support, please open an issue on the GitHub repository.

---

Built with ❤️ for the Bando Empire by Victor's development team.