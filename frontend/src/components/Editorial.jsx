// import { useState, useRef, useEffect } from 'react';
// import { Pause, Play } from 'lucide-react';

// const Editorial = ({ secureurl, thumbnail, duration }) => {
//   const videoRef = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [isHovering, setIsHovering] = useState(false);

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
//   };

//   const togglePlayPause = () => {
//     if (videoRef.current) {
//       if (isPlaying) {
//         videoRef.current.pause();
//       } else {
//         videoRef.current.play();
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     const handleTimeUpdate = () => setCurrentTime(video.currentTime);
//     const handleEnded = () => setIsPlaying(false);

//     video.addEventListener('timeupdate', handleTimeUpdate);
//     video.addEventListener('ended', handleEnded);

//     return () => {
//       video.removeEventListener('timeupdate', handleTimeUpdate);
//       video.removeEventListener('ended', handleEnded);
//     };
//   }, []);

//   return (
//     <div 
//       className="relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg"
//       onMouseEnter={() => setIsHovering(true)}
//       onMouseLeave={() => setIsHovering(false)}
//     >
//       {/* Video Element */}
//       <video
//         ref={videoRef}
//         src={secureurl}
//         poster={thumbnail}
//         onClick={togglePlayPause}
//         className="w-full aspect-video bg-black cursor-pointer"
//       />
      
//       {/* Video Controls Overlay */}
//       <div 
//         className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity ${
//           isHovering || !isPlaying ? 'opacity-100' : 'opacity-0'
//         }`}
//       >
//         <div className="flex items-center w-full mt-2">
//           {/* Play/Pause Button */}
//           <button
//             onClick={togglePlayPause}
//             className="btn btn-circle btn-primary mr-3"
//             aria-label={isPlaying ? "Pause" : "Play"}
//           >
//             {isPlaying ? <Pause /> : <Play />}
//           </button>
          
//           {/* Progress Bar */}
//           <span className="text-white text-sm mr-2">
//             {formatTime(currentTime)}
//           </span>
//           <input
//             type="range"
//             min="0"
//             max={duration || 0}
//             value={currentTime}
//             onChange={(e) => {
//               const newTime = Number(e.target.value);
//               if (videoRef.current) {
//                 videoRef.current.currentTime = newTime;
//                 setCurrentTime(newTime);
//               }
//             }}
//             className="range range-primary range-xs flex-1"
//           />
//           <span className="text-white text-sm ml-2">
//             {formatTime(duration)}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Editorial;
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

const Editorial = ({ secureurl, thumbnail, duration }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
        setHasStarted(true);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      setHasStarted(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  if (!secureurl) {
    return (
      <div className="w-full aspect-video bg-gray-900 rounded-xl flex items-center justify-center text-gray-400 border border-gray-800">
        No video solution available.
      </div>
    );
  }

  return (
    <div 
      className="relative w-full max-w-3xl mx-auto rounded-xl overflow-hidden shadow-2xl bg-black group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Custom Thumbnail Overlay (Guarantees Thumbnail Display) */}
      {!hasStarted && thumbnail && (
        <div 
          className="absolute inset-0 z-10 cursor-pointer bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: `url(${thumbnail})` }}
          onClick={togglePlayPause}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <button 
            className="z-20 p-4 bg-primary/90 text-white rounded-full shadow-xl hover:scale-110 transition-transform"
            aria-label="Play Video"
          >
            <Play size={32} className="fill-white ml-1" />
          </button>
        </div>
      )}

      {/* Video Element */}
      <video
        ref={videoRef}
        src={secureurl}
        onClick={togglePlayPause}
        className="w-full aspect-video cursor-pointer object-contain"
        preload="metadata"
      />
      
      {/* Video Controls Overlay */}
      <div 
        className={`absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 transition-opacity duration-300 ${
          isHovering || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center w-full gap-3">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="btn btn-circle btn-primary btn-sm flex-shrink-0"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>
          
          {/* Progress Bar */}
          <span className="text-white text-xs font-mono min-w-[35px]">
            {formatTime(currentTime)}
          </span>

          <input
            type="range"
            min="0"
            max={duration || videoRef.current?.duration || 0}
            value={currentTime}
            onChange={(e) => {
              const newTime = Number(e.target.value);
              if (videoRef.current) {
                videoRef.current.currentTime = newTime;
                setCurrentTime(newTime);
              }
            }}
            className="range range-primary range-xs flex-1 cursor-pointer"
          />

          <span className="text-white text-xs font-mono min-w-[35px]">
            {formatTime(duration || videoRef.current?.duration || 0)}
          </span>

          {/* Mute/Unmute */}
          <button onClick={toggleMute} className="text-white hover:text-primary transition-colors">
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          {/* Fullscreen */}
          <button onClick={toggleFullScreen} className="text-white hover:text-primary transition-colors">
            <Maximize size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Editorial;