<script lang="ts">
  import type { Photo } from "$lib/types";

  let albums: string[] = [];
  let error: string | null = null;
  let loading = true;

  // Fetch the list of albums
  async function fetchAlbums() {
    try {
      loading = true;
      const response = await fetch('/api/photos'); // Relative URL
      if (!response.ok) {
        throw new Error(`Failed to fetch albums: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      albums = data.albums || [];
      console.log('Fetched albums:', albums);
    } catch (err) {
      error = err instanceof Error ? err.message : "An unknown error occurred";
      console.error('Error fetching albums:', err);
    } finally {
      loading = false;
    }
  }

  // Load albums on mount
  fetchAlbums();
</script>

<div class="home">
  <h1>Photo Gallery</h1>

  {#if loading}
    <p>Loading albums...</p>
  {:else if error}
    <p>Error: {error}</p>
  {:else if albums.length === 0}
    <p>No albums found.</p>
  {:else}
    <div class="album-grid">
      {#each albums as album}
        <a href={`/photos/${album}`} class="album-card">
          <h2>{album}</h2>
          <p>View photos</p>
        </a>
      {/each}
    </div>
  {/if}
</div>

<style>
  .home {
    padding: 1rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  h1 {
    text-align: center;
    margin-bottom: 2rem;
  }

  .album-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }

  .album-card {
    border: 1px solid #ddd;
    padding: 1rem;
    text-align: center;
    text-decoration: none;
    color: #333;
    background-color: #f9f9f9;
    border-radius: 4px;
  }

  .album-card:hover {
    background-color: #f0f0f0;
  }

  .album-card h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
  }

  .album-card p {
    margin: 0;
    color: #666;
  }
</style>