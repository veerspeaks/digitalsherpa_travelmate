import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useEvents } from '@contexts/EventContext';
import { EventCard } from '@components/events/EventCard';
import { EmptyState } from '@components/common/EmptyState';
import { LoadingSpinner } from '@components/common/LoadingSpinner';
import { COLORS } from '@utils/constants';

export const EventsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { events, loading } = useEvents();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Events & Tours</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('EventDetail', { eventId: null })}>
          <Text style={styles.addButtonText}>+ Create Event</Text>
        </TouchableOpacity>
      </View>

      {events.length === 0 ? (
        <EmptyState
          image={require('../../assets/5.png')}
          message="No events scheduled"
          subMessage="Tap the button above to create your first event"
        />
      ) : (
        <FlatList
          data={events}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
  },
  addButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
});

