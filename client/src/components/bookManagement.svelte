<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import BookCard from './bookCard.svelte';
  import Header from './header.svelte';
  import Footer from './footer.svelte';
  import Sorting from './sorting.svelte';
  import Pagination from './pagination.svelte';

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
    const storedPage = sessionStorage.getItem('currentPage');
  currentPage = storedPage ? parseInt(storedPage, 10) : 1;
    await fetchBooks();
  });

  // Function to handle page change
  const handlePageChange = async (newPage) => {
    currentPage = newPage;
    sessionStorage.setItem('currentPage', currentPage.toString());
    await fetchBooks();
  };

  // Function to handle sorting
  const handleSort = async () => {
    await fetchBooks();
  };
</script>


<Header />

<h2 class="m-3">All Books</h2>

<Sorting bind:sortField={sortField} bind:sortOrder={sortOrder} handleSort={handleSort} />

<div class="d-flex flex-wrap">
  {#each $books as book (book.id)}
    <BookCard {book} />
  {/each}
</div>

<Pagination {currentPage} {totalPages} {handlePageChange} />

<Footer />

