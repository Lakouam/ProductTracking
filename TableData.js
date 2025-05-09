class TableData {


    // Handle Errors:
    /*
        Rules:             Many Error throw
        addScan:           
                           "The scan is corrupted why are you trying to add it"            : why you add a scan that is corrupted (exists in the table but with some different values)
                           "The scan already exists in the table"                          : why you add a scan that exist on the table
    */


    // TableData Rules:
    /*
        Rule 1: Identifier of the table is (nof, postActuel)
        Rule 2: types.
            string  : nof, refProduit, postActuel, moytempspasser, commentaire
            boolean : etat
            number  : qt, qa, scanCount
        Rule 3: qa <= qt, qt > 0, qa >= 0
        Rule 4: No post have multiple rows with (qa < qt) (not complete)
        Rule 5: Cannot be changed (nof, refProduit, qt, postActuel)
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
            this.rule3(row) // check if Rule3 respected: qa <= qt, qt > 0, qa >= 0
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

        // getter of id (nof, postActuel)
        isSameId(row1, row2) { // check if the two rows have the same id (nof, postActuel)
            if (this.nofGet(row1) !== this.nofGet(row2)) return false; // check if the nof is the same
            if (this.postActuelGet(row1) !== this.postActuelGet(row2)) return false; // check if the postActuel is the same
            return true; // return true if the nof and postActuel are the same
        }
        isSameScanId(row, scan) { // check if the scan has the same id (nof, postActuel) as the row
            if (this.nofGet(row) !== scan.nof) return false; // check if the nof is the same
            if (this.postActuelGet(row) !== scan.postActuel) return false; // check if the postActuel is the same
            return true; // return true if the nof and postActuel are the same
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
            this._commentaire[row] = value // update the commentaire value
        }

        scanCountUpdate(row) {
            if(this.scanCountGet(row) < this.qtGet(row) * 2) // if the scanCount is less than the qt * 2, update it
                this._scanCount[row]++ // update the scanCount value by 1
        }




        // Rules of the table
            // Rule 1: Identifier of the table is (nof, postActuel)
            rule1() {
                for (let i = 0; i < this.len; i++) {
                    for (let j = i + 1; j < this.len; j++) {
                        if (this.isSameId(i, j)) { // check if the two rows have the same id (nof, postActuel)
                            throw new Error("Rule 1 not respected: Identifier of the table is (nof, postActuel)"); // throw an error
                        }
                    }
                }
            }

            // Rule 2: types.
            rule2(row) {
                if (typeof this.nofGet(row) !== "string") throw new Error("nof must be a string"); // check if the nof is a string
                if (typeof this.refProduitGet(row) !== "string") throw new Error("refProduit must be a string"); // check if the refProduit is a string
                if (typeof this.qtGet(row) !== "number") throw new Error("qt must be a number"); // check if the qt is a number
                if (typeof this.postActuelGet(row) !== "string") throw new Error("postActuel must be a string"); // check if the postActuel is a string
                if (typeof this.qaGet(row) !== "number") throw new Error("qa must be a number"); // check if the qa is a number
                if (typeof this.moytempspasserGet(row) !== "string") throw new Error("moytempspasser must be a string"); // check if the moytempspasser is a string
                if (typeof this.etatGet(row) !== "boolean") throw new Error("etat must be a boolean"); // check if the etat is a boolean
                if (typeof this.commentaireGet(row) !== "string") throw new Error("commentaire must be a string"); // check if the commentaire is a string
                
                if (typeof this.scanCountGet(row) !== "number") throw new Error("scanCount must be a number"); // check if the scanCount is a number
            }
            
            // Rule 3: qa <= qt, qt > 0, qa >= 0
            rule3(row) {
                if (this.qaGet(row) > this.qtGet(row)) throw new Error("qa is greater than qt"); // check if the qa is greater than the qt
                if (this.qtGet(row) <= 0) throw new Error("qt must be greater than 0"); // check if the qt is greater than 0
                if (this.qaGet(row) < 0) throw new Error("qa must be greater than or equal to 0"); // check if the qa is greater than or equal to 0
            }

            // Rule 4: No post have multiple rows with (qa < qt) (not complete)
            rule4() {
                for (let i = 0; i < this.len; i++) {
                    for (let j = i + 1; j < this.len; j++) {
                        if (this.postActuelGet(i) === this.postActuelGet(j) && !this.isQaComplete(i) && !this.isQaComplete(j)) {
                            throw new Error("Rule 4 not respected: No post have multiple rows with (qa < qt) (not complete)"); // throw an error
                        }
                    }
                }
            }

            // Rule 5: Cannot be changed (nof, refProduit, qt, postActuel)
            rule5(row, scan) { // check if the nof, refProduit, qt, postActuel are the same as the scan
                if (this.nofGet(row) !== scan.nof) return false; // check if the nof is the same
                if (this.refProduitGet(row) !== scan.refProduit) return false; // check if the refProduit is the same
                if (this.qtGet(row) !== scan.qt) return false; // check if the qt is the same
                if (this.postActuelGet(row) !== scan.postActuel) return false; // check if the postActuel is the same
                return true; // return true if the nof, refProduit, qt, postActuel are the same
            }







    

    // functions used inside the class

        // search for the row of product (that we are currently scanning) in this scan post (-1: no product scanning in this post, row: the row of product)
        postCurrentRow(postActuel) {

            this.rule4() // check if Rule4 respected: No post have multiple rows with (qa < qt) (not complete)

            
            for (let i = 0; i < this.len; i++) {
                if (this.postActuelGet(i) === postActuel && !this.isQaComplete(i)) { // if the post is the same and the qa is not complete
                    return i; // return the row
                }
            }

            return -1; // no product scanning in this post
        }

        // true if we can update the row, false if not possible to update
        isUpdateRowPossible(row, scan) {
            
            // check if the nof, refProduit, qt, postActuel are the same
            if (this.rule5(row, scan)) return true; // possible to update (same scan)

            return false; // not possible to update (not the same scan)
        }

        // update the following row
        updateRow(row, scan) {

            if (this.isUpdateRowPossible(row, scan) === false) return false // check if we can update the row

            this.moytempspasserUpdate(row); // update the time spent
            this.etatUpdate(row, scan.etat); // update the etat value
            this.commentaireUpdate(row, scan.commentaire); // update the commentaire value

            this.scanCountUpdate(row) // update scan count
            this.qaUpdate(row); // update Quantite actual

            this.rule2(row); // check if Rule2 respected: types.

            return true; // return true if the row is updated

        }

        // check if the scan exists in the table (return the row of the scan if it exists, -1 if not, -2 if the scan is corrupted (exists but with some different values))
        isScanExists(scan) {

            this.rule1() // check if Rule1 respected: Identifier of the table is (nof, postActuel)

            for (let i = 0; i < this.len; i++) {
                if (this.isSameScanId(i, scan)) { // check if the nof and postActuel are the same
                    // check for errors
                    if (this.rule5(i, scan) === false) return -2; // check if the nof, refProduit, qt, postActuel are the same (returns -2 if the scan is corrupted)

                    return i; // return the row of the scan
                }
            }

            // check if the array is empty
            return -1; // no scan exists in the table
            
        }


        // add the scan to the table
        addScan(scan) {

            if (this.isScanExists(scan) === -2) throw new Error("The scan is corrupted why are you trying to add it"); // check if the scan is corrupted
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

            this.rule2(this.len - 1); // check for the new row if Rule2 respected: types.

        }












    // Post next scan (initial: false or final: true);
    postNextScanIsSecond(postActuel) {
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
            
            if (scanRow === -1) { // if the scan does not exist in the table (add it)
                this.addScan(scan); // add the scan to the table
                scanRejected = false; // the scan is not rejected (added to the table)
                secondScan = true; // the count for the new row is 1, so secondScan should be true
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