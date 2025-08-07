const { show } = require('../js/renderprocess/tools/ShowData.js');

// write data in table
let fullData = null;




// receiving Table Data columns and rows
{

    ipcRenderer.invoke('Table Data', 'gammes').then(data => {

        // store data in the page
        fullData = data;

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