import express from 'express';
import {
  getVideos,
  getVideoById,
  uploadVideo,
  updateVideo,
  deleteUserVideo,
  toggleLikeVideo,
  addComment,
  getVideoComments,
  addReply,
  toggleCommentReaction,
} from '../controllers/videoController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { createVideoSchema, commentSchema } from '../validators/schemas.js';

const router = express.Router();

// Root routes: Get all videos & Upload new video
router.route('/')
  .get(getVideos)
  .post(
    protect,
    upload.fields([
      { name: 'videoFile', maxCount: 1 },
      { name: 'thumbnailFile', maxCount: 1 },
    ]),
    validate(createVideoSchema),
    uploadVideo
  );

// Video detail, Update & Delete routes by ID
router.route('/:id')
  .get(getVideoById)
  .put(protect, updateVideo)
  .delete(protect, deleteUserVideo);

// Likes endpoint
router.post('/:id/like', protect, toggleLikeVideo);

// Comments endpoints
router.route('/:id/comments')
  .get(getVideoComments)
  .post(protect, validate(commentSchema), addComment);

// Reply & Reaction endpoints
router.post('/:id/comments/:commentId/reply', protect, validate(commentSchema), addReply);
router.post('/:videoId/comments/:commentId/react', protect, toggleCommentReaction);

export default router;