
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export interface MusicToggleHandle {
  playMusic: () => void;
}

const MusicToggle = forwardRef<MusicToggleHandle>((_, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // A high-quality soulful acoustic melody representing the 'Dooron Dooron' vibe.
    const audioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3';
    audioRef.current = new Audio(audioUrl); 
    
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3; // Gentle background volume
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useImperativeHandle(ref, () => ({
    playMusic: () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play().catch(e => console.log("Playback blocked:", e));
        setIsPlaying(true);
      }
    }
  }));

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => {
          console.warn("Audio playback failed.", e);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <button
      onClick={toggleMusic}
      className="fixed bottom-6 right-6 z-50 p-3 md:p-4 bg-white/90 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgba(251,207,232,0.3)] border border-pink-100 text-pink-500 hover:scale-110 active:scale-90 transition-all duration-300 group"
      aria-label={isPlaying ? "Mute Music" : "Play Dooron Dooron"}
      title={isPlaying ? "Mute" : "Play 'Dooron Dooron'"}
    >
      <div className="relative">
        {isPlaying ? (
          <Volume2 size={20} className="md:w-6 md:h-6 animate-pulse" />
        ) : (
          <VolumeX size={20} className="md:w-6 md:h-6" />
        )}
        {isPlaying && (
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 md:h-3 md:w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-full w-full bg-pink-500"></span>
          </span>
        )}
      </div>
      
      <span className="hidden md:block absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white/95 px-4 py-2 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase text-pink-500 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-sm border border-pink-50 pointer-events-none transform translate-x-2 group-hover:translate-x-0">
        Now Playing: Dooron Dooron
      </span>
    </button>
  );
});

export default MusicToggle;
