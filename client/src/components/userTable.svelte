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
            const response = await fetch(
                `http://localhost:3002/api/v1/users?page=${currentPage}&pageSize=12&search=${searchQuery}&sortField=${sortField}&sortOrder=${sortOrder}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${get(authStore).userToken}`,
                    },
                },
            );

            if (response.ok) {
                const data = await response.json();
                users = data.data;
                totalPages = data.totalPages;
            } else {
                console.error("Error fetching users:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
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
            const response = await fetch(
                `http://localhost:3002/api/v1/users/${userId}/restore`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${get(authStore).userToken}`,
                    },
                },
            );

            if (response.ok) {
                const data = await response.json();

                fetchUsers();
                successMessage = "User restored successfully";
            } else {
                console.error("Error restoring User:", response.statusText);
            }
        } catch (error) {
            console.error("Error restoring User:", error);
        }
    };
</script>

<div>
    <h1>All users</h1>

    {#if successMessage}
        <div class="notification">
            <p class="success-message">{successMessage}</p>
        </div>
    {/if}

    <div class="mb-3">
        <input
            type="text"
            bind:value={searchQuery}
            placeholder="Search by username, address, category..."
        />
        <button on:click={handleSearch}>Search</button>
    </div>

    <div class="mb-3">
        <label for="sortField">Sort by:</label>
        <select bind:value={sortField} on:change={handleSort} id="sortField">
            {#each sortOptions as option (option.field)}
                <option value={option.field}>{option.label}</option>
            {/each}
        </select>

        <label for="sortOrder">Order:</label>
        <select bind:value={sortOrder} on:change={handleSort} id="sortOrder">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
        </select>
    </div>

    {#if users.length > 0}
        <table class="table">
            <thead>
                <tr>
                    <th on:click={() => handleSort("id")}>Id</th>
                    <th on:click={() => handleSort("username")}>Username</th>
                    <th on:click={() => handleSort("email")}>Email</th>
                    <th on:click={() => handleSort("phoneNumber")}
                        >Phone Number</th
                    >
                    <th on:click={() => handleSort("address")}>Address</th>
                    <th on:click={() => handleSort("createdAt")}>Created At</th>
                    <th on:click={() => handleSort("updatedAt")}>Updated At</th>
                    <th on:click={() => handleSort("deletedAt")}>Deleted At</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {#each users as User (User.id)}
                    <tr>
                        <td>{User.id}</td>
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
                                    class="btn btn-secondary"
                                    on:click={() => handleRestore(User.id)}
                                    >Restore</button
                                >
                            {/if}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>

        <div class="pagination">
            {#if currentPage > 1}
                <button on:click={() => handlePageChange(currentPage - 1)}
                    >&lt; Prev</button
                >
            {/if}

            {#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
                <button
                    on:click={() => handlePageChange(page)}
                    class:selected={page === currentPage}>{page}</button
                >
            {/each}

            {#if currentPage < totalPages}
                <button on:click={() => handlePageChange(currentPage + 1)}
                    >Next &gt;</button
                >
            {/if}
        </div>
    {:else}
        <p>No users available.</p>
    {/if}
</div>

<style>
    .table {
        width: 100%;
        margin-bottom: 1rem;
        color: #212529;
        border-collapse: collapse;
    }

    .table,
    .table th,
    .table td {
        border: 1px solid #dee2e6;
    }

    .table th,
    .table td {
        padding: 0.75rem;
        vertical-align: top;
        cursor: pointer;
    }

    .table thead th {
        vertical-align: bottom;
        border-bottom: 2px solid #dee2e6;
        background-color: #f8f9fa;
    }

    .table tbody tr:hover {
        background-color: #f8f9fa;
    }

    .table td {
        text-align: left;
    }

    .pagination {
        margin-top: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .pagination button {
        margin-right: 0.5rem;
        cursor: pointer;
        padding: 0.5rem 1rem;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 4px;
        transition: background-color 0.3s;
    }

    .pagination button:hover {
        background-color: #0056b3;
    }

    .pagination button.selected {
        font-weight: bold;
        text-decoration: underline;
        background-color: #0056b3;
    }

    .btn {
        padding: 0.5rem 1rem;
        margin-right: 0.5rem;
        cursor: pointer;
        border: none;
        border-radius: 4px;
        transition: background-color 0.3s;
    }

    .btn:hover {
        opacity: 0.9;
    }

    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #28a745;
        color: #fff;
        padding: 10px;
        border-radius: 4px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        z-index: 999;
    }

    .success-message {
        font-weight: bold;
    }
</style>
