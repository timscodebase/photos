import { readdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const photosDir = join(process.cwd(), 'static', 'photos');
const outputFile = join(process.cwd(), 'src', 'lib', 'photos.json');

function generatePhotoList() {
  try {
    const albums = readdirSync(photosDir, { withFileTypes: true })
      .filter((item) => item.isDirectory())
      .map((item) => item.name);

    const photoData = { albums: [], photos: {} };
    photoData.albums = albums;

    for (const album of albums) {
      const targetDir = join(photosDir, album);
      const items = readdirSync(targetDir, { withFileTypes: true });
      const photos = [];

      for (const item of items) {
        if (item.isFile() && /\.(jpg|jpeg|png|gif)$/i.test(item.name)) {
          const id = `${album}-${item.name}`;
          const src = `/photos/${album}/${item.name}`;

          photos.push({
            id,
            src,
            name: item.name,
            album
          });
        }
      }

      photoData.photos[album] = photos;
    }

    writeFileSync(outputFile, JSON.stringify(photoData, null, 2), 'utf-8');
    console.log('Generated photos.json successfully');
  } catch (error) {
    console.error('Error generating photos.json:', error);
    process.exit(1);
  }
}

generatePhotoList();