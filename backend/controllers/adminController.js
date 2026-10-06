import Video from '../models/Video.js';
import User from '../models/User.js';

export const getAllVideosAdmin = async (req, res, next) => {
  try {
    const videos = await Video.find({})
      .populate('uploader', 'username email createdAt')
      .sort({ createdAt: -1 });

    res.json(videos);
  } catch (error) {
    next(error);
  }
};

export const getAllUsersAdmin = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const forceDeleteVideoAdmin = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      res.status(404);
      throw new Error('Video not found');
    }

    await video.deleteOne();
    res.json({ message: 'Video forcefully deleted by Admin' });
  } catch (error) {
    next(error);
  }
};