function show(nof = "", postCharge = "") {

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
            tableBody.appendChild(tr);
        });
    }
}

module.exports = { show };