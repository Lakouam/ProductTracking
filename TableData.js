class TableData {

    // our table
    constructor(){
        this.nof = ["2533024", "2533100"];
        this.refProduit = ["AEG661", "0EMS15"];
        this.qt = [200, 200];
        this.postActuel = ["Post 2", "Post 1"];
        this.qa = [0, 0];
        this.moytempspasser = ["", ""];
        this.etat = ["false", "false"];
        this.commentaire = ["", ""];

        this.scanCount = [1, 1]; // number of scans done to the product (qt = scanCount / 2)
    }



    // function used inside the class
        // search for the row of product (that we are currently scanning) in this scan post
        postCurrentRow(postActuel) {
            return 0;
        }

        // the row that we want to update for the scan, -1 if not possible to update
        isUpdatePossible(scan) {
            return 0;
        }

        // update the following row
        updateRow(row, scan) {

            this.scanCount[row]++; // update scan count
            if (this.scanCount[row] % 2 === 0) this.qa[row]++; // update Quantite total

        }




    // update table
    updateTable(scan) {

        let scanRejected = true; // true if the scan is rejected
        let secondScan = false; // initial scan
        let currentPostRow = this.postCurrentRow(scan.postActuel); // the row of product (that we are currently scanning) in this scan post
        



        // if the post is currently scanning a poduct
        if (currentPostRow !== -1){
            secondScan = (this.scanCount[currentPostRow] % 2 === 1);// false: if the post current scan is initial, true: if scan is final

            // verify if we can update the table with this scan
            let row = this.isUpdatePossible(scan);
    
            // if we can, update it
            if(row !== -1){
                // if row !== currentPostRow throw an error


                // update the row
                this.updateRow(row, scan);
                scanRejected = false;
                secondScan = (this.scanCount[row] % 2 === 1) ;
            }
        }

        


        // return information about the update (scan rejected?, scan initial or final?)
        return {scanRejected: scanRejected, secondScan: secondScan};

    }





    // return a list of rows
    getRows() {
        let rows = [];

        for (let i = 0; i < this.nof.length; i++) {
            rows.push([
                this.nof[i],
                this.refProduit[i],
                this.qt[i],
                this.postActuel[i],
                this.qa[i],
                this.moytempspasser[i],
                this.etat[i],
                this.commentaire[i]
            ]);
        }

        return rows;
    }


}

module.exports = TableData;