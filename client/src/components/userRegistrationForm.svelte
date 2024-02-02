<script> 
 import "bootstrap/dist/css/bootstrap.min.css"; 
    let formData = {
      username: '',
      password: '',
      email: '',
      phoneNumber: '',
      address: '',
      role: 'user', // Default role as 'user'
    };
  
    let errorMessage = '';
  
    const registerUser = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/v1/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('User registered successfully:', data);
          
        } else {
          const errorData = await response.json();
          errorMessage = errorData.message;
        }
      } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal Server Error'); 
      }
    };
  
  </script>
  
  <div class="container">
    <h2>User Registration</h2>
  
    {#if errorMessage} 
      <div class="alert alert-danger" role="alert">
        {errorMessage}
      </div>
    {/if} 
  
    <form>
        <div class="card">
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input type="text" class="form-control" id="username" bind:value={formData.username} required>
      </div>
  
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input type="password" class="form-control" id="password" bind:value={formData.password} required>
      </div>
  
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" class="form-control" id="email" bind:value={formData.email} required>
      </div>
  
      <div class="mb-3">
        <label for="phoneNumber" class="form-label">Phone Number</label>
        <input type="tel" class="form-control" id="phoneNumber" bind:value={formData.phoneNumber} required>
      </div>
  
      <div class="mb-3">
        <label for="address" class="form-label">Address</label>
        <input type="text" class="form-control" id="address" bind:value={formData.address} required>
      </div>
  
      <div class="mb-3">
        <label for="role" class="form-label">Role</label>
        <select class="form-control" id="role" bind:value={formData.role}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
  
      <button type="button" class="btn btn-dark" on:click={registerUser}>Register</button>
      </div>
    </form>
  </div> 

  <style>
    .container {
      max-width: 400px;
      margin: auto;
      padding: 20px;
    }
  
    .card {
      border: 1px solid #ccc;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 20px;
    }
  
    h2 {
      text-align: center;
    }
  
    form {
      margin-top: 20px;
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
        background-color: #F5F5F5;
    }

    .form-label{
        color: #5A5A5A;
    }
  </style>
  