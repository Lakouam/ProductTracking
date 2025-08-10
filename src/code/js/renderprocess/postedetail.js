const { show } = require('../js/renderprocess/tools/ShowData.js');


// retrieves the 'gamme' parameter from the URL
const params = new URLSearchParams(window.location.search);
const poste = params.get('poste');

// write data in table
let fullData = null;




// fill the HTML elements 'NOF, gamme, qt' with the values of 'nof, gamme, qt' if it exists
{
    // fill all the HTML element '.gammeRef' with the value of 'gamme'
    const POSTE = document.querySelectorAll('.poste');
    POSTE.forEach(element => {
        element.textContent = poste;
    });
}




// receiving Table Data columns and rows
{

    ipcRenderer.invoke('Table Data', 'poste-detail', [poste]).then(data => {

        // store data in the page
        fullData = data;

        show();
        
            
    });
}





// receiving value of input in 'search' when the user click enter in the input
{
    // click enter on input event
    document.getElementById("search").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            // get nof value
            const nof = document.getElementById("search").value;

            show(nof);

        }
    });
}