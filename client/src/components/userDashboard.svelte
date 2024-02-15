<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import authStore from '../stores/authStore';
    import UserUpdate from './userUpdate.svelte';
    import Header from './header.svelte';
    import Footer from './footer.svelte';
  
    let user = {};
    let lentBooks = [];
    let isUpdating = false;
    let successMessage = "";
  
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
    // Open the modal for updating user details
    isUpdating = true;
  };
  const cancelUpdate = () => {
    // Close the modal
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
  
    let returnDetails = null;

const showReturnDetails = (details) => {
    returnDetails = details;
};

const hideReturnDetails = () => {
    returnDetails = null;
};

const returnBook = async (bookId) => {
    try {
        const response = await fetch(`http://localhost:3002/api/v1/books/return/${bookId}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${$authStore.userToken}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            showReturnDetails(data.data);
            // Refresh the list of lended books
            fetchUserDetails();
        } else {
            const errorData = await response.json();
            console.error('Error returning book:', errorData.message);
        }
    } catch (error) {
        console.error('Error returning book:', error);
    }
};
  
    const logout = () => {
      authStore.set({ userToken: null, isAdmin: false });
      navigate('/login');
    };
  </script>
  
  <Header />

  <div class="container mt-4">
      {#if successMessage}
          <div class="notification">
              <p class="success-message">{successMessage}</p>
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
            <button class="btn btn-secondary action-button" on:click={logout}>
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
                              <button class="btn btn-warning action-button" on:click={() => returnBook(book.id)}>
                                  Return
                              </button>
                          </li>
                      {/each}
                  </ul>
              {:else}
                  <p>No books lended</p>
              {/if}
              
          </div>
      {/if}
  </div>
  <div class="modal" tabindex="-1" role="dialog" style="{returnDetails ? 'display: block;' : 'display: none;'}">
    <div class="modal-background"></div>
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Book Return Details</h5>
                <button type="button" class="close" aria-label="Close" on:click={hideReturnDetails}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p>Book returned successfully:</p>
                <p>Initial Charge: ${returnDetails ? returnDetails.initialCharge : ''}</p>
                <p>Additional Charge: ${returnDetails ? returnDetails.additionalCharge : ''}</p>
                <p>Total Charge: ${returnDetails ? returnDetails.totalCharge : ''}</p>
                <p>Days Lended: {returnDetails ? returnDetails.days : ''}</p>
            </div>
        </div>
    </div>
</div>
  <Footer />
  
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
          cursor: pointer;
      }
  
      .lend-return-section {
          margin-top: 20px;
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

      .modal-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(116, 114, 114, 0.8); /* Light background */
    }
  </style>
  