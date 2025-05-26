


// write data in table
let fullData = null;
function show(nof, postCharge) {

    // nof & postCharge ids
    let nofId = null;
    let postChargeId = null;
    for (let i in fullData.columns) {
        if (fullData.columns[i] === "nof") {
            nofId = i;
        }
        if (fullData.columns[i] === "post_actuel") {
            postChargeId = i;
        }
    }

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
            if (nof && nofId !== null)
                if (row[nofId] !== nof)
                    return; // skip this row
            if (postCharge && postChargeId !== null)
                if (row[postChargeId] !== postCharge)
                    return; // skip this row
            
            // show the row in the table
            row.forEach(cell => {
                const td = document.createElement("td");
                if (cell instanceof Date) 
                    td.innerText = cell.toLocaleString(); // format the date
                else td.innerText = cell;
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    }
}




// receiving Table Data columns and rows
{

    ipcRenderer.invoke('Table Data').then(data => {

        // store data in the page
        fullData = data;

        show();
        
            
    });
}





// receiving values of inputs in 'selections' form when the user click enter in any of the input
{
    // click enter on inputs event
    document.getElementById("selections").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            // get nof & postCharge value
            const nof = document.getElementById("nof").value;
            const postCharge = document.getElementById("postCharge").value;

            show(nof, postCharge);

        }
    });
}





