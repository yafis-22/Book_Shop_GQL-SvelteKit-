<script>
    import Header from './header.svelte';
    import Footer from './footer.svelte';
</script>

<div class="contactbody">
    <Header />
    <section class="container mt-5">
        <h2 class="title text-center">
            <span class="primary">Connect with Us</span>
        </h2>

        <div class="row justify-content-center">
            <!-- Left Side - Image Card and Details -->
            <div class="col-lg-6">
                <div class="card mb-5">
                    <img src="https://scontent.fbom57-1.fna.fbcdn.net/v/t39.30808-6/364667874_6487001854753054_8128779898226105722_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=efb6e6&_nc_ohc=4uCm7zRzQXEAX9mXQoS&_nc_ht=scontent.fbom57-1.fna&oh=00_AfCZ9SCsI4gUZP9hRJK2OsribxIrjVKQEvEyEy606gcAAw&oe=65D73F55"
                        alt="Mohd Yafis Khan" class="card-img-top img-fluid" style="max-width: 200px" />

                    <div class="card-body">
                        <h2 class="card-title name">Mohd Yafis Khan</h2>
                        <p class="card-text role">Full Stack Developer</p>
                    </div>
                    <div class="col-lg-6">
                        <div class="contact-details mt-3 p-3">
                            <h5 class="mb-3">Contact Details</h5>
                            <address>
                                <i class="bi bi-geo-alt"></i> 123 Main St. Anytown, USA 12345<br>
                                <i class="bi bi-telephone"></i> Phone: (123) 456-7890 <br>
                                <i class="bi bi-envelope"></i> Email: info@booklend.com
                            </address>
        
                            <h5 class="mb-3 mt-4">Follow Us</h5>
                            <ul class="list-unstyled list-inline">
                                <li class="list-inline-item"><a href="fb" class="bi bi-facebook"></a> Facebook</li>
                                <li class="list-inline-item"><a href="insta" class="bi bi-twitter"></a> Twitter</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
            </div>

            <!-- Right Side - Contact Details -->
            
        </div>
    </section>
    <Footer />
</div>
