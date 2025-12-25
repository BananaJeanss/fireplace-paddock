import { useEffect, useState, useRef } from "react";
import {
  FlameKindling,
  Fullscreen,
  Music,
  Settings,
  VolumeOff,
} from "lucide-react";
import songs from "./songs.json";
import quotes from "./f1quotes.json";
import SettingsPage, { type ExpectedSettings } from "./components/SettingsPage";
import UseLocalStorage from "./hooks/useLocalStorage";

export default function App() {
  const [showGui, setShowGui] = useState(true);

  // songs
  const [currentSongIndex, setCurrentSongIndex] = useState(
    Math.floor(Math.random() * songs.length)
  );
  const currentSong = songs[currentSongIndex];
  const [currentSongTime, setCurrentSongTime] = useState("0:00");

  const [quoteIndex, setQuoteIndex] = useState(0);
  const currentQuote = quotes[quoteIndex];

  const [userInteracted, setUserInteracted] = useState(false);
  const quoteAudioRef = useRef<HTMLAudioElement>(null);
  const songAudioRef = useRef<HTMLAudioElement>(null);
  const campfireAudioRef = useRef<HTMLVideoElement>(null);

  const [settingsOpen, setSettingsOpen] = useState(false);

  // audio levels
  // playQuotes, musicMute and campfireMute cant use localstorage because browser autoplay policies yadayada
  const [campfireLevel, setCampfireLevel] = UseLocalStorage<number>(
    "campfireLevel",
    50
  );
  const [musicLevel, setMusicLevel] = UseLocalStorage<number>("musicLevel", 50);
  const [quotesLevel, setQuotesLevel] = UseLocalStorage<number>(
    "quotesLevel",
    50
  );

  const [musicMute, setMusicMute] = useState(true);
  const [playQuotes, setPlayQuotes] = useState(true);
  const [campfireMute, setCampfireMute] = useState(true);

  // video selected by user
  const availableVideos = [
    {
      name: "Fireplace",
      file: "fireplace.mp4",
    },
    {
      name: "Fireplace 2",
      file: "fireplace2.mp4",
    },
    {
      name: "None",
      file: "thisfiledoesnotexist.txt",
    }
  ];
  const [selectedVideo, setSelectedVideo] = UseLocalStorage<string>(
    "selectedVideo",
    availableVideos[0].file
  );
  const currentVideo = selectedVideo;

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

  // to disable media session controls, e.g. play/pause from keyboard
  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.playbackState = "none";

      const actions: MediaSessionAction[] = [
        "play",
        "pause",
        "stop",
        "previoustrack",
        "nexttrack",
      ];

      actions.forEach((action) => {
        try {
          navigator.mediaSession.setActionHandler(action, null);
        } catch (error) {
          console.error(
            `The media session action "${action}" is not supported.`,
            error
          );
        }
      });
    }
  }, []);

  // play quotes every 5-10 minutes if enabled and user has interacted
  useEffect(() => {
    if (!playQuotes || !userInteracted) return;

    const nextInMs = Math.floor(Math.random() * 5 + 5) * 60 * 1000;
    const timeout = setTimeout(() => {
      if (quoteAudioRef.current) {
        // Play /radio.mp3 first, then play the actual quote
        const radio = new Audio("/radio.mp3");
        radio
          .play()
          .then(() => {
            radio.onended = () => {
              quoteAudioRef.current
                ?.play()
                .catch((e) => console.log("Autoplay blocked", e));
            };
          })
          .catch((e) => {
            console.log("Autoplay blocked for radio.mp3", e);
            // Fallback: play quote directly
            quoteAudioRef.current
              ?.play()
              .catch((err) => console.log("Autoplay blocked", err));
          });
      }
    }, nextInMs);

    return () => clearTimeout(timeout);
  }, [quoteIndex, playQuotes, userInteracted]);

  // song volume update
  useEffect(() => {
    if (songAudioRef.current) {
      songAudioRef.current.volume = musicLevel / 100;
    }
  }, [musicLevel]);

  // campfire volume update
  useEffect(() => {
    if (campfireAudioRef.current) {
      campfireAudioRef.current.volume = campfireLevel / 100;
    }
  }, [campfireLevel]);

  return (
    <>
      {settingsOpen && (
        <SettingsPage
          onClose={() => setSettingsOpen(false)}
          setters={{
            setCampfireMute,
            setMusicMute,
            setPlayQuotes,
            setCampfireLevel,
            setMusicLevel,
            setQuotesLevel,
            setSelectedVideo,
          }}
          settings={
            {
              campfireMute,
              musicMute,
              playQuotes,
              campfireLevel,
              musicLevel,
              quotesLevel,
              selectedVideo,
            } as ExpectedSettings
          }
        />
      )}
      <div
        onClick={() => setUserInteracted(true)}
        className={`${
          showGui ? "cursor-default" : "cursor-none"
        } h-screen w-screen`}
      >
        {/* song player */}
        <audio
          ref={songAudioRef}
          src={currentSong.url}
          autoPlay
          loop
          muted={musicMute}
          controls={false}
          onTimeUpdate={(e) => {
            let betterTime = Math.floor(e.currentTarget.currentTime);
            const minutes = Math.floor(betterTime / 60);
            const seconds = betterTime % 60;
            const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
            setCurrentSongTime(`${minutes}:${formattedSeconds}`);
          }}
          onEnded={() => {
            setCurrentSongIndex((currentSongIndex + 1) % songs.length);
          }}
        />
        {/* i have the seat full of water */}
        {/* plays f1 quotes every 5-10 minutes if enabled */}
        <audio
          ref={quoteAudioRef}
          src={currentQuote.url}
          muted={!playQuotes}
          controls={false}
          onEnded={() => {
            // schedule next quote
            setQuoteIndex((quoteIndex + 1) % quotes.length);
          }}
        />

        {/* campfire video nd audio */}
        <video
          ref={campfireAudioRef}
          className="fixed inset-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted={campfireMute}
          src={`/videos/${currentVideo}`}
          controls={false}
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback nopictureinpicture"
        />
        <div
          className={`fixed inset-0 flex flex-col transition-opacity duration-500 ${
            showGui ? "opacity-50" : "opacity-0"
          }`}
        >
          <div className="flex flex-col w-full h-full absolute z-10">
            {/* top bar */}
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

              {/* current song info */}
              <div className="text-white flex flex-row gap-2 items-center w-full">
                <p>{currentSong.title}</p>
                <p>-</p>
                <p>{currentSong.artist}</p>
                <div className="h-full w-px bg-white opacity-50" />
                <div className="flex flex-row gap-1 items-center">
                  <p>{currentSongTime}</p>
                  <p>/</p>
                  <p>
                    {`${Math.floor(currentSong.duration / 60)}:${
                      Math.round(currentSong.duration % 60) < 10 ? "0" : ""
                    }${Math.round(currentSong.duration % 60)}`}
                  </p>
                </div>
                {/* sesttings button */}
                <div className="flex flex-row w-full justify-end flex-1">
                  <Settings
                    className="text-white cursor-pointer"
                    onClick={() => setSettingsOpen(true)}
                  />
                </div>
              </div>
            </div>
            {/* spacer */}
            <div className="flex-grow" />
            {/* bottom bar */}
            <div className="flex flex-row m-4 gap-4">
              <Fullscreen
                className="text-white cursor-pointer ml-auto"
                onClick={() => {
                  if (document.fullscreenElement) {
                    document.exitFullscreen();
                  } else {
                    document.documentElement.requestFullscreen();
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
