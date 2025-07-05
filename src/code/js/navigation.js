// go to scans.html
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


// go to marque.html
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
document.addEventListener('DOMContentLoaded', function() {
    // Find the "post" button in the subtoolbar
    const scansBtn = Array.from(document.querySelectorAll('.main-subtoolbar-btn')).find(item =>
        item.textContent.trim().toLowerCase().includes('post')
    );
    if (scansBtn) {
        scansBtn.addEventListener('click', function() {
            window.location.href = 'post.html';
        });
    }
});


// go to marque.html when clicking on Nof on the sidebar
document.addEventListener('DOMContentLoaded', function() {
    // Find the "Nof" element in the sidebar
    const scansBtn = Array.from(document.querySelectorAll('.sidebar-menu-item')).find(item =>
        item.textContent.trim().toLowerCase().includes('nof')
    );
    if (scansBtn) {
        scansBtn.addEventListener('click', function() {
            window.location.href = 'marque.html';
        });
    }
});


// go to post.html when clicking on Post on the sidebar
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