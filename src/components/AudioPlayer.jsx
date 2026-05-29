"use client";
import { useEffect, useRef } from "react";

export default function AudioPlayer() {
  const ref = useRef(null);

  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;
    
    const playAudio = async () => {
      try {
        await audio.play();
      } catch (error) {
        // Autoplay prevented; user interaction may be needed
        console.log("Autoplay blocked:", error.message);
      }
    };

    // Delay slightly to ensure audio is ready
    setTimeout(playAudio, 100);
  }, []);

  return (
    <audio
      ref={ref}
      src="/audio/bg.mp3"
      autoPlay
      loop
      playsInline
      preload="auto"
    />
  );
}
