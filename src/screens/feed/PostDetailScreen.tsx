import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {useFeed} from '@contexts/FeedContext';
import {Button} from '@components/common/Button';
import {Card} from '@components/common/Card';
import {COLORS} from '@utils/constants';

export const PostDetailScreen: React.FC<{navigation: any; route: any}> = ({
  navigation,
  route,
}) => {
  const {postId} = route.params;
  const {getPost, likePost, addComment} = useFeed();
  const post = getPost(postId);
  const [comment, setComment] = useState('');

  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Post not found</Text>
      </View>
    );
  }

  const handleAddComment = async () => {
    if (!comment.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }

    const success = await addComment(postId, comment.trim());
    if (success) {
      setComment('');
    } else {
      Alert.alert('Error', 'Failed to add comment');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.postCard}>
        <View style={styles.postHeader}>
          <View>
            <Text style={styles.userName}>{post.userName}</Text>
            {post.location && (
              <Text style={styles.location}>📍 {post.location}</Text>
            )}
          </View>
          <Text style={styles.date}>{formatDate(post.createdAt)}</Text>
        </View>

        <Text style={styles.postContent}>{post.content}</Text>

        <View style={styles.postActions}>
          <Button
            title={`❤️ ${post.likes.length} Likes`}
            onPress={() => likePost(postId)}
            variant="outline"
            style={styles.likeButton}
          />
        </View>
      </Card>

      <View style={styles.commentsSection}>
        <Text style={styles.commentsTitle}>
          Comments ({post.comments.length})
        </Text>

        {post.comments.length === 0 ? (
          <Text style={styles.noComments}>No comments yet</Text>
        ) : (
          post.comments.map(comment => (
            <Card key={comment.id} style={styles.commentCard}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentUserName}>{comment.userName}</Text>
                <Text style={styles.commentDate}>
                  {formatDate(comment.createdAt)}
                </Text>
              </View>
              <Text style={styles.commentContent}>{comment.content}</Text>
            </Card>
          ))
        )}

        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            value={comment}
            onChangeText={setComment}
            placeholder="Write a comment..."
            multiline
          />
          <Button
            title="Post"
            onPress={handleAddComment}
            style={styles.commentButton}
          />
        </View>
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
    padding: 16,
  },
  postCard: {
    marginBottom: 24,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
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
  postContent: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  postActions: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  likeButton: {
    alignSelf: 'flex-start',
  },
  commentsSection: {
    marginTop: 8,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  noComments: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    padding: 16,
  },
  commentCard: {
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  commentDate: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  commentContent: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  commentInputContainer: {
    marginTop: 16,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: COLORS.text,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
    backgroundColor: COLORS.white,
  },
  commentButton: {
    alignSelf: 'flex-end',
    minWidth: 100,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: 32,
  },
});

