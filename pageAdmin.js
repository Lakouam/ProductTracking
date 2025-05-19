



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
    }

    ipcRenderer.on("Disable UI", () => setInputsDisabled(true)); // Disable UI
    ipcRenderer.on("Enable UI", () => setInputsDisabled(false)); // Enable UI
}