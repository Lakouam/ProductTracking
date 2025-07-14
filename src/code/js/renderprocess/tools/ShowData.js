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
        if (removable.is) { // Add a header for the remove icon column
            const th = document.createElement("th");
            th.innerText = "Actions";
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
                removeTd.style.textAlign = "center"; // Center the remove icon
                removeTd.innerHTML = `
                    <span class="remove-row" title="Supprimer">
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18" height="18" viewBox="0 0 24 24" style="fill:#d32f2f;">
                        <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z"></path>
                        </svg>
                    </span>
                `;
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
                tr.style.cursor = "pointer";
                tr.onclick = () => {
                    // Open gammedetail.html, using ipcRenderer, passing the gamme info (e.g., row.ref_gamme):
                    ipcRenderer.send('open-gamme-detail', row["ref_gamme"]);
                };
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