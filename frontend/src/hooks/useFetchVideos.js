import { useState, useEffect } from 'react';
import { fetchVideos } from '../services/videoService';

export const useFetchVideos = (search, category) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadVideos = async () => {
      setLoading(true);
      try {
        const data = await fetchVideos(search, category);
        if (isMounted) setVideos(data);
      } catch (error) {
        console.error('Failed to fetch videos:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadVideos();

    return () => {
      isMounted = false;
    };
  }, [search, category]);

  return { videos, setVideos, loading };
};