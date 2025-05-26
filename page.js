// import ipcRenderer from electron
//const {ipcRenderer} = require('electron'); // ealready imported in postRender.js



// always Focus on scanInput execpt when we click on commentInput or postSelect
{
    // focus on scanInput when the page loads
    document.getElementById("scanInput").focus();
    // focus on scanInput when the page is clicked execpt when we click on commentInput or postSelect
    document.addEventListener("click", function(event) {
        if (event.target.id !== "commentInput" && event.target.id !== "postSelect") {
            document.getElementById("scanInput").focus();
        }
    });
}



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




// send the scanInput value with other informations (post, etat, comment) to main process when the user presses enter
{
    document.getElementById("scanInput").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            // get the scanInput value, and make it empty
            const scanInput = document.getElementById("scanInput").value;

            // add with scanInput other information (post, etat, comment)
            const postSelect = document.getElementById("postSelect").value;
            const etatInput = document.getElementById("etatInput").checked ? "true" : "false";
            const commentInput = document.getElementById("commentInput").value;

            const allInput = scanInput + "/" + postSelect + "/" + etatInput + "/" + commentInput;
    
            // send the scanInput value to main process
            ipcRenderer.send("Scan Input", allInput);
        }
    });
}




// receiving a message about the scan whenever the page is loaded and show it in scan input
{
    ipcRenderer.invoke('Message About Scan').then(data => {
        // Show the message in the scan input
        document.getElementById("scanInput").placeholder = data.message;

        document.getElementById("errorMessage").textContent = data.errorMessage;
        // add class error to errorMessage if is not empty
        if (data.errorMessage !== "")
            document.getElementById('errorMessage').classList.add('error');
    });
}





// receive a signal to disable UI or Enable it (interaction of user with some elements)
{
    function setInputsDisabled(disabled) { // what's elements to disable or enable
        document.getElementById('scanInput').disabled = disabled;

        if (!disabled) // if the UI is enabled, focus on scanInput
            document.getElementById("scanInput").focus();
    }

    ipcRenderer.on("Disable UI", () => setInputsDisabled(true)); // Disable UI
    ipcRenderer.on("Enable UI", () => setInputsDisabled(false)); // Enable UI
}



