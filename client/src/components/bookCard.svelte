<script>
  import { navigate } from 'svelte-routing';

  export let book;

  // Provide a default image if not provided
  const defaultImage = 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTuwIVgNXdfsXqFjytVZYcw1SN4SdtCDTmwZopiASdnffYt_K1J';

  // Function to check if an image URL is valid
  const isValidImageUrl = (url) => {
    // You can implement your own logic to check URL validity
    return url && url.startsWith('https');
  };
</script>

<div class="col-md-3">
  <div class="card mb-3" style="width: 18rem;">
    {#if isValidImageUrl(book.imageSrc)}
      <img src={book.imageSrc} class="card-img-top" alt="Book Cover" />
    {:else}
      <img src={defaultImage} class="card-img-top" alt="No Preview" />
    {/if}
    <div class="card-body">
      <h5 class="card-title">{book.title}</h5>
      <p class="card-text">Author: {book.author}</p>
      <div class="price-button-container">
        <p class="card-price">${book.lendingPrice}</p>
        <button class="btn btn-dark">Lend</button>
      </div>
    </div>
  </div>
</div>
<style>
  .card {
    padding: 10px; /* Small padding */
    margin: 20px;
  }

  .card-body {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .card-title {
    font-size: 15px;
  }

  .card-img-top {
    max-height: 250px; /* Adjust as needed */
    object-fit: fill; /* Ensure the whole image fits */
  }

  .card-text {
    margin-bottom: 0.5rem;
    font-size: 12px;
    color: #747474;
  }

  .price-button-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto; /* Push to the bottom of the card */
  }
</style>
