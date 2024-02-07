<script>
  import { onMount, afterUpdate } from "svelte";
  import { readable } from "svelte/store";
  import authStore from "../stores/authStore";
  import Header from './header.svelte';
  import Footer from './footer.svelte';

  export let bookId;

  const fetchBookDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3002/api/v1/books/${bookId}`);
      const data = await response.json();
      return data || null;
    } catch (error) {
      console.error("Error fetching book details:", error);
      return null;
    }
  };

  export const bookDetails = readable(null, (set) => {
    const loadBookDetails = async () => {
      const details = await fetchBookDetails();
      set(details);
    };

    onMount(loadBookDetails);
    afterUpdate(loadBookDetails); // Ensure bookDetails updates when bookId changes
  });

  const lendBook = async () => {
  try {
    const response = await fetch(
      `http://localhost:3002/api/v1/books/lend/${bookId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${$authStore.userToken}`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Book lent successfully:", data);

      // Show alert with book information
      alert(`Book Lended:
            Title: ${$bookDetails.title}
            Author: ${$bookDetails.author}
            Initial Charges: $${data.chargeDetails.initialCharge}`);
    } else {
      const errorData = await response.json();

      // Check for the specific error message indicating that the book is already lent
      if (errorData.message === 'User has already lent a book with the same ID') {
        alert('Book already lent');
      } else {
        console.error("Error lending book:", errorData.message);
        alert("Please sign in to lend the book");
      }
    }
  } catch (error) {
    console.error("Error lending book:", error);
  }
};

  const defaultImage =
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTuwIVgNXdfsXqFjytVZYcw1SN4SdtCDTmwZopiASdnffYt_K1J";

  // Function to check if an image URL is valid
  const isValidImageUrl = (url) => {
    return url && url.startsWith("https");
  };
</script>

<Header />

{#if $bookDetails}
  <div class="card book-card">
    {#if isValidImageUrl($bookDetails.imageSrc)}
      <img src={$bookDetails.imageSrc} class="card-img-top" alt="Book Cover" />
    {:else}
      <img src={defaultImage} class="card-img-top" alt="No Preview" />
    {/if}

    <div class="card-body book-info">
      <h4>{$bookDetails.title}</h4>
      <p>
        By: {$bookDetails.author}
      </p>
      <span class="category-tag">{$bookDetails.category}</span><br>
      <p class="mt-3">
        Description: {$bookDetails.description}
      </p>
      <p>Quantity: {$bookDetails.quantity}</p>
      <p><strong>After 9 Days you will be charged $5/day</strong></p>
      <div class="price-button-container">
        <h5>${$bookDetails.lendingPrice}</h5>
        <button type="button" class="btn btn-dark" on:click={lendBook}>Lend</button>
      </div>
    </div>
  </div>
{:else}
  <p>Loading...</p>
{/if}

<Footer />

<style>

.price-button-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto; /* Push to the bottom of the card */
  }
  .book-card {
    max-width: 400px;
    border: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin: auto;
    border-radius: 10px;
    padding: 10px; /* Small padding */
  }

  .book-card img {
    margin-left: 80px;
    max-width: 200px;
    max-height: 250px;
    object-fit: fill;
  }

  .book-info {
    padding: 20px;
    background-color: white;
  }

  .category-tag {
    background-color: #b3b3b3;
    color: #373737;
    padding: 4px 8px;
    border-radius: 4px;
  }

 

  p {
    color: #666;
    font-size: 0.9em;
  }

  button {
    cursor: pointer;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
  }
</style>
