import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { pickImage } from '@utils/imageUtils';
import { useFeed } from '@contexts/FeedContext';
import { PostCard } from '@components/feed/PostCard';
import { EmptyState } from '@components/common/EmptyState';
import { LoadingSpinner } from '@components/common/LoadingSpinner';
import { Input } from '@components/common/Input';
import { Button } from '@components/common/Button';
import { COLORS } from '@utils/constants';

export const FeedScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { posts, loading, addPost, likePost } = useFeed();
  const [showPostInput, setShowPostInput] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleImagePick = async () => {
    const uri = await pickImage();
    if (uri) {
      setImageUri(uri);
    }
  };

  const handleAddPost = async () => {
    if (!postContent.trim()) {
      Alert.alert('Error', 'Please enter some content');
      return;
    }

    const success = await addPost(postContent.trim(), imageUri || undefined);
    if (success) {
      setPostContent('');
      setImageUri(null);
      setShowPostInput(false);
    } else {
      Alert.alert('Error', 'Failed to create post');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Travel Feed</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowPostInput(!showPostInput)}>
          <Text style={styles.addButtonText}>+ Post</Text>
        </TouchableOpacity>
      </View>

      {showPostInput && (
        <View style={styles.postInputContainer}>
          <Text style={styles.createPostTitle}>Create Post</Text>
          <Input
            value={postContent}
            onChangeText={setPostContent}
            placeholder="Share your travel experience..."
            multiline
            numberOfLines={4}
            icon="create-outline"
            style={{ height: 100, textAlignVertical: 'top' }}
          />

          {imageUri && (
            <View style={styles.previewContainer}>
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setImageUri(null)}>
                <Text style={styles.removeImageText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.postActions}>
            <TouchableOpacity onPress={handleImagePick} style={styles.iconButton}>
              <Ionicons name="image-outline" size={24} color={COLORS.primary} />
            </TouchableOpacity>

            <View style={{ flex: 1 }} />

            <Button
              title="Cancel"
              onPress={() => {
                setShowPostInput(false);
                setPostContent('');
                setImageUri(null);
              }}
              variant="outline"
              style={styles.cancelButton}
            />
            <Button
              title="Post"
              onPress={handleAddPost}
              style={styles.submitButton}
            />
          </View>
        </View>
      )}

      {posts.length === 0 ? (
        <EmptyState
          image={require('../../assets/7.png')}
          message="No posts yet"
          subMessage="Be the first to share your travel experience!"
        />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
              onLike={() => likePost(item.id)}
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
  postInputContainer: {
    backgroundColor: COLORS.white,
    padding: 16,
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  createPostTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  iconButton: {
    padding: 8,
  },
  previewContainer: {
    marginVertical: 10,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 0,
    minWidth: 90,
  },
  submitButton: {
    flex: 0,
    minWidth: 90,
  },
  listContent: {
    padding: 16,
  },
});
