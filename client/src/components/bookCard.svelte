<script>
  import { Link } from "svelte-routing";
  import LendBook from "./lendBook.svelte";

  export let book;
  let showModal = false;

  const openModal = () => {
    showModal = true;
  };

  // Provide a default image if not provided
  const defaultImage =
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTuwIVgNXdfsXqFjytVZYcw1SN4SdtCDTmwZopiASdnffYt_K1J";

  // Function to check if an image URL is valid
  const isValidImageUrl = (url) => {
    // You can implement your own logic to check URL validity
    return url && url.startsWith("http");
  };
</script>

<div class="col-md-3">
  <div class="card mb-3" style="width: 18rem; height: 400px;">
    <!-- Set a fixed height -->
    <Link to={`/books/${book.id}`} class="text-decoration-none">
      {#if isValidImageUrl(book.imageSrc)}
        <div class="image-container" style="height: 250px;">
          <!-- Set a fixed height for the image container -->
          <img src={book.imageSrc} class="card-img-top" alt="Book Cover" />
        </div>
      {:else}
        <div class="image-container" style="height: 250px;">
          <!-- Set a fixed height for the image container -->
          <img src={defaultImage} class="card-img-top" alt="No Preview" />
        </div>
      {/if}
    </Link>
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">{book.title}</h5>
      <p class="card-text">Author: {book.author}</p>
      <div class="price-button-container mt-auto">
        <!-- Use mt-auto to push to the bottom of the card -->
        <p class="card-price">${book.lendingPrice}</p>
        <button class="btn btn-dark" on:click={openModal}>Lend</button>
      </div>
    </div>
  </div>
  <LendBook
    {book}
    bind:showModal
    onCloseModal={() => {
      showModal = false;
    }}
  />
</div>
{#if showModal}
    <!-- Bootstrap modal backdrop class for light background overlay -->
    <div class="modal-backdrop show"></div>
  {/if}

<style>
  .card {
    padding: 10px; /* Small padding */
    margin: 20px;
    display: flex;
    flex-direction: column;
  }

  .image-container {
    overflow: hidden; /* Hide any overflow if the image is larger */
    height: 100%; /* Take up the full height of the container */
  }

  .card-img-top {
    object-fit: fill; /* Ensure the whole image covers the container */
    width: 100%; /* Ensure the image takes the full width of the container */
    height: 100%; /* Ensure the image takes the full height of the container */
  }

  .card-body {
    flex-grow: 1;
  }

  .card-title {
    font-size: 15px;
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
  }
</style>
