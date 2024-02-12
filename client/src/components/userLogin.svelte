<script>
  import "bootstrap/dist/css/bootstrap.min.css";
  import "bootstrap-icons/font/bootstrap-icons.css";
  import authStore from "../stores/authStore";
  import { Link, navigate } from "svelte-routing";
  import Header from "./header.svelte";
  import Footer from "./footer.svelte";

  let formData = {
    username: "",
    password: "",
  };

  let isAdmin = false;
  let errorMessage = "";

  const loginUser = async () => {
    try {
      const response = await fetch("http://localhost:3002/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User logged in successfully:", data);

        // Save token to local storage
        localStorage.setItem("userToken", data.userToken || data.adminToken);
        // Log the roles
        console.log("Role:", data.role);

        // Update the auth store with the token and isAdmin information
        authStore.set({
          userToken: data.userToken || data.adminToken,
          isAdmin: data.role === "admin", // Check if the role is 'admin'
          userLoggedIn: true,
        });

        // Redirect to the appropriate dashboard
        navigate(isAdmin ? "/admins/me" : "/users/me");
      } else {
        const errorData = await response.json();
        errorMessage = errorData.message || "Invalid username or password";

        // Log the entire errorData object for inspection
        console.log("Error data:", errorData);

        // Check if the error is due to incorrect role
        if (errorData.message === "Invalid username or password") {
          errorMessage = `Invalid ${
            isAdmin ? "admin" : "user"
          } username or password`;
        }
      }
    } catch (error) {
      console.error("Error logging in:", error);
      errorMessage = "Internal Server Error";
    }
  };
</script>
<Header />
<div class="container">
  <h2 class="mt-4">Sign In</h2>

  {#if errorMessage}
    <div class="alert alert-danger" role="alert">
      {errorMessage}
    </div>
  {/if}

  <form>
    <div class="card">
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input
          type="text"
          class="form-control"
          id="username"
          bind:value={formData.username}
          required
        />
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input
          type="password"
          class="form-control"
          id="password"
          bind:value={formData.password}
          required
        />
      </div>

      <div class="mb-3 form-check">
        <input
          type="checkbox"
          class="form-check-input"
          id="isAdmin"
          bind:checked={isAdmin}
        />
        <label class="form-check-label" for="isAdmin">Login as Admin</label>
      </div>

      <button type="button" class="btn btn-dark" on:click={loginUser}
        >Sign In</button
      >
      <div class="mt-3">
        <a href="forgot-password">Forgot password?</a>
      </div>
    </div>
  </form>

  <div class="text-center">
    <p><strong>Or</strong></p>
    <button type="button" class="btn btn-outline-dark"
      ><i class="bi bi-google"></i> Google</button
    >
    <button type="button" class="btn btn-outline-dark ml-5"
      ><i class="bi bi-facebook"></i> Facebook</button
    >
  </div>
  <hr />
  <div class="text-center">
    <p class="account">Don't have an account? <Link to="/register" class="text-dark">Sign up</Link></p>
</div>

</div>
<Footer />
<style>
  .container {
    max-width: 400px;
    margin: auto;
    padding: 20px;
  }

  .card {
    padding: 20px;
  }

  label {
    margin-bottom: 5px;
  }

  .form-control {
    margin-bottom: 15px;
  }

  .alert {
    margin-top: 20px;
  }

  input {
    background-color: #f5f5f5;
  }

  .form-label {
    color: #5a5a5a;
  }

  .account {
    color: #555555;
}
a {
    color: #555555;
}
</style>
