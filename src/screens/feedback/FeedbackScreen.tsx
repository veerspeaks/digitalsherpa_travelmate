import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useAuth} from '@contexts/AuthContext';
import {Button} from '@components/common/Button';
import {Input} from '@components/common/Input';
import {Card} from '@components/common/Card';
import {storageService} from '@services/storageService';
import {STORAGE_KEYS} from '@utils/constants';
import {Feedback} from '@types';
import {COLORS} from '@utils/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

const FEEDBACK_CATEGORIES = [
  'General',
  'Trip Planning',
  'Weather Updates',
  'Marketplace',
  'Travel Feed',
  'Events',
  'Bug Report',
  'Feature Request',
];

export const FeedbackScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {user} = useAuth();
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState(FEEDBACK_CATEGORIES[0]);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter your feedback message');
      return;
    }

    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'Please login to submit feedback');
      return;
    }

    setSubmitting(true);

    try {
      const allFeedback = await storageService.getItem<Feedback[]>(
        STORAGE_KEYS.FEEDBACK,
      ) || [];
      const newFeedback: Feedback = {
        id: Date.now().toString(),
        userId: user.id,
        rating,
        category,
        message: message.trim(),
        createdAt: new Date().toISOString(),
      };

      allFeedback.push(newFeedback);
      await storageService.setItem(STORAGE_KEYS.FEEDBACK, allFeedback);

      Alert.alert(
        'Thank You!',
        'Your feedback has been submitted successfully. We appreciate your input!',
        [
          {
            text: 'OK',
            onPress: () => {
              setRating(0);
              setCategory(FEEDBACK_CATEGORIES[0]);
              setMessage('');
              navigation.goBack();
            },
          },
        ],
      );
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Give Feedback</Text>
        <View style={styles.placeholder} />
      </View>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>How would you rate your experience?</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map(star => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              style={styles.starButton}>
              <Ionicons
                name={star <= rating ? 'star' : 'star-outline'}
                size={40}
                color={star <= rating ? COLORS.warning : COLORS.border}
              />
            </TouchableOpacity>
          ))}
        </View>
        {rating > 0 && (
          <Text style={styles.ratingText}>
            {rating === 1
              ? 'Poor'
              : rating === 2
              ? 'Fair'
              : rating === 3
              ? 'Good'
              : rating === 4
              ? 'Very Good'
              : 'Excellent'}
          </Text>
        )}
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Category</Text>
        <View style={styles.categories}>
          {FEEDBACK_CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                category === cat && styles.categoryChipActive,
              ]}
              onPress={() => setCategory(cat)}>
              <Text
                style={[
                  styles.categoryChipText,
                  category === cat && styles.categoryChipTextActive,
                ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Your Feedback</Text>
        <Input
          value={message}
          onChangeText={setMessage}
          placeholder="Tell us about your experience, suggestions, or any issues you encountered..."
          multiline
          numberOfLines={8}
          style={styles.messageInput}
        />
      </Card>

      <Button
        title="Submit Feedback"
        onPress={handleSubmit}
        loading={submitting}
        disabled={submitting || rating === 0 || !message.trim()}
        style={styles.submitButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  card: {
    marginBottom: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  starButton: {
    marginHorizontal: 4,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: COLORS.white,
  },
  messageInput: {
    minHeight: 150,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 32,
  },
});

