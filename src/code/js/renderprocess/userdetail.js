const { show } = require('../js/renderprocess/tools/ShowData.js');


// retrieves the 'gamme' parameter from the URL
const params = new URLSearchParams(window.location.search);
const nom = params.get('nom');
const matricule = params.get('matricule');
const role = params.get('role');

// write data in table
let fullData = null;




// fill the HTML elements 'NOF, gamme, qt' with the values of 'nof, gamme, qt' if it exists
{
    // fill all the HTML element '.gammeRef' with the value of 'gamme'
    const MATRICULE = document.querySelectorAll('.matricule');
    MATRICULE.forEach(element => {
        element.textContent = matricule;
    });

    // fill all the HTML element '.gamme' with the value of 'gamme'
    const NOM = document.querySelectorAll('.nom');
    NOM.forEach(element => {
        element.textContent = nom;
    });

    // fill all the HTML element '.qt' with the value of 'qt'
    const ROLE = document.querySelectorAll('.role');
    ROLE.forEach(element => {
        element.textContent = role;
    });
}




// receiving Table Data columns and rows
{

    ipcRenderer.invoke('Table Data', 'user-detail', [nom, matricule]).then(data => {

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