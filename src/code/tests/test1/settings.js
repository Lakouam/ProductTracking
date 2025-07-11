const { ipcRenderer } = require('electron');

// Load current settings
{
    // when the page is loaded send a request to the main process to get the current settings
    // and fill the form with the current settings
    window.onload = () => {
        ipcRenderer.invoke('get-db-config').then(config => {
            document.getElementById('dbHost').value = config.host || '';
            document.getElementById('dbUser').value = config.user || '';
            document.getElementById('dbPassword').value = config.password || '';
            document.getElementById('dbName').value = config.database || '';
        });
    };
}


// Save settings
{
    document.getElementById('settingsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const config = {
            host: document.getElementById('dbHost').value,
            user: document.getElementById('dbUser').value,
            password: document.getElementById('dbPassword').value,
            database: document.getElementById('dbName').value
        };
        ipcRenderer.invoke('save-db-config', config).then(result => {
            document.getElementById('statusMessage').textContent = result.success
                ? "Settings saved!"
                : "Failed to save settings.";
            // add class error to statusMessage if result.success is false
            document.getElementById('statusMessage').classList.add(result.success ? 'success' : 'error');
        });
    });
}