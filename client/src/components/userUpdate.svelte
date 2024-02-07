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

<div>
        {#if successMessage}
    <div class="notification">
      <p class="success-message">{successMessage}</p>
    </div>
  {/if}
  <h1>Update Profile</h1>
  <form on:submit|preventDefault={updateProfile}>
    <label for="username">Username:</label>
    <input type="text" id="username" bind:value={updatedUser.username} disabled />

    <label for="email">Email:</label>
    <input type="email" id="email" bind:value={updatedUser.email} />

    <label for="phoneNumber">Phone Number:</label>
    <input type="tel" id="phoneNumber" bind:value={updatedUser.phoneNumber} />

    <label for="address">Address:</label>
    <textarea id="address" bind:value={updatedUser.address}></textarea>

    <button type="submit">Update Profile</button>
    <button type="button" on:click={cancelUpdate}>Cancel</button>
  </form>
</div>

