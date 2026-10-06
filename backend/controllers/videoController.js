import Video from '../models/Video.js';
import Comment from '../models/Comment.js';

// Get All Videos (with optional search and category filters)
export const getVideos = async (req, res, next) => {
  try {
    const { search, source } = req.query;
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (source && source !== 'All') {
      query.sourceType = source.toLowerCase();
    }

    const videos = await Video.find(query)
      .populate('uploader', 'username email')
      .sort({ createdAt: -1 });

    res.json(videos);
  } catch (error) {
    next(error);
  }
};

// Get Single Video by ID & Increment Views
export const getVideoById = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id).populate('uploader', 'username email');
    if (!video) {
      res.status(404);
      throw new Error('Video not found');
    }

    // Increment view count on watch
    video.views += 1;
    await video.save();

    res.json(video);
  } catch (error) {
    next(error);
  }
};

// Upload a New Video (Supports Cloudinary file streams & URLs)
export const uploadVideo = async (req, res, next) => {
  try {
    const { title, description, sourceType, videoUrl, thumbnailUrl } = req.body;

    let finalVideoUrl = videoUrl;
    let finalThumbnailUrl = thumbnailUrl;

    if (req.files) {
      if (req.files.videoFile && req.files.videoFile[0]) {
        finalVideoUrl = req.files.videoFile[0].path;
      }
      if (req.files.thumbnailFile && req.files.thumbnailFile[0]) {
        finalThumbnailUrl = req.files.thumbnailFile[0].path;
      }
    }

    if (!finalVideoUrl) {
      res.status(400);
      throw new Error('Please provide a video URL or upload a file');
    }

    const video = await Video.create({
      title,
      description,
      sourceType,
      videoUrl: finalVideoUrl,
      thumbnailUrl: finalThumbnailUrl || 'https://via.placeholder.com/600x340',
      uploader: req.user._id,
    });

    // Real-time Socket Event: Notify Admin & Feed of new upload
    if (req.io) {
      req.io.emit('new_video_uploaded', video);
    }

    res.status(201).json(video);
  } catch (error) {
    next(error);
  }
};

// Update Video Details (Edit Modal Handler)
export const updateVideo = async (req, res, next) => {
  try {
    const { title, description, thumbnailUrl } = req.body;

    const video = await Video.findById(req.params.id);

    if (!video) {
      res.status(404);
      throw new Error('Video not found');
    }

    // Check ownership
    if (video.uploader.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to update this video');
    }

    if (title) video.title = title;
    if (description !== undefined) video.description = description;
    if (thumbnailUrl) video.thumbnailUrl = thumbnailUrl;

    const updatedVideo = await video.save();
    res.json(updatedVideo);
  } catch (error) {
    next(error);
  }
};

// Delete Video uploaded by the logged-in user
export const deleteUserVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      res.status(404);
      throw new Error('Video not found');
    }

    if (video.uploader.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('User not authorized to delete this video');
    }

    await video.deleteOne();

    // Real-time Socket Event: Emit deletion to Watch Room & Global Feed
    if (req.io) {
      req.io.to(req.params.id).emit('video_deleted', { videoId: req.params.id });
      req.io.emit('admin_video_deleted', { videoId: req.params.id });
    }

    res.json({ message: 'Video removed successfully' });
  } catch (error) {
    next(error);
  }
};

// Toggle Like / Unlike Video (Only the current user can toggle their own like)
export const toggleLikeVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      res.status(404);
      throw new Error('Video not found');
    }

    const currentUserId = req.user._id.toString();
    const alreadyLikedIndex = video.likes.findIndex(
      (id) => id.toString() === currentUserId
    );

    if (alreadyLikedIndex > -1) {
      // Current user previously liked this video -> remove THEIR OWN like
      video.likes.splice(alreadyLikedIndex, 1);
    } else {
      // Current user hasn't liked it yet -> add their like
      video.likes.push(req.user._id);
    }

    await video.save();

    // Real-time Socket Event: Broadcast like count update to video room viewers
    if (req.io) {
      req.io.to(req.params.id).emit('like_updated', {
        videoId: req.params.id,
        likes: video.likes,
        likesCount: video.likes.length,
      });
    }

    res.json({
      likes: video.likes,
      likesCount: video.likes.length,
    });
  } catch (error) {
    next(error);
  }
};

// Add Comment to Video
export const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === '') {
      res.status(400);
      throw new Error('Comment text is required');
    }

    const comment = await Comment.create({
      video: req.params.id,
      user: req.user._id,
      text,
    });

    const populatedComment = await comment.populate('user', 'username');

    // Real-time Socket Event: Broadcast new comment to viewers watching this video
    if (req.io) {
      req.io.to(req.params.id).emit('new_comment', populatedComment);
    }

    res.status(201).json(populatedComment);
  } catch (error) {
    next(error);
  }
};

// Get All Comments for a Specific Video
export const getVideoComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ video: req.params.id })
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

// Add Reply to an Existing Comment
export const addReply = async (req, res, next) => {
  try {
    const { text } = req.body;
    const { id: videoId, commentId } = req.params;

    if (!text || text.trim() === '') {
      res.status(400);
      throw new Error('Reply text is required');
    }

    const parent = await Comment.findById(commentId);
    if (!parent) {
      res.status(404);
      throw new Error('Parent comment not found');
    }

    const reply = await Comment.create({
      video: videoId,
      user: req.user._id,
      text,
      parentComment: commentId,
    });

    const populatedReply = await reply.populate('user', 'username');

    if (req.io) {
      req.io.to(videoId).emit('new_reply', populatedReply);
    }

    res.status(201).json(populatedReply);
  } catch (error) {
    next(error);
  }
};

// Toggle Emoji Reaction on a Comment (like, love, laugh, fire)
export const toggleCommentReaction = async (req, res, next) => {
  try {
    const { commentId, videoId } = req.params;
    const { emoji } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404);
      throw new Error('Comment not found');
    }

    const existingIndex = comment.reactions.findIndex(
      (r) => r.user.toString() === req.user._id.toString() && r.emoji === emoji
    );

    if (existingIndex > -1) {
      comment.reactions.splice(existingIndex, 1);
    } else {
      comment.reactions.push({ user: req.user._id, emoji });
    }

    await comment.save();
    const updatedComment = await comment.populate('user', 'username');

    if (req.io) {
      req.io.to(videoId).emit('comment_reaction_updated', updatedComment);
    }

    res.json(updatedComment);
  } catch (error) {
    next(error);
  }
};