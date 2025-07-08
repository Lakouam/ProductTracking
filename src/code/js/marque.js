const { show } = require('../js/tools/ShowData.js');


// write data in table
let fullData = null;




// receiving Table Data columns and rows
{

    ipcRenderer.invoke('Table Data', 'nof').then(data => {

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