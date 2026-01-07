import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FeedPost } from '@types';
import { Card } from '@components/common/Card';
import { useAuth } from '@contexts/AuthContext';
import { COLORS } from '@utils/constants';

interface PostCardProps {
  post: FeedPost;
  onPress: () => void;
  onLike: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onPress, onLike }) => {
  const { user } = useAuth();
  const isLiked = user ? post.likes.includes(user.id) : false;
  const commentCount = post.comments.length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{post.userName}</Text>
          {post.location && (
            <Text style={styles.location}>📍 {post.location}</Text>
          )}
        </View>
        <Text style={styles.date}>{formatDate(post.createdAt)}</Text>
      </View>

      <Text style={styles.content}>{post.content}</Text>

      {post.imageUri && (
        <Image source={{ uri: post.imageUri }} style={styles.postImage} />
      )}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onLike}>
          <Text style={[styles.actionText, isLiked && styles.actionTextActive]}>
            ❤️ {post.likes.length}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onPress}>
          <Text style={styles.actionText}>💬 {commentCount}</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  date: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  content: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
    resizeMode: 'cover',
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  actionButton: {
    marginRight: 24,
  },
  actionText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  actionTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

