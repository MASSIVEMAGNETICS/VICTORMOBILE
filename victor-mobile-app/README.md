# Victor Mobile - Native Mobile App

A React Native mobile application built with Expo for iOS and Android platforms.

## Features

- **Real-time Communication**: Socket.IO integration for live updates from Victor
- **AR Hologram Mode**: Camera-based AR visualization of Victor
- **Security Dashboard**: DNA Sentinel threat monitoring
- **Location Services**: GPS tracking for context-aware responses
- **Offline Mode**: Work without internet connection with local data sync
- **Native Mobile Experience**: Optimized for iOS and Android devices

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Expo CLI
- For iOS development: macOS with Xcode
- For Android development: Android Studio

## Installation

1. Navigate to the mobile app directory:
```bash
cd victor-mobile-app
```

2. Install dependencies:
```bash
npm install
```

## Development

### Running on Expo Go (Easiest)

1. Install Expo Go app on your iOS/Android device
2. Start the development server:
```bash
npm start
```
3. Scan the QR code with your device camera (iOS) or Expo Go app (Android)

### Running on iOS Simulator (macOS only)

```bash
npm run ios
```

### Running on Android Emulator

```bash
npm run android
```

### Running on Web

```bash
npm run web
```

## Building for Production

### Prerequisites for Building

Install EAS CLI:
```bash
npm install -g eas-cli
```

Login to Expo:
```bash
eas login
```

### Configure EAS Build

Initialize EAS:
```bash
eas build:configure
```

### Build Android APK

For development APK:
```bash
eas build -p android --profile preview
```

For production APK:
```bash
eas build -p android --profile production
```

The build will run on Expo's cloud servers and provide a download link when complete.

### Build iOS App (requires macOS)

For development:
```bash
eas build -p ios --profile development
```

For App Store:
```bash
eas build -p ios --profile production
```

Note: iOS builds require Apple Developer Program membership ($99/year).

## Local APK Build (Alternative)

If you want to build locally without EAS:

1. Install Android Studio and set up Android SDK
2. Configure environment variables:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

3. Build the APK:
```bash
cd android
./gradlew assembleRelease
```

The APK will be generated at:
`android/app/build/outputs/apk/release/app-release.apk`

## Configuration

### Update Server URL

Edit `src/services/socket.ts` and change the `SOCKET_URL`:

```typescript
const SOCKET_URL = 'https://your-server-url.com'; // Production server
```

Also update API URLs in screen files:
- `src/screens/HomeScreen.tsx`
- `src/screens/DashboardScreen.tsx`
- `src/screens/SecurityScreen.tsx`

### App Icons and Splash Screen

Replace the following files in the `assets` directory:
- `icon.png` - App icon (1024x1024px)
- `splash-icon.png` - Splash screen image
- `adaptive-icon.png` - Android adaptive icon foreground (1024x1024px)

## Project Structure

```
victor-mobile-app/
├── src/
│   ├── screens/          # Main app screens
│   │   ├── HomeScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── ARScreen.tsx
│   │   ├── SecurityScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── navigation/       # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── services/         # Services (Socket.IO, API)
│   │   └── socket.ts
│   └── types/           # TypeScript type definitions
│       └── index.ts
├── App.tsx              # Main app entry point
├── app.json            # Expo configuration
└── package.json        # Dependencies
```

## Permissions

The app requires the following permissions:

### Android
- `CAMERA` - For AR hologram mode
- `ACCESS_FINE_LOCATION` - For GPS tracking
- `ACCESS_COARSE_LOCATION` - For location services
- `RECORD_AUDIO` - For voice commands (future feature)

### iOS
- Camera Usage - For AR hologram mode
- Location When In Use - For location services

## Troubleshooting

### Metro Bundler Issues

Clear cache and restart:
```bash
npm start -- --clear
```

### Android Build Fails

Clean and rebuild:
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### iOS Pod Install Issues

```bash
cd ios
pod install --repo-update
cd ..
npm run ios
```

## Support

For issues and questions, visit the repository issues page.

## License

© 2024 Bando Empire. All rights reserved.
