const TrackingDB = require("./TrackingDB");

class Post {

    constructor() {
        // only: null --> value or value --> null (when completed qa === qt): cannot be updated
        this._nof = null;
        this._refProduit = null;
        this._qt = null;
        this._tempsDebut = null; // time of the start of the first scan
        this._tempsFin = null; // time of the end of the last scan that completed the product

        // only: null --> value: cannot be updated
        this._postActuel = null;

        // can be updated
        this._qa = null;
        this._moytempspasser = null;
        this._etat = null;
        this._commentaire = null;


        // can be updated, don't show in the UI
        this._scanCount = null; // number of scans done to the product (qt = scanCount / 2)
        this._tempsDernierScan = null; // time of the last scan (initial or final) done to the product
    }

    // getters and setters

        // getter and setter for nof
        get nof() {
            return this._nof;
        }
        set nof(value) {
            this._nof = value;
        }

        // getter and setter for refProduit
        get refProduit() {
            return this._refProduit;
        }
        set refProduit(value) {
            this._refProduit = value;
        }

        // getter and setter for qt
        get qt() {
            return this._qt;
        }
        set qt(value) {
            this._qt = value;
        }

        // getter and setter for tempsDebut
        get tempsDebut() {
            return this._tempsDebut;
        }
        set tempsDebut(value) {
            this._tempsDebut = value;
        }

        // getter and setter for tempsFin
        get tempsFin() {
            return this._tempsFin;
        }
        set tempsFin(value) {
            this._tempsFin = value;
        }

        // getter and setter for postActuel
        get postActuel() {
            return this._postActuel;
        }
        set postActuel(value) {
            this._postActuel = value;
        }

        // getter and setter for qa
        get qa() {
            return this._qa;
        }
        set qa(value) {
            this._qa = value;
        }
        isQaCompleted() {
            return (this._qa === this._qt) 
        }

        // getter and setter for moytempspasser
        get moytempspasser() {
            return this._moytempspasser;
        }
        set moytempspasser(value) {
            this._moytempspasser = value;
        }

        // getter and setter for etat
        get etat() {
            return this._etat;
        }
        set etat(value) {
            this._etat = value;
        }

        // getter and setter for commentaire
        get commentaire() {
            return this._commentaire;
        }
        set commentaire(value) {
            this._commentaire = value;
        }

        // getter and setter for scanCount
        get scanCount() {
            return this._scanCount;
        }
        set scanCount(value) {
            this._scanCount = value;
        }
        isSecondScan() {
            return (this._scanCount % 2 === 1) // true: number of scans is odd
        }

        // getter and setter for tempsDernierScan
        get tempsDernierScan() {
            return this._tempsDernierScan;
        }
        set tempsDernierScan(value) {
            this._tempsDernierScan = value;
        }

        // getter of marque fix
        isSameMarque(scan) { // check if the scan has the same marque fix (nof, refProduit, qt) as the row
            if (this.nof === scan.nof && this.refProduit === scan.refProduit && this.qt === scan.qt) {
                return true;
            } else {
                return false;
            }
        }

        // getter for empty
        isEmpty() { // check if the post is empty (qa < qt)
            return (this.nof === null) 
        }
    
        // setter for clear
        clear() {
            this.nof = null;
            this.refProduit = null;
            this.qt = null;
            this.tempsDebut = null;
            this.tempsFin = null;
            this.qa = null;
            this.moytempspasser = null;
            this.etat = null;
            this.commentaire = null;
            this.scanCount = null;
            this.tempsDernierScan = null;
        }



    // update setters
        
        // update setter for tempsFin
        tempsFinUpdate(value) {
            if (this.isQaCompleted())
                this.tempsFin = value;
        }

        // update setter for qa
        qaUpdate() {
            if (!this.isQaCompleted() && !this.isSecondScan()) { // if the qa is less than the qt, and we are in the initial scan, update it
                this.qa = this.qa + 1;
            }
        }

        // update setter for moytempspasser
        moytempspasserUpdate(value) {
            // moytempspasser = ((moytempspasser * scanCount) + ((tempsActuel - tempsDernierScan) in seconds)) / scanCount + 1
            if (this.scanCount > 0) // if this is not the first scan
                this.moytempspasser = ((this.moytempspasser * (this.scanCount - 1)) + ((value - this.tempsDernierScan) / 1000)) / (this.scanCount); 
            this.moytempspasser = Math.round(this.moytempspasser); // round the moytempspasser value
        }

        // update setter for etat
        etatUpdate(value) {
            this.etat = (value === true || this.etat === true);
        }

        // update setter for commentaire
        commentaireUpdate(value) {
            if (this.commentaire !== "" && value !== "") // if the commentaire and value are not empty
                this.commentaire += "\n" // add a new line
            this.commentaire += value // update the commentaire value
        }

