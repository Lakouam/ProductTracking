const { ipcRenderer } = require('electron');


document.getElementById('adminAuthBtn').addEventListener('click', () => {
    const entered = document.getElementById('adminPassword').value;
    // Replace with your secure password check
    if (entered === "yourStrongAdminPassword") {
        ipcRenderer.send('admin-auth-success');
    } else {
        document.getElementById('adminAuthStatus').textContent = "Mot de passe incorrect.";
        document.getElementById('adminPassword').value = '';
    }
});