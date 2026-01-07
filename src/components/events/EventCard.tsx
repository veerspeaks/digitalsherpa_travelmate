import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Event } from '@types';
import { Card } from '@components/common/Card';
import { COLORS } from '@utils/constants';

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isFull =
    event.maxParticipants &&
    event.currentParticipants.length >= event.maxParticipants;

  return (
    <Card onPress={onPress} style={styles.card}>
      {event.imageUri && (
        <Image source={{ uri: event.imageUri }} style={styles.image} />
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {event.title}
          </Text>
          <View style={[styles.badge, isFull && styles.badgeFull]}>
            <Text style={[styles.badgeText, isFull && styles.badgeTextFull]}>
              {isFull ? 'Full' : event.category}
            </Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {event.description}
        </Text>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>📍</Text>
            <Text style={styles.detailValue}>{event.location}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>📅</Text>
            <Text style={styles.detailValue}>{formatDate(event.date)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>🕐</Text>
            <Text style={styles.detailValue}>{event.time}</Text>
          </View>
        </View>

        {event.maxParticipants && (
          <View style={styles.participants}>
            <Text style={styles.participantsText}>
              {event.currentParticipants.length} / {event.maxParticipants}{' '}
              participants
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    overflow: 'hidden',
    padding: 0, // Reset padding to allow full width image
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginRight: 8,
  },
  badge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeFull: {
    backgroundColor: COLORS.error,
  },
  badgeText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: '600',
  },
  badgeTextFull: {
    color: COLORS.white,
  },
  description: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 12,
  },
  details: {
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    marginRight: 6,
  },
  detailValue: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  participants: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  participantsText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
});

