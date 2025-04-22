<script lang="ts">
    import { getPhotosByAlbum } from "$lib/utils";
    import type { Photo } from "$lib/types";
    import { page } from "$app/stores"; // Access URL parameters
  
    let photo: Photo | null = null;
    let photos: Photo[] = []; // All photos in the album for navigation
    let error: string | null = null;
    let loading = true;
  
    // Get the album and photo parameters from the URL
    $: album = $page.params.album;
    $: photoId = $page.params.photo;
  
    // Fetch photos when the component mounts or parameters change
    async function loadPhoto() {
      if (!album || !photoId) {
        error = "Missing album or photo ID";
        loading = false;
        return;
      }
  
      try {
        loading = true;
        photos = await getPhotosByAlbum(album);
        console.log(`Fetched photos for album "${album}":`, photos); // Debug log
  
        // Find the photo with the matching ID
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
  
    // Load photo initially and when parameters change
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
        <img src={photo.src} alt={photo.name} />
        <p>Album: <a href={`/photos/${photo.album}`}>{photo.album}</a></p>
  
        <!-- Navigation to other photos in the same album -->
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