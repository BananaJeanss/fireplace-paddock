import { X } from "lucide-react";
import { useEffect, useState } from "react";

export interface SettingsPageProps {
  onClose: () => void;
  onSave: (settings: ExpectedSettings) => void;
  settings: ExpectedSettings;
}

export interface ExpectedSettings {
  campfireMute: boolean;
  musicMute: boolean;
  playQuotes: boolean;
  campfireLevel: number;
  musicLevel: number;
  quotesLevel: number;
}

export default function SettingsPage({
  onClose,
  onSave,
  settings,
}: SettingsPageProps) {
  const [campfireMute, setCampfireMute] = useState(settings.campfireMute);
  const [musicMute, setMusicMute] = useState(settings.musicMute);
  const [playQuotes, setPlayQuotes] = useState(settings.playQuotes);

  const [campfireLevel, setCampfireLevel] = useState(settings.campfireLevel);
  const [musicLevel, setMusicLevel] = useState(settings.musicLevel);
  const [quotesLevel, setQuotesLevel] = useState(settings.quotesLevel);

  // onSave whenever anything changes cause autosave ftw
  useEffect(() => {
    onSave({
      campfireMute,
      musicMute,
      playQuotes,
      campfireLevel,
      musicLevel,
      quotesLevel,
    });
  }, [
    campfireMute,
    musicMute,
    playQuotes,
    campfireLevel,
    musicLevel,
    quotesLevel,
  ]);

  return (
    <div className="z-50 absolute bg-black/70 backdrop-blur-md inset-0 flex items-center justify-center">
      <div className="bg-black p-8 rounded-lg w-1/2 border border-white/20">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-2xl text-white font-bold">Settings</h2>
          <X
            className="text-white cursor-pointer"
            onClick={() => {
              onClose();
              onSave({
                campfireMute,
                musicMute,
                playQuotes,
                campfireLevel,
                musicLevel,
                quotesLevel,
              });
            }}
          />
        </div>
        <hr className="my-4 border-white/20" />
        <div className="flex flex-col mt-4 gap-4">
          <div className="flex flex-row items-center gap-2">
            <label className="text-white">Campfire Audio</label>
            <input
              type="checkbox"
              className="p-2 rounded bg-white/10 border border-white/20 text-white"
              checked={!campfireMute}
              onChange={(e) => setCampfireMute(!e.target.checked)}
            />
          </div>
          <div className="flex flex-row items-center gap-2">
            <label className="text-white">Music Audio</label>
            <input
              type="checkbox"
              className="p-2 rounded bg-white/10 border border-white/20 text-white"
              checked={!musicMute}
              onChange={(e) => setMusicMute(!e.target.checked)}
            />
          </div>
          <div className="flex flex-row items-center gap-2">
            <label className="text-white">Play F1 Quotes</label>
            <input
              type="checkbox"
              className="p-2 rounded bg-white/10 border border-white/20 text-white"
              checked={playQuotes}
              onChange={(e) => setPlayQuotes(e.target.checked)}
            />
          </div>

          <div className="flex flex-row items-center gap-2">
            <label className="text-white">Campfire Volume</label>
            <input
              type="range"
              min="0"
              max="100"
              value={campfireLevel}
              onChange={(e) => setCampfireLevel(parseInt(e.target.value))}
            />
          </div>
          <div className="flex flex-row items-center gap-2">
            <label className="text-white">Music Volume</label>
            <input
              type="range"
              min="0"
              max="100"
              value={musicLevel}
              onChange={(e) => setMusicLevel(parseInt(e.target.value))}
            />
          </div>
          <div className="flex flex-row items-center gap-2">
            <label className="text-white">F1 Quotes Volume</label>
            <input
              type="range"
              min="0"
              max="100"
              value={quotesLevel}
              onChange={(e) => setQuotesLevel(parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
