<script>
    import authStore from "../stores/authStore";

    export let book;
    export let showModal;
    export let onCloseModal;
    let lendSuccess = false;

    const lendBook = async () => {
        try {
            const response = await fetch(
                `http://localhost:3002/api/v1/books/lend/${book.id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${$authStore.userToken}`,
                    },
                },
            );

            if (response.ok) {
                const data = await response.json();
                console.log("Book lent successfully:", data);

                // Display lend success message
                lendSuccess = true;

                // Close the modal and trigger the onCloseModal callback after a delay
                setTimeout(() => {
                    lendSuccess = false;
                    showModal = false;
                    onCloseModal();
                }, 2000); // Adjust the delay time as needed
            } else {
                const errorData = await response.json();

                // Check for the specific error message indicating that the book is already lent
                if (
                    errorData.message ===
                    "User has already lent a book with the same ID"
                ) {
                    alert("Book already lent");
                } else {
                    console.error("Error lending book:", errorData.message);
                    alert("Please sign in to lend the book");
                }
            }
        } catch (error) {
            console.error("Error lending book:", error);
        }
    };
</script>

<div class="modal" style="display: {showModal ? 'block' : 'none'};">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{book.title}</h5>
                <button
                    type="button"
                    class="btn-close"
                    aria-label="Close"
                    on:click={() => {
                        lendSuccess = false;
                        showModal = false;
                        onCloseModal();
                    }}
                ></button>
            </div>
            <div class="modal-body">
                {#if lendSuccess}
                    <p class="text-success">Book successfully lended!</p>
                {:else}
                    <p>Author: {book.author}</p>
                    <p>Lending Price: {book.lendingPrice}</p>
                    <p>
                        <strong>After 9 Days you will be charged $5/day</strong>
                    </p>
                {/if}
            </div>
            <div class="modal-footer">
                {#if lendSuccess}
                    <button
                        type="button"
                        class="btn btn-secondary"
                        on:click={() => {
                            lendSuccess = false;
                            showModal = false;
                            onCloseModal();
                        }}
                    >
                        Close
                    </button>
                {:else}
                    <button class="btn btn-dark" on:click={lendBook}>
                        Lend
                    </button>
                {/if}
            </div>
        </div>
    </div>
</div>
