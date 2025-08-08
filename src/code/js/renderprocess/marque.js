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

        show(sharedNof, undefined, {is: true, who: 'nof'}, undefined, {is: true, who: 'nof'});
            
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

            show(nof, undefined, {is: true, who: 'nof'}, undefined, {is: true, who: 'nof'});

        }
    });
}





// Toggle form visibility on label click
{
    // show/hide the form when the label is clicked
    document.querySelector('.main-subtoolbar-sort-label').addEventListener('click', () => {
        const form = document.getElementById('addNofForm');
        form.style.display = form.style.display === 'none' ? 'flex' : 'none';
    });


    // handle the send button click (hide the form)
    document.getElementById('addNofSendBtn').addEventListener('click', () => {
        const nof = document.getElementById('nofInput').value.trim(); // Get the user name input value without leading/trailing spaces
        const ref = document.getElementById('refInput').value.trim(); // Get the user matricule input value without leading/trailing spaces
        const qt = document.getElementById('qtInput').value.trim(); // Get the user role input value without leading/trailing spaces
        

        // TODO: Validate and send data (e.g., via ipcRenderer)
        if (nof && ref && qt) {
            // Send data to main process or handle as needed
            ipcRenderer.invoke('add-nof', { nof, ref, qt }).then(response => {
                if (response.success) {
                    // Optionally, update the UI to reflect the new user
                    console.log('Numéro O.F added successfully:', response.data);

                    // Hide form after sending
                    document.getElementById('addNofForm').style.display = 'none';
                }
                else {
                    // Handle error response
                    document.getElementById("ajouterError").textContent = "Une erreur est survenue lors de l'ajout de ce numéro O.F.";
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
