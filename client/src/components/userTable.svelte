<script>
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    import authStore from "../stores/authStore";

    let users = [];
    let searchQuery = "";
    let currentPage = 1;
    let totalPages = 1;
    let sortField = "";
    let sortOrder = "";
    let sortOptions = [
        { field: "id", label: "Id" },
        { field: "username", label: "Username" },
        { field: "email", label: "Email" },
        { field: "phoneNumber", label: "Phone Number" },
        { field: "address", label: "Address" },
        { field: "createdAt", label: "Created At" },
        { field: "updatedAt", label: "Updated At" },
        { field: "deletedAt", label: "Deleted At" },
    ];

    let successMessage = "";

    const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:4000/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${get(authStore).userToken}`,
                },
                body: JSON.stringify({
                    query: `
            query GetUsers($page: Int, $pageSize: Int, $search: String, $sortField: String, $sortOrder: String) {
              getAllUsers(page: $page, pageSize: $pageSize, search: $search, sortField: $sortField, sortOrder: $sortOrder) {
                data {
                  id
                  username
                  email
                  phoneNumber
                  address
                  createdAt
                  updatedAt
                  deletedAt
                }
                totalPages
              }
            }
          `,
                    variables: {
                        page: currentPage,
                        pageSize: 12,
                        search: searchQuery,
                        sortField: sortField,
                        sortOrder: sortOrder,
                    },
                }),
            });

            const { data, errors } = await response.json();

            if (errors) {
                console.error(
                    "Error fetching users:",
                    errors[0].extensions.response.body.message,
                );
            } else if (data && data.getAllUsers) {
                users = data.getAllUsers.data || [];
                totalPages = data.getAllUsers.totalPages;
            } else {
                console.error("Error fetching users: Invalid response format");
            }
        } catch (error) {
            console.error("Error fetching users:", error.message);
        }
    };

    onMount(fetchUsers);

    const handleSearch = () => {
        currentPage = 1; // Reset to the first page when performing a new search
        fetchUsers();
    };

    const handleSort = () => {
        fetchUsers();
    };

    const handlePageChange = (newPage) => {
        currentPage = newPage;
        fetchUsers();
    };

    const handleRestore = async (userId) => {
        try {
            const response = await fetch("http://localhost:4000/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${get(authStore).userToken}`,
                },
                body: JSON.stringify({
                    query: `
                       mutation ActivateUser($id: ID!) {
                         activateUser(id: $id) {
                           message
                           data {
                             id
                             username
                             phoneNumber
                             email
                             address
                             password
                             role
                             createdAt
                             updatedAt
                             deletedAt
                           }
                         }
                       }
                       `,
                    variables: {
                        id: userId,
                    },
                }),
            });

            const { data, errors } = await response.json();

            if (errors) {
                console.error(
                    `Error restoring user with ID ${userId}:`,
                    errors[0],
                );
            } else {
                fetchUsers();
                successMessage = "User restored successfully";
                setTimeout(() => {
                    successMessage = "";
                }, 3000);
            }
        } catch (error) {
            console.error(`Error restoring user with ID ${userId}:`, error);
        }
    };
</script>

