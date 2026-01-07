import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  FlatList,
} from 'react-native';
import { useTrips } from '@contexts/TripContext';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/Input';
import { COLORS } from '@utils/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';
import { POPULAR_CITIES } from '@utils/cities';

export const TripDetailScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { tripId } = route.params;
  const { getTrip, addTrip, updateTrip, deleteTrip } = useTrips();
  const trip = tripId ? getTrip(tripId) : null;

  const [destination, setDestination] = useState(trip?.destination || '');
  const [startDate, setStartDate] = useState(trip?.startDate ? new Date(trip.startDate) : new Date());
  const [endDate, setEndDate] = useState(trip?.endDate ? new Date(trip.endDate) : new Date());
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  const [activity, setActivity] = useState('');
  const [activities, setActivities] = useState<string[]>(trip?.activities || []);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const isEditing = !!tripId;
  const [hasSetStart, setHasSetStart] = useState(!!trip?.startDate);
  const [hasSetEnd, setHasSetEnd] = useState(!!trip?.endDate);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDestinationChange = (text: string) => {
    setDestination(text);
    if (text.length > 0) {
      const filtered = POPULAR_CITIES.filter(city =>
        city.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectCity = (city: string) => {
    setDestination(city);
    setShowSuggestions(false);
  };

  const handleSave = async () => {
    if (!destination.trim()) {
      Alert.alert('Error', 'Please enter a destination');
      return;
    }

    if (!hasSetStart || !hasSetEnd) {
      Alert.alert('Error', 'Please select start and end dates');
      return;
    }

    if (startDate > endDate) {
      Alert.alert('Error', 'End date must be after start date');
      return;
    }

    const tripData = {
      destination: destination.trim(),
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      activities,
    };

    const success = isEditing
      ? await updateTrip(tripId, tripData)
      : await addTrip(tripData);

    if (success) {
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Failed to save trip');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Trip',
      'Are you sure you want to delete this trip?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteTrip(tripId);
            if (success) {
              navigation.goBack();
            } else {
              Alert.alert('Error', 'Failed to delete trip');
            }
          },
        },
      ],
    );
  };

  const addActivity = () => {
    if (activity.trim()) {
      setActivities([...activities, activity.trim()]);
      setActivity('');
    }
  };

  const removeActivity = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={[styles.card, { zIndex: 2 }]}>
        <Text style={styles.cardTitle}>Trip Information</Text>

        <View style={[styles.inputGroup, { zIndex: 2 }]}>
          <Text style={styles.label}>Destination</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={destination}
              onChangeText={handleDestinationChange}
              placeholder="Where are you going?"
              placeholderTextColor={COLORS.textLight}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
          </View>

          {showSuggestions && suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {suggestions.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => selectCity(item)}>
                  <Ionicons name="location-sharp" size={16} color={COLORS.textLight} />
                  <Text style={styles.suggestionText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => setOpenStart(true)}>
              <Ionicons name="calendar-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
              <Text style={[styles.dateText, !hasSetStart && styles.placeholderText]}>
                {hasSetStart ? formatDate(startDate) : 'Select Date'}
              </Text>
            </TouchableOpacity>
            <DatePicker
              modal
              mode="date"
              open={openStart}
              date={startDate}
              onConfirm={(date) => {
                setOpenStart(false);
                setStartDate(date);
                setHasSetStart(true);
              }}
              onCancel={() => {
                setOpenStart(false);
              }}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
            <Text style={styles.label}>End Date</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => setOpenEnd(true)}>
              <Ionicons name="calendar-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
              <Text style={[styles.dateText, !hasSetEnd && styles.placeholderText]}>
                {hasSetEnd ? formatDate(endDate) : 'Select Date'}
              </Text>
            </TouchableOpacity>
            <DatePicker
              modal
              mode="date"
              open={openEnd}
              date={endDate}
              onConfirm={(date) => {
                setOpenEnd(false);
                setEndDate(date);
                setHasSetEnd(true);
              }}
              onCancel={() => {
                setOpenEnd(false);
              }}
            />
          </View>
        </View>
      </View>

      <View style={[styles.card, { zIndex: 1 }]}>
        <Text style={styles.cardTitle}>Activities</Text>
        <View style={styles.addActivityContainer}>
          <TextInput
            style={styles.addActivityInput}
            value={activity}
            onChangeText={setActivity}
            placeholder="Add a new activity..."
            placeholderTextColor={COLORS.textLight}
            onSubmitEditing={addActivity}
          />
          <TouchableOpacity style={styles.addActivityButton} onPress={addActivity}>
            <Ionicons name="add" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.activitiesList}>
          {activities.length === 0 ? (
            <Text style={styles.emptyActivities}>No activities added yet.</Text>
          ) : (
            activities.map((act, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={styles.activityContent}>
                  <View style={styles.activityDot} />
                  <Text style={styles.activityText}>{act}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => removeActivity(index)}
                  style={styles.removeButton}>
                  <Ionicons name="close-circle-outline" size={24} color={COLORS.textLight} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title={isEditing ? 'Save Changes' : 'Create Trip'}
          onPress={handleSave}
          style={styles.saveButton}
        />

        {isEditing && (
          <TouchableOpacity onPress={handleDelete} style={styles.deleteLink}>
            <Text style={styles.deleteLinkText}>Delete Trip</Text>
          </TouchableOpacity>
        )}
      </View>
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
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
    position: 'relative',
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 80,
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
    fontSize: 16,
    color: COLORS.text,
  },
  dateText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  placeholderText: {
    color: COLORS.textLight,
  },
  addActivityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  addActivityInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    fontSize: 16,
    color: COLORS.text,
  },
  addActivityButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  activitiesList: {
    gap: 12,
  },
  emptyActivities: {
    textAlign: 'center',
    color: COLORS.textLight,
    fontStyle: 'italic',
    marginTop: 10,
    marginBottom: 10,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
  },
  activityText: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
  },
  removeButton: {
    padding: 4,
  },
  footer: {
    marginTop: 10,
    gap: 16,
  },
  saveButton: {
    height: 56,
    borderRadius: 28,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  deleteLink: {
    alignItems: 'center',
    padding: 10,
  },
  deleteLinkText: {
    color: COLORS.error,
    fontWeight: '600',
    fontSize: 16,
  },
});

