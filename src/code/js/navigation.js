// go to scans.html
document.addEventListener('DOMContentLoaded', function() {
    // Find the "Scans" button in the sidebar
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
    // Find the "marque" button in the sidebar
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
    // Find the "Scans" button in the sidebar
    const scansBtn = Array.from(document.querySelectorAll('.main-subtoolbar-btn')).find(item =>
        item.textContent.trim().toLowerCase().includes('operations')
    );
    if (scansBtn) {
        scansBtn.addEventListener('click', function() {
            window.location.href = 'operations.html';
        });
    }
});