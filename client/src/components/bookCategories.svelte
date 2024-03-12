<script>
  import { onMount, afterUpdate } from 'svelte';
  import BookCard from './bookCard.svelte';
  import Header from './header.svelte';
  import Footer from './footer.svelte';
  import Pagination from './pagination.svelte';
  import Sorting from './sorting.svelte';

  export let category;

  let books = [];
  let currentPage = 1;
  let totalPages = 1;
  let sortField = '';
  let sortOrder = '';

  const fetchBooksByCategory = async () => {
    try {
      const response = await fetch(`http://localhost:4000/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query GetBooksByCategory($category: String, $page: Int, $pageSize: Int, $sortField: String, $sortOrder: String) {
              getBooksByCategory(category: $category, page: $page, pageSize: $pageSize, sortField: $sortField, sortOrder: $sortOrder) {
                message
                data {
                  id
                  title
                  author
                  lendingPrice
                  imageSrc
                }
                totalPages
              }
            }
          `,
          variables: {
            category: category,
            page: currentPage,
            pageSize: 12,
            sortField: sortField,
            sortOrder: sortOrder,
          },
        }),
      });
      
      if (response.ok) {
        const { data, errors } = await response.json();
        if (!errors && data && data.getBooksByCategory) {
          books = data.getBooksByCategory.data|| [];
          totalPages = data.getBooksByCategory.totalPages || 1;
          console.log("books", books)
        } else {
          console.error(`Error fetching books in category ${category}:`, errors || 'Invalid response format');
        }
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

  // $: if (category) {
  //   books = [];
  //   currentPage = 1;
  //   totalPages = 1;
  //   sortField = '';
  //   sortOrder = '';
  //   fetchBooksByCategory();
  // }

  onMount(() => {
    fetchBooksByCategory();
  });

  // afterUpdate(() => {
  //   fetchBooksByCategory();
  // });

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
