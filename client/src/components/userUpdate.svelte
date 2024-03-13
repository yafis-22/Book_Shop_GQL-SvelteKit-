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
      // const { username, ...updatedUserWithoutUsername } = updatedUser;
      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${get(authStore).userToken}`,
        },
        body: JSON.stringify({
          query: `
            mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
              updateUser(id: $id, input: $input) {
                message
                user {
                  id
                  username
                  address
                }
              }
            }
          `,
          variables: {
            id: updatedUser.id,
            input: {
              email: updatedUser.email,
              password: updatedUser.password,
              phoneNumber: updatedUser.phoneNumber,
              address: updatedUser.address
            }
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user profile');
      }

      const { data, errors } = await response.json();
      if (errors) {
        throw new Error(errors[0].message || 'Unknown error occurred');
      }

      console.log('User details updated successfully:', data.updateUser);
      // Notify the parent component about the update
      onUpdate(data.updateUser);
    } catch (error) {
      console.error('Error updating user profile:', error.message);
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
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" bind:value={updatedUser.password} />
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

