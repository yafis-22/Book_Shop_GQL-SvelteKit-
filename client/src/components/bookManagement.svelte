<script>
    import { onMount } from 'svelte';
    import { readable } from 'svelte/store';
    import BookCard from './bookCard.svelte';
  
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/v1/books');
        const data = await response.json();
        console.log('Fetched books:', data.data);
        return data.data || [];
      } catch (error) {
        console.error('Error fetching books:', error);
        return [];
      }
    };
  
    export const books = readable([], (set) => {
      onMount(async () => {
        const booksData = await fetchBooks();
        set(booksData);
      });
    });

</script>
  
<h2 class="mt-2">All Books</h2>
  
<div class="d-flex flex-wrap">
  {#each $books as book (book.id)}
    <BookCard {book} />
  {/each}
</div>
