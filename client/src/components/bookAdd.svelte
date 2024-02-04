<script>
    import { get } from 'svelte/store';
    import authStore from '../stores/authStore';
  
    let formData = {
      title: '',
      description: '',
      lendingPrice: 0,
      quantity: 0,
      author: '',
      category: '',
      imageSrc: '',
    };
  
    let errorMessage = '';
  
    const addBook = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/v1/books', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${get(authStore).userToken}`,
          },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('Book added successfully:', data);
          // Optionally, you can reset the form or show a success message
          formData = {
            title: '',
            description: '',
            lendingPrice: 0,
            quantity: 0,
            author: '',
            category: '',
            imageSrc: '',
          };
          errorMessage = ''; // Reset error message
        } else {
          const errorData = await response.json();
          errorMessage = errorData.message || 'Failed to add book';
        }
      } catch (error) {
        console.error('Error adding book:', error);
        errorMessage = 'Internal Server Error';
      }
    };
  </script>
  
  <div class="container">
    <h2>Add New Book</h2>
  
    {#if errorMessage}
      <div class="alert alert-danger" role="alert">
        {errorMessage}
      </div>
    {/if}
  
    <form>
      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input type="text" class="form-control" id="title" bind:value={formData.title} required />
      </div>
  
      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea class="form-control" id="description" rows="3" bind:value={formData.description} required></textarea>
      </div>
  
      <div class="mb-3">
        <label for="lendingPrice" class="form-label">Lending Price</label>
        <input type="number" class="form-control" id="lendingPrice" bind:value={formData.lendingPrice} required />
      </div>
  
      <div class="mb-3">
        <label for="quantity" class="form-label">Quantity</label>
        <input type="number" class="form-control" id="quantity" bind:value={formData.quantity} required />
      </div>
  
      <div class="mb-3">
        <label for="author" class="form-label">Author</label>
        <input type="text" class="form-control" id="author" bind:value={formData.author} required />
      </div>
  
      <div class="mb-3">
        <label for="category" class="form-label">Category</label>
        <input type="text" class="form-control" id="category" bind:value={formData.category} required />
      </div>
  
      <div class="mb-3">
        <label for="imageSrc" class="form-label">Image Source</label>
        <input type="text" class="form-control" id="imageSrc" bind:value={formData.imageSrc} />
      </div>
  
      <button type="button" class="btn btn-primary" on:click={addBook}>Add Book</button>
    </form>
  </div>
  
  <style>
    .container {
      max-width: 600px;
      background-color: #f5f5f5;
    }
  
    form {
      margin-top: 20px;
    }
  
    .mb-3 {
      margin-bottom: 15px;
    }
  
    .btn-primary {
      background-color: #007bff;
      color: #fff;
    }
  
    .btn-primary:hover {
      background-color: #0056b3;
    }
  
    .alert {
      margin-top: 20px;
    }
  </style>
  
  