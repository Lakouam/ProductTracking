const { show } = require('../js/renderprocess/tools/ShowData.js');


// write data in table
let fullData = null;




// receiving Table Data columns and rows
{

    ipcRenderer.invoke('Table Data', 'user').then(data => {

        // store data in the page
        fullData = data;

        show(undefined, undefined, {is: true, who: 'user'}, undefined, {is: true, who: 'user'});
        
            
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
        const nom = document.getElementById('userNameInput').value.trim(); // Get the user name input value without leading/trailing spaces
        const matricule = document.getElementById('userMatriculeInput').value.trim(); // Get the user matricule input value without leading/trailing spaces
        const role = document.getElementById('userRoleSelect').value;
        
        // Make the first letter of each word in the name uppercase and remove extra spaces
        const formattedNom = nom
            .split(' ')
            .filter(word => word.length > 0)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        

        // TODO: Validate and send data (e.g., via ipcRenderer)
        if (nom && matricule && role) {
            // Send data to main process or handle as needed
            ipcRenderer.invoke('add-user', { nom: formattedNom, matricule, role }).then(response => {
                if (response.success) {
                    // Optionally, update the UI to reflect the new user
                    console.log('User added successfully:', response.data);

                    // Hide form after sending
                    document.getElementById('addUserForm').style.display = 'none';
                }
                else {
                    // Handle error response
                    document.getElementById("ajouterError").textContent = "Une erreur est survenue lors de l'ajout de l'utilisateur.";
                    document.getElementById('ajouterError').style.display = "block";
                }
            });

        } else {
            // show an error message
            document.getElementById("ajouterError").textContent = "Merci de remplir tous les champs.";
            document.getElementById('ajouterError').style.display = "block";
        }
    });
}
