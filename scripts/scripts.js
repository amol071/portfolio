$(document).ready(function() {
    // Smooth scrolling for navigation links
    $('a.nav-link').on('click', function(e) {
        if (this.hash !== "") {
            e.preventDefault();
            const hash = this.hash;

            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function() {
                window.location.hash = hash;
            });
        }
    });

    $('#carouselExampleIndicators').carousel({
        interval: 3000
    });

    $('#contact-form').on('submit', function(e) {
        e.preventDefault();
        alert('Thank you for contacting me!');
        $('#contact-form')[0].reset();
    });

    // Navbar scroll effect
    $(window).scroll(function() {
        if ($(document).scrollTop() > 50) {
            $('#navbar').removeClass('initial').addClass('scrolled');
            $('.navbar-brand').removeClass('initial').addClass('scrolled');
        } else {
            $('#navbar').removeClass('scrolled').addClass('initial');
            $('.navbar-brand').removeClass('scrolled').addClass('initial');
        }

        // Show back to top button
        if ($(document).scrollTop() > $('#about').offset().top - 100) {
            $('#back-to-top').fadeIn();
        } else {
            $('#back-to-top').fadeOut();
        }
    });

    // Back to top button click event
    $('#back-to-top').on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 800);
    });
});
