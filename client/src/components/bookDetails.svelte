<script>
  import { onMount } from 'svelte';
  //import { useParams } from 'svelte-routing';
  
  export let book = {};

  // Fetch book details based on the ID from the route params
  const fetchBookDetails = async (bookId) => {
    try {
      const response = await fetch(`http://localhost:3002/api/v1/books/${bookId}`);
      const data = await response.json();
      console.log('Fetched book details:', data);
      return data.data || {};
    } catch (error) {
      console.error('Error fetching book details:', error);
      return {};
    }
  };

  const { id } = useParams();

  onMount(async () => {
    // Fetch book details when the component is mounted
    const bookDetails = await fetchBookDetails(id);
    book = bookDetails;
  });
</script>

<div>
  <h2>{book.title}</h2>
  <p>Author: {book.author}</p>
  <p>Description: {book.description}</p>
  <p>Lending Price: ${book.lendingPrice}</p>
  <!-- Add more details as needed -->

  <!-- You can also include the lend button here if needed -->
  <button class="btn btn-dark">Lend</button>
</div>

<style>
  /* Add your styling here */
</style>
