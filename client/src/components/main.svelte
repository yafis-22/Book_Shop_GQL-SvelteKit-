<script>
  import { Router, Route } from "svelte-routing";
  import HomePage from "./homePage.svelte";
  import UserLogin from "./userLogin.svelte";
  import UserRegistrationForm from "./userRegistrationForm.svelte";
  import BookManagement from './bookManagement.svelte';
  import BookDetails from "./bookDetails.svelte";
  import AdminDashboard from "./adminDashboard.svelte";
  import UserDashboard from "./userDashboard.svelte";
  import BookCategories from "./bookCategories.svelte";
  import Contact from "./contact.svelte";
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
  <Route path="/books/category/:category" let:params>
    <BookCategories category={params.category} />
  </Route>
  <Route path="/admins/me">
    <AdminDashboard />
  </Route>
  <Route path="/users/me">
    <UserDashboard />
  </Route>
  <Route path="/contact">
    <Contact />
  </Route>
</Router>


