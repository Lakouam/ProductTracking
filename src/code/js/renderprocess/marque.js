const { show } = require('../js/renderprocess/tools/ShowData.js');


// write data in table
let fullData = null;




// receiving Table Data columns and rows
{

    ipcRenderer.invoke('Table Data', 'nof').then(data => {

        // store data in the page
        fullData = data;

        // Retrieve the shared 'nof' value from localStorage
        let sharedNof = localStorage.getItem('shared_nof');
        if (sharedNof === null) 
            sharedNof = "";

        // set the input value to the shared 'nof'
        document.getElementById("search").value = sharedNof;

        show(sharedNof, undefined, {is: true, who: 'nof'}, undefined, undefined, true);
            
    });
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

            show(nof, undefined, {is: true, who: 'nof'}, undefined, undefined, true);

        }
    });
}