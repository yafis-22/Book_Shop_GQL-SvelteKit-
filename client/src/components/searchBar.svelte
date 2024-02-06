<script>
  import { writable } from "svelte/store";
  import { Link } from "svelte-routing";

  let searchQuery = "";

  const searchResults = writable([]);

  const searchBooks = async () => {
    try {
      const response = await fetch(
        `http://localhost:3002/api/v1/books/?search=${searchQuery}`,
      );
      const data = await response.json();
      searchResults.set(data.data);
    } catch (error) {
      console.error("Error searching books:", error);
    }
  };
</script>

<div class="search-container">
  <input
    class="form-control"
    type="search"
    bind:value={searchQuery}
    placeholder="Search for books"
    aria-label="Search"
  />
  <i class="bi bi-search search-icon" on:click={searchBooks}></i>

  {#if $searchResults.length > 0}
    <ul class="search-results">
      {#each $searchResults as book (book.id)}
        <Link to={`/books/${book.id}`}>
          <div class="card-body">
            <h5 class="card-title">{book.title}</h5>
            <p class="card-text">Author: {book.author}</p>
            <div class="price-button-container">
              <p class="card-price">${book.lendingPrice}</p>
            </div>
          </div>
        </Link>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .search-container {
    display: flex;
    align-items: center;
    position: relative; /* Ensure relative positioning for absolute elements */
  }

  .search-icon {
    cursor: pointer;
    margin-left: -20px;
  }

  .search-results {
    list-style-type: none;
    padding: 0;
    position: absolute;
    top: 100%; /* Position the results below the search bar */
    left: 0;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 1; /* Ensure the results overlay other content */
  }

  .card-body {
    border: 1px solid #ddd;
    padding: 10px;
  }

  .no-results-message {
    margin: 10px 0;
    color: #777;
  }
</style>
