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
  <h2 class="mt-4 mb-4">All Books</h2>

  {#if successMessage}
    <div class="alert alert-success">
      <p class="font-weight-bold">{successMessage}</p>
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
    <div class="mb-3 col-md-6 offset-md-3">
      <div class="input-group">
        <input
          type="text"
          class="form-control"
          bind:value={searchQuery}
          placeholder="Search by title, author, category..."
        />
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button" on:click={handleSearch}>Search</button>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-end m-4">
          <label class="sr-only" for="sortField">Sort by:</label>
          <select class="custom-select mr-sm-2" bind:value={sortField} on:change={handleSort} id="sortField">
            {#each sortOptions as option (option.field)}
              <option value={option.field}>{option.label}</option>
            {/each}
          </select>
        

          <label class="sr-only" for="sortOrder">Order:</label>
          <select class="custom-select mr-sm-2" bind:value={sortOrder} on:change={handleSort} id="sortOrder">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
  

    {#if books.length > 0}
      <table class="table">
        <thead>
          <tr>
            <th scope="col" on:click={() => handleSort("id")}>Id</th>
            <th scope="col" on:click={() => handleSort("title")}>Title</th>
            <th scope="col" on:click={() => handleSort("description")}>Description</th>
            <th scope="col" on:click={() => handleSort("quantity")}>Quantity</th>
            <th scope="col" on:click={() => handleSort("author")}>Author</th>
            <th scope="col" on:click={() => handleSort("category")}>Category</th>
            <th scope="col" on:click={() => handleSort("lendingPrice")}>Lending Price</th>
            <th scope="col" on:click={() => handleSort("createdAt")}>Created At</th>
            <th scope="col" on:click={() => handleSort("updatedAt")}>Updated At</th>
            <th scope="col" on:click={() => handleSort("deletedAt")}>Deleted At</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {#each books as book (book.id)}
            <tr>
              <th scope="row">{book.id}</th>
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
                  class="btn btn-success btn-sm"
                  on:click={() => handleUpdate(book)}>Update</button
                >
                <button
                  type="button"
                  class="btn btn-danger btn-sm mt-2"
                  on:click={() => handleDelete(book.id)}>Delete</button
                >
                {#if book.deletedAt != null}
                  <button
                    type="button"
                    class="btn btn-secondary btn-sm mt-2"
                    on:click={() => handleRestore(book.id)}>Restore</button
                  >
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>

      <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center">
          {#if currentPage > 1}
            <li class="page-item">
              <button class="page-link" on:click={() => handlePageChange(currentPage - 1)}
                >&lt; Prev</button
              >
            </li>
          {/if}

          {#if totalPages <= 7}
            {#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
              <li class="page-item">
                <button
                  class="page-link"
                  on:click={() => handlePageChange(page)}
                  class:selected={page === currentPage}>{page}</button
                >
              </li>
            {/each}
          {:else if currentPage <= 4}
            {#each Array.from({ length: 5 }, (_, i) => i + 1) as page}
              <li class="page-item">
                <button
                  class="page-link"
                  on:click={() => handlePageChange(page)}
                  class:selected={page === currentPage}>{page}</button
                >
              </li>
            {/each}
            <li class="page-item">
              <span class="page-link">...</span>
            </li>
            <li class="page-item">
              <button class="page-link" on:click={() => handlePageChange(totalPages)}
                >{totalPages}</button
              >
            </li>
          {:else if currentPage > totalPages - 4}
            <li class="page-item">
              <button class="page-link" on:click={() => handlePageChange(1)}>1</button>
            </li>
            <li class="page-item">
              <span class="page-link">...</span>
            </li>
            {#each Array.from({ length: 5 }, (_, i) => totalPages - 4 + i) as page}
              <li class="page-item">
                <button
                  class="page-link"
                  on:click={() => handlePageChange(page)}
                  class:selected={page === currentPage}>{page}</button
                >
              </li>
            {/each}
          {:else}
            <li class="page-item">
              <button class="page-link" on:click={() => handlePageChange(1)}>1</button>
            </li>
            <li class="page-item">
              <span class="page-link">...</span>
            </li>
            {#each Array.from({ length: 3 }, (_, i) => currentPage - 1 + i) as page}
              <li class="page-item">
                <button
                  class="page-link"
                  on:click={() => handlePageChange(page)}
                  class:selected={page === currentPage}>{page}</button
                >
              </li>
            {/each}
            <li class="page-item">
              <span class="page-link">...</span>
            </li>
            <li class="page-item">
              <button class="page-link" on:click={() => handlePageChange(totalPages)}
                >{totalPages}</button
              >
            </li>
          {/if}

          {#if currentPage < totalPages}
            <li class="page-item">
              <button class="page-link" on:click={() => handlePageChange(currentPage + 1)}
                >Next &gt;</button
              >
            </li>
          {/if}
        </ul>
      </nav>
    {:else}
      <p>No books available.</p>
    {/if}
  {/if}
</div>

<style>
  .page-link {
    color: black;
  }
  .alert {
    margin-top: 20px;
    border-radius: 4px;
  }

  .btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }

  .pagination {
    margin-top: 1rem;
  }
</style>
