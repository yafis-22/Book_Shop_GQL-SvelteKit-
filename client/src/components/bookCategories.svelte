<script>
  import { onMount, afterUpdate } from 'svelte';
  import BookCard from './bookCard.svelte';
  import Header from './header.svelte';
  import Footer from './footer.svelte';
  import Pagination from './Pagination.svelte';
  import Sorting from './Sorting.svelte';

  export let category;

  let books = [];
  let currentPage = 1;
  let totalPages = 1;
  let sortField = '';
  let sortOrder = '';

  const fetchBooksByCategory = async () => {
    try {
      const response = await fetch(`http://localhost:3002/api/v1/books/category/${category}?page=${currentPage}&pageSize=12&sortField=${sortField}&sortOrder=${sortOrder}`);
      if (response.ok) {
        const data = await response.json();
        books = data.books;
        totalPages = data.totalPages || 1;
        console.log("books", books)
      } else {
        console.error(`Error fetching books in category ${category}:`, response.statusText);
      }
    } catch (error) {
      console.error(`Error fetching books in category ${category}:`, error);
    }
  };

  const handlePageChange = async (newPage) => {
    currentPage = newPage;
    await fetchBooksByCategory();
  };

  const handleSort = async () => {
    await fetchBooksByCategory();
  };

  onMount(() => {
    fetchBooksByCategory();
  });
  
  afterUpdate(() => {
    fetchBooksByCategory();
  });

</script>

<Header />
<h2 class="m-3">{category} Books</h2>

<Sorting bind:sortField={sortField} bind:sortOrder={sortOrder} handleSort={handleSort} />

{#if books.length > 0}
  <div class="row">
    {#each books as book (book.id)}
      <BookCard {book} />
    {/each}
  </div>
  <Pagination {currentPage} {totalPages} {handlePageChange} />
{:else}
  <p>No books available in the {category} category.</p>
{/if}

<Footer />
