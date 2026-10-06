
const VideoPlayer = ({ video }) => {
  if (video.sourceType === 'youtube') {
    const embedUrl = video.videoUrl.replace('watch?v=', 'embed/');
    return (
      <iframe
        src={embedUrl}
        title={video.title}
        className="w-full aspect-video rounded-2xl shadow-lg"
        allowFullScreen
      ></iframe>
    );
  }

  return (
    <video controls className="w-full aspect-video rounded-2xl shadow-lg bg-black">
      <source src={video.videoUrl} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;