<script>
    import { get } from 'svelte/store';
    import authStore from '../stores/authStore';
  
    export let book;
    export let onSuccess;
    export let onCancel;
  
    let updatedBook = { ...book };
    let successMessage = '';
  
    const handleUpdateSubmit = async () => {
      try {
        const response = await fetch(
          `http://localhost:3002/api/v1/books/${updatedBook.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${get(authStore).userToken}`,
            },
            body: JSON.stringify(updatedBook),
          },
        );
  
        if (response.ok) {
          onSuccess(); // Callback to refresh the book list after successful update
          successMessage = 'Book updated successfully';
        } else {
          console.error(
            `Error updating book with ID ${updatedBook.id}:`,
            response.statusText,
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
  
  <div class="update-form">
    <h2>Update Book</h2>
    {#if successMessage}
      <div class="notification">
        <p class="success-message">{successMessage}</p>
      </div>
    {/if}
    <form on:submit|preventDefault={handleUpdateSubmit}>
      <label for="title">Title:</label>
      <input type="text" bind:value={updatedBook.title} />
  
      <label for="description">Description:</label>
      <textarea bind:value={updatedBook.description}></textarea>
  
      <label for="quantity">Quantity:</label>
      <input type="number" bind:value={updatedBook.quantity} />
  
      <label for="author">Author:</label>
      <input type="text" bind:value={updatedBook.author} />
  
      <label for="category" class="form-label">Category</label>
        <select class="form-select" id="category" bind:value={updatedBook.category} required>
          <option value="" disabled>Select a category</option>
          {#each ['Romance', 'Science', 'Adventure', 'Fantasy', 'Friction', 'History', 'Literature', 'Mystery'] as category}
            <option value={category}>{category}</option>
          {/each}
        </select>
  
      <label for="lendingPrice">Lending Price:</label>
      <input type="number" bind:value={updatedBook.lendingPrice} />
      
      <label for="imageSrc">Image Source:</label>
      <input type="text" bind:value={updatedBook.imageSrc} />
  
      <button type="submit">Update</button>
      <button type="button" on:click={handleUpdateCancel}>Cancel</button>
    </form>
  </div>
  
  