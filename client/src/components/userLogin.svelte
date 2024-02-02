<script>
    import "bootstrap/dist/css/bootstrap.min.css";
    import "bootstrap-icons/font/bootstrap-icons.css";
    import { navigate } from "@sveltejs/kit";
  
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
          console.log('User logged in successfully:', data);
  
          // Check if the user is an admin
          isAdmin = data.role === 'admin';
  
          // Check if the selected role matches the actual role of the user
          if ((isAdmin && !data.isAdmin) || (!isAdmin && data.isAdmin)) {
            errorMessage = `You are not ${isAdmin ? 'admin' : 'user'}`;
          } else {
            // Redirect to the appropriate dashboard
            navigate(isAdmin ? '/admin-dashboard' : '/user-dashboard');
          }
        } else {
          const errorData = await response.json();
          errorMessage = errorData.message || "Invalid username or password";
        }
      } catch (error) {
        console.error("Error logging in:", error);
        errorMessage = "Internal Server Error";
      }
    };
  </script>
  
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
  
        <button type="button" class="btn btn-dark" on:click={loginUser}>Sign In</button>
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
      <p>Don't have an account? <a href="/register">Sign up</a></p>
    </div>
  </div>
  
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
  
    a {
      color: #555555;
    }
  </style>
  