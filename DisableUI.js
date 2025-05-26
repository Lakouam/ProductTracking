// receive a signal to disable UI or Enable it (interaction of user with some elements)
{
    function setInputsDisabled(disabled) { // what's elements to disable or enable  
        
        // Select all interactive elements you want to disable
        const elements = document.querySelectorAll('input, select, .action-card');
        elements.forEach(el => {
            
            if (disabled) {
                el.classList.add('disabled');
            } else {
                el.classList.remove('disabled');
            }
        
            el.disabled = disabled;

            if (!disabled) // if the UI is enabled, focus on scanInput if exist
                document.querySelector('#scanInput')?.focus();
                
            
        });

    }

    ipcRenderer.on("Disable UI", () => setInputsDisabled(true)); // Disable UI
    ipcRenderer.on("Enable UI", () => setInputsDisabled(false)); // Enable UI



    
    // Block click events on .action-card when disabled
    document.addEventListener('click', function(e) {
        const card = e.target.closest('.action-card.disabled');
        if (card) e.stopPropagation();
    }, true);
    
}