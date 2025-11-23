# Build and Deployment Guide

This guide provides step-by-step instructions for building and deploying both the web and mobile applications.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Web Application Deployment](#web-application-deployment)
- [Mobile App Build](#mobile-app-build)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### For All Builds
- Node.js 18 or higher
- npm or yarn package manager
- Git

### For Mobile Builds
- Expo account (free tier works)
- EAS CLI: `npm install -g eas-cli`

### For iOS Builds (Optional)
- macOS with Xcode 14 or higher
- Apple Developer account ($99/year)

### For Android Builds (Optional Local Build)
- Android Studio
- Android SDK 33 or higher
- Java JDK 17

## Web Application Deployment

### Step 1: Prepare the Application

```bash
cd "VICTOR MOBILE"
npm install
```

### Step 2: Set Up Environment

Create `.env` file:
```env
DATABASE_URL="file:./prod.db"
NODE_ENV="production"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="generate-a-secure-random-string-here"
```

Generate secure secret:
```bash
openssl rand -base64 32
```

### Step 3: Initialize Database

```bash
npx prisma generate
npx prisma db push
```

### Step 4: Build

```bash
npm run build
```

### Step 5: Deploy

#### Option A: Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow prompts and configure environment variables in Vercel dashboard

#### Option B: Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t victor-mobile .
docker run -p 3000:3000 victor-mobile
```

#### Option C: Traditional VPS

1. Upload files to server
2. Install dependencies: `npm ci`
3. Build: `npm run build`
4. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start npm --name "victor-mobile" -- start
pm2 save
pm2 startup
```

## Mobile App Build

### Step 1: Prepare Mobile App

```bash
cd victor-mobile-app
npm install
```

### Step 2: Update Configuration

Edit `src/services/socket.ts`:
```typescript
const SOCKET_URL = 'https://your-production-server.com';
```

Update all API URLs in screen files to point to your production server.

### Step 3: Login to Expo

```bash
eas login
```

Create account at https://expo.dev if you don't have one.

### Step 4: Configure EAS Build

```bash
eas build:configure
```

This creates `eas.json` (already included in the project).

### Android APK Build

#### Development APK (Internal Testing)

```bash
eas build -p android --profile preview
```

This creates an APK file that can be installed directly on Android devices.

#### Production APK

```bash
eas build -p android --profile production
```

#### What Happens During Build

1. Code is uploaded to Expo's build servers
2. Dependencies are installed
3. Native Android project is generated
4. APK is compiled
5. Download link is provided (valid for 30 days)

#### After Build Completes

1. Download the APK from the provided link
2. Distribute to users via:
   - Direct download link
   - Google Drive
   - Your website
   - Google Play Store (requires developer account)

### iOS App Build

**Note**: Requires macOS for local testing. EAS can build without macOS.

#### Prerequisites

1. Apple Developer account ($99/year)
2. Create App ID in Apple Developer portal
3. Create provisioning profiles

#### Development Build (TestFlight)

```bash
eas build -p ios --profile development
```

#### Production Build (App Store)

```bash
eas build -p ios --profile production
```

#### Submit to App Store

```bash
eas submit -p ios
```

### Alternative: Local Android Build

If you prefer to build locally without EAS:

#### Step 1: Prebuild

```bash
npx expo prebuild --platform android
```

This generates the native Android project.

#### Step 2: Configure Signing

Create `android/app/build.gradle` signing config:

```gradle
signingConfigs {
    release {
        storeFile file("your-release-key.keystore")
        storePassword "your-password"
        keyAlias "your-key-alias"
        keyPassword "your-password"
    }
}
```

Generate keystore:
```bash
keytool -genkey -v -keystore your-release-key.keystore -alias your-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

#### Step 3: Build APK

```bash
cd android
./gradlew assembleRelease
```

APK location: `android/app/build/outputs/apk/release/app-release.apk`

## Distribution

### Android APK Distribution

1. **Direct Install**: Send APK file directly to users
   - Users need to enable "Install from Unknown Sources"
   - Simple for testing and internal use

2. **Google Play Store**:
   - Create Google Play Developer account ($25 one-time fee)
   - Upload APK/AAB to Play Console
   - Complete store listing
   - Submit for review

3. **Third-party Stores**: Amazon Appstore, Samsung Galaxy Store, etc.

### iOS Distribution

1. **TestFlight** (Beta Testing):
   - Upload build via EAS or Xcode
   - Invite testers via email
   - Up to 10,000 testers

2. **App Store**:
   - Complete App Store Connect listing
   - Submit for review
   - Approval typically takes 1-3 days

## Updating the App

### Web Application

```bash
cd "VICTOR MOBILE"
git pull
npm install
npx prisma generate
npm run build
pm2 restart victor-mobile  # or your deployment method
```

### Mobile Application

1. Update version in `app.json`:
```json
{
  "expo": {
    "version": "1.0.1"
  }
}
```

2. Rebuild and redistribute:
```bash
eas build -p android --profile production
eas build -p ios --profile production
```

3. For app stores, upload new version

## Troubleshooting

### Build Fails on EAS

**Issue**: Build errors on Expo servers

**Solutions**:
- Check build logs in Expo dashboard
- Ensure all dependencies are listed in `package.json`
- Try clearing cache: `eas build --clear-cache`
- Check platform-specific issues in `app.json`

### APK Install Fails

**Issue**: APK won't install on device

**Solutions**:
- Enable "Install from Unknown Sources" in Android settings
- Check if APK architecture matches device (ARM vs x86)
- Ensure enough storage space
- Try uninstalling old version first

### iOS Build Requires Certificates

**Issue**: Missing provisioning profiles

**Solutions**:
- Use EAS to manage certificates automatically
- Or manually create in Apple Developer portal
- Ensure correct bundle identifier

### App Crashes on Launch

**Issue**: App crashes immediately

**Solutions**:
- Check error logs: `adb logcat` (Android) or Xcode (iOS)
- Verify server URL is correct and accessible
- Check required permissions are granted
- Test in development mode first

### Connection Issues

**Issue**: App can't connect to server

**Solutions**:
- Verify server URL in code
- Check firewall settings
- Ensure WebSocket connections are allowed
- Test with development server first

## Performance Optimization

### Web Application

1. Enable production mode
2. Use CDN for static assets
3. Enable gzip compression
4. Set up Redis for caching (optional)

### Mobile Application

1. Enable Hermes engine (included in Expo)
2. Optimize images before bundling
3. Use production builds
4. Enable ProGuard for Android (reduces APK size)

## Security Checklist

- [ ] Change all default secrets and keys
- [ ] Enable HTTPS for web server
- [ ] Configure CORS properly
- [ ] Validate and sanitize all inputs
- [ ] Keep dependencies updated
- [ ] Use environment variables for sensitive data
- [ ] Enable rate limiting on APIs
- [ ] Implement proper authentication
- [ ] Regular security audits

## Monitoring

### Web Application

- Set up error tracking (e.g., Sentry)
- Monitor server resources
- Track API response times
- Set up uptime monitoring

### Mobile Application

- Use Expo Analytics
- Track crash reports
- Monitor API usage
- Gather user feedback

## Support

For build issues:
- Check Expo documentation: https://docs.expo.dev
- Visit Expo forums: https://forums.expo.dev
- GitHub issues page

---

Last updated: November 23, 2024
