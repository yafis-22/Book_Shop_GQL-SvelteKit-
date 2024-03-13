<script>
  import { get } from "svelte/store";
  import authStore from "../stores/authStore";

  export let book;
  export let onSuccess;
  export let onCancel;

  let updatedBook = { ...book };
  let successMessage = "";

  const handleUpdateSubmit = async () => {
    try {
      const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${get(authStore).userToken}`,
        },
        body: JSON.stringify({
          query: `
            mutation UpdateBook($id: ID!, $input: AddBookInput!) {
              updateBook(id: $id, input: $input) {
                message
                data {
                  id
                  title
                  quantity
                  lendingPrice
                  imageSrc
                  author
                  category
                  description
                  createdAt
                  updatedAt
                  deletedAt
                }
              }
            }
          `,
          variables: {
            id: updatedBook.id,
            input: {
              // Define the fields you want to update
              title: updatedBook.title,
              description: updatedBook.description,
              lendingPrice: updatedBook.lendingPrice,
              quantity: updatedBook.quantity,
              author: updatedBook.author,
              category: updatedBook.category,
              imageSrc: updatedBook.imageSrc,
            },
          },
        }),
      });
      const responseData = await response.json();

      if (response.ok) {
        onSuccess(); // Callback to refresh the book list after successful update
        successMessage =
          responseData.data.updateBook.message || "Book updated successfully";
      } else {
        console.error(
          `Error updating book with ID ${updatedBook.id}:`,
          responseData.errors[0].message,
        );
      }
    } catch (error) {
      console.error(`Error updating book with ID ${updatedBook.id}:`, error);
    }
  };

  const handleUpdateCancel = () => {
    onCancel(); // Callback to hide the update form
  };
</script>

<div class="container">
  <div class="update-form card p-4">
    <h2 class="text-center mb-4">Update Book</h2>
    {#if successMessage}
      <div class="notification alert alert-success">
        <p>{successMessage}</p>
      </div>
    {/if}
    <form on:submit|preventDefault={handleUpdateSubmit}>
      <div class="mb-3">
        <label for="title" class="form-label">Title:</label>
        <input type="text" class="form-control" bind:value={updatedBook.title} />
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Description:</label>
        <textarea class="form-control" bind:value={updatedBook.description}></textarea>
      </div>

      <div class="mb-3">
        <label for="quantity" class="form-label">Quantity:</label>
        <input type="number" class="form-control" bind:value={updatedBook.quantity} />
      </div>

      <div class="mb-3">
        <label for="author" class="form-label">Author:</label>
        <input type="text" class="form-control" bind:value={updatedBook.author} />
      </div>

      <div class="mb-3">
        <label for="category" class="form-label">Category:</label>
        <select class="form-select" bind:value={updatedBook.category} required>
          <option value="" disabled>Select a category</option>
          {#each ["Romance", "Science", "Adventure", "Fantasy", "Fiction", "History", "Literature", "Mystery"] as category}
            <option value={category}>{category}</option>
          {/each}
        </select>
      </div>

      <div class="mb-3">
        <label for="lendingPrice" class="form-label">Lending Price:</label>
        <input type="number" class="form-control" bind:value={updatedBook.lendingPrice} />
      </div>

      <div class="mb-3">
        <label for="imageSrc" class="form-label">Image Source:</label>
        <input type="text" class="form-control" bind:value={updatedBook.imageSrc} />
      </div>

      <div class="d-grid gap-2">
        <button type="submit" class="btn btn-primary">Update</button>
        <button type="button" on:click={handleUpdateCancel} class="btn btn-secondary">Cancel</button>
      </div>
    </form>
  </div>
</div>

<style>
  .update-form {
    max-width: 400px;
    margin: auto;
  }

  input, textarea, select {
      background-color: #f5f5f5;
    }

  .notification {
    margin-top: 20px;
  }

  .notification p {
    padding: 10px;
    border-radius: 4px;
  }
</style>
