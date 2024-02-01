<script>
    import Cards from "./cards.svelte";
  </script>
  
  <main>
    <div class="container">
      <div class="row">
        <div class="col-md-6 month-pick">
          <h2>Our monthly picks:</h2>
          <p class="submonth-pick">Lend 3 or more and get a special discount</p>
          <button class="btn btn-outline">Learn more</button>
        </div>
        <div class="col-md-6">
          <div class="card">
            <div class="row g-0">
              <div class="col-md-6">
                <img class="card-img" src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTuwIVgNXdfsXqFjytVZYcw1SN4SdtCDTmwZopiASdnffYt_K1J" alt="Quintessence by Jess Redman">
              </div>
              <div class="col-md-6">
                <div class="card-body d-flex flex-column justify-content-between">
                  <h3 class="card-title">Quintessence</h3>
                  <div class="submonth-pick">
                    <p class="card-text">By Jess Redman</p>
                    <p class="card-text">Three months ago, twelve-year-old Alma moved to the town of Four Points. Her panic attacks started a week later—and they haven’t stopped—even though she told her parents that they did. And every day she feels less and less like herself.</p>
                  </div>
                  <div class="price-button-container">
                    <p class="card-price">$19</p>
                    <button class="btn btn-dark">Lend</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-5">
        <h3>Bestsellers</h3>
        <Cards />
      </div>
      <div class="row mt-5 mb-5">
        <h3>New Releases</h3>
        <Cards />
      </div>
    </div>
  </main>
  
  <style>
    main {
      margin-top: 20px;
      background-color: #F5F5F5;
      font-family: 'IBM Plex Sans', sans-serif;
      color: #373737;
    }
  
    .card {
      margin-top: 30px;
      padding: 20px;
    }
  
    .card-img {
      max-width: 100%;
      height: auto;
    }

    .month-pick{
        margin-top: 150px;
    }

    .submonth-pick {
        color: #747474;
    }

    .btn-outline {
        color: #343a40;
        border-color: #343a40;
    }

    .btn-outline:hover {
        color: #fff;
        background-color: #343a40;
    }

    .price-button-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
    }

  </style>
  