import { json } from '@sveltejs/kit';
import { readdirSync } from 'fs';
import { join } from 'path';
import type { Photo } from '$lib/types';

export async function GET({ url }) {
  const album = url.searchParams.get('album');
  const photosDir = join(process.cwd(), 'static', 'photos');
  const photos: Photo[] = [];

  console.log('Photos directory:', photosDir);
  console.log('Requested album:', album);

  try {
    const targetDir = album ? join(photosDir, album) : photosDir;

    // If album is specified, process only that directory
    if (album) {
      const items = readdirSync(targetDir, { withFileTypes: true });
      console.log('Items found:', items.map(item => item.name));

      for (const item of items) {
        if (item.isFile() && /\.(jpg|jpeg|png|gif)$/i.test(item.name)) {
          console.log('Found image:', item.name);
          const id = `${album}-${item.name}`;
          const src = `/photos/${album}/${item.name}`;

          photos.push({
            id,
            src,
            name: item.name,
            album: album
          });
        }
      }
    } else {
      // If no album, recursively process all subdirectories
      const walkDir = (dir: string, albumPrefix: string = '') => {
        const items = readdirSync(dir, { withFileTypes: true });
        for (const item of items) {
          const itemPath = join(dir, item.name);
          if (item.isDirectory()) {
            console.log('Entering directory:', item.name);
            walkDir(itemPath, albumPrefix ? `${albumPrefix}/${item.name}` : item.name);
          } else if (item.isFile() && /\.(jpg|jpeg|png|gif)$/i.test(item.name)) {
            console.log('Found image:', item.name);
            const id = `${albumPrefix || 'root'}-${item.name}`;
            const src = albumPrefix
              ? `/photos/${albumPrefix}/${item.name}`
              : `/photos/${item.name}`;

            photos.push({
              id,
              src,
              name: item.name,
              album: albumPrefix || undefined
            });
          }
        }
      };

      walkDir(photosDir);
    }

    console.log('Photos to return:', photos);
    return json({ photos });
  } catch (error) {
    console.error('Error reading photos:', error);
    return json(
      {
        photos: [],
        error: album ? `Album "${album}" not found` : 'Photos directory not found',
        details: error.message
      },
      { status: 404 }
    );
  }
}