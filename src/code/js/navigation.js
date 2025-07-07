// go to scans.html
{
    // When clicking on 'scans' button on the subtoolbar
    document.addEventListener('DOMContentLoaded', function() {
        // Find the "Scans" button in the subtoolbar
        const scansBtn = Array.from(document.querySelectorAll('.main-subtoolbar-btn')).find(item =>
            item.textContent.trim().toLowerCase().includes('scans')
        );
        if (scansBtn) {
            scansBtn.addEventListener('click', function() {
                window.location.href = 'scans.html';
            });
        }
    });


    // When clicking on Nof on the sidebar
    document.addEventListener('DOMContentLoaded', function() {
        // Find the "Nof" element in the sidebar
        const scansBtn = Array.from(document.querySelectorAll('.sidebar-menu-item')).find(item =>
            item.textContent.trim().toLowerCase().includes('nof')
        );
        if (scansBtn) {
            scansBtn.addEventListener('click', function() {
                window.location.href = 'scans.html';
            });
        }
    });
}



// go to marque.html
{
    // When clicking on 'marque' button on the subtoolbar
    document.addEventListener('DOMContentLoaded', function() {
        // Find the "marque" button in the subtoolbar
        const scansBtn = Array.from(document.querySelectorAll('.main-subtoolbar-btn')).find(item =>
            item.textContent.trim().toLowerCase().includes('marque')
        );
        if (scansBtn) {
            scansBtn.addEventListener('click', function() {
                window.location.href = 'marque.html';
            });
        }
    });
}



// go to operations.html
document.addEventListener('DOMContentLoaded', function() {
    // Find the "operations" button in the subtoolbar
    const scansBtn = Array.from(document.querySelectorAll('.main-subtoolbar-btn')).find(item =>
        item.textContent.trim().toLowerCase().includes('operations')
    );
    if (scansBtn) {
        scansBtn.addEventListener('click', function() {
            window.location.href = 'operations.html';
        });
    }
});


// go to post.html
{
    // When clicking on 'post' button on the subtoolbar
    document.addEventListener('DOMContentLoaded', function() {
        // Find the "post" button on the subtoolbar
        const scansBtn = Array.from(document.querySelectorAll('.main-subtoolbar-btn')).find(item =>
            item.textContent.trim().toLowerCase().includes('post')
        );
        if (scansBtn) {
            scansBtn.addEventListener('click', function() {
                window.location.href = 'post.html';
            });
        }
    });


    // When clicking on Post on the sidebar
    document.addEventListener('DOMContentLoaded', function() {
        // Find the "post" element in the sidebar
        const scansBtn = Array.from(document.querySelectorAll('.sidebar-menu-item')).find(item =>
            item.textContent.trim().toLowerCase().includes('post')
        );
        if (scansBtn) {
            scansBtn.addEventListener('click', function() {
                window.location.href = 'post.html';
            });
        }
    });
}



// go to gamme.html
{
    // When clicking on the 'gamme' button on the subtoolbar
    document.addEventListener('DOMContentLoaded', function() {
        // Find the "gamme" button on the subtoolbar
        const scansBtn = Array.from(document.querySelectorAll('.main-subtoolbar-btn')).find(item =>
            item.textContent.trim().toLowerCase().includes('gamme')
        );
        if (scansBtn) {
            scansBtn.addEventListener('click', function() {
                window.location.href = 'gamme.html';
            });
        }
    });


    // When clicking on Gamme on the sidebar
    document.addEventListener('DOMContentLoaded', function() {
        // Find the "gamme" element on the sidebar
        const scansBtn = Array.from(document.querySelectorAll('.sidebar-menu-item')).find(item =>
            item.textContent.trim().toLowerCase().includes('gamme')
        );
        if (scansBtn) {
            scansBtn.addEventListener('click', function() {
                window.location.href = 'gamme.html';
            });
        }
    });
}