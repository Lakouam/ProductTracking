const { show } = require('../js/renderprocess/tools/ShowData.js');


// write data in table
let fullData = null;


// retrieves the 'role' parameter from the URL
const params = new URLSearchParams(window.location.search);
const userrole = params.get('role');



// create a function to request the data and show it in the table
function showData(nof) {
    // get data from main process
    ipcRenderer.invoke('Table Data', 'operations', [nof]).then(data => {

        // store data in the page
        fullData = data;

        show(undefined, undefined, undefined, undefined, undefined, undefined, userrole, {is: true});
        
            
    });
}



// receiving Table Data columns and rows
{

    // Retrieve the shared 'nof' value from localStorage
    let sharedNof = localStorage.getItem('shared_nof');
    if (sharedNof === null) 
        sharedNof = "";

    // set the input value to the shared 'nof'
    document.getElementById("search").value = sharedNof;

    // request the data with the shared nof value & show it
    showData(sharedNof);
}





// receiving value of input in 'search' when the user click enter in the input
{
    // click enter on input event
    document.getElementById("search").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            // get nof value
            const nof = document.getElementById("search").value;

            // Save the value in localStorage
            localStorage.setItem('shared_nof', nof);


            // request the data with the new nof value & show it
            showData(nof);

        }
    });
}