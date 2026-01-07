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
import { useMarketplace } from '@contexts/MarketplaceContext';
import { useAuth } from '@contexts/AuthContext';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/Input';
import { CATEGORIES } from '@utils/constants';
import { COLORS } from '@utils/constants';
import { pickImage } from '@utils/imageUtils';
import { POPULAR_CITIES } from '@utils/cities';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TextInput } from 'react-native';

export const MarketplaceItemDetailScreen: React.FC<{
  navigation: any;
  route: any;
}> = ({ navigation, route }) => {
  const { itemId } = route.params;
  const { getItem, addItem, updateItem, deleteItem } = useMarketplace();
  const { user } = useAuth();
  const item = itemId ? getItem(itemId) : null;

  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');
  const [price, setPrice] = useState(item?.price.toString() || '');
  const [category, setCategory] = useState(item?.category || CATEGORIES.MARKETPLACE[0]);
  const [location, setLocation] = useState(item?.location || '');
  const [imageUri, setImageUri] = useState<string | null>(item?.imageUri || null); // Added

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const isEditing = !!itemId;
  const isOwner = item?.sellerId === user?.id;

  // Added
  const handleImagePick = async () => {
    const uri = await pickImage();
    if (uri) {
      setImageUri(uri);
    }
  };

  const handleLocationChange = (text: string) => {
    setLocation(text);
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
    setLocation(city);
    setShowSuggestions(false);
  };

  const handleSave = async () => {
    if (!title.trim() || !description.trim() || !price || !location.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    const itemData = {
      title: title.trim(),
      description: description.trim(),
      price: priceNum,
      category,
      location: location.trim(),
      imageUri: imageUri || undefined, // Added
    };

    const success = isEditing
      ? await updateItem(itemId, itemData)
      : await addItem(itemData);

    if (success) {
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Failed to save item');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteItem(itemId);
            if (success) {
              navigation.goBack();
            } else {
              Alert.alert('Error', 'Failed to delete item');
            }
          },
        },
      ],
    );
  };

  const handlePurchase = () => {
    Alert.alert('Purchase', `Purchase ${item?.title} for ₹${item?.price}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: () => {
          Alert.alert('Success', 'Purchase completed! (This is a demo)');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          {isEditing ? 'Edit Item Details' : 'What are you selling?'}
        </Text>

        {/* Added image picker UI */}
        {(!isEditing || isOwner) && (
          <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            ) : (
              <View style={styles.placeholderContainer}>
                <Ionicons name="camera-outline" size={40} color={COLORS.textLight} />
                <Text style={styles.placeholderText}>Add Photo</Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        <Input
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Vintage Camera"
          icon="pricetag-outline"
          editable={isEditing ? isOwner : true}
        />

        <Input
          label="Price (₹)"
          value={price}
          onChangeText={setPrice}
          placeholder="0.00"
          keyboardType="decimal-pad"
          icon="cash-outline"
          editable={isEditing ? isOwner : true}
        />

        <View style={{ zIndex: 10, marginBottom: 16 }}>
          <Text style={styles.label}>Location</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={20} color={COLORS.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={handleLocationChange}
              placeholder="Select City"
              placeholderTextColor={COLORS.textLight}
              editable={isEditing ? isOwner : true}
            />
          </View>
          {showSuggestions && suggestions.length > 0 && (
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

        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your item..."
          multiline
          numberOfLines={4}
          editable={isEditing ? isOwner : true}
          style={{ height: 100, textAlignVertical: 'top' }}
        />

        {!isEditing && (
          <View style={styles.categorySection}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categories}>
              {CATEGORIES.MARKETPLACE.map(cat => (
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
      </View>

      {isEditing && !isOwner && (
        <Button
          title={`Purchase - ₹${item?.price}`}
          onPress={handlePurchase}
          style={styles.purchaseButton}
        />
      )}

      {(!isEditing || isOwner) && (
        <View style={styles.actionContainer}>
          <Button
            title={isEditing ? 'Save Changes' : 'Post Item'}
            onPress={handleSave}
            style={styles.saveButton}
          />

          {isEditing && isOwner && (
            <Text onPress={handleDelete} style={styles.deleteLink}>
              Remove this item
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
  categorySection: {
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
  purchaseButton: {
    marginTop: 8,
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
    backgroundColor: COLORS.background, // Match Input component background usually or white? Using background from styles
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
  // Suggestions Styles
  suggestionsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    maxHeight: 200,
    overflow: 'hidden',
  },
  suggestionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  suggestionText: {
    fontSize: 14,
    color: COLORS.text,
  },
});

