<script>
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { navigate } from "svelte-routing";
  import authStore from "../stores/authStore";
  import BookUpdate from "./bookUpdate.svelte";

  let books = [];
  let searchQuery = "";
  let currentPage = 1;
  let totalPages = 1;
  let sortField = "";
  let sortOrder = "";
  let sortOptions = [
    { field: "id", label: "Id" },
    { field: "title", label: "Title" },
    { field: "description", label: "Description" },
    { field: "quantity", label: "Quantity" },
    { field: "author", label: "Author" },
    { field: "category", label: "Category" },
    { field: "lendingPrice", label: "Lending Price" },
    { field: "createdAt", label: "Created At" },
    { field: "updatedAt", label: "Updated At" },
    { field: "deletedAt", label: "Deleted At" },
  ];

  let successMessage = "";
  let updateFormVisible = false;
  let updatedBook = {};

  const fetchBooks = async () => {
    try {
      const response = await fetch(
        `http://localhost:3002/api/v1/books?page=${currentPage}&pageSize=12&search=${searchQuery}&sortField=${sortField}&sortOrder=${sortOrder}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${get(authStore).userToken}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        books = data.data;
        totalPages = data.totalPages;
      } else {
        console.error("Error fetching books:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  onMount(fetchBooks);

  const handleSearch = () => {
    currentPage = 1; // Reset to the first page when performing a new search
    fetchBooks();
  };

  const handleSort = () => {
    fetchBooks();
  };

  const handlePageChange = (newPage) => {
    currentPage = newPage;
    fetchBooks();
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3002/api/v1/books/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${get(authStore).userToken}`,
        },
      });

      if (response.ok) {
        fetchBooks(); // Refresh the book list after successful deletion
        successMessage = "Book deleted successfully";
        setTimeout(() => {
          successMessage = "";
        }, 3000);
      } else {
        console.error(
          `Error deleting book with ID ${id}:`,
          response.statusText,
        );
      }
    } catch (error) {
      console.error(`Error deleting book with ID ${id}:`, error);
    }
  };

  const handleUpdate = (book) => {
    updateFormVisible = true;
    updatedBook = { ...book };
  };

  const handleUpdateSuccess = () => {
    fetchBooks(); // Refresh the book list after successful update
    successMessage = "Book updated successfully";
    updateFormVisible = false;
    setTimeout(() => {
      successMessage = "";
    }, 3000);
  };

  const handleUpdateCancel = () => {
    updateFormVisible = false;
  };

  const handleRestore = async (bookId) => {
    try {
      const response = await fetch(
        `http://localhost:3002/api/v1/books/${bookId}/restore`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${get(authStore).userToken}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();

        fetchBooks();
        successMessage = "Book restored successfully";
        setTimeout(() => {
          successMessage = "";
        }, 3000);
      } else {
        console.error("Error restoring book:", response.statusText);
      }
    } catch (error) {
      console.error("Error restoring book:", error);
    }
  };
</script>

