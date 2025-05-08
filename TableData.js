class TableData {

    // our table
    constructor(){
        this._nof = ["2533024", "2533100"];
        this._refProduit = ["AEG661", "0EMS15"];
        this._qt = [200, 200];
        this._postActuel = ["Post 2", "Post 1"];
        this._qa = [0, 0];
        this._moytempspasser = ["", ""];
        this._etat = [false, false];
        this._commentaire = ["", ""];

        this._scanCount = [1, 1]; // number of scans done to the product (qt = scanCount / 2)
    }



    // getters and setters

        // getter for length
        get len() {
            return this._nof.length
        }

        // getter and setter for nof
        nofGet(row) {
            return this._nof[row];
        }
        set nof(value) {
            this._nof.push(value);
        }

        // getter and setter for refProduit
        refProduitGet(row) {
            return this._refProduit[row];
        }
        set refProduit(value) {
            this._refProduit.push(value);
        }

        // getter and setter for qt
        qtGet(row) {
            return this._qt[row];
        }
        set qt(value) {
            this._qt.push(value);
        }

        // getter and setter for postActuel
        postActuelGet(row) {
            return this._postActuel[row];
        }
        set postActuel(value) {
            this._postActuel.push(value);
        }

        // getter and setter for qa
        qaGet(row) {
            return this._qa[row];
        }
        set qa(value) {
            this._qa.push(value);
        }

        // getter and setter for moytempspasser
        moytempspasserGet(row) {
            return this._moytempspasser[row];
        }
        set moytempspasser(value) {
            this._moytempspasser.push(value);
        }

        // getter and setter for etat
        etatGet(row) {
            return this._etat[row];
        }
        set etat(value) {
            this._etat.push(value);
        }

        // getter and setter for commentaire
        commentaireGet(row) {
            return this._commentaire[row];
        }
        set commentaire(value) {
            this._commentaire.push(value);
        }

        // getter and setter for scanCount
        scanCountGet(row) {
            return this._scanCount[row]; // return the scanCount value
        }
        isSecondScan(row) {
            return (this._scanCount[row] % 2 === 1); // return true if the scanCount is odd (final scan), false if even (initial scan)
        }
        set scanCount(value) {
            this._scanCount.push(value);
        }



    // updates setters
        qaUpdate(row) {
            if(this.qaGet(row) < this.qtGet(row) && !this.isSecondScan(row)) // if the qa is less than the qt, and we are in the initial scan, update it
                this._qa[row]++ // update the qa value by 1
        }

        moytempspasserUpdate(row) {

        }

        etatUpdate(row, value) {
            this._etat[row] = (value === true || value === "true") // update the etat value
        }

        commentaireUpdate(row, value) {
            if (typeof value !== "string") throw new Error("commentaire must be a string"); // check if the value is a string
            this._commentaire[row] = value // update the commentaire value
        }

        scanCountUpdate(row) {
            if(this.scanCountGet(row) < this.qtGet(row) * 2) // if the scanCount is less than the qt * 2, update it
                this._scanCount[row]++ // update the scanCount value by 1
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

            this.scanCountUpdate(row) // update scan count
            this.qaUpdate(row); // update Quantite total

        }




    // Post next scan (initial: false or final: true);
    postNextScanIsSecond(postActuel) {
        if (this.postCurrentRow(postActuel) === -1) return false; // if the post is not scanning a product, return false
        return this.isSecondScan(this.postCurrentRow(postActuel)); // false if the post current scan is initial, true if scan is final
    }




    // update table
    updateTable(scan) {

        let scanRejected = true; // true if the scan is rejected
        let secondScan = false; // initial scan
        let currentPostRow = this.postCurrentRow(scan.postActuel); // the row of product (that we are currently scanning) in this scan post
        



        // if the post is currently scanning a poduct
        if (currentPostRow !== -1){
            secondScan = this.isSecondScan(currentPostRow);// false: if the post current scan is initial, true: if scan is final

            // verify if we can update the table with this scan
            let row = this.isUpdatePossible(scan);
    
            // if we can, update it
            if(row !== -1){
                // if row !== currentPostRow throw an error


                // update the row
                this.updateRow(row, scan);
                scanRejected = false;
                secondScan = this.isSecondScan(row) ;
            }
        }

        


        // return information about the update (scan rejected?, scan initial or final?)
        return {scanRejected: scanRejected, secondScan: secondScan};

    }
    
    
    
    



    // return a list of rows
    getRows() {
        let rows = [];

        for (let i = 0; i < this.len; i++) {
            rows.push([
                this.nofGet(i),
                this.refProduitGet(i),
                this.qtGet(i),
                this.postActuelGet(i),
                this.qaGet(i),
                this.moytempspasserGet(i),
                this.etatGet(i),
                this.commentaireGet(i)
            ]);
        }

        return rows;
    }


}

module.exports = TableData;