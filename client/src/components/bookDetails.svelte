<script>
    // Export the book data to be used in the component
    export let book;
  
    // Provide a default image if not provided
    const defaultImage = 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTuwIVgNXdfsXqFjytVZYcw1SN4SdtCDTmwZopiASdnffYt_K1J';
  
    // Function to check if an image URL is valid
    const isValidImageUrl = (url) => {
      // You can implement your own logic to check URL validity
      return url && url.startsWith('https');
    };
  </script>
  
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-4">
        {#if isValidImageUrl(book.imageSrc)}
          <img src={book.imageSrc} class="img-fluid rounded" alt="Book Cover" />
        {:else}
          <img src={defaultImage} class="img-fluid rounded" alt="No Preview" />
        {/if}
      </div>
      <div class="col-md-8">
        <h2>{book.title}</h2>
        <p>Author: {book.author}</p>
        <p>Lending Price: ${book.lendingPrice}</p>
        <p>Category: <span class="badge bg-primary">{book.category}</span></p>
        <p>Description: {book.description}</p>
        <a href="/books">Back to Books</a>
      </div>
    </div>
  </div>
  
  <style>
    .img-fluid {
      max-width: 100%;
      height: auto;
    }
  
    .badge {
      font-size: 14px;
      margin-top: 5px;
    }
  </style>
  