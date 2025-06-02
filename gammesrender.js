const { show } = require('./ShowData.js');


// write data in table
let fullData = null;




// receiving Table Data columns and rows
{

    ipcRenderer.invoke('Table Data', 'gammes').then(data => {

        // store data in the page
        fullData = data;

        show(undefined, undefined, undefined, undefined, true);
        
            
    });
}




// receiving values of inputs in 'selections' form when the user click enter in any of the input
{
    // click enter on inputs event
    document.getElementById("selections").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {

            event.preventDefault();

            // get gamme value
            const gamme = document.getElementById("gamme").value;

            show(undefined, undefined, undefined, gamme, true);

        }
    });
}
