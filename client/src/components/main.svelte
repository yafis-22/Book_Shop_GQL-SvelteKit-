<script>
  import { Router, Route } from "svelte-routing";
  import HomePage from "./homePage.svelte";
  import UserLogin from "./userLogin.svelte";
  import UserRegistrationForm from "./userRegistrationForm.svelte";
  import BookManagement from './bookManagement.svelte';
  import AdminDashboard from "./adminDashboard.svelte";
</script>

<Router>
  <Route path="/">
    <HomePage />
  </Route>
  <Route path="/login">
    <UserLogin />
  </Route>
  <Route path="/register">
    <UserRegistrationForm />
  </Route>
  <Route path="/books">
    <BookManagement />
  </Route>
  <Route path="/admin">
    <AdminDashboard />
  </Route>
</Router>
