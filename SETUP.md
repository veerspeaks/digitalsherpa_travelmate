# TravelMate Setup Instructions

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- React Native CLI installed globally: `npm install -g react-native-cli`
- For iOS: Xcode and CocoaPods
- For Android: Android Studio and Android SDK

## Installation Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install iOS dependencies (macOS only):**
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Start Metro bundler:**
   ```bash
   npm start
   ```

4. **Run on iOS:**
   ```bash
   npm run ios
   ```

5. **Run on Android:**
   ```bash
   npm run android
   ```

## Optional: Weather API Setup

To use real weather data instead of mock data:

1. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Update `src/utils/constants.ts`:
   ```typescript
   export const WEATHER_API_KEY = 'your-api-key-here';
   ```

## Project Structure Overview

- **Components**: Reusable UI components organized by feature
- **Screens**: Screen components for each feature
- **Contexts**: State management using React Context API
- **Services**: API and storage services
- **Navigation**: React Navigation setup
- **Types**: TypeScript type definitions
- **Utils**: Constants and utility functions

## Features

✅ Authentication (Login/Register)
✅ Trip Planner with CRUD operations
✅ Weather Updates (with API integration)
✅ Local Marketplace with search and filters
✅ Travel Feed with likes and comments
✅ Event Scheduler with join/leave functionality

All data is persisted locally using AsyncStorage.

