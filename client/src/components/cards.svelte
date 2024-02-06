<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import authStore from "../stores/authStore";

  let books = writable([]);

  onMount(async () => {
    // Fetch books from the backend
    const response = await fetch("http://localhost:3002/api/v1/books");
    const data = await response.json();
    books.set(data.data.slice(0, 6)); // Get only the first 6 books
  });

  const lendBook = async (bookId, title, author, lendingPrice) => {
    try {
      const response = await fetch(
        `http://localhost:3002/api/v1/books/lend/${bookId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${$authStore.userToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Book lent successfully:", data);

        alert(`Book Lended:
            Title: ${title}
            Author: ${author}
            Initial Charges: $${data.chargeDetails.initialCharge}`);
      } else {
        const errorData = await response.json();
        console.error("Error lending book:", errorData.message);

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
</script>

<div class="container">
  <div class="row row-cols-2 g-4">
    {#each $books as { id, title, author, lendingPrice }}
      <div class="col-md-2">
        <div class="card">
          <img src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTuwIVgNXdfsXqFjytVZYcw1SN4SdtCDTmwZopiASdnffYt_K1J" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">{title}</h5>
            <p class="card-text">By {author}</p>
            <div class="price-button-container">
              <p class="card-price">${lendingPrice}</p>
              <button class="btn btn-dark" on:click={() => lendBook(id, title, author, lendingPrice)}>Lend</button>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
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
      height: 100%;
    }

    .card-title {
        font-size: 15px;
    }
  
    .card-img-top {
      height: 210px; 
      object-fit: contain; /* Ensure the whole image fits */
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
  