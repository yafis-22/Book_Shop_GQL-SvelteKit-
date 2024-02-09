<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import BookCard from './bookCard.svelte';
  import Header from './header.svelte';
  import Footer from './footer.svelte';

  // Define the pagination parameters
  let currentPage = 1;
  let totalPages = 1;

  // Define the number of items per page
  const itemsPerPage = 12;

  // Define sorting parameters
  let sortField = "";
  let sortOrder = "";

  // Initialize the writable store for books
  const books = writable([]);

  const fetchBooks = async () => {
    try {
      const response = await fetch(
        `http://localhost:3002/api/v1/books?page=${currentPage}&pageSize=${itemsPerPage}&sortField=${sortField}&sortOrder=${sortOrder}`
      );
      const data = await response.json();
      console.log('Fetched books:', data.data);
      totalPages = data.totalPages || 1;
      books.set(data.data || []);  // Set the value of the books store
    } catch (error) {
      console.error('Error fetching books:', error);
      books.set([]);  // Set an empty array in case of an error
    }
  };

  // Fetch books on component mount
  onMount(async () => {
    await fetchBooks();
  });

  // Function to handle page change
  const handlePageChange = async (newPage) => {
    currentPage = newPage;
    await fetchBooks();
  };

  // Function to handle sorting
  const handleSort = async () => {
    await fetchBooks();
  };
</script>

<Header />

<h2 class="m-3">All Books</h2>

<div class="d-flex justify-content-end sort-options">
  <label for="sortField">Sort by:</label>
  <select bind:value={sortField} on:change={handleSort} id="sortField">
    <option value="title">Title</option>
    <option value="author">Author</option>
    <option value="lendingPrice">Lending Price</option>
  </select>

  <label for="sortOrder">Order:</label>
  <select bind:value={sortOrder} on:change={handleSort} id="sortOrder">
    <option value="asc">Ascending</option>
    <option value="desc">Descending</option>
  </select>
</div>

<div class="d-flex flex-wrap">
  {#each $books as book (book.id)}
    <BookCard {book} />
  {/each}
</div>

<div class="pagination">
  {#if currentPage > 1}
    <button on:click={() => handlePageChange(currentPage - 1)}>&lt; Prev</button>
  {/if}

  {#if totalPages <= 7}
    {#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
      <button on:click={() => handlePageChange(page)} class:selected={page === currentPage}>{page}</button>
    {/each}
  {:else}
    {#if currentPage <= 4}
      {#each Array.from({ length: 5 }, (_, i) => i + 1) as page}
        <button on:click={() => handlePageChange(page)} class:selected={page === currentPage}>{page}</button>
      {/each}
      <span>...</span>
      <button on:click={() => handlePageChange(totalPages)}>{totalPages}</button>
    {:else if currentPage > totalPages - 4}
      <button on:click={() => handlePageChange(1)}>1</button>
      <span>...</span>
      {#each Array.from({ length: 5 }, (_, i) => totalPages - 4 + i) as page}
        <button on:click={() => handlePageChange(page)} class:selected={page === currentPage}>{page}</button>
      {/each}
    {:else}
      <button on:click={() => handlePageChange(1)}>1</button>
      <span>...</span>
      {#each Array.from({ length: 3 }, (_, i) => currentPage - 1 + i) as page}
        <button on:click={() => handlePageChange(page)} class:selected={page === currentPage}>{page}</button>
      {/each}
      <span>...</span>
      <button on:click={() => handlePageChange(totalPages)}>{totalPages}</button>
    {/if}
  {/if}

  {#if currentPage < totalPages}
    <button on:click={() => handlePageChange(currentPage + 1)}>Next &gt;</button>
  {/if}
</div>

<Footer />

<style>
  /* Custom CSS for styling */
  .sort-options {
    
    margin-right: 20px;
  }

  .pagination {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .pagination button {
    margin-right: 0.5rem;
    cursor: pointer;
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    transition: background-color 0.3s;
  }

  .pagination button:hover {
    background-color: #0056b3;
  }

  .pagination button.selected {
    font-weight: bold;
    text-decoration: underline;
    background-color: #0056b3;
  }

</style>
