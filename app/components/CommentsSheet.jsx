import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Animated, KeyboardAvoidingView, Platform, Alert, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { Send, X, ThumbsUp } from 'lucide-react-native';

const { height } = Dimensions.get('window');

export default function CommentsSheet({ visible, onClose, comments }) {
  const [commentText, setCommentText] = useState('');
  const [allComments, setAllComments] = useState(comments);
  const [expanded, setExpanded] = useState(false);
  const [replyTo, setReplyTo] = useState(null);

  if (!visible) return null;

  const handleLike = (id) => {
    const updated = allComments.map(comment =>
      comment.id === id ? { ...comment, liked: !comment.liked } : comment
    );
    setAllComments(updated);
  };

  const handleReply = (id, user) => {
    setCommentText(`@${user} `);
    setReplyTo(id);
  };

  const handleLongPress = (comment) => {
    Alert.alert(
      'Comment Options',
      'Choose an action',
      [
        { text: 'Delete', onPress: () => handleDelete(comment.id), style: 'destructive' },
        { text: 'Report', onPress: () => console.log('Reported') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleDelete = (id) => {
    setAllComments(prev => prev.filter(comment => comment.id !== id && comment.replyTo !== id));
  };

  const handleSend = () => {
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now(),
      user: 'you',
      text: commentText.trim(),
      time: 'Just now',
      liked: false,
      replyTo: replyTo || null
    };
    setAllComments([newComment, ...allComments]);
    setCommentText('');
    setReplyTo(null);
  };

  const renderComment = (comment, depth = 0) => {
    const replies = allComments.filter(c => c.replyTo === comment.id);

    return (
      <View key={comment.id} style={{ marginLeft: depth * 16 }}>
        <TouchableOpacity onLongPress={() => handleLongPress(comment)}>
          <View style={styles.comment}>
            <View style={styles.rowString}>
              <Text style={styles.user}>@{comment.user}</Text>
              <Text style={styles.text}>{comment.text}</Text>
            </View>
            <View style={styles.commentFooter}>
              <Text style={styles.time}>{comment.time}</Text>
              <TouchableOpacity onPress={() => handleReply(comment.id, comment.user)}>
                <Text style={styles.replyText}>Reply</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleLike(comment.id)}>
                <ThumbsUp size={16} color={comment.liked ? '#0095f6' : '#999'} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
        {replies.map(reply => renderComment(reply, depth + 1))}
      </View>
    );
  };

  const topLevelComments = allComments.filter(c => !c.replyTo);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, expanded && styles.expandedContainer]}
    >
      <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.swipeBar}>
        <View style={styles.swipeIndicator} />
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.title}>Comments</Text>
        <TouchableOpacity onPress={onClose}>
          <X size={24} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={topLevelComments}
        renderItem={({ item }) => renderComment(item)}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        inverted
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          placeholderTextColor="#999"
          value={commentText}
          onChangeText={setCommentText}
        />
        <TouchableOpacity disabled={!commentText.trim()} onPress={handleSend}>
          <Send size={24} color={commentText.trim() ? "#0095f6" : "#666"} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.6,
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  expandedContainer: {
    height: height,
  },
  swipeBar: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  swipeIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  list: {
    flex: 1,
  },
  comment: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  rowString: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  user: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 6,
  },
  text: {
    color: 'white',
    flexShrink: 1,
  },
  time: {
    color: '#999',
    fontSize: 12,
    marginRight: 12,
  },
  replyText: {
    color: '#0095f6',
    fontSize: 12,
    marginRight: 12,
  },
  commentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 20,
    padding: 12,
    color: 'white',
    marginRight: 8,
  },
});
