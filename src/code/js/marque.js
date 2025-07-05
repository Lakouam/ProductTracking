const { show } = require('../../../ShowData.js');


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