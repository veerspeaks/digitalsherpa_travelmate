/**
 * TravelMate - Your Personal Travel Companion
 * Main App Component
 */

import React from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {AuthProvider} from '@contexts/AuthContext';
import {TripProvider} from '@contexts/TripContext';
import {MarketplaceProvider} from '@contexts/MarketplaceContext';
import {FeedProvider} from '@contexts/FeedContext';
import {EventProvider} from '@contexts/EventContext';
import {AppNavigator} from '@navigation/AppNavigator';
import {COLORS} from '@utils/constants';

const App = () => {
  return (
    <AuthProvider>
      <TripProvider>
        <MarketplaceProvider>
          <FeedProvider>
            <EventProvider>
              <StatusBar
                barStyle="dark-content"
                backgroundColor={COLORS.white}
              />
              <AppNavigator />
            </EventProvider>
          </FeedProvider>
        </MarketplaceProvider>
      </TripProvider>
    </AuthProvider>
  );
};

export default App;

