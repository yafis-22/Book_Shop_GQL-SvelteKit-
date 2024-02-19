<script>
    export let sortField;
    export let sortOrder;
    export let handleSort;
  </script>
  
  <div class="d-flex justify-content-end sort-options">
    <label for="sortField">Sort by:</label>
    <select bind:value={sortField} on:change={handleSort} id="sortField">
      <option value="title">Title</option>
      <option value="author">Author</option>
      <option value="lendingPrice">Lending Price</option>
    </select>
  
    <label for="sortOrder">Order:</label>
    <select bind:value={sortOrder} on:change={handleSort} id="sortOrder">
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
    </select>
  </div>
  
  <style>
   .sort-options {
    margin-right: 20px;
  }
  </style>
  