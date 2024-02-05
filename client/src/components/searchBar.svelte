<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { Link } from 'svelte-routing';
  
    let searchQuery = '';
  
    const searchResults = writable([]);
  
    const searchBooks = async () => {
      try {
        const response = await fetch(`http://localhost:3002/api/v1/books/?search=${searchQuery}`);
        const data = await response.json();
        searchResults.set(data.data);
      } catch (error) {
        console.error('Error searching books:', error);
      }
    };
  </script>
  
  <div>
    <input bind:value={searchQuery} placeholder="Search for books" />
    <button on:click={searchBooks}>Search</button>
  
    {#if $searchResults.length > 0}
      <ul>
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
    {:else}
      <p>No results found.</p>
    {/if}
  </div>
  