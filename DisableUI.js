// receive a signal to disable UI or Enable it (interaction of user with some elements)
{
    function setInputsDisabled(disabled) { // what's elements to disable or enable  
        // disable click events on the body
        document.body.style.pointerEvents = disabled ? 'none' : 'auto';

    }

    ipcRenderer.on("Disable UI", () => setInputsDisabled(true)); // Disable UI
    ipcRenderer.on("Enable UI", () => setInputsDisabled(false)); // Enable UI
}