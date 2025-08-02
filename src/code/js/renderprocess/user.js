const { show } = require('../js/renderprocess/tools/ShowData.js');


// write data in table
let fullData = null;




// receiving Table Data columns and rows
{

    ipcRenderer.invoke('Table Data', 'user').then(data => {

        // store data in the page
        fullData = data;

        show();
        
            
    });
}