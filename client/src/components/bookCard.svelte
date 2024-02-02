<script>
  export let book;

  // Provide a default image if not provided
  const defaultImage = 'path-to-default-image.jpg';

  // Function to check if an image URL is valid
  const isValidImageUrl = (url) => {
    // You can implement your own logic to check URL validity
    return url && url.startsWith('http');
  };
</script>

<div class="card m-3" style="width: 18rem;">
  {#if isValidImageUrl(book.imageSrc)}
    <img src={book.imageSrc} class="card-img-top" alt="Book Cover" />
  {:else}
    <img src={defaultImage} class="card-img-top" alt="No Preview" />
  {/if}
  <div class="card-body">
    <h5 class="card-title">{book.title}</h5>
    <p class="card-text">{book.description}</p>
    <p class="card-text">Author: {book.author}</p>
    <p class="card-text">Category: {book.category}</p>
    <p class="card-text">Quantity: {book.quantity}</p>
    <p class="card-text">Lending Price: ${book.lendingPrice}</p>
  </div>
</div>
