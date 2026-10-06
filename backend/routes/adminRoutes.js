import express from 'express';
import { getAllVideosAdmin, getAllUsersAdmin, forceDeleteVideoAdmin } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/videos', getAllVideosAdmin);
router.get('/users', getAllUsersAdmin);
router.delete('/videos/:id', forceDeleteVideoAdmin);

export default router;