// always Focus on scanInput execpt when we click on commentInput or posteSelect
{
    // focus on scanInput when the page loads
    document.getElementById("scanInput").focus();
    // focus on scanInput when the page is clicked execpt when we click on commentInput or posteSelect
    document.addEventListener("click", function(event) {
        if (event.target.id !== "commentInput" && event.target.id !== "posteSelect") {
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