// retrieves the 'gamme' parameter from the URL and fill the HTML element 'gammeRef' with that value
{
    const params = new URLSearchParams(window.location.search);
    const gamme = params.get('gamme');
    if (gamme) // Check if 'gamme' parameter exists
        document.getElementById('gammeRef').textContent = gamme;
}