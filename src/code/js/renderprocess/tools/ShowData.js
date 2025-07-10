const { columnName } = require('./columnsnames.js');


function show(nof = "", postCharge = "", removable = {is: false, who: ""}, gamme = "", detail = false) {
    
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
            th.innerText = columnName(column);
            tr.appendChild(th);
        });

        // Remove
        if (removable.is || detail) { // Add a header for the remove icon column
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
            if (postCharge !== "" && row["post_actuel"] !== postCharge && row["post_machine"] !== postCharge)
                return; // skip this row

            // check if the row contains the gamme value as a prefix
            if (gamme !== "" && !row["ref_gamme"].startsWith(gamme))
                return; // skip this row
            
            // show the row in the table
            for (let [name, cell] of Object.entries(row)) {

                const td = document.createElement("td");

                // Special style for status_ligne column
                if (name === "status_ligne") {
                    td.classList.add("status-ligne");
                    let badge = document.createElement("span");
                    badge.classList.add("status-badge");
                    badge.innerText = cell;
                    if (cell === "Soldee") {
                        td.classList.add("status-soldee");
                    } else if (cell === "En cours") {
                        td.classList.add("status-encours");
                    }
                    td.appendChild(badge);
                } else if (cell instanceof Date) 
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
                    if (removable.who === 'post')
                        removeRowFromDB(row["name"], removable.who)
                };
                if(row["name"] !== "Admin")
                    tr.appendChild(removeTd);
            }

            // gamme detail
            if (detail) {
                const detailTd = document.createElement("td");
                detailTd.innerHTML = `<span class="detail-row" style="cursor:pointer;color:#1976d2;font-size:1.2em;" title="Voir le détail">&#128269;</span>`;
                detailTd.onclick = () => {
                    // Open gammedetail.html, using ipcRenderer, passing the gamme info (e.g., row.ref_gamme):
                    ipcRenderer.send('open-gamme-detail', row["ref_gamme"]);
                };
                tr.appendChild(detailTd);
            }

            tableBody.appendChild(tr);
        });
    }
}




// remove value from database
function removeRowFromDB(value, who) {
    // Use ipcRenderer to ask main process to remove by unique key (e.g., nof)
    
    ipcRenderer.invoke('remove-row', value, who).then(success => {
        if (success) {
            
        } else {
            
        }
    });
        
    
}


module.exports = { show };