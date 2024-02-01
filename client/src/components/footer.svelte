<script>
    // Import Bootstrap CSS
    import "bootstrap/dist/css/bootstrap.min.css";
    
    // Import Bootstrap Icons CSS
    import "bootstrap-icons/font/bootstrap-icons.css";

    const bookCategories = ['Fiction', 'Non-Fiction', 'Mystery', 'Science Fiction', 'Romance'];
    const quickLinks = ['Sign In', 'FAQ', 'Terms of Service', 'Privacy Policy'];
</script>

<footer>
    <div class="container">
        <div class="row">
            <div class="col-md-3">
                <h5 class="mb-3">Contact Us</h5>
                <p>
                    <i class="bi bi-geo-alt"></i> 123 Main St. Anytown, USA 12345<br>
                    <i class="bi bi-telephone"></i>Phone: (123) 456-7890 <br>
                    <i class="bi bi-envelope"></i> Email: info@booklend.com
                </p>
        
                <h5 class="mb-3">Follow Us</h5>
                <ul class="list-unstyled list-inline">
                    <li class="list-inline-item"><a href="fb" class="bi bi-facebook"></a> Facebook</li>
                    <li class="list-inline-item"><a href="insta" class="bi bi-twitter"></a> Twitter</li>
                </ul>
            </div>
            <div class="col-md-3">
                <h5 class="mb-3">Categories</h5>
                <ul class="list-unstyled">
                    {#each bookCategories as category}
                        <li><a href="#" >{category}</a></li>
                    {/each}
                </ul>
            </div>
            <div class="col-md-3">
                <h5 class="mb-3">Quick Links</h5>
                <ul class="list-unstyled">
                    {#each quickLinks as link}
                        <li><a href="#" >{link}</a></li>
                    {/each}
                </ul>
            </div>
            <div class="col-md-3">
                <h5 class="mb-3">Subscribe to Our Newsletter</h5>
                <form>
                    <div class="input-group">
                        <input type="email" class="form-control" placeholder="Enter your email address">
                        <div class="input-group-append">
                            <button class="btn btn-primary" type="submit">Subscribe</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</footer>

<style>
    footer {
        background-color: #DEDEDE;
        color: #555555;
        font-size: 14px;
        padding-top: 20px;
    }

    /* Style for the heading */
    h5 {
        color: #333333;
    }

    /* Style for the list items */
    li {
        margin-bottom: 5px;
    }

    /* Style for links */
    a {
        color: #555555;
        text-decoration: none;
    }

    /* Style for icons */
    .bi {
        margin-right: 5px;
    }
</style>
