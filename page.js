// import ipcRenderer from electron
const {ipcRenderer} = require('electron');



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



// receiving a message about the scan whenever the page is loaded and show it in scan input
{
    // when receiving a message about the scan, Show it in the input
    {
        ipcRenderer.on("Message About Scan", (event, data) => {
            // Show the message in the scan input
            document.getElementById("scanInput").placeholder = data;
        });
    }
}



// receiving Table Data rows
{
    // when receiving Table Data rows, show it in the table
    {
        ipcRenderer.on("Table Data Rows", (event, data) => {

            // get the table body
            const tableBody = document.getElementById("dataBody");
            // clear the table body
            tableBody.innerHTML = "";
            // add the data to the table body
            data.forEach(row => {
                const tr = document.createElement("tr");
                row.forEach(cell => {
                    const td = document.createElement("td");
                    if (cell instanceof Date) 
                        td.innerText = cell.toLocaleString(); // format the date
                    else td.innerText = cell;
                    tr.appendChild(td);
                });
                tableBody.appendChild(tr);
            });
            
        });
    }
}
