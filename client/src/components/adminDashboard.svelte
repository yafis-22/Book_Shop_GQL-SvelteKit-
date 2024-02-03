<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import authStore from '../stores/authStore';
  import BookTable from "./bookTable.svelte";

  let showModal = false;

  const openModal = () => {
    showModal = true;
  };

  const closeModal = () => {
    showModal = false;
  };

  onMount(() => {
    // Redirect to login if not an admin
    if (!$authStore.isAdmin) {
      navigate('/login');
    }
  });
</script>

<div>
<h1 class="dashboard-title">Welcome to Admin Dashboard</h1>
<button class="action-button" on:click={() => navigate('/admin/add-book')}>Add New Book</button>
<button class="action-button" on:click={openModal}>Fetch All Books</button>
<button class="action-button" on:click={() => navigate('/admin/all-users')}>Fetch All Users</button>

{#if showModal}
  <!-- Modal -->
  <div class="modal">
    <div class="modal-content">
      <span class="close" on:click={closeModal}>&times;</span>
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
