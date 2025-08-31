// receive a signal to disable UI or Enable it (interaction of user with some elements)
{
    function setInputsDisabled(disabled, role = "") { // what's elements to disable or enable  
        // Select all interactive elements you want to disable
        const elements = document.querySelectorAll('input, select, button, tr, .sidebar-menu-item, .breadcrumb-nav');
        elements.forEach(el => {
            
            if (disabled) {
                el.classList.add('disabled');
                el.disabled = true;

                // To fix the issue: the browser does not fire click events on them at all when disabled (input, select, or button)
                // Add 'disabled-parent' to parent if element is input, select, or button (it's safe if the parent is a wrapper to that element)
                if (['INPUT', 'SELECT', 'BUTTON'].includes(el.tagName) && el.parentElement) {
                    el.parentElement.classList.add('disabled-parent');
                }
            } else {
                if (role === "Opérateur") {
                    // If the rule is "Opérateur", remove disable class only from specific elements (input, #userMenuBtn, #logoutBtn)
                    if (el.id === 'scanInput' || el.id === 'userMenuBtn' || el.id === 'logoutBtn') {
                        el.classList.remove('disabled');
                        el.disabled = false;

                        // Remove 'disabled-parent' from parent if element is input, select, or button
                        if (['INPUT', 'SELECT', 'BUTTON'].includes(el.tagName) && el.parentElement) {
                            el.parentElement.classList.remove('disabled-parent');
                        }
                    }
                }
                else {
                    el.classList.remove('disabled');
                    el.disabled = false;

                    // Remove 'disabled-parent' from parent if element is input, select, or button
                    if (['INPUT', 'SELECT', 'BUTTON'].includes(el.tagName) && el.parentElement) {
                        el.parentElement.classList.remove('disabled-parent');
                    }
                }
            }
        
            

            if (!disabled) // if the UI is enabled, focus on scanInput if exist
                document.querySelector('#scanInput')?.focus();
                
            
        });

    }

    ipcRenderer.on("Disable UI", (event, role) => setInputsDisabled(true, role)); // Disable UI
    ipcRenderer.on("Enable UI", (event, role) => setInputsDisabled(false, role)); // Enable UI



    
    // Block click events on .action-card & .breadcrumb-link when disabled
    document.addEventListener('click', function(e) {
        const menuitem = e.target.closest('.sidebar-menu-item.disabled');
        const breadcrumb = e.target.closest('.breadcrumb-nav.disabled');
        const inputselectbutton = e.target.closest('.disabled-parent');
        const tr = e.target.closest('tr.disabled');

        //console.log('menuitem', menuitem, 'breadcrumb', breadcrumb, 'disabled-parent', inputselectbutton);

        if (menuitem || breadcrumb || inputselectbutton || tr) {
            e.stopPropagation();
            e.preventDefault();
            
            const scanInput = document.querySelector('#scanInput');
            if (scanInput && !scanInput.disabled) scanInput.focus();
        }
        
    }, true);
    
}