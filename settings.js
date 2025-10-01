const { ipcRenderer } = require('electron');

// Load current settings
window.onload = () => {
    ipcRenderer.invoke('get-db-config').then(config => {
        document.getElementById('dbHost').value = config.host || '';
        document.getElementById('dbUser').value = config.user || '';
        document.getElementById('dbPassword').value = config.password || '';
        document.getElementById('dbName').value = config.database || '';
    });
};

// Show/hide password
document.getElementById('togglePassword').addEventListener('click', function() {
    const pwd = document.getElementById('dbPassword');
    if (pwd.type === 'password') {
        pwd.type = 'text';
        this.textContent = 'Masquer';
    } else {
        pwd.type = 'password';
        this.textContent = 'Afficher';
    }
});

// Test connection
document.getElementById('testBtn').addEventListener('click', function() {
    const config = {
        host: document.getElementById('dbHost').value,
        user: document.getElementById('dbUser').value,
        password: document.getElementById('dbPassword').value,
        database: document.getElementById('dbName').value
    };
    setStatus('Test de connexion en cours...', '');
    ipcRenderer.invoke('test-db-connection', config).then(result => {
        setStatus(result.success ? "Connexion réussie !" : ("Erreur : " + (result.error || "Échec de la connexion.")), result.success ? 'success' : 'error');
    });
});

// Save settings
document.getElementById('settingsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const config = {
        host: document.getElementById('dbHost').value,
        user: document.getElementById('dbUser').value,
        password: document.getElementById('dbPassword').value,
        database: document.getElementById('dbName').value
    };
    ipcRenderer.invoke('save-db-config', config).then(result => {
        setStatus(result.success ? "Paramètres enregistrés !" : "Échec de l'enregistrement.", result.success ? 'success' : 'error');
    });
});

function setStatus(msg, type) {
    const status = document.getElementById('statusMessage');
    status.textContent = msg;
    status.className = type;
}




// Change admin password
document.getElementById('changeAdminPwdForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const oldPwd = document.getElementById('oldAdminPwd').value;
    const newPwd = document.getElementById('newAdminPwd').value;
    const confirmPwd = document.getElementById('confirmAdminPwd').value;
    const status = document.getElementById('adminPwdStatus');

    if (newPwd.length < 8) {
        status.textContent = "Le nouveau mot de passe doit contenir au moins 8 caractères.";
        status.className = "error";
        return;
    }
    if (newPwd !== confirmPwd) {
        status.textContent = "Les mots de passe ne correspondent pas.";
        status.className = "error";
        return;
    }

    const result = await ipcRenderer.invoke('change-admin-password', { oldPassword: oldPwd, newPassword: newPwd });
    if (result.success) {
        status.textContent = "Mot de passe administrateur changé avec succès!";
        status.className = "success";
        this.reset();
    } else {
        status.textContent = result.message || "Échec du changement de mot de passe.";
        status.className = "error";
    }
});