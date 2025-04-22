<script lang="ts">
  import { getPhotosByAlbum } from "$lib/utils";
  import type { Photo } from "$lib/types";
  import { page } from "$app/stores";

  let photo: Photo | null = null;
  let photos: Photo[] = [];
  let error: string | null = null;
  let loading = true;

  // Get the album and photo parameters from the URL
  $: album = $page.params.album;
  $: photoId = $page.params.photo;

  // Find previous and next photos for navigation
  $: currentIndex = photo ? photos.findIndex((p) => p.id === photoId) : -1;
  $: prevPhoto = currentIndex > 0 ? photos[currentIndex - 1] : null;
  $: nextPhoto = currentIndex >= 0 && currentIndex < photos.length - 1 ? photos[currentIndex + 1] : null;

  // Fetch the photo
  async function loadPhoto() {
    if (!album || !photoId) {
      error = "Missing album or photo ID";
      loading = false;
      return;
    }

    try {
      loading = true;
      photos = await getPhotosByAlbum(album);
      console.log(`Fetched photos for album "${album}":`, photos);
      photo = photos.find((p) => p.id === photoId) || null;

      if (!photo) {
        error = `Photo "${photoId}" not found in album "${album}"`;
      }
    } catch (err) {
      error = err instanceof Error ? err.message : "An unknown error occurred";
      console.error(`Error fetching photo "${photoId}" in album "${album}":`, error);
    } finally {
      loading = false;
    }
  }

  $: if (album && photoId) {
    loadPhoto();
  }
</script>

<div class="photo-details">
  {#if loading}
    <p>Loading photo...</p>
  {:else if error}
    <p>Error: {error}</p>
  {:else if !photo}
    <p>Photo not found.</p>
  {:else}
    <div class="photo-content">
      <h1>{photo.name}</h1>
      <img
        src={photo.src}
        alt={photo.name}
        on:error={() => console.error(`Failed to load image: ${photo.src}`)}
      />
      <p>Album: <a href={`/photos/${photo.album}`}>{photo.album}</a></p>

      <!-- Previous/Next Navigation -->
      <div class="photo-nav-buttons">
        {#if prevPhoto}
          <a href={`/photos/${album}/${prevPhoto.id}`} class="nav-button">Previous</a>
        {/if}
        {#if nextPhoto}
          <a href={`/photos/${album}/${nextPhoto.id}`} class="nav-button">Next</a>
        {/if}
      </div>

      <!-- Other photos in the album -->
      <div class="photo-nav">
        <h2>Other Photos in {album}:</h2>
        {#each photos as otherPhoto}
          {#if otherPhoto.id !== photoId}
            <a href={`/photos/${album}/${otherPhoto.id}`}>{otherPhoto.name}</a>
          {/if}
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .photo-details {
    padding: 1rem;
    max-width: 800px;
    margin: 0 auto;
  }

  .photo-content img {
    max-width: 100%;
    height: auto;
    margin-bottom: 1rem;
  }

  .photo-nav-buttons {
    margin: 1rem 0;
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .nav-button {
    padding: 0.5rem 1rem;
    background-color: #f0f0f0;
    text-decoration: none;
    color: #333;
    border-radius: 4px;
  }

  .nav-button:hover {
    background-color: #e0e0e0;
  }

  .photo-nav {
    margin-top: 2rem;
  }

  .photo-nav a {
    display: inline-block;
    margin: 0.5rem;
    text-decoration: none;
    color: blue;
  }

  .photo-nav a:hover {
    text-decoration: underline;
  }
</style>