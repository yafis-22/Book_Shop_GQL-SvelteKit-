<script>
    import { onMount } from 'svelte';
    import BookCard from './bookCard.svelte';
    import Header from './header.svelte';
    import Footer from './footer.svelte';
  
    export let category;
  
    let books = [];
  
    const fetchBooksByCategory = async () => {
      try {
        const response = await fetch(`http://localhost:3002/api/v1/books/category/${category}`);
        if (response.ok) {
          const data = await response.json();
          books = data.books;
        } else {
          console.error(`Error fetching books in category ${category}:`, response.statusText);
        }
      } catch (error) {
        console.error(`Error fetching books in category ${category}:`, error);
      }
    };
  
    onMount(() => {
      fetchBooksByCategory();
    });

  </script>
  <Header />
  <h2 class="m-3">{category} Books</h2>
  
  {#if books.length > 0}
    <div class="row">
      {#each books as book (book.id)}
        <BookCard {book} />
      {/each}
    </div>
  {:else}
    <p>No books available in the {category} category.</p>
  {/if}
  <Footer />
  