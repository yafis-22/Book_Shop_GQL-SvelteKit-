<!-- App.svelte -->

<script>
    // Export the book data to be used in the component
    export let books = [
      { title: "The Art of Racing in the Rain", author: "Garth Stein", price: 17.00 },
      { title: "Wings of Shadow", author: "Nicki Pau Preto", price: 15.00 },
      { title: "The New Adolescence", author: "Christine Carter, Ph.D", price: 12.60 },
      { title: "The Precipice", author: "Toby Ord", price: 19.00 },
      { title: "The Clay Lion (The Clay Lion Series, Vol 1)", author: "Amelie Jahn", price: 17.00 },
      { title: "The Clay Lion (The Clay Lion Series, Vol 1)", author: "Amelie Jahn", price: 17.00 },
    ];
  </script>
  
  <div class="container">
    <div class="row row-cols-2 g-4">
      {#each books as { title, author, price }}
        <div class="col-md-2">
          <div class="card">
            <img src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTuwIVgNXdfsXqFjytVZYcw1SN4SdtCDTmwZopiASdnffYt_K1J" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">{title}</h5>
              <p class="card-text">By {author}</p>
              <div class="price-button-container">
                <p class="card-price">${price}</p>
                <button class="btn btn-dark">Lend</button>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <style>
    .card {
      height: 100%;
      padding: 10px; /* Small padding */
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
      max-height: 100%; /* Adjust as needed */
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
  