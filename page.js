// import ipcRenderer from electron
const {ipcRenderer} = require('electron');



// always Focus on scanInput execpt when we click on commentInput or postSelect
{
    // focus on scanInput when the page loads
    document.getElementById("scanInput").focus();
    // focus on scanInput when the page is clicked execpt when we click on commentInput or postSelect
    document.body.addEventListener("click", function(event) {
        if (event.target.id !== "commentInput" && event.target.id !== "postSelect") {
            document.getElementById("scanInput").focus();
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




// register the post actuel in the main process and received it whenever the page is loaded
{
    // when selecting a post, send the post name to main process
    {
        document.getElementById("postSelect").addEventListener("change", function(event) {
            // get the postSelect value
            const postSelect = document.getElementById("postSelect").value;
            // send the postSelect value to main process
            ipcRenderer.send("Post Select", postSelect);
        });
    }

    // when receiving a post, select it
    {
        ipcRenderer.on("Post Actuel", (event, post) => {
            // select the post in the postSelect
            document.getElementById("postSelect").value = post;
        });
    }
}

