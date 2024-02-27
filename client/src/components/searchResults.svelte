<script>
  import { onMount } from "svelte";
  import { Link } from "svelte-routing";
  import Header from "./header.svelte";
  import Footer from "./footer.svelte";
  import { searchResults } from "../stores/authStore";
  import LendBook from "./lendBook.svelte";
  import SearchBar from "./searchBar.svelte";
  let results = [];

  onMount(() => {
    // Subscribe to changes in the searchResults store
    const unsubscribe = searchResults.subscribe((value) => {
      results = value;
    });

    // Cleanup the subscription when the component is destroyed
    return unsubscribe;
  });

  let showModal = false;

  const openModal = () => {
    showModal = true;
  };
  const defaultImage =
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTuwIVgNXdfsXqFjytVZYcw1SN4SdtCDTmwZopiASdnffYt_K1J";

  // Function to check if an image URL is valid
  const isValidImageUrl = (url) => {
    // You can implement your own logic to check URL validity
    return url && url.startsWith("http");
  };
</script>

<Header />
<div class="mt-5 col-md-6 offset-md-3 search-container">
  <SearchBar showSearchFields={true} />
</div>
{#if results.length === 0}
  <h3 class="mt-5 mb-5 p-5 text-center">No books found.</h3>
{:else}
<div class="row">
  {#each results as book (book.id)}
    <div class="col-md-4">
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
  {/each}
</div>
{/if}
{#if showModal}
  <!-- Bootstrap modal backdrop class for light background overlay -->
  <div class="modal-backdrop show"></div>
{/if}

<Footer />

<style>
  .search-container {
    align-items: center;
    text-align: center;
  }

  .card {
    padding: 10px; 
    margin: 20px;
    display: flex;
    flex-direction: column;
  }

  .image-container {
    overflow: hidden; 
    height: 100%; 
  }

  .card-img-top {
    object-fit: fill; 
    width: 100%; 
    height: 100%;
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