        // update setter for scanCount
        scanCountUpdate() {
            if (this.scanCount < this.qt * 2)
                this.scanCount = this.scanCount + 1; // increment the scan count
        }

        // update setter for tempsDernierScan
        tempsDernierScanUpdate(value) {
            this.tempsDernierScan = value; // set the tempsDernierScan to the current time
        }

        // update setter for all
        allUpdate(scan) {
            this.moytempspasserUpdate(scan.tempsActuel);
            this.etatUpdate(scan.etat);
            this.commentaireUpdate(scan.commentaire);

            this.scanCountUpdate();
            this.qaUpdate();

            this.tempsFinUpdate(scan.tempsActuel);
            this.tempsDernierScanUpdate(scan.tempsActuel);
        }

        






    // fill post name
    fillPostName(postName) {
        this.postActuel = postName;
    }

    // fill active row (qa < qt) from the database
    fillFromDB(row) {
        // fill all the variables except postActuel with the data from the database
        this.nof = row.nof;
        this.refProduit = row.ref_produit;
        this.qt = row.qt;
        this.tempsDebut = row.temps_debut;
        this.tempsFin = null; // set tempsFin to null
        this.qa = row.qa;
        this.moytempspasser = row.moy_temps_passer;
        this.etat = row.etat;
        this.commentaire = row.commentaire;
        this.scanCount = row.scan_count;
        this.tempsDernierScan = row.temps_dernier_scan;
    }

    // fill a new values from scan
    fillNew(scan) {
        // fill all the variables except postActuel with the data from the scan
        this.nof = scan.nof; 
        this.refProduit = scan.refProduit;
        this.qt = scan.qt; 
        this.qa = 0;
        this.moytempspasser = 0;
        this.etat = scan.etat;
        this.commentaire = scan.commentaire;

        this.tempsDebut = scan.tempsActuel;
        this.tempsFin = null;

        this.scanCount = 1;

        this.tempsDernierScan = scan.tempsActuel;
    }


    // update the post with the scan
    async update(scan) {

        let scanRejected = true; // true if the scan is rejected
        let secondScan = false; // initial scan


        if(!this.isEmpty()) { // if the post is not empty
            if (this.isSameMarque(scan)) { // check if the scan has the same marque fix (nof, refProduit, qt) as the row
                if (!this.isQaCompleted()) { // if the qa is less than the qt
                    this.allUpdate(scan); // update all the variables (that can be updated)
                    await TrackingDB.updateScan(this); // update the scan in the database
                    scanRejected = false;
                    secondScan = this.isSecondScan(); // check if the scan is the second scan
                }
            }
        }
        else { // if the post is empty
            const scanNotExist = await TrackingDB.isScanNotExist(scan); // check if the scan is Not exist in the database (nof, postActuel)
            
            if (scanNotExist) { // if the scan is Not exist in the database
                const nofExist = await TrackingDB.isNofExist(scan); // check if the nof exists in the database

                if (nofExist === 1) { // if the nof exists in the database
                    this.fillNew(scan);
                    await TrackingDB.insertScan(this); // insert the scan in the database
                    scanRejected = false;
                    secondScan = this.isSecondScan(); // check if the scan is the second scan
                }
                else if (nofExist === 0) { // if the nof does not exist in the database
                    this.fillNew(scan);
                    await TrackingDB.insertMarque(this); // insert the new marque fix (new nof) in the database
                    await TrackingDB.insertScan(this); // insert the scan in the database
                    scanRejected = false;
                    secondScan = this.isSecondScan(); // check if the scan is the second scan
                }

            }


        }



        
        if (!this.isEmpty())
            if (this.isQaCompleted()) 
                this.clear(); // if the post is not empty and if the qa is equal to the qt, clear the post
        


        // return information about the update (scan rejected?, scan initial or final?)
        return {scanRejected: scanRejected, secondScan: secondScan};


    }


    // show the active row (qa < qt) in the console
    show() {
        console.log("nof: " + this.nof);
        console.log("refProduit: " + this.refProduit);
        console.log("qt: " + this.qt);
        console.log("tempsDebut: " + this.tempsDebut);
        console.log("tempsFin: " + this.tempsFin);
        console.log("postActuel: " + this.postActuel);
        console.log("qa: " + this.qa);
        console.log("moytempspasser: " + this.moytempspasser);
        console.log("etat: " + this.etat);
        console.log("commentaire: " + this.commentaire);
        console.log("scanCount: " + this.scanCount);
        console.log("tempsDernierScan: " + this.tempsDernierScan);
    }

        

    


}

module.exports = Post;