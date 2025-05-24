// send message to main to open dashboard window
{
    document.getElementById('goDashboard').onclick = (e) => {
        e.preventDefault();
        ipcRenderer.send('open-dashboard');
    };
}