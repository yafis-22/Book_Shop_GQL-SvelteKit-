<script>
  import { Router, Route } from "svelte-routing";
  import HomePage from "./homePage.svelte";
  import UserLogin from "./userLogin.svelte";
  import UserRegistrationForm from "./userRegistrationForm.svelte";
  import BookManagement from './bookManagement.svelte';
  import BookDetails from "./bookDetails.svelte";
  import AdminDashboard from "./adminDashboard.svelte";
  import UserDashboard from "./userDashboard.svelte";
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
  <Route path="/books/:id" let:params>
    <BookDetails bookId={params.id} />
  </Route>
  <Route path="/admins">
    <AdminDashboard />
  </Route>
  <Route path="/users/me">
    <UserDashboard />
  </Route>
</Router>


