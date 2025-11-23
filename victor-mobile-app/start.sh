#!/bin/bash

echo "📱 Starting Victor Mobile App..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo ""
echo "✨ Starting Expo development server..."
echo ""
echo "Options:"
echo "  • Press 'i' for iOS simulator"
echo "  • Press 'a' for Android emulator"
echo "  • Scan QR code with Expo Go app on your device"
echo ""

npm start
