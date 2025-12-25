import { X } from "lucide-react";
import { useState } from "react";

export interface SettingsSetters {
  setCampfireMute: (val: boolean) => void;
  setMusicMute: (val: boolean) => void;
  setPlayQuotes: (val: boolean) => void;
  setCampfireLevel: (val: number) => void;
  setMusicLevel: (val: number) => void;
  setQuotesLevel: (val: number) => void;
  setSelectedVideo: (val: string) => void;
}

export interface ExpectedSettings {
  campfireMute: boolean;
  musicMute: boolean;
  playQuotes: boolean;
  campfireLevel: number;
  musicLevel: number;
  quotesLevel: number;
  selectedVideo: string;
}

export interface SettingsPageProps {
  onClose: () => void;
  settings: ExpectedSettings;
  setters: SettingsSetters;
}

export default function SettingsPage({
  onClose,
  settings,
  setters,
}: SettingsPageProps) {
  const [currentTab, setCurrentTab] = useState("general");

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
    },
  ];

  return (
    <div className="z-50 absolute bg-black/70 backdrop-blur-md inset-0 flex items-center justify-center">
      <div className="bg-black p-8 rounded-lg w-1/2 border border-white/20">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-2xl text-white font-bold">Settings</h2>
          <X className="text-white cursor-pointer" onClick={onClose} />
        </div>
        {/* settings tab row */}
        <div className="flex flex-col">
          <div className="flex flex-row gap-4 mt-4 w-full">
            <button
              className={`cursor-pointer text-white py-2 px-4 rounded-t ${
                currentTab === "general" ? "bg-neutral-800" : "bg-neutral-900"
              }`}
              onClick={() => setCurrentTab("general")}
            >
              General
            </button>
          </div>
          <hr className="border-white/20 w-full" />
        </div>

        <div className="flex flex-col mt-4 gap-4">
          {/* General Settings Tab */}
          {currentTab === "general" && (
            <>
              {/* Toggles */}
              <div className="flex flex-row items-center gap-2">
                <label className="text-white">Campfire Audio</label>
                <input
                  type="checkbox"
                  className="p-2 rounded bg-white/10 border border-white/20 text-white"
                  checked={!settings.campfireMute}
                  // Call the setter from props
                  onChange={(e) => setters.setCampfireMute(!e.target.checked)}
                />
              </div>
              <div className="flex flex-row items-center gap-2">
                <label className="text-white">Music Audio</label>
                <input
                  type="checkbox"
                  className="p-2 rounded bg-white/10 border border-white/20 text-white"
                  checked={!settings.musicMute}
                  onChange={(e) => setters.setMusicMute(!e.target.checked)}
                />
              </div>
              <div className="flex flex-row items-center gap-2">
                <label className="text-white">Play F1 Quotes</label>
                <input
                  type="checkbox"
                  className="p-2 rounded bg-white/10 border border-white/20 text-white"
                  checked={settings.playQuotes}
                  onChange={(e) => setters.setPlayQuotes(e.target.checked)}
                />
              </div>

              {/* Sliders */}
              <div className="flex flex-row items-center gap-2">
                <label className="text-white">Campfire Volume</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.campfireLevel}
                  onChange={(e) =>
                    setters.setCampfireLevel(parseInt(e.target.value))
                  }
                />
              </div>
              <div className="flex flex-row items-center gap-2">
                <label className="text-white">Music Volume</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.musicLevel}
                  onChange={(e) =>
                    setters.setMusicLevel(parseInt(e.target.value))
                  }
                />
              </div>
              <div className="flex flex-row items-center gap-2">
                <label className="text-white">F1 Quotes Volume</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.quotesLevel}
                  onChange={(e) =>
                    setters.setQuotesLevel(parseInt(e.target.value))
                  }
                />
              </div>
              <div className="flex flex-row items-center gap-2">
                <label className="text-white">Selected Video</label>
                <select
                  className="p-2 rounded bg-white/10 border border-white/20 text-white"
                  value={settings.selectedVideo}
                  onChange={(e) => setters.setSelectedVideo(e.target.value)}
                >
                  {availableVideos.map(
                    (video: { file: string; name: string }) => (
                      <option key={video.file} value={video.file}>
                        {video.name}
                      </option>
                    )
                  )}
                </select>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
