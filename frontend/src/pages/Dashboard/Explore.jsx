import  { useState } from 'react';
import FilterBar from '../../components/Video/FilterBar';
import VideoCard from '../../components/Video/VideoCard';
import { useFetchVideos } from '../../hooks/useFetchVideos';

const Explore = ({ search }) => {
  const [category, setCategory] = useState('All');
  const { videos, loading } = useFetchVideos(search, category);

  return (
    <div className="p-8">
      <FilterBar selected={category} onSelect={setCategory} />
      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading videos...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;