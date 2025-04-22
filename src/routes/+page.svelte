<script lang="ts">
  const data = fetch("http://localhost:5173/api/photos")
    .then((response) => response.json())
    .then((data) => data.photos);

  // get a list of albums from data.photos
  const albums = data
    .then((photos) => {
      const albumSet = new Set();
      photos.forEach((photo) => {
        if (photo.album) {
          albumSet.add(photo.album);
        }
      });
      return Array.from(albumSet);
    })
    .catch((error) => {
      console.error("Error fetching albums:", error);
    });
</script>

<h1>Albums</h1>
<ul>
  {#await albums}
    <p>Loading...</p>
  {:then albums}
    {#each albums as album}
      <li><a href="/photos/{album}">{album}</a></li>
    {/each}
  {:catch error}
    <p>Error: {error.message}</p>
  {/await}
</ul>

<div class="photos">
  {#await data}
    <p>Loading...</p>
  {:then photos}
    {#each photos as photo}
      <img class="photo" src={photo.src} alt={photo.name} />
    {/each}
  {:catch error}
    <p>Error: {error.message}</p>
  {/await}
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