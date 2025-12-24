import fs from 'fs';
import path from 'path';
import * as mm from 'music-metadata';

const playlistDir = './public/playlist';
const files = fs.readdirSync(playlistDir).filter(file => file.endsWith('.mp3'));

const playlist = await Promise.all(files.map(async (file) => {
  const metadata = await mm.parseFile(path.join(playlistDir, file));
  return {
    url: `/playlist/${file}`,
    title: metadata.common.title || file,
    artist: metadata.common.artist || "Unknown Artist",
    duration: metadata.format.duration || 0,
  };
}));

fs.writeFileSync('./src/songs.json', JSON.stringify(playlist, null, 2));
console.log('Playlist generated!');