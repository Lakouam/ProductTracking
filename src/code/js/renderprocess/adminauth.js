const { ipcRenderer } = require('electron');




const adminAuthBtn = document.getElementById('adminAuthBtn');
const adminPasswordInput = document.getElementById('adminPassword');



adminAuthBtn.addEventListener('click', async () => {
    const entered = adminPasswordInput.value;
    const isValid = await ipcRenderer.invoke('check-admin-password', entered);

    if (isValid) {
        ipcRenderer.send('admin-auth-success');
        window.close(); // Close the auth window
    } else {
        document.getElementById('adminAuthStatus').textContent = "Mot de passe incorrect.";
        adminPasswordInput.value = '';
    }
});



// Optionally, allow pressing Enter to submit
adminPasswordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') adminAuthBtn.click();
});