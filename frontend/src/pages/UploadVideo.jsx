import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadVideoSchema } from '../validators/schemas';
import { uploadVideoData } from '../services/videoService';
import { useToast } from '../context/ToastContext';
import Input from '../components/Common/Input';

const UploadVideo = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [generalError, setGeneralError] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const {
    register,
    watch,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(uploadVideoSchema),
    defaultValues: { sourceType: 'youtube' },
  });

  const sourceType = watch('sourceType');

  const onSubmit = async (data) => {
    try {
      setGeneralError('');
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description || '');
      formData.append('sourceType', data.sourceType);

      if (data.sourceType === 'local') {
        if (!videoFile) {
          const errMsg = 'Please select a local video file';
          setGeneralError(errMsg);
          showToast(errMsg, 'error');
          return;
        }
        formData.append('videoFile', videoFile);
        if (thumbnailFile) {
          formData.append('thumbnailFile', thumbnailFile);
        }
      } else {
        if (!data.videoUrl) {
          const errMsg = 'Video URL is required for embedded streams';
          setError('videoUrl', { message: errMsg });
          showToast(errMsg, 'error');
          return;
        }
        formData.append('videoUrl', data.videoUrl);
        if (data.thumbnailUrl) {
          formData.append('thumbnailUrl', data.thumbnailUrl);
        }
      }

      await uploadVideoData(formData);
      showToast('Video published successfully!', 'success');
      navigate('/');
    } catch (err) {
      if (err.fieldErrors) {
        Object.keys(err.fieldErrors).forEach((field) => {
          setError(field, { message: err.fieldErrors[field] });
        });
        showToast('Please fix the errors in the form.', 'error');
      } else if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        err.response.data.errors.forEach((e) => {
          if (e.field) setError(e.field, { message: e.message });
        });
        showToast('Upload validation failed.', 'error');
      } else {
        const errMsg = err.response?.data?.message || 'Failed to upload video';
        setGeneralError(errMsg);
        showToast(errMsg, 'error');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Upload New Video</h1>

      {generalError && (
        <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-600 text-xs rounded-xl font-medium">
          {generalError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Video Title"
          type="text"
          placeholder="Enter video title"
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            {...register('description')}
            rows="3"
            placeholder="Tell viewers about your video..."
            className="w-full p-3 text-sm bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-slate-700 focus:border-red-500 outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Source Type</label>
          <select
            {...register('sourceType')}
            className="w-full p-3 text-sm bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-slate-700 outline-none"
          >
            <option value="youtube">YouTube Embed</option>
            <option value="twitch">Twitch Stream</option>
            <option value="local">Local MP4 File (Cloudinary)</option>
          </select>
          {errors.sourceType && (
            <p className="text-[11px] text-red-500 font-medium">{errors.sourceType.message}</p>
          )}
        </div>

        {sourceType === 'local' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Video File (.mp4)
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files[0])}
                className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-600 hover:file:bg-red-100 dark:file:bg-slate-800 dark:file:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Thumbnail Image (.jpg/.png)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files[0])}
                className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-600 hover:file:bg-red-100 dark:file:bg-slate-800 dark:file:text-white"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              label="Video URL"
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              error={errors.videoUrl?.message}
              {...register('videoUrl')}
            />

            <Input
              label="Thumbnail Image URL (Optional)"
              type="text"
              placeholder="https://img.youtube.com/vi/..."
              error={errors.thumbnailUrl?.message}
              {...register('thumbnailUrl')}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-red-600 text-white font-semibold text-xs rounded-xl hover:bg-red-700 transition shadow-md shadow-red-500/20 disabled:opacity-50"
        >
          {isSubmitting ? 'Uploading...' : 'Publish Video'}
        </button>
      </form>
    </div>
  );
};

export default UploadVideo;