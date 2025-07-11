const { show } = require('./ShowData.js');


// retrieves the 'gamme' parameter from the URL
const params = new URLSearchParams(window.location.search);
const gamme = params.get('gamme');

// write data in table
let fullData = null;




// fill the HTML element 'gammeRef' with the value of 'gamme' if it exists
{
    if (gamme) // Check if 'gamme' parameter exists
        document.getElementById('gammeRef').textContent = gamme;
}




// receiving Table Data columns and rows
{

    ipcRenderer.invoke('Table Data', 'gamme-detail', gamme).then(data => {

        // store data in the page
        fullData = data;

        show();
        
            
    });
}