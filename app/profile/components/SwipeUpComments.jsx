import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Animated, 
  StyleSheet,
  Dimensions
} from 'react-native';
import { Share, X, Send, Heart, Reply, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const MOCK_COMMENTS = [
  {
    id: '1',
    user: {
      username: 'sarah_designs',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      isVerified: true,
    },
    text: 'This is absolutely stunning! 😍 ...',
    likes: 24,
    timeAgo: '2h',
    isLiked: false,
    replies: [
      {
        id: '1-1',
        user: {
          username: 'photo_master',
          avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        },
        text: 'Thanks! I used golden hour lighting...',
        likes: 8,
        timeAgo: '1h',
        isLiked: true,
      }
    ]
  },
  {
    id: '2',
    user: {
      username: 'adventure_seeker',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    },
    text: 'Amazing shot! 🔥 Where was this taken?',
    likes: 15,
    timeAgo: '3h',
    isLiked: true,
  },
];

export default function SwipeUpComments({ visible, onClose, postId, onShare }) {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [replyingTo, setReplyingTo] = useState(null);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: visible ? 0 : SCREEN_HEIGHT,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, [visible]);

  const handleSendComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      user: {
        username: 'you',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      },
      text: newComment,
      likes: 0,
      timeAgo: 'now',
      isLiked: false,
    };

    if (replyingTo) {
      setComments(prev =>
        prev.map(c =>
          c.id === replyingTo
            ? { ...c, replies: [...(c.replies || []), comment] }
            : c
        )
      );
      setReplyingTo(null);
    } else {
      setComments(prev => [comment, ...prev]);
    }

    setNewComment('');
  };

  const toggleLike = (commentId, isReply = false, parentId) => {
    setComments(prev =>
      prev.map(comment => {
        if (isReply && comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies?.map(reply =>
              reply.id === commentId
                ? {
                    ...reply,
                    isLiked: !reply.isLiked,
                    likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                  }
                : reply
            ),
          };
        } else if (!isReply && comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          };
        }
        return comment;
      })
    );
  };

  const CommentItem = ({ comment, isReply = false, parentId }) => (
    <View style={[styles.commentItem, isReply && styles.replyItem]}>
      <View style={styles.commentContent}>
        <Image source={{ uri: comment.user.avatar }} style={styles.avatar} />
        <View style={styles.commentBody}>
          <View style={styles.commentBubble}>
            <View style={styles.commentHeader}>
              <Text style={styles.username}>{comment.user.username}</Text>
              {comment.user.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>✓</Text>
                </View>
              )}
              <Text style={styles.timeAgo}>{comment.timeAgo}</Text>
            </View>
            <Text style={styles.commentText}>{comment.text}</Text>
          </View>

          <View style={styles.commentActions}>
            <TouchableOpacity
              onPress={() => toggleLike(comment.id, isReply, parentId)}
              style={styles.actionButton}
            >
              <Heart
                size={14}
                color={comment.isLiked ? '#ef4444' : '#6b7280'}
                fill={comment.isLiked ? '#ef4444' : 'none'}
              />
              <Text style={[styles.actionText, comment.isLiked && styles.likedText]}>
                {comment.likes}
              </Text>
            </TouchableOpacity>

            {!isReply && (
              <TouchableOpacity onPress={() => setReplyingTo(comment.id)} style={styles.actionButton}>
                <Reply size={14} color="#6b7280" />
                <Text style={styles.actionText}>Reply</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.actionButton}>
              <MoreHorizontal size={14} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {comment.replies?.map(reply => (
        <CommentItem key={reply.id} comment={reply} isReply={true} parentId={comment.id} />
      ))}
    </View>
  );

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Comments</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={onShare} style={styles.shareButton}>
              <Share size={20} color="#6366f1" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.commentsList} showsVerticalScrollIndicator={false}>
          {comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </ScrollView>

        {replyingTo && (
          <View style={styles.replyIndicator}>
            <View style={styles.replyInfo}>
              <Text style={styles.replyText}>
                Replying to {comments.find(c => c.id === replyingTo)?.user.username}
              </Text>
              <TouchableOpacity onPress={() => setReplyingTo(null)}>
                <X size={16} color="#2563eb" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2' }}
            style={styles.inputAvatar}
          />
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder={replyingTo ? "Write a reply..." : "Add a comment..."}
              placeholderTextColor="#9ca3af"
              value={newComment}
              onChangeText={setNewComment}
              multiline
              maxLength={500}
            />
          </View>
          <TouchableOpacity
            onPress={handleSendComment}
            disabled={!newComment.trim()}
            style={[styles.sendButton, !newComment.trim() && styles.sendButtonDisabled]}
          >
            <Send size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}


const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.8,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1f2937',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareButton: {
    padding: 8,
    marginRight: 8,
  },
  closeButton: {
    padding: 8,
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  commentItem: {
    marginBottom: 16,
  },
  replyItem: {
    marginLeft: 48,
    marginTop: 12,
  },
  commentContent: {
    flexDirection: 'row',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentBody: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1f2937',
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    marginLeft: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    color: '#ffffff',
    fontSize: 10,
  },
  timeAgo: {
    color: '#6b7280',
    fontSize: 12,
    marginLeft: 8,
  },
  commentText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 20,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  likedText: {
    color: '#ef4444',
  },
  replyIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#eff6ff',
    borderTopWidth: 1,
    borderTopColor: '#dbeafe',
  },
  replyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  replyText: {
    fontFamily: 'Inter-Regular',
    color: '#2563eb',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  inputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
  },
  textInput: {
    fontFamily: 'Inter-Regular',
    color: '#1f2937',
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 16,
  },
  sendButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
});