<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import authStore from '../stores/authStore';
  
    let user = {};
    let lentBooks = [];
  
    onMount(async () => {
      // Redirect to login if not a user
      if (authStore.isAdmin) {
        navigate('/admin');
      } else {
        // Fetch user details and lent books
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
      }
    });
  
    const deleteProfile = async () => {
      const confirmDelete = confirm('Are you sure you want to delete your profile?');
  
      if (confirmDelete) {
        // Perform delete operation
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
    };
  
    const lendBook = async () => {
      navigate('/books');
    };
  
    const returnBook = async (bookId) => {
      // Implement book return functionality here
      console.log(`Returning book with ID: ${bookId}`);
    };
  
    const logout = () => {
      authStore.set({ userToken: null, isAdmin: false });
      navigate('/login');
    };
  </script>
  
  <div>
    <h1 class="dashboard-title">Welcome, {user.username}</h1>
    <div class="user-details">
      <p>Email: {user.email}</p>
      <p>Phone Number: {user.phoneNumber}</p>
      <!-- Add more user details as needed -->
  
      <button class="action-button" on:click={() => navigate('/user/update-profile')}>
        Update Profile
      </button>
      <button class="action-button" on:click={deleteProfile}>
        Delete Profile
      </button>
      <button class="action-button" on:click={logout}>
        Logout
      </button>
    </div>
  
    <div class="lend-return-section">
      <h2>Lended Books</h2>
      {#if lentBooks.length > 0}
        <ul>
          {#each lentBooks as book (book.id)}
            <li>
              {book.title} by {book.author} ({book.category})
              <button class="action-button" on:click={() => returnBook(book.id)}>Return</button>
            </li>
          {/each}
        </ul>
      {:else}
        <p>No books lended</p>
      {/if}
      <button class="action-button" on:click={lendBook}>
        Lend a Book
      </button>
    </div>
  </div>
  
  <style>
    .dashboard-title {
      font-size: 24px;
      margin-bottom: 20px;
    }
  
    .user-details {
      margin-bottom: 20px;
    }
  
    .action-button {
      margin-right: 10px;
      margin-bottom: 10px;
      padding: 8px 12px;
      cursor: pointer;
    }
  
    .lend-return-section {
      margin-top: 20px;
    }
  </style>
  