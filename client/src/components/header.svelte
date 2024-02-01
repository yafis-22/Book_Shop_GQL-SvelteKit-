<script>
    import "bootstrap/dist/css/bootstrap.min.css";
    let userLoggedIn = false; // Set this to true if the user is logged in
</script>

<nav class="navbar navbar-expand-lg navbar-light">
    <div class="container-fluid">
        <a class="navbar-brand" href="#">BookLender</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item active">
                    <a class="nav-link" href="#">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Categories</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Blog</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">About</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Contact</a>
                </li>
            </ul>
            <div class="search-bar">
                <input class="form-control" type="search" placeholder="Search" aria-label="Search">
            </div>
            <div class="login-register-buttons">
                {#if userLoggedIn}
                    <i class="fa fa-user"></i>
                {:else}
                    <button class="btn btn-outline-primary" type="button">Login</button>
                    <button class="btn btn-outline-primary" type="button">Register</button>
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

    .fa-user {
        color: #343a40;
        margin-right: 10px;
    }
</style>
