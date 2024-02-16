<!-- returnBook.svelte -->
<script>
    import authStore from "../stores/authStore";

    export let book;
    export let showModal;
    export let onCloseModal;
    let returnSuccess = false;

    const returnBook = async () => {
        try {
            const response = await fetch(
                `http://localhost:3002/api/v1/books/return/${book.id}`,
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
                console.log("Book returned successfully:", data);

                // Display return success message
                returnSuccess = true;

                // Close the modal and trigger the onCloseModal callback after a delay
                setTimeout(() => {
                    returnSuccess = false;
                    showModal = false;
                    onCloseModal();
                }, 2000); // Adjust the delay time as needed
            } else {
                const errorData = await response.json();
                console.error("Error returning book:", errorData.message);
            }
        } catch (error) {
            console.error("Error returning book:", error);
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
                        returnSuccess = false;
                        showModal = false;
                        onCloseModal();
                    }}
                ></button>
            </div>
            <div class="modal-body">
                {#if returnSuccess}
                    <p class="text-success">Book successfully returned!</p>
                {:else}
                    <p>Author: {book.author}</p>
                    <p>Initial Charge: ${book.initialCharge}</p>
                    <p>Additional Charge: ${book.additionalCharge}</p>
                    <p>Total Charge: ${book.totalCharge}</p>
                    <p>Days Lended: {book.days}</p>
                {/if}
            </div>
            <div class="modal-footer">
                {#if returnSuccess}
                    <button
                        type="button"
                        class="btn btn-secondary"
                        on:click={() => {
                            returnSuccess = false;
                            showModal = false;
                            onCloseModal();
                        }}
                    >
                        Close
                    </button>
                {:else}
                    <button class="btn btn-success" on:click={returnBook}>
                        Return
                    </button>
                {/if}
            </div>
        </div>
    </div>
</div>
