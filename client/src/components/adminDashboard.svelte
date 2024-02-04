<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import authStore from "../stores/authStore";
  import BookTable from "./bookTable.svelte";
  import UserTable from "./userTable.svelte";
  import BookAdd from "./bookAdd.svelte";

  let showUserModal = false;
  let showBookModal = false;
  let showAddBookModal = false; // New state variable for the Add Book modal

  const openUserModal = () => {
    showUserModal = true;
  };

  const closeUserModal = () => {
    showUserModal = false;
  };

  const openBookModal = () => {
    showBookModal = true;
  };

  const closeBookModal = () => {
    showBookModal = false;
  };

  const openAddBookModal = () => {
    showAddBookModal = true;
  };

  const closeAddBookModal = () => {
    showAddBookModal = false;
  };

  onMount(() => {
    // Redirect to login if not an admin
    if (!$authStore.isAdmin) {
      navigate("/login");
    }
  });
  const logout = () => {
    authStore.set({ userToken: null, isAdmin: false });
    // Redirect to the login page after logout
    navigate('/login');
  };
</script>

<div>
  <h1 class="dashboard-title">Welcome to Admin Dashboard</h1>
  <button class="action-button" on:click={openAddBookModal}>
    Add New Book
  </button>
  <button class="action-button" on:click={openBookModal}>
    Fetch All Books
  </button>
  <button class="action-button" on:click={openUserModal}>
    Fetch All Users
  </button>
  <button class="action-button" on:click={logout}>
    Logout
  </button>

  {#if showAddBookModal}
    <!-- Modal -->
    <div class="modal">
      <div class="modal-content">
        <span class="close" on:click={closeAddBookModal}>&times;</span>
        <BookAdd on:close={closeAddBookModal} />
      </div>
    </div>
  {/if}
  {#if showUserModal}
    <!-- Modal -->
    <div class="modal">
      <div class="modal-content">
        <span class="close" on:click={closeUserModal}>&times;</span>
        <UserTable />
      </div>
    </div>
  {/if}
  {#if showBookModal}
    <!-- Modal -->
    <div class="modal">
      <div class="modal-content">
        <span class="close" on:click={closeBookModal}>&times;</span>
        <BookTable />
      </div>
    </div>
  {/if}
</div>

<style>
  /* Admin Dashboard styles */
  .dashboard-title {
    color: #333;
    margin-bottom: 20px;
  }

  .action-button {
    background-color: #007bff;
    color: #fff;
    padding: 10px 20px;
    margin-right: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .action-button:hover {
    background-color: #0056b3;
  }

  /* Modal styles */
  .modal {
    display: flex;
    padding: 20px;
    position: fixed;
    background: rgba(0, 0, 0, 0.5);
  }

  .modal-content {
    background: #fefefe;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    position: relative;
  }

  .close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 20px;
    cursor: pointer;
    color: #333;
  }
</style>
