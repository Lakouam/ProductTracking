// go to scans.html
{
    // When clicking on 'scans' button on the subtoolbar
    document.addEventListener('DOMContentLoaded', function() {
        // Find the "Scans" button in the subtoolbar
        const scansBtn = Array.from(document.querySelectorAll('.main-subtoolbar-btn')).find(item =>
            item.textContent.trim().toLowerCase().includes('scans')
        );
        if (scansBtn) 
            scansBtn.onclick = () => ipcRenderer.send('open-scans');
    });
}



// go to marque.html
{
    // When clicking on 'nof' button on the subtoolbar
    document.addEventListener('DOMContentLoaded', function() {
        // Find the "nof" button in the subtoolbar
        const scansBtn = Array.from(document.querySelectorAll('.main-subtoolbar-btn')).find(item =>
            item.textContent.trim().toLowerCase().includes('n° of')
        );
        if (scansBtn) 
            scansBtn.onclick = () => ipcRenderer.send('open-nof');
    });


    // When clicking on NOF on the breadcrumb
    document.addEventListener('DOMContentLoaded', function() {
        // Find the "nof" element on the breadcrumb
        const scansBtn = Array.from(document.querySelectorAll('.breadcrumb-item')).find(item =>
            item.textContent.trim().toLowerCase().includes('n° of')
        );
        if (scansBtn) 
            scansBtn.onclick = () => ipcRenderer.send('open-nof');
    });


    // When clicking on Nof on the sidebar
    document.addEventListener('DOMContentLoaded', function() {
        // Find the "Nof" element in the sidebar
        const scansBtn = Array.from(document.querySelectorAll('.sidebar-menu-item')).find(item =>
            item.textContent.trim().toLowerCase().includes('n° of')
        );
        if (scansBtn) 
            scansBtn.onclick = () => ipcRenderer.send('open-nof');
    });
}



// go to operations.html
document.addEventListener('DOMContentLoaded', function() {
    // Find the "operations" button in the subtoolbar
    const scansBtn = Array.from(document.querySelectorAll('.main-subtoolbar-btn')).find(item =>
        item.textContent.trim().toLowerCase().includes('operations')
    );
    if (scansBtn) 
        scansBtn.onclick = () => ipcRenderer.send('open-operations');
});


// go to post.html
{
    // When clicking on Post on the sidebar
    document.addEventListener('DOMContentLoaded', function() {
        // Find the "post" element in the sidebar
        const scansBtn = Array.from(document.querySelectorAll('.sidebar-menu-item')).find(item =>
            item.textContent.trim().toLowerCase().includes('poste')
        );
        if (scansBtn) 
            scansBtn.onclick = () => ipcRenderer.send('open-post');
    });


    // When clicking on Post on the breadcrumb
    document.addEventListener('DOMContentLoaded', function() {
        // Find the "post" element on the breadcrumb
        const scansBtn = Array.from(document.querySelectorAll('.breadcrumb-item')).find(item =>
            item.textContent.trim().toLowerCase().includes('poste')
        );
        if (scansBtn) 
            scansBtn.onclick = () => ipcRenderer.send('open-post');
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
        if (scansBtn) 
            scansBtn.onclick = () => ipcRenderer.send('open-gamme');
    });


    // When clicking on Gamme on the sidebar
    document.addEventListener('DOMContentLoaded', function() {
        // Find the "gamme" element on the sidebar
        const scansBtn = Array.from(document.querySelectorAll('.sidebar-menu-item')).find(item =>
            item.textContent.trim().toLowerCase().includes('gamme')
        );
        if (scansBtn) 
            scansBtn.onclick = () => ipcRenderer.send('open-gamme');
    });


    // When clicking on Gamme on the breadcrumb
    document.addEventListener('DOMContentLoaded', function() {
        // Find the "gamme" element on the breadcrumb
        const scansBtn = Array.from(document.querySelectorAll('.breadcrumb-item')).find(item =>
            item.textContent.trim().toLowerCase().includes('gamme')
        );
        if (scansBtn) 
            scansBtn.onclick = () => ipcRenderer.send('open-gamme');
    });
}



// go to scanner.html
{
    // When clicking on 'scanner' on the sidebar
    document.addEventListener('DOMContentLoaded', function() {
        // Find the "scanner" button in the subtoolbar
        const scansBtn = Array.from(document.querySelectorAll('.sidebar-scanner-btn')).find(item =>
            item.textContent.trim().toLowerCase().includes('scanner')
        );
        if (scansBtn) 
            scansBtn.onclick = () => ipcRenderer.send('open-scanner');
    });
}



// go to user.html
{
    // When clicking on 'utilisateurs' on the sidebar
    document.addEventListener('DOMContentLoaded', function() {
        // Find the "users" element in the sidebar
        const scansBtn = Array.from(document.querySelectorAll('.sidebar-menu-item')).find(item =>
            item.textContent.trim().toLowerCase().includes('utilisateurs')
        );
        if (scansBtn) {
            scansBtn.onclick = () => ipcRenderer.send('open-user');
        }
    });


    // When clicking on 'utilisateurs' on the breadcrumb
    document.addEventListener('DOMContentLoaded', function() {
        // Find the "users" element on the breadcrumb
        const scansBtn = Array.from(document.querySelectorAll('.breadcrumb-item')).find(item =>
            item.textContent.trim().toLowerCase().includes('utilisateurs')
        );
        if (scansBtn) {
            scansBtn.onclick = () => ipcRenderer.send('open-user');
        }
    });
}