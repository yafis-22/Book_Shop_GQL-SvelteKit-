<script>
    export let currentPage;
    export let totalPages;
    export let handlePageChange;
  </script>
  
  <div class="pagination">
    {#if currentPage > 1}
      <button on:click={() => handlePageChange(currentPage - 1)}>&lt; Prev</button>
    {/if}
  
    {#if totalPages <= 7}
      {#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
        <button on:click={() => handlePageChange(page)} class:selected={page === currentPage}>{page}</button>
      {/each}
    {:else}
      {#if currentPage <= 4}
        {#each Array.from({ length: 5 }, (_, i) => i + 1) as page}
          <button on:click={() => handlePageChange(page)} class:selected={page === currentPage}>{page}</button>
        {/each}
        <span>...</span>
        <button on:click={() => handlePageChange(totalPages)}>{totalPages}</button>
      {:else if currentPage > totalPages - 4}
        <button on:click={() => handlePageChange(1)}>1</button>
        <span>...</span>
        {#each Array.from({ length: 5 }, (_, i) => totalPages - 4 + i) as page}
          <button on:click={() => handlePageChange(page)} class:selected={page === currentPage}>{page}</button>
        {/each}
      {:else}
        <button on:click={() => handlePageChange(1)}>1</button>
        <span>...</span>
        {#each Array.from({ length: 3 }, (_, i) => currentPage - 1 + i) as page}
          <button on:click={() => handlePageChange(page)} class:selected={page === currentPage}>{page}</button>
        {/each}
        <span>...</span>
        <button on:click={() => handlePageChange(totalPages)}>{totalPages}</button>
      {/if}
    {/if}
  
    {#if currentPage < totalPages}
      <button on:click={() => handlePageChange(currentPage + 1)}>Next &gt;</button>
    {/if}
  </div>
  
  <style>
   .pagination {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .pagination button {
    margin-right: 0.5rem;
    cursor: pointer;
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    transition: background-color 0.3s;
  }

  .pagination button:hover {
    background-color: #0056b3;
  }

  .pagination button.selected {
    font-weight: bold;
    text-decoration: underline;
    background-color: #0056b3;
  }
  </style>
  