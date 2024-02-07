<script>
  import { Link, navigate } from "svelte-routing";
  import authStore from "../stores/authStore";
  import SearchBar from "./searchBar.svelte"
  import "bootstrap/dist/css/bootstrap.min.css";
  import "bootstrap-icons/font/bootstrap-icons.css";
  let expanded = false;
  $: userLoggedIn = $authStore.userLoggedIn;
  $: isAdmin = $authStore.isAdmin;

  const handleIconClick = () => {
    if (userLoggedIn) {
      navigate(isAdmin ? "/admins" : "/users/me");
    } else {
      navigate("/login");
    }
  };
</script>

<nav class="navbar navbar-expand-lg navbar-light">
  <div class="container-fluid">
    <Link to="/" class="navbar-brand">BookLender</Link>
    <button class="navbar-toggler" type="button" on:click={() => expanded = !expanded}>
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class={expanded ? "navbar-collapse show" : "navbar-collapse"} id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <Link to="/" class="nav-link">Home</Link>
        </li>
        <li class="nav-item">
          <Link to="/books" class="nav-link">Books</Link>
        </li>
        <li class="nav-item">
          <Link to="/blog" class="nav-link">Blog</Link>
        </li>
        <li class="nav-item">
          <Link to="/about" class="nav-link">About</Link>
        </li>
        <li class="nav-item">
          <Link to="/contact" class="nav-link">Contact</Link>
        </li>
      </ul>
      <div class="search-bar">
        <SearchBar />
      </div>
      <div class="login-register-buttons">
        {#if userLoggedIn}
          <i class="bi bi-person" on:click={handleIconClick}></i>
        {:else}
          <Link to="/login" class="btn btn-outline-dark" type="button">Login</Link>
          <Link to="/register" class="btn btn-outline-dark" type="button">Register</Link>
        {/if}
      </div>
    </div>
  </div>
</nav>

<style>
    .navbar {
        background-color: #ffffff;
    }

    .navbar-nav {
        margin: 0 auto;
    }

    .navbar-nav .nav-item {
        text-align: center;
    }

    .search-bar {
        margin-left: auto; /* Move search bar to the right */
    }

    .login-register-buttons {
        margin-left: 10px; /* Add some space between search bar and buttons */
    }

    .bi-person {
        color: #343a40;
        margin-right: 10px;
    }

    .navbar-collapse {
    display: none;
  }

  .navbar-collapse.show {
    display: block;
  }
</style>
