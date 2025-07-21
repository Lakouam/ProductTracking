const { show } = require('../js/renderprocess/tools/ShowData.js');


// retrieves the 'gamme' parameter from the URL
const params = new URLSearchParams(window.location.search);
const nof = params.get('nof');
const gamme = params.get('gamme');
const qt = params.get('qt');

// write data in table
let fullData = null;




// fill the HTML elements 'NOF, gamme, qt' with the values of 'nof, gamme, qt' if it exists
{
    // fill all the HTML element '.gammeRef' with the value of 'gamme'
    const NOF = document.querySelectorAll('.NOF');
    NOF.forEach(element => {
        element.textContent = nof;
    });

    // fill all the HTML element '.gamme' with the value of 'gamme'
    const gammeRef = document.querySelectorAll('.gamme');
    gammeRef.forEach(element => {
        element.textContent = gamme;
    });

    // fill all the HTML element '.qt' with the value of 'qt'
    const qtElements = document.querySelectorAll('.qt');
    qtElements.forEach(element => {
        element.textContent = qt;
    });
}




// receiving Table Data columns and rows
{

    ipcRenderer.invoke('Table Data', 'nof-detail', nof).then(data => {

        // store data in the page
        fullData = data;

        show();
        
            
    });
}