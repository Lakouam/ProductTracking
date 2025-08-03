// This script handles the login functionality for the application
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const errorDiv = document.getElementById('loginError');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorDiv.style.display = "none";

        const nom = document.getElementById('loginNom').value.trim();
        const matricule = document.getElementById('loginMatricule').value.trim();

        if (!nom || !matricule) {
            errorDiv.textContent = "Merci de remplir tous les champs.";
            errorDiv.style.display = "block";
            return;
        }

        // Send login data to main process and wait for response
        const response = await ipcRenderer.invoke('login-user', { nom, matricule });

        if (response && response.success) {
            console.log("Login successful:");
        } else {
            errorDiv.textContent = response && response.message
                ? response.message
                : "Nom ou matricule incorrect.";
            errorDiv.style.display = "block";
        }
    });
});