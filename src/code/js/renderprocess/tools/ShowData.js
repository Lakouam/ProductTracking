const { columnName } = require('./columnsnames.js');


function show(nof = "", postCharge = "", removable = {is: false, who: ""}, gamme = "", detail = {is: false, who: ""}, nom = "", role = "", skip = {is: false}) {
    
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

        // Remove or skip
        if ((removable.is || skip.is) && role === "Admin") { // Add a header for the remove icon column
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
            if (postCharge !== "" && row["post_actuel"] !== postCharge && row["poste_machine"] !== postCharge)
                return; // skip this row

            // check if the row contains the gamme value as a prefix
            if (gamme !== "" && !row["ref_gamme"].startsWith(gamme))
                return; // skip this row
            // check if the row contains the nom value
            if (nom !== "" && !row["nom"].toLowerCase().includes(nom.toLowerCase()))
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
                } else if (name === "statut") { // Special style for statut column
                    td.classList.add("status-ligne");
                    let badge = document.createElement("span");
                    badge.classList.add("status-badge");
                    badge.innerText = cell;
                    if (cell === "En cours") {
                        td.classList.add("status-soldee");
                    } else if (cell === "En attente") {
                        td.classList.add("status-encours");
                    }
                    td.appendChild(badge);
                } else if (name === "date") // show only the year, month and day
                    td.innerText = cell.toLocaleDateString(); // format the date
                else if (cell instanceof Date) 
                    td.innerText = cell.toLocaleString(); // format the date
                else td.innerText = cell;
                tr.appendChild(td);
            };

            
            // Remove
            if (removable.is && role === "Admin") {
                // Add remove icon cell
                const removeTd = document.createElement("td");
                removeTd.style.textAlign = "center"; // Center the remove icon

                if(row["role"] !== "Admin") {
                    removeTd.innerHTML = `
                        <span class="remove-row" title="Supprimer">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18" height="18" viewBox="0 0 24 24" style="fill:#d32f2f;">
                            <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z"></path>
                            </svg>
                        </span>
                    `;
                    removeTd.onclick = (event) => {
                        event.stopPropagation(); // Prevent row click event
                        // Call remove function, e.g.:
                        if (removable.who === 'nof')
                            removeRowFromDB(row["nof"], removable.who)
                        if (removable.who === 'post')
                            removeRowFromDB(row["name"], removable.who)
                        if (removable.who === 'user')
                            removeRowFromDB([row["nom"], row["matricule"]], removable.who);
                    };
                }
                    
                tr.appendChild(removeTd);
            }


            // Skip
            if (skip.is && role === "Admin") {
                // Add skip icon cell
                const skipTd = document.createElement("td");
                skipTd.style.textAlign = "center"; // Center the skip icon

                // cursor pointer
                skipTd.style.cursor = "pointer";

                skipTd.innerHTML = `
                    <span class="skip-row" title="Ignorer">
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18" height="18" viewBox="0 0 24 24" style="fill:#f9a825;">
                        <path d="M 12 2 C 6.486 2 2 6.486 2 12 C 2 17.514 6.486 22 12 22 C 17.514 22 22 17.514 22 12 C 22 6.486 17.514 2 12 2 z M 12 4 C 16.411997 4 20 7.5880031 20 12 C 20 16.411997 16.411997 20 12 20 C 7.5880031 20 4 16.411997 4 12 C 4 7.5880031 7.5880031 4 12 4 z M 11 6 L 11 13 L 16.5 16.15 L 17.5 14.85 L 13 12 L 13 6 L 11 6 z"></path>
                        </svg>
                    </span>
                `;
                skipTd.onclick = (event) => {
                    // Call skip function, e.g.:
                    skipRowsInDB(row["nof"], row["num_ope"]);
                };

                tr.appendChild(skipTd);
            }

            // Add detail functionality
            if (detail.is) {
                if (detail.who === "gamme") { // gamme detail
                    tr.style.cursor = "pointer";
                    tr.onclick = () => {
                        // Open gammedetail.html, using ipcRenderer, passing the gamme info (e.g., row.ref_gamme):
                        ipcRenderer.send('open-gamme-detail', row["ref_gamme"]);
                    };
                }
                if (detail.who === "nof") { // nof detail
                    tr.style.cursor = "pointer";
                    tr.onclick = () => {
                        // Open carte.html, using ipcRenderer, passing the nof info (e.g., row.nof, row.gamme, row.qt):
                        ipcRenderer.send('open-nof-detail', row["nof"], row["ref_gamme"], row["qt"]);
                    };
                }
                if (detail.who === "user" && row["role"] === "Opérateur") { // user detail
                    tr.style.cursor = "pointer";
                    tr.onclick = () => {
                        // Open userdetail.html, using ipcRenderer, passing the user info (e.g., row.nom, row.matricule):
                        ipcRenderer.send('open-user-detail', row["nom"], row["matricule"], row["role"]);
                    };
                }
                if (detail.who === "poste") { // poste detail
                    tr.style.cursor = "pointer";
                    tr.onclick = () => {
                        // Open poste-detail.html, using ipcRenderer, passing the poste info (e.g., row.poste_machine):
                        ipcRenderer.send('open-poste-detail', row["poste_machine"]);
                    };
                }
                
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


// skip value in database
function skipRowsInDB(nof, num_ope) {
    // Use ipcRenderer to ask main process to skip by unique key (e.g., nof), some operations
    ipcRenderer.invoke('skip-rows', {nof, num_ope}).then(success => {
        if (success) {

        } else {

        }
    });
}


module.exports = { show };