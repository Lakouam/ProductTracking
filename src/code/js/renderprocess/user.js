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





// Toggle form visibility on label click
{
    // show/hide the form when the label is clicked
    document.querySelector('.main-subtoolbar-sort-label').addEventListener('click', () => {
        const form = document.getElementById('addUserForm');
        form.style.display = form.style.display === 'none' ? 'flex' : 'none';
    });


    // handle the send button click (hide the form)
    document.getElementById('addUserSendBtn').addEventListener('click', () => {
        const nom = document.getElementById('userNameInput').value.trim();
        const matricule = document.getElementById('userMatriculeInput').value.trim();
        const role = document.getElementById('userRoleSelect').value;

        // TODO: Validate and send data (e.g., via ipcRenderer)
        if (nom && matricule && role) {
            // Send data to main process or handle as needed
            console.log({ nom, matricule, role });
            ipcRenderer.invoke('add-user', { nom, matricule, role }).then(response => {
                if (response.success) {
                    // Optionally, update the UI to reflect the new user
                    console.log('User added successfully:', response.data);
                }
                else {
                    // Handle error response
                    console.error('Error adding user:', response.error);
                }
            });

            // Hide form after sending
            document.getElementById('addUserForm').style.display = 'none';
        } else {
            // Optionally show an error message
            console.log('Veuillez remplir tous les champs.');
        }
    });
}
