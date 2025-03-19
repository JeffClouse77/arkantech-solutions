document.addEventListener('DOMContentLoaded', function() {
    console.log('Fixed blog link handler loaded');
    
    // Get all "Read More" buttons
    const blogLinks = document.querySelectorAll('.service-card .btn-primary');
    
    blogLinks.forEach(link => {
        // Remove original click handlers by cloning 
        const clonedLink = link.cloneNode(true);
        link.parentNode.replaceChild(clonedLink, link);
        
        // Add direct forced navigation
        clonedLink.addEventListener('click', function(event) {
            // Prevent the default (which isn't working correctly)
            event.preventDefault();
            
            // Get the target URL from the href attribute
            const targetUrl = this.getAttribute('href');
            console.log('Navigating directly to:', targetUrl);
            
            // Force navigation to the article page
            window.location.href = targetUrl;
        });
    });
}); 