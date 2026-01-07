# TravelMate - Your Personal Travel Companion

A comprehensive React Native mobile application designed to enhance the travel experience by providing a centralized platform for trip planning, local insights, weather updates, and community interaction.

## Features

### 1. Trip Planner
- Create, update, and manage travel itineraries
- Add destinations, dates, and activities
- Local persistence using AsyncStorage
- Full CRUD operations for trips

### 2. Weather Updates
- Real-time weather forecasts for travel destinations
- 5-day weather forecast
- Current conditions with humidity and wind speed
- Integration with OpenWeatherMap API (with mock data fallback)

### 3. Local Marketplace
- Browse, search, and filter travel-related items
- CRUD operations for marketplace listings
- Category-based filtering
- Local storage for listings

### 4. Travel Feed
- Share and view travel experiences
- Like and comment on posts
- Social interaction features
- Chronological feed display

### 5. Event Scheduler
- Browse upcoming events and tours
- Join/leave events
- Create and manage events
- Participant tracking

### 6. Authentication
- Secure login and registration
- Session management with AsyncStorage
- User profile management

## Project Structure

```
TravelMate_DS/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Common components (Button, Input, Card, etc.)
│   │   ├── trips/          # Trip-related components
│   │   ├── marketplace/    # Marketplace components
│   │   ├── feed/           # Feed components
│   │   └── events/         # Event components
│   ├── screens/            # Screen components
│   │   ├── auth/          # Authentication screens
│   │   ├── trips/         # Trip screens
│   │   ├── weather/       # Weather screen
│   │   ├── marketplace/   # Marketplace screens
│   │   ├── feed/         # Feed screens
│   │   └── events/       # Event screens
│   ├── contexts/          # Context providers for state management
│   ├── services/          # Service layer (API, storage)
│   ├── navigation/        # Navigation setup
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions and constants
├── App.tsx               # Main app component
├── index.js             # Entry point
└── package.json         # Dependencies
```

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **iOS Setup (macOS only):**
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Run the app:**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

## Configuration

### Weather API (Optional)
To use real weather data, update the API key in `src/utils/constants.ts`:
```typescript
export const WEATHER_API_KEY = 'YOUR_OPENWEATHER_API_KEY';
```

If no API key is provided, the app will use mock weather data.

## Technologies Used

- **React Native** - Mobile framework
- **TypeScript** - Type safety
- **React Navigation** - Navigation library
- **AsyncStorage** - Local data persistence
- **Context API** - State management
- **OpenWeatherMap API** - Weather data (optional)

## Key Design Principles

- **Component Reusability**: All UI components are modular and reusable
- **Clean Architecture**: Separation of concerns with clear folder structure
- **Type Safety**: Full TypeScript implementation
- **State Management**: Context API for global state
- **Local Persistence**: AsyncStorage for data storage
- **User Experience**: Intuitive UI with proper error handling

## Development

The project follows best practices:
- Modular component architecture
- Reusable UI components
- Centralized state management
- Type-safe codebase
- Clean code structure

## License

This project is created for educational purposes.

# digitalsherpa_travelmate
