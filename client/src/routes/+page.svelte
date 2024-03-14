<script>
   import { Router, Route } from "svelte-routing";
   import HomePage from "../components/homePage.svelte";
   import UserLogin from "../components/userLogin.svelte";
   import UserRegistrationForm from "../components/userRegistrationForm.svelte";
   import BookManagement from "../components/bookManagement.svelte";
   import BookDetails from "../components/bookDetails.svelte";
   import AdminDashboard from "../components/adminDashboard.svelte";
   import UserDashboard from "../components/userDashboard.svelte";
   import BookCategories from "../components/bookCategories.svelte";
   import Contact from "../components/contact.svelte";
   import SearchResults from "../components/searchResults.svelte";
</script>

<main>
   <Router>
      <Route path="/">
         <HomePage />
      </Route>
      <Route path="/login">
         <UserLogin />
      </Route>
      <Route path="/users">
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
      <Route path="/q">
         <SearchResults />
      </Route>
   </Router>
</main>

<style>
   main {
      background-color: #f5f5f5;
   }
</style>
