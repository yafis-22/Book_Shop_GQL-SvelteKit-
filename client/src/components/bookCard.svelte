<script>
  import authStore from "../stores/authStore";
  import { Link } from 'svelte-routing';

  export let book;

  // Provide a default image if not provided
  const defaultImage =
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTuwIVgNXdfsXqFjytVZYcw1SN4SdtCDTmwZopiASdnffYt_K1J";

  // Function to check if an image URL is valid
  const isValidImageUrl = (url) => {
    // You can implement your own logic to check URL validity
    return url && url.startsWith("https");
  };

  const lendBook = async () => {
  try {
    const response = await fetch(
      `http://localhost:3002/api/v1/books/lend/${book.id}`,
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
            Title: ${book.title}
            Author: ${book.author}
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

</script>

<div class="col-md-3">
  <Link to={`/books/${book.id}`} class="text-decoration-none">
  <div class="card mb-3" style="width: 18rem;" >
    {#if isValidImageUrl(book.imageSrc)}
      <img src={book.imageSrc} class="card-img-top" alt="Book Cover" />
    {:else}
      <img src={defaultImage} class="card-img-top" alt="No Preview" />
    {/if}
    <div class="card-body">
      <h5 class="card-title">{book.title}</h5>
      <p class="card-text">Author: {book.author}</p>
      <div class="price-button-container">
        <p class="card-price">${book.lendingPrice}</p>
        <button class="btn btn-dark" on:click={lendBook}>Lend</button>
      </div>
    </div>
  </div>
   </Link>
</div>


<style>
  .card {
    padding: 10px; /* Small padding */
    margin: 20px;
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
    max-height: 250px; /* Adjust as needed */
    object-fit: fill; /* Ensure the whole image fits */
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
