<script>
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';
  import authStore from '../stores/authStore';
  import UserUpdate from './userUpdate.svelte';
  import Header from './header.svelte';
  import Footer from './footer.svelte';
  import ReturnBook from './returnBook.svelte';

  let user = {};
  let lentBooks = [];
  let isUpdating = false;
  let successMessage = "";
  let returnDetails = null;
  let showModal = false;

  const openModal = (book) => {
      returnDetails = book;
      showModal = true;
  };

  const fetchUserDetails = async () => {
      try {
          const response = await fetch('http://localhost:3002/api/v1/users/me', {
              method: 'GET',
              headers: {
                  Authorization: `Bearer ${$authStore.userToken}`,
              },
          });

          if (response.ok) {
              const data = await response.json();
              user = data.data;
              lentBooks = user.lentBooks || [];
          } else {
              console.error('Error fetching user details:', response.statusText);
          }
      } catch (error) {
          console.error('Error fetching user details:', error);
      }
  };

  onMount(fetchUserDetails);

  const deleteProfile = async () => {
      const confirmDelete = confirm('Are you sure you want to delete your profile?');

      if (confirmDelete) {
          // Check if the user has lended books
          if (lentBooks.length > 0) {
              alert('Clear your lended books before deleting your profile.');
          } else {
              try {
                  const response = await fetch('http://localhost:3002/api/v1/users/me', {
                      method: 'DELETE',
                      headers: {
                          Authorization: `Bearer ${$authStore.userToken}`,
                      },
                  });

                  if (response.ok) {
                      // Logout user and redirect to login
                      authStore.set({ userToken: null, isAdmin: false });
                      navigate('/login');
                  } else {
                      console.error('Error deleting user profile:', response.statusText);
                  }
              } catch (error) {
                  console.error('Error deleting user profile:', error);
              }
          }
      }
  };

  const updateProfile = () => {
      isUpdating = true;
  };

  const cancelUpdate = () => {
      isUpdating = false;
  };

  const handleUpdate = (updatedUser) => {
      fetchUserDetails();
      successMessage = 'User updated successfully';
      isUpdating = false;

      setTimeout(() => {
          successMessage = "";
      }, 3000);
  };

  const lendBook = async () => {
      navigate('/books');
  };

  const logout = () => {
      authStore.set({ userToken: null, isAdmin: false });
      navigate('/login');
  };
</script>

<Header />

<div class="container mt-4">
  {#if successMessage}
      <div class="alert alert-success" role="alert">
          {successMessage}
      </div>
  {/if}

  <!-- Modal for updating user details -->
  {#if isUpdating}
      <UserUpdate user={user} onUpdate={handleUpdate} onCancel={cancelUpdate} />
  {:else}
      <h1 class="dashboard-title">Welcome, {user.username}</h1>

      <div class="user-details">
          <p>Email: {user.email}</p>
          <p>Phone Number: {user.phoneNumber}</p>

          <button class="btn btn-primary action-button" on:click={updateProfile}>
              Update Profile
          </button>
          <button class="btn btn-danger action-button" on:click={deleteProfile}>
              Delete Profile
          </button>
          <button class="btn btn-primary action-button" on:click={lendBook}>
              Lend a Book
          </button>
          <button class="btn btn-dark action-button ml-auto" on:click={logout}>
              Logout
          </button>
      </div>

      <div class="lend-return-section">
          <h2>Lended Books</h2>
          {#if lentBooks.length > 0}
              <ul class="list-group">
                  {#each lentBooks as book (book.id)}
                      <li class="list-group-item">
                          {book.title} by {book.author} ({book.category})
                          <button class="btn btn-warning" on:click={() => openModal(book)}>
                              Return
                          </button>
                          <p>Initial Charges: ${book.initialCharge}</p>
                          <p>Additional Charges: ${book.additionalCharge}</p>
                          <p>Days Lended: {book.days}</p>
                      </li>
                  {/each}
              </ul>
          {:else}
              <p>No books lended</p>
          {/if}
      </div>
  {/if}
  {#if showModal}
      <ReturnBook
          book={returnDetails}
          bind:showModal
          onCloseModal={() => {
              showModal = false;
          }}
      />
  {/if}
</div>

{#if showModal}
    <!-- Bootstrap modal backdrop class for light background overlay -->
    <div class="modal-backdrop show"></div>
  {/if}
<Footer />
<style>
   .action-button {
          margin-right: 10px;
          margin-bottom: 15px;
          cursor: pointer;
      }
</style>