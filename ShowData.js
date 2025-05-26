function show(nof = "", postCharge = "", removable = {is: false, who: ""}) {

    // show columns in the table
    {
        // get the table head
        const tableHead = document.getElementById("dataHead");
        // clear the table head
        tableHead.innerHTML = "";
        // add the data to the table head
        const tr = document.createElement("tr");
        fullData.columns.forEach(column => {
            const th = document.createElement("th");
            th.innerText = column;
            tr.appendChild(th);
        });

        // Remove
        if (removable.is) { // Add a header for the remove icon column
            const th = document.createElement("th");
            th.innerText = "";
            th.style.width = "48px"; // Set a fixed width for the remove icon column
            th.style.textAlign = "center"; 
            tr.appendChild(th);
        }

        tableHead.appendChild(tr);
    }


    // show rows in the table
    {
        // get the table body
        const tableBody = document.getElementById("dataBody");
        // clear the table body
        tableBody.innerHTML = "";
        // add the data to the table body
        fullData.rows.forEach(row => {
            const tr = document.createElement("tr");

            // check if the row contains the nof and postCharge values
            if (nof !== "" && row["nof"] !== nof)
                return; // skip this row
            if (postCharge !== "" && row["post_actuel"] !== postCharge)
                return; // skip this row
            
            // show the row in the table
            for (let [name, cell] of Object.entries(row)) {

                const td = document.createElement("td");
                if (cell instanceof Date) 
                    td.innerText = cell.toLocaleString(); // format the date
                else td.innerText = cell;
                tr.appendChild(td);
            };

            
            // Remove
            if (removable.is) {
                // Add remove icon cell
                const removeTd = document.createElement("td");
                removeTd.innerHTML = `<span class="remove-row" style="cursor:pointer;color:#e53935;font-size:1.2em;" title="Remove">&#10060;</span>`;
                removeTd.onclick = () => {
                    // Call remove function, e.g.:
                    if (removable.who === 'nof')
                        removeRowFromDB(row["nof"], removable.who)
                };
                tr.appendChild(removeTd);
            }

            tableBody.appendChild(tr);
        });
    }
}




// remove value from database
function removeRowFromDB(value, who) {
    // Use ipcRenderer to ask main process to remove by unique key (e.g., nof)
    if (confirm("Are you sure you want to remove this row?")) {
        ipcRenderer.invoke('remove-row', value, who).then(success => {
            if (success) {
                alert("Row removed successfully.");
            } else {
                alert("Failed to remove row from database.");
            }
        });
        
    }
}


module.exports = { show };