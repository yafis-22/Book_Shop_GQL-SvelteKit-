<script>
  import { onMount, afterUpdate } from "svelte";
  import { readable } from "svelte/store";
  import Header from "./header.svelte";
  import Footer from "./footer.svelte";
  import LendBook from "./lendBook.svelte";

  // Define the book variable
  $: book = $bookDetails;
  let showModal = false;

  const openModal = () => {
    showModal = true;
  };

  export let bookId;

  const fetchBookDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/graphql`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query GetBookDetails($bookId: ID!) {
                getBookById(id: $bookId) {
                  id
                  title
                  author
                  category
                  quantity
                  lendingPrice
                  imageSrc
                }
              }
            `,
            variables: {
              bookId: bookId,
            },
          }),
        },
      );
      const { data, errors } = await response.json();

      if (response.ok && data && !errors) {
        return data.getBookById || null;
      } else {
        console.error('Error fetching book details:', errors || 'Unknown error');
        return null;
      }
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

  const defaultImage =
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTuwIVgNXdfsXqFjytVZYcw1SN4SdtCDTmwZopiASdnffYt_K1J";

  // Function to check if an image URL is valid
  const isValidImageUrl = (url) => {
    return url && url.startsWith("http");
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
      <span class="category-tag">{$bookDetails.category}</span><br />
      <p class="mt-3">
        Description: {$bookDetails.description}
      </p>
      <p>Quantity: {$bookDetails.quantity}</p>
      <p><strong>After 9 Days you will be charged $5/day</strong></p>
      <div class="price-button-container">
        <h5>${$bookDetails.lendingPrice}</h5>
        <LendBook
          {book}
          bind:showModal
          onCloseModal={() => {
            showModal = false;
          }}
        />
        <button type="button" class="btn btn-dark" on:click={openModal}
          >Lend</button
        >
      </div>
    </div>
  </div>
  {#if showModal}
    <!-- Bootstrap modal backdrop class for light background overlay -->
    <div class="modal-backdrop show"></div>
  {/if}
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
