import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Trip } from '@types';
import { Card } from '@components/common/Card';
import { COLORS } from '@utils/constants';

import Ionicons from 'react-native-vector-icons/Ionicons';

interface TripCardProps {
  trip: Trip;
  onPress: () => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onPress }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.mainContent}>
        <View style={styles.headerRow}>
          <View style={styles.destinationContainer}>
            <Ionicons name="location-sharp" size={24} color={COLORS.primary} style={styles.icon} />
            <Text style={styles.destination}>{trip.destination}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.textLight} />
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.textLight} style={styles.smallIcon} />
            <Text style={styles.dateText}>
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </Text>
          </View>

          {trip.activities.length > 0 && (
            <View style={styles.activitiesContainer}>
              <Text style={styles.activitiesLabel}>
                {trip.activities.length} Activities
              </Text>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  mainContent: {
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  destinationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    marginLeft: -4,
  },
  destination: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  smallIcon: {
    opacity: 0.6,
  },
  dateText: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  activitiesContainer: {
    backgroundColor: '#FFF0E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  activitiesLabel: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '700',
  },
});

