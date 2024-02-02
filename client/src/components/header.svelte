<script>
    import { Link } from "svelte-routing";
    import "bootstrap/dist/css/bootstrap.min.css";
    import "bootstrap-icons/font/bootstrap-icons.css";
    
    let userLoggedIn = false; // Set this to true if the user is logged in
</script>

<nav class="navbar navbar-expand-lg navbar-light">
    <div class="container-fluid">
      <Link to="/" class="navbar-brand">BookLender</Link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item active">
            <Link to="/" class="nav-link">Home</Link>
          </li>
          <li class="nav-item">
            <Link to="/categories" class="nav-link">Categories</Link>
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
            <i class="bi bi-person"></i>
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

    .navbar-brand {
        color: #343a40;
        font-family: 'IBM Plex Sans', sans-serif;
        font-size: 1.5rem;
    }

    .navbar-nav {
        margin: 0 auto;
    }

    .navbar-nav .nav-item {
        text-align: center;
    }

    .navbar-nav .nav-link {
        color: #343a40;
        border-bottom: 3px solid transparent;
        transition: border-color 0.3s;
    }

    .navbar-nav .nav-link:hover {
        border-color: #343a40;
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

    .btn-outline-primary {
        color: #343a40;
        border-color: #343a40;
    }

    .btn-outline-primary:hover {
        color: #fff;
        background-color: #343a40;
    }

    .bi-person {
        color: #343a40;
        margin-right: 10px;
    }
</style>