<div>
    <h2 class="mt-4 mb-4">All Users</h2>

    {#if successMessage}
        <div class="alert alert-success">
            <p class="font-weight-bold">{successMessage}</p>
        </div>
    {/if}

    <div class="mb-3 col-md-6 offset-md-3">
        <div class="input-group">
            <input
                type="text"
                class="form-control"
                bind:value={searchQuery}
                placeholder="Search by username, address..."
            />
            <div class="input-group-append">
                <button
                    class="btn btn-outline-secondary"
                    type="button"
                    on:click={handleSearch}>Search</button
                >
            </div>
        </div>
    </div>

    <div class="d-flex justify-content-end m-4">
        <label for="sortField">Sort by:</label>
        <select
            class="custom-select mr-sm-2"
            bind:value={sortField}
            on:change={handleSort}
            id="sortField"
        >
            {#each sortOptions as option (option.field)}
                <option value={option.field}>{option.label}</option>
            {/each}
        </select>

        <label for="sortOrder">Order:</label>
        <select
            class="custom-select mr-sm-2"
            bind:value={sortOrder}
            on:change={handleSort}
            id="sortOrder"
        >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
        </select>
    </div>

    {#if users.length > 0}
        <table class="table">
            <thead>
                <tr>
                    <th scope="col" on:click={() => handleSort("id")}>Id</th>
                    <th scope="col" on:click={() => handleSort("username")}
                        >Username</th
                    >
                    <th scope="col" on:click={() => handleSort("email")}
                        >Email</th
                    >
                    <th scope="col" on:click={() => handleSort("phoneNumber")}
                        >Phone Number</th
                    >
                    <th scope="col" on:click={() => handleSort("address")}
                        >Address</th
                    >
                    <th scope="col" on:click={() => handleSort("createdAt")}
                        >Created At</th
                    >
                    <th scope="col" on:click={() => handleSort("updatedAt")}
                        >Updated At</th
                    >
                    <th scope="col" on:click={() => handleSort("deletedAt")}
                        >Deleted At</th
                    >
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                {#each users as User (User.id)}
                    <tr>
                        <th scope="row">{User.id}</th>
                        <td>{User.username}</td>
                        <td>{User.email}</td>
                        <td>{User.phoneNumber}</td>
                        <td>{User.address}</td>
                        <td>{User.createdAt}</td>
                        <td>{User.updatedAt}</td>
                        <td>{User.deletedAt}</td>
                        <td>
                            {#if User.deletedAt != null}
                                <button
                                    type="button"
                                    class="btn btn-secondary btn-sm"
                                    on:click={() => handleRestore(User.id)}
                                    >Restore</button
                                >
                            {/if}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>

        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
                {#if currentPage > 1}
                    <li class="page-item">
                        <button
                            class="page-link"
                            on:click={() => handlePageChange(currentPage - 1)}
                            >&lt; Prev</button
                        >
                    </li>
                {/if}

                {#if totalPages <= 7}
                    {#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
                        <li class="page-item">
                            <button
                                class="page-link"
                                on:click={() => handlePageChange(page)}
                                class:selected={page === currentPage}
                                >{page}</button
                            >
                        </li>
                    {/each}
                {:else if currentPage <= 4}
                    {#each Array.from({ length: 5 }, (_, i) => i + 1) as page}
                        <li class="page-item">
                            <button
                                class="page-link"
                                on:click={() => handlePageChange(page)}
                                class:selected={page === currentPage}
                                >{page}</button
                            >
                        </li>
                    {/each}
                    <li class="page-item">
                        <span class="page-link">...</span>
                    </li>
                    <li class="page-item">
                        <button
                            class="page-link"
                            on:click={() => handlePageChange(totalPages)}
                            >{totalPages}</button
                        >
                    </li>
                {:else if currentPage > totalPages - 4}
                    <li class="page-item">
                        <button
                            class="page-link"
                            on:click={() => handlePageChange(1)}>1</button
                        >
                    </li>
                    <li class="page-item">
                        <span class="page-link">...</span>
                    </li>
                    {#each Array.from({ length: 5 }, (_, i) => totalPages - 4 + i) as page}
                        <li class="page-item">
                            <button
                                class="page-link"
                                on:click={() => handlePageChange(page)}
                                class:selected={page === currentPage}
                                >{page}</button
                            >
                        </li>
                    {/each}
                {:else}
                    <li class="page-item">
                        <button
                            class="page-link"
                            on:click={() => handlePageChange(1)}>1</button
                        >
                    </li>
                    <li class="page-item">
                        <span class="page-link">...</span>
                    </li>
                    {#each Array.from({ length: 3 }, (_, i) => currentPage - 1 + i) as page}
                        <li class="page-item">
                            <button
                                class="page-link"
                                on:click={() => handlePageChange(page)}
                                class:selected={page === currentPage}
                                >{page}</button
                            >
                        </li>
                    {/each}
                    <li class="page-item">
                        <span class="page-link">...</span>
                    </li>
                    <li class="page-item">
                        <button
                            class="page-link"
                            on:click={() => handlePageChange(totalPages)}
                            >{totalPages}</button
                        >
                    </li>
                {/if}

                {#if currentPage < totalPages}
                    <li class="page-item">
                        <button
                            class="page-link"
                            on:click={() => handlePageChange(currentPage + 1)}
                            >Next &gt;</button
                        >
                    </li>
                {/if}
            </ul>
        </nav>
    {:else}
        <p>No users available.</p>
    {/if}
</div>

<style>
    .page-link {
        color: black;
    }
    .alert {
        margin-top: 20px;
        border-radius: 4px;
    }

    .btn-sm {
        padding: 0.25rem 0.5rem;
        font-size: 0.875rem;
    }

    .pagination {
        margin-top: 1rem;
    }
</style>
