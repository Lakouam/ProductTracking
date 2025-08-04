// get the current user information and display it in the sidebar
{
    document.addEventListener('DOMContentLoaded', async () => {
        const user = await ipcRenderer.invoke('get-current-user');
        if (user) {
            const nameElem = document.querySelector('.sidebar-user-name');
            const roleElem = document.querySelector('.sidebar-user-role');
            if (nameElem) nameElem.textContent = user.nom;
            if (roleElem) roleElem.textContent = user.role;
        }
    });
}