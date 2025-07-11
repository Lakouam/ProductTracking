const { show } = require('./ShowData.js');


// write data in table
let fullData = null;




// receiving Table Data columns and rows
{

    ipcRenderer.invoke('Table Data').then(data => {

        // store data in the page
        fullData = data;

        show();
        
            
    });
}





// receiving values of inputs in 'selections' form when the user click enter in any of the input
{
    // click enter on inputs event
    document.getElementById("selections").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            // get nof & postCharge value
            const nof = document.getElementById("nof").value;
            const postCharge = document.getElementById("postCharge").value;

            show(nof, postCharge);

        }
    });
}





