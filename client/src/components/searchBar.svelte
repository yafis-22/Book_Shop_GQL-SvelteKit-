<script>
  import { writable } from "svelte/store";
  import { Link, navigate } from "svelte-routing";
  import { searchResults } from "../stores/authStore";

  let searchQuery = "";
  export let searchFields = "title,author"; // Default search fields
  export let showSearchFields = false;
  const isResultsVisible = writable(false);

  const searchBooks = async () => {
    try {
      const encodedSearchFields = encodeURIComponent(searchFields);
      const response = await fetch(
        `http://localhost:3002/api/v1/books/?search=${searchQuery}&searchFields=${encodedSearchFields}`,
      );
      const data = await response.json();
      searchResults.set(data.data);

      // Navigate to the search results page
      navigate(`/q?search=${searchQuery}&searchFields=${encodedSearchFields}`);
    } catch (error) {
      console.error("Error searching books:", error);
    }
  };

  // const handleDocumentClick = (event) => {
  //   const isClickedInsideSearchResults = event.target.closest(".search-results");

  //   if (!isClickedInsideSearchResults) {
  //     isResultsVisible.set(false);
  //   }
  // };

  // onMount(() => {
  //   document.addEventListener("click", handleDocumentClick);

  //   // Cleanup the event listener when the component is destroyed
  //   return () => {
  //     document.removeEventListener("click", handleDocumentClick);
  //   };
  // });
</script>

{#if showSearchFields}
  <div class="search-fields">
    <label for="searchFields">Search by:</label>
    <select bind:value={searchFields} id="searchFields">
      <option value="author">Author</option>
      <option value="title">Title</option>
      <option value="category">Category</option>
    </select>
  </div>
{/if}

<div class="search-container">
  <input
    class="form-control"
    type="search"
    bind:value={searchQuery}
    placeholder="Search for books"
    aria-label="Search"
  />
  <i class="bi bi-search search-icon" on:click={searchBooks}></i>

  {#if $searchResults.length > 0 && $isResultsVisible}
    <ul class="search-results">
      {#each $searchResults as book (book.id)}
        <Link to={`/books/${book.id}`} class="text-decoration-none">
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
    margin-left: -16px;
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
    color: #5a5a5a;
    border: 1px solid #ddd;
    padding: 10px;
  }
</style>
