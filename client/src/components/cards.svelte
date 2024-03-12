<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import LendBook from "./lendBook.svelte";
  import { navigate } from "svelte-routing";

  let books = writable([]);

  onMount(async () => {
    try {
      const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query {
              getBooks {
                message
                data {
                  id
                  title
                  lendingPrice
                  author
                  imageSrc
                }
              }
            }
          `,
        }),
      });
      const { data, errors } = await response.json();
      if (errors) {
        throw new Error(errors[0].message);
      }
      if (!data || !data.getBooks) {
        throw new Error("Data format is incorrect");
      }
      books.set(data.getBooks.data.slice(0, 6)); // Get only the first 6 books
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  });

  let showModal = false;
  let selectedBook = null;

  const lendBook = (id, title, author, lendingPrice, imageSrc) => {
    selectedBook = { id, title, author, lendingPrice, imageSrc };
    showModal = true;
  };

  const goToBookDetails = (id) => {
    // Use the navigate function to redirect to the book details page
    navigate(`/books/${id}`);
  };

  // Provide a default image if not provided
  const defaultImage =
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTuwIVgNXdfsXqFjytVZYcw1SN4SdtCDTmwZopiASdnffYt_K1J";

  // Function to check if an image URL is valid
  const isValidImageUrl = (url) => {
    // You can implement your own logic to check URL validity
    return url && url.startsWith("http");
  };
</script>

<div class="container">
  <div class="row row-cols-2 g-4">
    {#each $books as { id, title, author, lendingPrice, imageSrc }}
      <div class="col-md-2">
        <div class="card">
          {#if isValidImageUrl(imageSrc)}
          <img
          on:click={() => goToBookDetails(id)}
            src={imageSrc}
            class="card-img-top"
            alt="book"
          />
          {:else}
          <img src={defaultImage} class="card-img-top" alt="No Preview" />
      {/if}
          <div class="card-body">
            <h5 class="card-title">{title}</h5>
            <p class="card-text">By {author}</p>
            <div class="price-button-container">
              <p class="card-price">${lendingPrice}</p>
              <button
                class="btn btn-dark"
                on:click={() => lendBook(id, title, author, lendingPrice)}
                >Lend</button
              >
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
  {#if showModal}
    <div class="modal-backdrop show"></div>
    <LendBook
      book={selectedBook}
      bind:showModal
      onCloseModal={() => {
        showModal = false;
      }}
    />
  {/if}
</div>

<style>
  .card {
    height: 95%;
    width: 180px;
    padding: 10px;
  }

  .card-body {
    display: flex;
    flex-direction: column;
  }

  .card-title {
    font-size: 15px;
  }

  .card-img-top {
    height: 210px;
    object-fit: contain; /* Ensure the whole image fits */
    cursor: pointer;
  }

  .card-text {
    margin-bottom: 0.5rem;
    font-size: 12px;
    color: #747474;
  }

  .price-button-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto; /* Push to the bottom of the card */
  }
</style>
