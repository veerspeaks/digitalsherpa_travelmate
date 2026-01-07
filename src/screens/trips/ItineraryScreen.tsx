import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTrips } from '@contexts/TripContext';
import { TripCard } from '@components/trips/TripCard';
import { EmptyState } from '@components/common/EmptyState';
import { LoadingSpinner } from '@components/common/LoadingSpinner';
import { COLORS } from '@utils/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const ItineraryScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { trips, loading } = useTrips();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.brandingContainer}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.brandingLogo}
        />
        <TouchableOpacity
          style={styles.profileIconButton}
          onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-circle" size={36} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>My Trips</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('TripDetail', { tripId: null })}>
          <Text style={styles.addButtonText}>+ Add Trip</Text>
        </TouchableOpacity>
      </View>

      {trips.length === 0 ? (
        <EmptyState
          image={require('../../assets/ticketillustration.png')}
          message="No trips planned yet"
          subMessage="Tap the button above to create your first trip"
        />
      ) : (
        <FlatList
          data={trips}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TripCard
              trip={item}
              onPress={() => navigation.navigate('TripDetail', { tripId: item.id })}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  brandingContainer: {
    backgroundColor: COLORS.primary, // Orange background
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  brandingLogo: {
    width: 250,
    height: 80,
    resizeMode: 'contain',
    tintColor: COLORS.white,
  },
  profileIconButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.primary, // Orange background
    borderBottomWidth: 0,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.white, // White text
  },
  addButton: {
    backgroundColor: COLORS.white, // White button
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1, // Reduced shadow opacity
    shadowRadius: 8,
    elevation: 5,
  },
  addButtonText: {
    color: COLORS.primary, // Orange text
    fontWeight: '700',
    fontSize: 16,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100, // Extra padding for potential FAB
  },
});

