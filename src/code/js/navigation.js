// go to show.html when clicking on app logo
document.addEventListener('DOMContentLoaded', function() {
    const headerLeft = document.querySelector('.header-left');
    if (headerLeft) {
        headerLeft.addEventListener('click', function() {
            window.location.href = 'show.html';
        });
    }
});


// go scanner.html when clicking on scanner button
document.addEventListener('DOMContentLoaded', function() {
    const headerLeft = document.querySelector('.add-btn');
    if (headerLeft) {
        headerLeft.addEventListener('click', function() {
            window.location.href = 'scanner.html';
        });
    }
});