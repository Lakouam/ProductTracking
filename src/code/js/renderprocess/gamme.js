const { show } = require('../js/renderprocess/tools/ShowData.js');

// write data in table
let fullData = null;



// retrieves the 'role' parameter from the URL
const params = new URLSearchParams(window.location.search);
const userrole = params.get('role');



// receiving Table Data columns and rows
{

    ipcRenderer.invoke('Table Data', 'gammes').then(data => {

        // store data in the page
        fullData = data;


        // show the Ajouter button if the user is an Admin
        if (userrole === 'Admin')
            document.querySelector('.main-subtoolbar-sort').style.display = 'flex';
        

        show(undefined, undefined, undefined, undefined, {is: true, who: "gamme"});
        
            
    });
}




// receiving value of input in 'search' when the user click enter in the input
{
    // click enter on input event
    document.getElementById("search").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {

            event.preventDefault();

            // get gamme value
            const gamme = document.getElementById("search").value;

            show(undefined, undefined, undefined, gamme, {is: true, who: "gamme"});

        }
    });
}




// on label click, add gammes
{
    document.querySelector('.main-subtoolbar-sort-label').addEventListener('click', () => {
        ipcRenderer.send('insert-gamme');
    });
}