<script>
  import { get } from 'svelte/store';
  import authStore from '../stores/authStore';

  export let user;
  export let onUpdate = () => {};
  export let onCancel = () => {};
  let updatedUser = { ...user };
  let successMessage = "";

 

  const updateProfile = async () => {
    try {
        const { username, password, ...updatedUserWithoutUsername } = updatedUser;
      const response = await fetch('http://localhost:3002/api/v1/users/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${get(authStore).userToken}`,
        },
        body: JSON.stringify(updatedUserWithoutUsername)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User details updated successfully:', data);
        // Notify the parent component about the update
    onUpdate(updatedUser);
      } else {
        const errorData = await response.json();
        console.error('Error updating user profile:', errorData.message);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };
  const cancelUpdate = () => {
    // Notify the parent component about the cancellation
    onCancel();
  };
</script>

<div class="container mt-4">
  {#if successMessage}
      <div class="alert alert-success">
          <p class="mb-0">{successMessage}</p>
      </div>
  {/if}
  <h2 class="mb-4 ">Update Profile</h2>
  <form on:submit|preventDefault={updateProfile}>
      <div class="card">
          <div class="mb-3">
              <label for="username" class="form-label">Username</label>
              <input type="text" class="form-control" id="username" bind:value={updatedUser.username} disabled />
          </div>

          <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input type="email" class="form-control" id="email" bind:value={updatedUser.email} />
          </div>

          <div class="mb-3">
              <label for="phoneNumber" class="form-label">Phone Number</label>
              <input type="tel" class="form-control" id="phoneNumber" bind:value={updatedUser.phoneNumber} />
          </div>

          <div class="mb-3">
              <label for="address" class="form-label">Address</label>
              <textarea id="address" class="form-control" bind:value={updatedUser.address}></textarea>
          </div>

          <button type="submit" class="btn btn-primary">Update Profile</button>
          <button type="button" on:click={cancelUpdate} class="btn btn-secondary mt-3">Cancel</button>
      </div>
  </form>
</div>


<style>
  /* You can include custom styles here if needed */
  .container {
      max-width: 400px;
      margin: auto;
      padding: 20px;
  }

  .card {
      border: 1px solid #ccc;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 20px;
  }

  h2 {
      text-align: center;
  }

  form {
      margin-top: 20px;
  }

  label {
      margin-bottom: 5px;
  }

  .form-control {
      margin-bottom: 15px;
  }

  .alert {
      margin-top: 20px;
  }

  input {
      background-color: #F5F5F5;
  }

  .form-label {
      color: #5A5A5A;
  }
</style>

