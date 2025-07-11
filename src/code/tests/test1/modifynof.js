const { show } = require('./ShowData.js');

const ScanData = require('./ScanData.js'); 


// write data in table
let fullData = null;




// receiving Table Data columns and rows
{

    ipcRenderer.invoke('Table Data', 'nof').then(data => {

        // store data in the page
        fullData = data;

        show(undefined, undefined, {is: true, who: 'nof'});
        
            
    });
}




// send add NOF request
{
    document.getElementById('addNOFForm').addEventListener('submit', function(e) {
        e.preventDefault();
        let nofscan = ScanData.scanToObject(document.getElementById('scanNOF').value);
        
        // if nofscan is not null and nofscan.qt equal to 0, make nofscan null
        if (nofscan !== null && nofscan.qt === 0)
            nofscan = null;

        ipcRenderer.invoke('add-nof', nofscan).then(success => {
            
            // Store status in sessionStorage
            sessionStorage.setItem('statusMessage', success ? 'NOF ajouté avec succès !' : 'Échec de l\'ajout du nof.');
            sessionStorage.setItem('statusType', success ? 'success' : 'error');

        });
    });


    
    // On page load, show status message if present
    {
        const msg = sessionStorage.getItem('statusMessage');
        const type = sessionStorage.getItem('statusType');
        if (msg) {
            const statusEl = document.getElementById('statusMessage');
            statusEl.textContent = msg;
            statusEl.classList.remove('success', 'error');
            statusEl.classList.add(type);
            sessionStorage.removeItem('statusMessage');
            sessionStorage.removeItem('statusType');
        }
    }
    
    

}