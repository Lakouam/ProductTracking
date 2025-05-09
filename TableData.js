class TableData {


    // Handle Errors:
    /*
        isQaComplete:      "qa is greater than qt"                                         : how?
        commentaireUpdate: "commentaire must be a string"                                  : how?
        postCurrentRow:    "Multiple products scanning not complete in the same post"      : Any post can only start scanning a product if only,
                                                                                                it's not scanning any other product in the moment
        isScanExists:
                           "The scan has multiple rows Not Allowed"                        : nof and postActuel are the identifier of the table so multiple of them is not allowed
        addScan:           
                           "The scan is corrupted"                                         : why you add a scan that is corrupted (exists in the table but with some different values)
                           "The scan already exists in the table"                          : why you add a scan that exist on the table
        updateTable:       "Post is currently scanning a product,                   :
                              but the progamme work like the post is currently complete"   : how?

    */


    // our table
    constructor(){
        this._nof = [];
        this._refProduit = [];
        this._qt = [];
        this._postActuel = [];
        this._qa = [];
        this._moytempspasser = [];
        this._etat = [];
        this._commentaire = [];

        this._scanCount = []; // number of scans done to the product (qt = scanCount / 2)
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
        isQaComplete(row) {
            if (this._qa[row] > this._qt[row]) throw new Error("qa is greater than qt"); // check if the qa is greater than the qt
            return (this._qa[row] === this._qt[row]); // return true if the qa is equal to the qt, false otherwise
        }
        set qa(value) {
            this._qa.push(0); // set the qa to 0 (initial value)
        }

        // getter and setter for moytempspasser
        moytempspasserGet(row) {
            return this._moytempspasser[row];
        }
        set moytempspasser(value) {
            this._moytempspasser.push(""); // set the moytempspasser to "" (initial value)
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
            this._scanCount.push(1);
        }



    // updates setters
        qaUpdate(row) {
            if(!this.isQaComplete(row) && !this.isSecondScan(row)) // if the qa is less than the qt, and we are in the initial scan, update it
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






    

    // functions used inside the class

        // search for the row of product (that we are currently scanning) in this scan post (-1: no product scanning in this post, row: the row of product)
        postCurrentRow(postActuel) {
            let PorductsScanningNotComplete = []; // array of products that are not complete (qa < qt) in postActuel
            for (let i = 0; i < this.len; i++) {
                if (this.postActuelGet(i) === postActuel && !this.isQaComplete(i)) { // if the post is the same and the qa is not complete
                    PorductsScanningNotComplete.push(i); // add the row to the array
                }
            }

            // if the array is empty, return -1 (no product scanning in this post)
            if (PorductsScanningNotComplete.length === 0) return -1; // no product scanning in this post

            // if the array has only one element, return it (only one product scanning in this post)
            if (PorductsScanningNotComplete.length === 1) return PorductsScanningNotComplete[0]; // only one product scanning in this post

            // if the array has more than one element, throw an error (multiple products scanning not complete in the same post is not allowed)
            throw new Error("Multiple products scanning not complete in the same post");
        }

        // true if we can update the row, false if not possible to update
        isUpdateRowPossible(row, scan) {
            // check if nof, refProduit, qt, postActuel are the same
            if (this.nofGet(row) !== scan.nof || this.refProduitGet(row) !== scan.refProduit || this.qtGet(row) !== scan.qt || this.postActuelGet(row) !== scan.postActuel) {
                return false; // not possible to update (not the same scan)
            }

            return true; // possible to update (same scan)
        }

        // update the following row
        updateRow(row, scan) {

            if (this.isUpdateRowPossible(row, scan) === false) return false // check if we can update the row

            this.moytempspasserUpdate(row); // update the time spent
            this.etatUpdate(row, scan.etat); // update the etat value
            this.commentaireUpdate(row, scan.commentaire); // update the commentaire value

            this.scanCountUpdate(row) // update scan count
            this.qaUpdate(row); // update Quantite actual

            return true; // return true if the row is updated

        }

        // check if the scan exists in the table (return the row of the scan if it exists, -1 if not, -2 if the scan is corrupted (exists but with some different values))
        isScanExists(scan) {
            let rows = []; // array of rows that are the same as the scan
            for (let i = 0; i < this.len; i++) {
                if (this.nofGet(i) === scan.nof && this.postActuelGet(i) === scan.postActuel) {
                    // check for errors
                    if (this.refProduitGet(i) !== scan.refProduit) return -2; // check if the refProduit is the same
                    if (this.qtGet(i) !== scan.qt) return -2; // check if the qt is the same

                    rows.push(i); // add the row to the array
                }
            }

            // check if the array is empty
            if (rows.length === 0) return -1; // no scan exists

            if (rows.length > 1) throw new Error("The scan has multiple rows Not Allowed"); // multiple row of the scan not allowed

            return rows[0]; // return the row of the scan
            
        }


        // add the scan to the table
        addScan(scan) {

            if (this.isScanExists(scan) === -2) throw new Error("The scan is corrupted"); // check if the scan is corrupted
            if (this.isScanExists(scan) !== -1) throw new Error("The scan already exists in the table"); // check if the scan already exists in the table

            this.nof = scan.nof; // add the nof to the table
            this.refProduit = scan.refProduit; // add the refProduit to the table
            this.qt = scan.qt; // add the qt to the table
            this.postActuel = scan.postActuel; // add the postActuel to the table
            this.qa = scan.qa // scan.qa; // add the qa to the table
            this.moytempspasser = scan.moytempspasser; // add the moytempspasser to the table
            this.etat = scan.etat; // add the etat to the table
            this.commentaire = scan.commentaire; // add the commentaire to the table

            this.scanCount = scan.scanCount // add the scanCount on the table
        }




    // Post next scan (initial: false or final: true);
    postNextScanIsSecond(postActuel) {
        if (this.postCurrentRow(postActuel) === -1) return false; // if the post is not scanning a product, return false
        let row = this.postCurrentRow(postActuel); // get the row of the product (that we are currently scanning) in this scan post
        if (row === -1) return false; // if the row is -1, return false: scan initial (no product scanning in this post)
        return this.isSecondScan(row); // false if the post current scan is initial, true if scan is final
    }



    

    // update table
    updateTable(scan) {

        let scanRejected = true; // true if the scan is rejected
        let secondScan = false; // initial scan
        let currentPostRow = this.postCurrentRow(scan.postActuel); // the row of product (that we are currently scanning) in this scan post
        

        // if the post is currently scanning a poduct
        if (currentPostRow !== -1){

            // update the row
            scanRejected = (!this.updateRow(currentPostRow, scan));
            secondScan = this.isSecondScan(currentPostRow);
            
        }
        else { // post is currently complete (no scanning in the momment)

        // check if the scan is not existing in the table (to add it)
            let scanRow = this.isScanExists(scan); // check if the scan exists in the table


            if (scanRow !== -2) { // if the scan is not corrupted (exists but with some different values)
                // check for errors
                if (scanRow !== -1) {  // if the scan exists in the table
                    // check if the scan not complete (qa < qt)
                    if (!this.isQaComplete(scanRow))  // if the scan is not complete (qa < qt)
                        throw new Error("Post is currently scanning a product, but the progamme work like the post is currently complete"); // throw an error
                }
                else { // if the scan does not exist in the table (add it)
                    this.addScan(scan); // add the scan to the table
                    scanRejected = false; // the scan is not rejected (added to the table)
                    secondScan = this.isSecondScan(this.len - 1); // the count for the new row is 1, so secondScan should be true
                }
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