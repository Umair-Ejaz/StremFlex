import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ThumbsUp, Send, User as UserIcon, Eye, CornerDownRight, Smile } from 'lucide-react';
import VideoPlayer from '../components/Video/VideoPlayer';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import { useSocket } from '../context/SocketContext';
import {
  fetchVideoById,
  fetchComments,
  createComment,
  toggleLike,
  addReply,
  toggleCommentReaction,
} from '../services/videoService';

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const socket = useSocket();

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Reaction picker visibility tracking per comment
  const [activeReactionCommentId, setActiveReactionCommentId] = useState(null);

  // Reply state tracking
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const loadVideoAndComments = async () => {
      try {
        setLoading(true);
        const videoData = await fetchVideoById(id);
        const commentData = await fetchComments(id);

        setVideo(videoData);
        setLikes(videoData.likes || []);
        setComments(commentData);
      } catch (err) {
        showToast('Error loading video data', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadVideoAndComments();
  }, [id]);

  // Socket.io Room Listeners
  useEffect(() => {
    if (!socket || !id) return;

    socket.emit('join_video', id);

    socket.on('new_comment', (incomingComment) => {
      setComments((prev) => [incomingComment, ...prev]);
    });

    socket.on('new_reply', (incomingReply) => {
      setComments((prev) => [incomingReply, ...prev]);
    });

    socket.on('like_updated', (data) => {
      if (data.videoId === id) setLikes(data.likes);
    });

    socket.on('comment_reaction_updated', (updatedComment) => {
      setComments((prev) =>
        prev.map((c) => (c._id === updatedComment._id ? updatedComment : c))
      );
    });

    socket.on('video_deleted', (data) => {
      if (data.videoId === id) {
        showToast('Video removed by uploader/admin', 'info');
        navigate('/');
      }
    });

    return () => {
      socket.emit('leave_video', id);
      socket.off('new_comment');
      socket.off('new_reply');
      socket.off('like_updated');
      socket.off('comment_reaction_updated');
      socket.off('video_deleted');
    };
  }, [socket, id, navigate]);

  // Handle Like/Unlike (Allows original liker to toggle off, syncs live for all)
  const handleLike = async () => {
    if (!user) {
      showToast('Please sign in to like videos!', 'info');
      return;
    }

    try {
      const res = await toggleLike(id);
      setLikes(res.likes);
      const isNowLiked = res.likes.some((likeId) => likeId === user._id || likeId._id === user._id);
      showToast(isNowLiked ? 'Video Liked!' : 'Like removed', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update like', 'error');
    }
  };

  // Submit Top-Level Comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!user) {
      showToast('Please sign in to leave a comment!', 'info');
      return;
    }

    try {
      setSubmitting(true);
      await createComment(id, newComment);
      setNewComment('');
    } catch (err) {
      showToast('Failed to post comment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Reply to Comment
  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      await addReply(id, commentId, replyText);
      setReplyText('');
      setReplyingToId(null);
      showToast('Reply posted!', 'success');
    } catch (err) {
      showToast('Failed to post reply', 'error');
    }
  };

  // Toggle Emoji Reaction on Comment
  const handleReaction = async (commentId, emoji) => {
    if (!user) {
      showToast('Please sign in to react!', 'info');
      return;
    }

    try {
      await toggleCommentReaction(id, commentId, emoji);
    } catch (err) {
      showToast('Failed to react', 'error');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading video...</div>;
  if (!video) return <div className="p-8 text-center text-gray-500">Video not found.</div>;

  // Check if current user has liked this video
  const isLikedByCurrentUser = user && likes.some((likeId) => likeId === user._id || likeId._id === user._id);

  // Group top-level comments and replies
  const topLevelComments = comments.filter((c) => !c.parentComment);
  const getReplies = (parentId) => comments.filter((c) => c.parentComment === parentId);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <VideoPlayer video={video} />

      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{video.title}</h1>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Uploaded by <strong className="text-gray-800 dark:text-gray-200">{video.uploader?.username || 'Unknown'}</strong></span>
            <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {video.views} views</span>
          </div>

          {/* Like Button: Highlighted if liked by current user */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
              isLikedByCurrentUser
                ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${isLikedByCurrentUser ? 'fill-current' : ''}`} />
            <span>{isLikedByCurrentUser ? 'Liked' : 'Like'} ({likes.length})</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Comments ({comments.length})</h2>

        {user ? (
          <form onSubmit={handleCommentSubmit} className="flex gap-3">
            <input
              type="text"
              placeholder="Add a public comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl text-sm dark:text-white border-none focus:ring-2 focus:ring-red-500 outline-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 text-xs font-semibold"
            >
              <Send className="w-4 h-4" /> Post
            </button>
          </form>
        ) : (
          <p className="text-xs text-gray-500 bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl text-center">
            Please <Link to="/login" className="text-red-500 font-semibold">Sign In</Link> to join discussion.
          </p>
        )}

        {/* Comment Stream */}
        <div className="space-y-4 pt-2">
          {topLevelComments.map((comment) => {
            const replies = getReplies(comment._id);
            const reactions = comment.reactions || [];

            const totalLikeCount = reactions.filter((r) => r.emoji === 'like').length;
            const totalLoveCount = reactions.filter((r) => r.emoji === 'love').length;
            const totalLaughCount = reactions.filter((r) => r.emoji === 'laugh').length;
            const totalFireCount = reactions.filter((r) => r.emoji === 'fire').length;

            const isReactionsVisible = activeReactionCommentId === comment._id;

            return (
              <div key={comment._id} className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50/50 dark:bg-slate-800/30 rounded-2xl border border-gray-100 dark:border-slate-800">
                  <div className="p-2 bg-red-50 dark:bg-red-950/40 text-red-600 rounded-full mt-0.5">
                    <UserIcon className="w-4 h-4" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-900 dark:text-white">
                        {comment.user?.username || 'Anonymous'}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">{comment.text}</p>

                    {/* Active Reaction Counters (Pills) */}
                    {reactions.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-2 text-[10px]">
                        {totalLikeCount > 0 && <span className="bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-gray-700 dark:text-gray-300">👍 {totalLikeCount}</span>}
                        {totalLoveCount > 0 && <span className="bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-gray-700 dark:text-gray-300">❤️ {totalLoveCount}</span>}
                        {totalLaughCount > 0 && <span className="bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-gray-700 dark:text-gray-300">😂 {totalLaughCount}</span>}
                        {totalFireCount > 0 && <span className="bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-gray-700 dark:text-gray-300">🔥 {totalFireCount}</span>}
                      </div>
                    )}

                    {/* Action Row */}
                    <div className="flex items-center gap-4 mt-3 pt-2 border-t border-gray-100 dark:border-slate-800 text-[11px]">
                      {/* React Toggle Button */}
                      <button
                        onClick={() => setActiveReactionCommentId(isReactionsVisible ? null : comment._id)}
                        className="text-gray-500 hover:text-red-500 font-semibold flex items-center gap-1 transition"
                      >
                        <Smile className="w-3.5 h-3.5" /> React
                      </button>

                      {/* Hidden Emoji Bar - Appears when "React" is clicked */}
                      {isReactionsVisible && (
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-2 py-1 rounded-full border border-gray-200 dark:border-slate-700 shadow-sm animate-in fade-in">
                          <button onClick={() => handleReaction(comment._id, 'like')} className="hover:scale-125 transition">👍</button>
                          <button onClick={() => handleReaction(comment._id, 'love')} className="hover:scale-125 transition">❤️</button>
                          <button onClick={() => handleReaction(comment._id, 'laugh')} className="hover:scale-125 transition">😂</button>
                          <button onClick={() => handleReaction(comment._id, 'fire')} className="hover:scale-125 transition">🔥</button>
                        </div>
                      )}

                      {/* Reply Button */}
                      {user && (
                        <button
                          onClick={() => setReplyingToId(replyingToId === comment._id ? null : comment._id)}
                          className="text-red-500 font-semibold flex items-center gap-1 ml-auto hover:underline"
                        >
                          <CornerDownRight className="w-3 h-3" /> Reply
                        </button>
                      )}
                    </div>

                    {/* Inline Reply Box */}
                    {replyingToId === comment._id && (
                      <form onSubmit={(e) => handleReplySubmit(e, comment._id)} className="flex gap-2 mt-3">
                        <input
                          type="text"
                          placeholder="Write a reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="flex-1 p-2 bg-white dark:bg-slate-900 rounded-lg text-xs dark:text-white border border-gray-200 dark:border-slate-700 outline-none"
                        />
                        <button type="submit" className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold">
                          Reply
                        </button>
                      </form>
                    )}
                  </div>
                </div>

                {/* Nested Replies Stream */}
                {replies.length > 0 && (
                  <div className="pl-8 space-y-2 border-l-2 border-red-500/20 ml-4">
                    {replies.map((reply) => (
                      <div key={reply._id} className="flex items-start gap-2 p-2.5 bg-gray-50/30 dark:bg-slate-800/20 rounded-xl">
                        <div className="p-1.5 bg-gray-100 dark:bg-slate-800 text-gray-500 rounded-full mt-0.5">
                          <UserIcon className="w-3 h-3" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-gray-900 dark:text-white">{reply.user?.username || 'Anonymous'}</span>
                            <span className="text-[9px] text-gray-400">{new Date(reply.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5">{reply.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Watch;