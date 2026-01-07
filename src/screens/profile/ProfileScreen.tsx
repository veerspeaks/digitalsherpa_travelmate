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
import {COLORS} from '@utils/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const ProfileScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {user, updateProfile, logout} = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || '');

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }

    const success = await updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      bio: bio.trim() || undefined,
      location: location.trim() || undefined,
    });

    if (success) {
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } else {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <Card style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={50} color={COLORS.primary} />
          </View>
        </View>

        {!isEditing ? (
          <>
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={20} color={COLORS.textLight} />
                <Text style={styles.infoLabel}>Name:</Text>
                <Text style={styles.infoValue}>{user?.name}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="mail-outline" size={20} color={COLORS.textLight} />
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>{user?.email}</Text>
              </View>

              {user?.phone && (
                <View style={styles.infoRow}>
                  <Ionicons name="call-outline" size={20} color={COLORS.textLight} />
                  <Text style={styles.infoLabel}>Phone:</Text>
                  <Text style={styles.infoValue}>{user.phone}</Text>
                </View>
              )}

              {user?.location && (
                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={20} color={COLORS.textLight} />
                  <Text style={styles.infoLabel}>Location:</Text>
                  <Text style={styles.infoValue}>{user.location}</Text>
                </View>
              )}

              {user?.bio && (
                <View style={styles.bioSection}>
                  <Text style={styles.bioLabel}>Bio:</Text>
                  <Text style={styles.bioValue}>{user.bio}</Text>
                </View>
              )}
            </View>

            <Button
              title="Edit Profile"
              onPress={() => {
                setName(user?.name || '');
                setEmail(user?.email || '');
                setPhone(user?.phone || '');
                setBio(user?.bio || '');
                setLocation(user?.location || '');
                setIsEditing(true);
              }}
              style={styles.editButton}
            />
          </>
        ) : (
          <>
            <Input
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
            />

            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Phone (Optional)"
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />

            <Input
              label="Location (Optional)"
              value={location}
              onChangeText={setLocation}
              placeholder="Enter your location"
            />

            <Input
              label="Bio (Optional)"
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself"
              multiline
              numberOfLines={4}
            />

            <View style={styles.editActions}>
              <Button
                title="Save"
                onPress={handleSave}
                style={styles.saveButton}
              />
              <Button
                title="Cancel"
                onPress={() => setIsEditing(false)}
                variant="outline"
                style={styles.cancelButton}
              />
            </View>
          </>
        )}
      </Card>

      <Card style={styles.actionsCard}>
        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => navigation.navigate('Feedback')}>
          <Ionicons name="chatbubble-outline" size={24} color={COLORS.primary} />
          <Text style={styles.actionText}>Give Feedback</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.actionItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
          <Text style={[styles.actionText, styles.logoutText]}>Logout</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
        </TouchableOpacity>
      </Card>
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
  profileCard: {
    marginBottom: 16,
    padding: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  infoSection: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 12,
    marginRight: 8,
    minWidth: 80,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textLight,
  },
  bioSection: {
    marginTop: 8,
  },
  bioLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  bioValue: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  editButton: {
    marginTop: 8,
  },
  editActions: {
    marginTop: 8,
  },
  saveButton: {
    marginBottom: 12,
  },
  cancelButton: {
    marginBottom: 0,
  },
  actionsCard: {
    padding: 0,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
  },
  logoutText: {
    color: COLORS.error,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 16,
  },
});

