<script lang="ts">
  import { getPhotosByAlbum } from "$lib/utils";
  import type { Photo } from "$lib/types";
  import { page } from "$app/stores";
  
  let photos: Photo[] = [];
  let albums: string[] = [];
  let error: string | null = null;
  let loading = true;
  
  // Get the album parameter from the URL
  $: album = $page.params.album;
  
  // Fetch the list of albums
  async function fetchAlbums() {
    try {
      const response = await fetch('http://localhost:5173/api/photos');
      const data = await response.json();
      albums = data.albums || [];
    } catch (err) {
      console.error('Error fetching albums:', err);
    }
  }
  
  // Fetch photos for the album
  async function loadPhotos() {
    if (!album) {
      error = "No album specified";
      loading = false;
      return;
    }

    try {
      loading = true;
      photos = await getPhotosByAlbum(album);
      console.log(`Fetched photos for album "${album}":`, photos);
    } catch (err) {
      error = err instanceof Error ? err.message : "An unknown error occurred";
      console.error(`Error fetching photos for album "${album}":`, error);
    } finally {
      loading = false;
    }
  }
  
  // Load albums and photos on mount or when album changes
  fetchAlbums();
  $: if (album) {
    loadPhotos();
  }
</script>

<div>
  {#if loading}
    <p>Loading photos...</p>
  {:else if error}
    <p>Error: {error}</p>
  {:else if photos.length === 0}
    <p>No photos found in this album.</p>
  {:else}
    <div class="photos">
      {#each photos as photo}
        <a href={`/photos/${album}/${photo.id}`}>
          <img class="photo" src={photo.src} alt={photo.name} />
        </a>
      {/each}
    </div>
  {/if}
</div>
  
<style>
  .photos {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.5rem;
  }

  .photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>