import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const VideoCard = ({ video }) => {
  return (
    <Link to={`/watch/${video._id}`} className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-slate-800">
        <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <div className="p-3 bg-red-600 text-white rounded-full">
            <Play className="w-6 h-6 fill-current" />
          </div>
        </div>
        <span className="absolute bottom-2 right-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white bg-black/70 backdrop-blur-md rounded-md">
          {video.sourceType}
        </span>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 text-sm leading-snug group-hover:text-red-500">
          {video.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {video.uploader?.username || 'Anonymous'}
        </p>
      </div>
    </Link>
  );
};

export default VideoCard;