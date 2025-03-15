import { useEffect, useRef, useState } from 'react';

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoError, setIsVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const attemptPlay = async () => {
      try {
        video.currentTime = 0;
        video.playbackRate = 0.75;
        await video.play();
        setIsPlaying(true);
        console.log('Воспроизведение успешно запущено');
      } catch (error) {
        console.error('Ошибка воспроизведения видео:', error);
      }
    };

    const handleCanPlay = () => {
      console.log('Видео готово к воспроизведению');
      if (!isPlaying) {
        attemptPlay();
      }
    };

    const handlePlay = () => {
      console.log('Видео начало воспроизведение');
      setIsPlaying(true);
    };

    const handlePause = () => {
      console.log('Видео приостановлено');
      setIsPlaying(false);
      attemptPlay();
    };

    const handleTimeUpdate = () => {
      if (!isPlaying && video.currentTime > 0) {
        setIsPlaying(true);
      }
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);

    if (video.readyState >= 3) {
      attemptPlay();
    }

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [isPlaying]);

  const handleVideoLoad = () => {
    console.log('Видео загружено');
    setIsVideoLoaded(true);
    
    const video = videoRef.current;
    if (!video || isPlaying) return;

    video.play().catch(error => {
      console.error('Ошибка воспроизведения после загрузки:', error);
    });
  };

  const handleVideoError = () => {
    setIsVideoError(true);
    console.error('Ошибка загрузки видео');
  };

  return (
    <div className="fixed inset-0 w-full h-full">
      {!isVideoError && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          poster="/restaurant-poster.jpg"
        >
          <source src="/restaurant-video.mp4" type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60" />
      <div className="absolute inset-0 backdrop-blur-[1px] bg-black/10" />
    </div>
  );
} 