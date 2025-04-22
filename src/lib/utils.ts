import type { Photo } from './types';

export async function getAllPhotos() {
  try {
    // Step 1: Fetch the list of albums
    const albumsResponse = await fetch('https://photos-eight-beta.vercel.app/api/photos');
    const albumsData = await albumsResponse.json();
    console.log('Albums fetched:', albumsData); // Log the albums

    if (!albumsData.albums || !Array.isArray(albumsData.albums)) {
      throw new Error('No albums found or invalid response');
    }

    // Step 2: Fetch photos from each album
    const allPhotos: Photo[] = [];
    for (const album of albumsData.albums) {
      const photosResponse = await fetch(`http://localhost:5173/api/photos?album=${album}`);
      const photosData = await photosResponse.json();
      console.log(`Photos for album "${album}":`, photosData); // Log the photos for each album

      if (photosData.photos && Array.isArray(photosData.photos)) {
        const photos = photosData.photos.map((photo: Photo) => ({
          id: photo.id,
          src: photo.src,
          name: photo.name,
          album: album // Add the album name to each photo
        }));
        allPhotos.push(...photos);
      }
    }

    return allPhotos;
  } catch (error) {
    console.error('Error fetching all photos:', error);
    return [];
  }
}

// getPhotosByAlbum remains unchanged
export async function getPhotosByAlbum(album: string) {
  try {
    if (!album || typeof album !== 'string') {
      throw new Error('Invalid album name');
    }

    const response = await fetch(`http://localhost:5173/api/photos?album=${album}`);
    const data = await response.json();

    if (!data.photos || !Array.isArray(data.photos)) {
      throw new Error(`No photos found for album "${album}" or invalid response`);
    }

    const photos = data.photos.map((photo: Photo) => ({
      id: photo.id,
      src: photo.src,
      name: photo.name,
      album: album // Add the album name to each photo
    }));

    return photos;
  } catch (error) {
    console.error(`Error fetching photos for album "${album}":`, error);
    return [];
  }
}