<div>
  <h1>All Books</h1>

  {#if successMessage}
    <div class="notification">
      <p class="success-message">{successMessage}</p>
    </div>
  {/if}

  {#if updateFormVisible}
    <BookUpdate
      bind:book={updatedBook}
      onSuccess={handleUpdateSuccess}
      onCancel={handleUpdateCancel}
    />
  {:else}
    <!-- Book List -->
    <div class="mb-3">
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search by title, author, category..."
      />
      <button on:click={handleSearch}>Search</button>
    </div>

    <div class="mb-3">
      <label for="sortField">Sort by:</label>
      <select bind:value={sortField} on:change={handleSort} id="sortField">
        {#each sortOptions as option (option.field)}
          <option value={option.field}>{option.label}</option>
        {/each}
      </select>

      <label for="sortOrder">Order:</label>
      <select bind:value={sortOrder} on:change={handleSort} id="sortOrder">
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>

    {#if books.length > 0}
      <table class="table">
        <thead>
          <tr>
            <th on:click={() => handleSort("id")}>Id</th>
            <th on:click={() => handleSort("title")}>Title</th>
            <th on:click={() => handleSort("description")}>Description</th>
            <th on:click={() => handleSort("quantity")}>Quantity</th>
            <th on:click={() => handleSort("author")}>Author</th>
            <th on:click={() => handleSort("category")}>Category</th>
            <th on:click={() => handleSort("lendingPrice")}>Lending Price</th>
            <th on:click={() => handleSort("createdAt")}>Created At</th>
            <th on:click={() => handleSort("updatedAt")}>Updated At</th>
            <th on:click={() => handleSort("deletedAt")}>Deleted At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {#each books as book (book.id)}
            <tr>
              <td>{book.id}</td>
              <td>{book.title}</td>
              <td>{book.description}</td>
              <td>{book.quantity}</td>
              <td>{book.author}</td>
              <td>{book.category}</td>
              <td>{book.lendingPrice}</td>
              <td>{book.createdAt}</td>
              <td>{book.updatedAt}</td>
              <td>{book.deletedAt}</td>
              <td>
                <button
                  type="button"
                  class="btn btn-success"
                  on:click={() => handleUpdate(book)}>Update</button
                >
                <button
                  type="button"
                  class="btn btn-danger"
                  on:click={() => handleDelete(book.id)}>Delete</button
                >
                {#if book.deletedAt != null}
                  <button
                    type="button"
                    class="btn btn-secondary"
                    on:click={() => handleRestore(book.id)}>Restore</button
                  >
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>

      <div class="pagination">
        {#if currentPage > 1}
          <button on:click={() => handlePageChange(currentPage - 1)}
            >&lt; Prev</button
          >
        {/if}

        {#if totalPages <= 7}
          {#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
            <button
              on:click={() => handlePageChange(page)}
              class:selected={page === currentPage}>{page}</button
            >
          {/each}
        {:else if currentPage <= 4}
          {#each Array.from({ length: 5 }, (_, i) => i + 1) as page}
            <button
              on:click={() => handlePageChange(page)}
              class:selected={page === currentPage}>{page}</button
            >
          {/each}
          <span>...</span>
          <button on:click={() => handlePageChange(totalPages)}
            >{totalPages}</button
          >
        {:else if currentPage > totalPages - 4}
          <button on:click={() => handlePageChange(1)}>1</button>
          <span>...</span>
          {#each Array.from({ length: 5 }, (_, i) => totalPages - 4 + i) as page}
            <button
              on:click={() => handlePageChange(page)}
              class:selected={page === currentPage}>{page}</button
            >
          {/each}
        {:else}
          <button on:click={() => handlePageChange(1)}>1</button>
          <span>...</span>
          {#each Array.from({ length: 3 }, (_, i) => currentPage - 1 + i) as page}
            <button
              on:click={() => handlePageChange(page)}
              class:selected={page === currentPage}>{page}</button
            >
          {/each}
          <span>...</span>
          <button on:click={() => handlePageChange(totalPages)}
            >{totalPages}</button
          >
        {/if}

        {#if currentPage < totalPages}
          <button on:click={() => handlePageChange(currentPage + 1)}
            >Next &gt;</button
          >
        {/if}
      </div>
    {:else}
      <p>No books available.</p>
    {/if}
  {/if}
</div>

<style>
  .table {
    width: 100%;
    margin-bottom: 1rem;
    color: #212529;
    border-collapse: collapse;
  }

  .table,
  .table th,
  .table td {
    border: 1px solid #dee2e6;
  }

  .table th,
  .table td {
    padding: 0.75rem;
    vertical-align: top;
    cursor: pointer;
  }

  .table thead th {
    vertical-align: bottom;
    border-bottom: 2px solid #dee2e6;
    background-color: #f8f9fa;
  }

  .table tbody tr:hover {
    background-color: #f8f9fa;
  }

  .table td {
    text-align: left;
  }

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

  .btn {
    padding: 0.5rem 1rem;
    margin-right: 0.5rem;
    cursor: pointer;
    border: none;
    border-radius: 4px;
    transition: background-color 0.3s;
  }

  .btn-success {
    background-color: #28a745;
    color: #fff;
  }

  .btn-danger {
    background-color: #dc3545;
    color: #fff;
  }

  .btn:hover {
    opacity: 0.9;
  }

  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #28a745;
    color: #fff;
    padding: 10px;
    border-radius: 4px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    z-index: 999;
  }

  .success-message {
    font-weight: bold;
  }
</style>
