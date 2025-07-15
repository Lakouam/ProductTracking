// always Focus on scanInput execpt when we click on commentInput or posteSelect
{
    // focus on scanInput when the page loads
    document.getElementById("scanInput").focus();
    // focus on scanInput when the page is clicked execpt when we click on search or commentInput or posteSelect
    document.addEventListener("click", function(event) {
        if (event.target.id !== "search" && event.target.id !== "commentInput" && event.target.id !== "posteSelect") {
            document.getElementById("scanInput").focus();
        }
    });
}


/*
// when we check the etatInput, we show the commentInput and when we uncheck it, we hide the commentInput and make it empty
{
    // when we check the etatInput, we show the commentInput
    document.getElementById("etatInput").addEventListener("change", function(event) {
        if (event.target.checked) {
            document.getElementById("commentInput").style.display = "block";
        } else {
            document.getElementById("commentInput").style.display = "none";
            document.getElementById("commentInput").value = ""; // make it empty when we uncheck the etat
        }
    });
}
*/




// send the scanInput value with other informations (post, etat, comment) to main process when the user presses enter
{
    document.getElementById("scanInput").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            // get the scanInput value, and make it empty
            const scanInput = document.getElementById("scanInput").value;

            // add with scanInput other information (post, etat, comment)
            const postSelect = document.getElementById("posteSelect").value;
            const etatInput = false; //document.getElementById("etatInput").checked ? "true" : "false";
            const commentInput = "";// document.getElementById("commentInput").value;

            const allInput = scanInput + "/" + postSelect + "/" + etatInput + "/" + commentInput;
            console.log("Sending scan input:", allInput);
            // send the scanInput value to main process
            ipcRenderer.send("Scan Input", allInput);
        }
    });
}




// receiving a message about the scan whenever the page is loaded and show it in scan input
{
    ipcRenderer.invoke('Message About Scan').then(data => {
        // Show the message in the scan input
        //document.getElementById("scanInput").placeholder = data.message;

        document.getElementById("scanError").textContent = data.errorMessage;
        // add class error to errorMessage if is not empty
        if (data.errorMessage !== "") {
            document.getElementById('scanError').classList.add('error');
            document.getElementById('scanError').style.display = "block";
        }
    });
}





// receiving Table Data columns and row
{
    // request post actuel from main process then request Table Data columns and row
    ipcRenderer.invoke('Post Actuel').then(postActuel => {
        
            ipcRenderer.invoke('Table Data', 'scanner', postActuel.name).then(data => {

                document.getElementById("scan-product-nof").textContent = data.rows[0].nof;
                document.getElementById("scan-product-gamme").textContent = data.rows[0].ref_gamme;
                document.getElementById("scan-product-operation").textContent = data.rows[0].num_ope;
                document.getElementById("scan-product-poste").textContent = data.rows[0].post_machine;
                document.getElementById("scan-progress-qa").textContent = data.rows[0].qa;
                document.getElementById("scan-progress-qt").textContent = data.rows[0].qt;

                // change the width of the scan-progress-bar-fill based on qa and qt
                const qa = data.rows[0].qa;
                const qt = data.rows[0].qt;
                const progressBarFill = document.querySelector('.scan-progress-bar-fill');
                if (qt > 0) {
                    const percentage = (qa / qt) * 100;
                    progressBarFill.style.width = percentage + '%';
                }

                // if scan_count is odd, , add class scan-step-value-complet to scanInitialValue and remove class scan-step-value-attente and set the text to "Complet"
                if (data.rows[0].scan_count % 2 === 1) {
                    document.getElementById("scanInitialValue").classList.add("scan-step-value-complet");
                    document.getElementById("scanInitialValue").classList.remove("scan-step-value-attente");
                    document.getElementById("scanInitialValue").textContent = "Complet";
                    document.getElementById("scanInitialCircle").classList.add("scan-step-complet");
                } 

                
                    
            });
        });
}