const { show } = require('./ShowData.js');


// write data in table
let fullData = null;




// receiving Table Data columns and rows
{

    ipcRenderer.invoke('Table Data', 'post').then(data => {

        // store data in the page
        fullData = data;

        show(undefined, undefined, {is: true, who: 'post'});
        
            
    });
}




// send add post request
{
    document.getElementById('addPostForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const postName = document.getElementById('postName').value;
        
        ipcRenderer.invoke('add-post', postName).then(success => {
            
            // Store status in sessionStorage
            sessionStorage.setItem('statusMessage', success ? 'Post ajouté avec succès !' : 'Échec de l\'ajout du poste.');
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