<script>
  import { Link, navigate } from "svelte-routing";
  import authStore from "../stores/authStore";
  import "bootstrap/dist/css/bootstrap.min.css";
  import "bootstrap-icons/font/bootstrap-icons.css";

  $: userLoggedIn = $authStore.userLoggedIn;
  $: isAdmin = $authStore.isAdmin;

  const handleIconClick = () => {
    if (userLoggedIn) {
      navigate(isAdmin ? "/admins" : "/users");
    } else {
      navigate("/login");
    }
  };
</script>

<nav class="navbar navbar-expand-lg navbar-light">
    <div class="container-fluid">
      <Link to="/" class="navbar-brand">BookLender</Link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
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
          <input class="form-control" type="search" placeholder="Search" aria-label="Search">
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

    .form-control {
        color: #343a40;
    }

    .login-register-buttons {
        margin-left: 10px; /* Add some space between search bar and buttons */
    }

    .bi-person {
        color: #343a40;
        margin-right: 10px;
    }
</style>
