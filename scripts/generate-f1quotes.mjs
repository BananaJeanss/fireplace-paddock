import fs from 'fs';
import path from 'path';
import * as mm from 'music-metadata';

const quotesDir = './public/f1quotes';
const files = fs.readdirSync(quotesDir).filter(file => file.endsWith('.mp3'));

const quotes = await Promise.all(files.map(async (file) => {
  const metadata = await mm.parseFile(path.join(quotesDir, file));
  return {
    url: `/f1quotes/${file}`,
  };
}));

fs.writeFileSync('./src/f1quotes.json', JSON.stringify(quotes, null, 2));
console.log('F1 quotes generated!');
