// handles the display of the user menu and the logout action.
document.addEventListener('DOMContentLoaded', () => {
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userMenuPopup = document.getElementById('userMenuPopup');
    const logoutBtn = document.getElementById('logoutBtn');

    // Toggle popup
    userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userMenuPopup.style.display = userMenuPopup.style.display === 'none' ? 'block' : 'none';
    });

    // Hide popup when clicking outside
    document.addEventListener('click', (e) => {
        if (userMenuPopup.style.display === 'block' && !userMenuPopup.contains(e.target) && e.target !== userMenuBtn) {
            userMenuPopup.style.display = 'none';
        }
    });

    // Logout action
    logoutBtn.addEventListener('click', () => {
        // Add your logout logic here
        console.log('test logout');
    });
});