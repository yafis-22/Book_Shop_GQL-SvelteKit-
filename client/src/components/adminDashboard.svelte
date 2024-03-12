<script>
  import { onMount, setContext } from "svelte";
  import { navigate } from "svelte-routing";
  import authStore from "../stores/authStore";
  import BookTable from "./bookTable.svelte";
  import UserTable from "./userTable.svelte";
  import BookAdd from "./bookAdd.svelte";
  import Header from "./header.svelte";
  import Footer from "./footer.svelte";

  let activeTab = "addBook";
  let user={};

  onMount(async () => {
    // Redirect to login if not an admin
    if (!$authStore.isAdmin) {
      navigate("/login");
    }

    try {
      const response = await fetch('http://localhost:3002/api/v1/admins/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${$authStore.userToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        user = data.data;
        // Update user context for other components
        setContext("user", user);
      } else {
        console.error('Error fetching user details:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  });

  const logout = () => {
    authStore.set({ userToken: null, isAdmin: false });
    // Redirect to the login page after logout
    navigate('/login');
  };
</script>

<Header />
<div class="dashboard-title">
  <h2>Welcome to Admin Dashboard</h2>
  <div class="user-info">
    <p>Email: {user.email}</p>
    <p>Phone Number: {user.phoneNumber}</p>
  </div>
  <div class="nav-container">
    <ul class="nav nav-pills">
      <li class="nav-item">
        <a class="nav-link" on:click={() => activeTab = "addBook"} class:active={activeTab === "addBook"}>Add New Book</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" on:click={() => activeTab = "fetchAllBooks"} class:active={activeTab === "fetchAllBooks"}>Fetch All Books</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" on:click={() => activeTab = "fetchAllUsers"} class:active={activeTab === "fetchAllUsers"}>Fetch All Users</a>
      </li>
    </ul>
    <button class="btn btn-dark" on:click={logout}>
      Logout
    </button>
  </div>
  <hr>
  {#if activeTab === "addBook"}
    <!-- Add Book Content -->
    <BookAdd />
  {/if}
  {#if activeTab === "fetchAllBooks"}
    <!-- Fetch All Books Content -->
    <BookTable />
  {/if}
  {#if activeTab === "fetchAllUsers"}
    <!-- Fetch All Users Content -->
    <UserTable />
  {/if}
</div>

<Footer />
<style>
  .dashboard-title {
    color: #333;
    margin-bottom: 20px;
    margin-top: 10px;
    text-align: center;
  }

  .nav-link {
    cursor: pointer;
  }

  .user-info {
    text-align: center;
    margin-bottom: 10px;
  }

  .nav-container {
    display: flex;
    justify-content: space-between;
  }
</style>
