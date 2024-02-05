<script>
  import { Router, Route } from "svelte-routing";
  import HomePage from "./homePage.svelte";
  import UserLogin from "./userLogin.svelte";
  import UserRegistrationForm from "./userRegistrationForm.svelte";
  import BookManagement from './bookManagement.svelte';
  import BookDetails from "./bookDetails.svelte";
  import AdminDashboard from "./adminDashboard.svelte";
  import UserDashboard from "./userDashboard.svelte";
  import Header from "./header.svelte";
  import Footer from "./footer.svelte";
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
  <Route path="/books/:id">
    <BookDetails />
  </Route>
  <Route path="/admins">
    <AdminDashboard />
  </Route>
  <Route path="/users">
    <UserDashboard />
  </Route>
</Router>


