import { useEffect, useState } from "react";
import { FlameKindling, Music, VolumeOff } from "lucide-react";
import songs from "./songs.json";

export default function App() {
  const [campfireMute, setCampfireMute] = useState(true);

  const [showGui, setShowGui] = useState(true);

  // songs
  const [musicMute, setMusicMute] = useState(true);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const currentSong = songs[currentSongIndex];

  // gui auto-hide logic
  useEffect(() => {
    let timeoutId: number;
    const handleMouseMove = () => {
      setShowGui(true);
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setShowGui(false);
      }, 3000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.clearTimeout(timeoutId);
    };
  }, []);

  // loopdeloop through songs
  useEffect(() => {
    let intervalId: number;
    if (!musicMute) {
      intervalId = window.setInterval(() => {
        setCurrentSongIndex((index) => (index + 1) % songs.length);
      }, currentSong.duration * 1000);
    }
    return () => {
      window.clearInterval(intervalId);
    };
  }, [musicMute, currentSong.duration]);

  return (
    <div
      className={`${
        showGui ? "cursor-default" : "cursor-none"
      } h-screen w-screen`}
    >
      <audio src={currentSong.url} autoPlay loop muted={musicMute} />
      <video
        className="fixed inset-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted={campfireMute}
        src="/fireplace.mp4"
      />
      <div
        className={`fixed inset-0 flex flex-col transition-opacity duration-500 ${
          showGui ? "opacity-50" : "opacity-0"
        }`}
      >
        <div className="flex flex-row m-4 gap-4">
          {/* campfire toggle */}
          {campfireMute ? (
            <VolumeOff
              className="text-white cursor-pointer"
              onClick={() => setCampfireMute(false)}
            />
          ) : (
            <FlameKindling
              className="text-white cursor-pointer"
              onClick={() => setCampfireMute(true)}
            />
          )}

          {/* music toggle */}
          {musicMute ? (
            <VolumeOff
              className="text-white cursor-pointer"
              onClick={() => setMusicMute(false)}
            />
          ) : (
            <Music
              className="text-white cursor-pointer"
              onClick={() => setMusicMute(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
