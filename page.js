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




// register the post actuel in the main process
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



// receiving Table Data columns and rows
{

    // when receiving Table Data columns, show it in the table
    {
        ipcRenderer.on("Table Data Columns", (event, data) => {

            // get the table head
            const tableHead = document.getElementById("dataHead");
            // clear the table head
            tableHead.innerHTML = "";
            // add the data to the table head
            const tr = document.createElement("tr");
            data.forEach(column => {
                const th = document.createElement("th");
                th.innerText = column;
                tr.appendChild(th);
            });

            tableHead.appendChild(tr);
            
        });
    }


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




// receive a signal to disable UI or Enable it (interaction of user with some elements)
{
    function setInputsDisabled(disabled) { // what's elements to disable or enable
        document.getElementById('postSelect').disabled = disabled;
        document.getElementById('scanInput').disabled = disabled;
        document.getElementById('etatInput').disabled = disabled;
        document.getElementById('commentInput').disabled = disabled;
    }

    ipcRenderer.on("Disable UI", () => setInputsDisabled(true)); // Disable UI
    ipcRenderer.on("Enable UI", () => setInputsDisabled(false)); // Enable UI
}



// receive posts names from the main process and show them in the postSelect and request the post actuel and select it
{
    ipcRenderer.on("Posts Names", (event, data) => {
        // get the postSelect
        const postSelect = document.getElementById("postSelect");
        for (const post of data) {
            // create an option element
            const option = document.createElement("option");
            // set the value and text of the option
            option.value = post;
            option.innerText = post;
            // add the option to the postSelect
            postSelect.appendChild(option);
        }

        // request post actuel from main process and select it
        ipcRenderer.invoke('Post Actuel').then(postActuel => {
            document.getElementById("postSelect").value = postActuel;
        });

    });
}