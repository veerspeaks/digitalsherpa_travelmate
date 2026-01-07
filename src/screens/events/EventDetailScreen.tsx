import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useEvents } from '@contexts/EventContext';
import { useAuth } from '@contexts/AuthContext';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/Input';
import { Card } from '@components/common/Card';
import { CATEGORIES, COLORS } from '@utils/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { pickImage } from '@utils/imageUtils';
import { POPULAR_CITIES } from '@utils/cities';
import { TextInput } from 'react-native';

export const EventDetailScreen: React.FC<{
  navigation: any;
  route: any;
}> = ({ navigation, route }) => {
  const { eventId } = route.params;
  const { getEvent, addEvent, updateEvent, deleteEvent, joinEvent, leaveEvent } =
    useEvents();
  const { user } = useAuth();
  const event = eventId ? getEvent(eventId) : undefined;

  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [location, setLocation] = useState(event?.location || '');

  /*
   * Restore secure Date initialization to prevent RangeError crashes
   */
  const [date, setDate] = useState<Date>(() => {
    return event?.date ? new Date(event.date) : new Date();
  });

  const [time, setTime] = useState<Date>(() => {
    // If we could parse event.time, we would. For now, default to now globally to avoid crash.
    return new Date();
  });

  const [category, setCategory] = useState(event?.category || CATEGORIES.EVENT[0]);
  const [maxParticipants, setMaxParticipants] = useState(event?.maxParticipants?.toString() || '');
  const [imageUri, setImageUri] = useState<string | null>(event?.imageUri || null);

  const [openDate, setOpenDate] = useState(false);
  const [openTime, setOpenTime] = useState(false);

  // Restore Autocomplete state
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const isEditing = !!eventId;
  const isOwner = event?.createdBy === user?.id; // Renamed back to isOwner
  const isParticipant = user
    ? event?.currentParticipants.includes(user.id) || false
    : false;
  const isFull =
    event?.maxParticipants &&
    event.currentParticipants.length >= event.maxParticipants;

  const handleImagePick = async () => {
    const uri = await pickImage();
    if (uri) {
      setImageUri(uri);
    }
  };

  const handleLocationChange = (text: string) => {
    setLocation(text);
    if (text.length > 0) {
      const filtered = POPULAR_CITIES.filter((city: string) =>
        city.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectCity = (city: string) => {
    setLocation(city);
    setShowSuggestions(false);
  };

  const formatDate = (dateString: Date) => {
    return dateString.toISOString().split('T')[0];
  };

  const formatTime = (dateString: Date) => {
    return dateString.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSave = async () => {
    if (!title.trim() || !description.trim() || !location.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const eventData = {
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      date: date.toISOString().split('T')[0],
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category,
      maxParticipants: maxParticipants ? parseInt(maxParticipants) : undefined,
      imageUri: imageUri || undefined,
    };

    const success = isEditing
      ? await updateEvent(eventId, eventData)
      : await addEvent(eventData);

    if (success) {
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Failed to save event');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteEvent(eventId);
            if (success) {
              navigation.goBack();
            } else {
              Alert.alert('Error', 'Failed to delete event');
            }
          },
        },
      ],
    );
  };

  const handleJoin = async () => {
    if (isFull) {
      Alert.alert('Event Full', 'This event has reached maximum capacity');
      return;
    }

    const success = await joinEvent(eventId);
    if (success) {
      Alert.alert('Success', 'You have joined the event!');
    } else {
      Alert.alert('Error', 'Failed to join event');
    }
  };

  const handleLeave = async () => {
    const success = await leaveEvent(eventId);
    if (success) {
      Alert.alert('Success', 'You have left the event');
    } else {
      Alert.alert('Error', 'Failed to leave event');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {isEditing && !isOwner && (
        <Card style={styles.eventInfoCard}>
          <Text style={styles.eventTitle}>{event?.title}</Text>
          <Text style={styles.eventDescription}>{event?.description}</Text>
          <View style={styles.eventDetails}>
            <Text style={styles.eventDetail}>
              📍 {event?.location} | 📅 {event?.date} | 🕐 {event?.time}
            </Text>
          </View>
          {event?.maxParticipants && (
            <Text style={styles.participantsInfo}>
              {event.currentParticipants.length} / {event.maxParticipants}{' '}
              participants
            </Text>
          )}
          {isFull && (
            <Text style={styles.fullWarning}>⚠️ Event is full</Text>
          )}
        </Card>
      )}

      {(!isEditing || isOwner) && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            {isEditing ? 'Edit Event Details' : 'Plan an Event'}
          </Text>

          <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            ) : (
              <View style={styles.placeholderContainer}>
                <Ionicons name="camera-outline" size={40} color={COLORS.textLight} />
                <Text style={styles.placeholderText}>Add Cover Photo</Text>
              </View>
            )}
          </TouchableOpacity>

          <Input
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="Event title"
            icon="text-outline"
          />

          <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Event description"
            multiline
            numberOfLines={4}
            icon="document-text-outline"
            style={{ height: 100, textAlignVertical: 'top' }}
          />

          <View style={{ zIndex: 2000 }}>
            <View style={styles.inputContainer}>
              <Ionicons name="location-outline" size={20} color={COLORS.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Location"
                placeholderTextColor={COLORS.textLight}
                value={location}
                onChangeText={handleLocationChange}
              />
            </View>
            {showSuggestions && (
              <View style={styles.suggestionsContainer}>
                <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
                  {suggestions.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.suggestionItem}
                      onPress={() => selectCity(item)}>
                      <Ionicons name="location-sharp" size={16} color={COLORS.textLight} />
                      <Text style={styles.suggestionText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={{ height: 16 }} />

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity
                style={styles.dateTimeContainer}
                onPress={() => setOpenDate(true)}>
                <Ionicons name="calendar-outline" size={20} color={COLORS.textLight} />
                <Text style={styles.dateTimeText}>{formatDate(date)}</Text>
              </TouchableOpacity>
              <DatePicker
                modal
                open={openDate}
                date={date}
                mode="date"
                onConfirm={(d) => {
                  setOpenDate(false);
                  setDate(d);
                }}
                onCancel={() => {
                  setOpenDate(false);
                }}
              />
            </View>

            <View style={styles.halfInput}>
              <Text style={styles.label}>Time</Text>
              <TouchableOpacity
                style={styles.dateTimeContainer}
                onPress={() => setOpenTime(true)}>
                <Ionicons name="time-outline" size={20} color={COLORS.textLight} />
                <Text style={styles.dateTimeText}>{formatTime(time)}</Text>
              </TouchableOpacity>
              <DatePicker
                modal
                open={openTime}
                date={time}
                mode="time"
                onConfirm={(d) => {
                  setOpenTime(false);
                  setTime(d);
                }}
                onCancel={() => {
                  setOpenTime(false);
                }}
              />
            </View>
          </View>

          {!isEditing && (
            <View style={styles.categorySection}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categories}>
                {CATEGORIES.EVENT.map(cat => (
                  <Text
                    key={cat}
                    style={[
                      styles.categoryChip,
                      category === cat && styles.categoryChipActive,
                    ]}
                    onPress={() => setCategory(cat)}>
                    <Text style={[
                      styles.categoryText,
                      category === cat && styles.categoryTextActive
                    ]}>{cat}</Text>
                  </Text>
                ))}
              </View>
            </View>
          )}

          <Input
            label="Max Participants"
            value={maxParticipants}
            onChangeText={setMaxParticipants}
            placeholder="Optional"
            keyboardType="number-pad"
            icon="people-outline"
          />
        </View>
      )}

      {isEditing && !isOwner && (
        <View style={styles.actionButtons}>
          {isParticipant ? (
            <Button
              title="Leave Event"
              onPress={handleLeave}
              variant="outline"
              style={styles.actionButton}
            />
          ) : (
            <Button
              title={isFull ? 'Event Full' : 'Join Event'}
              onPress={handleJoin}
              disabled={isFull}
              style={styles.actionButton}
            />
          )}
        </View>
      )}

      {(!isEditing || isOwner) && (
        <View style={styles.actionContainer}>
          <Button
            title={isEditing ? 'Update Event' : 'Create Event'}
            onPress={handleSave}
            style={styles.saveButton}
          />

          {isEditing && isOwner && (
            <Text onPress={handleDelete} style={styles.deleteLink}>
              Delete Event
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
  },
  imagePicker: {
    height: 200,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    marginBottom: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContainer: {
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 8,
    color: COLORS.textLight,
    fontSize: 14,
    fontWeight: '500',
  },
  eventInfoCard: {
    marginBottom: 16,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  eventDetails: {
    marginBottom: 8,
  },
  eventDetail: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  participantsInfo: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
    marginTop: 8,
  },
  fullWarning: {
    fontSize: 12,
    color: COLORS.error,
    fontWeight: '500',
    marginTop: 4,
  },
  categorySection: {
    marginBottom: 16,
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    fontWeight: '600',
    elevation: 2,
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.text,
  },
  categoryTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  actionButtons: {
    marginTop: 8,
  },
  actionButton: {
    marginBottom: 12,
  },
  actionContainer: {
    alignItems: 'center',
    gap: 16,
  },
  saveButton: {
    width: '100%',
    borderRadius: 12,
    height: 50,
  },
  deleteLink: {
    color: COLORS.error,
    fontSize: 16,
    fontWeight: '500',
    padding: 8,
  },
  // Input Styles
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 10,
  },
  inputIcon: {
    marginRight: 4,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    maxHeight: 200,
    zIndex: 1000,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: COLORS.text,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    height: 50,
    gap: 10,
    marginTop: 4,
  },
  dateTimeText: {
    fontSize: 16,
    color: COLORS.text,
  },
});

