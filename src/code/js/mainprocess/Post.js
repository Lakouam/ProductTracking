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
        this._nSerie = null;


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

        // getter and setter for nSerie
        get nSerie() {
            return this._nSerie;
        }
        set nSerie(value) {
            this._nSerie = value;
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
            this.nSerie = null;
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
            this.etat = (value === true || this.etat === true || this.etat === 1);
        }

        // update setter for commentaire
        commentaireUpdate(value) {
            if (this.commentaire !== "" && value !== "") // if the commentaire and value are not empty
                this.commentaire += "\n" // add a new line
            this.commentaire += value // update the commentaire value
        }

        nSerieUpdate(value) {
            this.nSerie = value; // set the nSerie to the current value
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
            this.nSerieUpdate(scan.n_serie);

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
        this.nSerie = null; // set nSerie to null, it will be filled later if needed
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
        this.nSerie = scan.n_serie;

        this.tempsDebut = scan.tempsActuel;
        this.tempsFin = null;

        this.scanCount = 1;

        this.tempsDernierScan = scan.tempsActuel;
    }


    // update the post with the scan
    async update(scan, store, user) {

        let scanRejected = true; // true if the scan is rejected
        let errorMessage = ""; // error message

        let num_ope = await TrackingDB.currentNumopeFromPost(scan.nof, this.postActuel, scan.n_serie); // get the current num_ope from the database
        console.log("num_ope: " + num_ope); // log the num_ope
        let data = await TrackingDB.getActiveRow(this.postActuel, num_ope, scan.nof); // get the active row from the database
        this.fillFromDB(data); // fill the post with the data from the database
        console.log("Post nof: " + this.nof);



        if(!this.isEmpty()) { // if the post is not empty
            if (this.isSameMarque(scan)) { // check if the scan has the same marque fix (nof, refProduit, qt) as the row
                if (!this.isQaCompleted()) { // if the qa is less than the qt
                    this.allUpdate(scan); // update all the variables (that can be updated)
                    const ScanUpdated = await TrackingDB.updateScan(this, num_ope, user); // update the scan in the database

                    if (ScanUpdated.is) {// if the scan is updated in the database
                        scanRejected = false;
                        store.set(this.postActuel, {ope: num_ope, nof: this.nof}); // save the current num_ope and nof in store
                    }
                    else { // error messages
                        if (ScanUpdated.why === "There is an active carte on this operation") // updateCarte function
                            errorMessage = "Une carte « " + ScanUpdated.carte + " » est déjà active sur cette opération.";
                        else if (ScanUpdated.why === "Carte not completed yet") // updateCarte function
                            errorMessage = "La carte n’est pas encore terminée pour l’opération « " + ScanUpdated.ope + " ».";
                        else if (ScanUpdated.why === "Next operation does not match current num_ope") // updateCarte function
                            errorMessage = "La carte doit être scannée à l’opération « " + ScanUpdated.ope + " ».";
                        else if (ScanUpdated.why === "Carte completed") // updateCarte function
                            errorMessage = "La carte est déjà terminée.";
                        else if (ScanUpdated.why === "Already scanned twice") // updateCarte function
                            errorMessage = "La carte a déjà été scannée deux fois.";
                        else if (ScanUpdated.why === "Carte not found") // updateCarte function
                            errorMessage = "La carte n’existe pas dans la base de données.";
                        else if (ScanUpdated.why === "Unknown error") // updateCarte function
                            errorMessage = "";

                        this.clear(); // clear the post if the update failed
                    }
                }
            }
            else {
                if (this.nof === scan.nof) errorMessage = "Le NOF « " + this.nof + " » existe déjà avec une référence produit ou une quantité différente."; // error message
                else errorMessage = "Le NOF « " + this.nof + " » n'est pas encore terminé, veuillez le terminer avant d'en scanner un nouveau."; // error message
            }
        }
        else { // if the post is empty
            const scanNotExist = await TrackingDB.isScanNotExist(scan, num_ope); // check if the scan is Not exist in the database (nof, postActuel)
            
            if (scanNotExist) { // if the scan is Not exist in the database
                const nofExist = await TrackingDB.isNofExist(scan); // check if the nof exists in the database

                if (nofExist === 1) { // if the nof exists in the database
                    this.fillNew(scan);
                    const ScanInserted = await TrackingDB.insertScan(this, num_ope, user); // insert the scan in the database

                    if (ScanInserted.is) { // if the scan is inserted in the database
                        scanRejected = false;
                        store.set(this.postActuel, {ope: num_ope, nof: this.nof}); // save the current num_ope and nof in store
                    }
                    else {

                        if (ScanInserted.why === "There is an active carte on this operation") // updateCarte function
                            errorMessage = "Une carte « " + ScanInserted.carte + " » est déjà active sur cette opération.";
                        else if (ScanInserted.why === "Carte not completed yet") // updateCarte function
                            errorMessage = "La carte n’est pas encore terminée pour l’opération « " + ScanInserted.ope + " ».";
                        else if (ScanInserted.why === "Next operation does not match current num_ope") // updateCarte function
                            errorMessage = "La carte doit être scannée à l’opération « " + ScanInserted.ope + " ».";
                        else if (ScanInserted.why === "Carte completed") // updateCarte function
                            errorMessage = "La carte est déjà terminée.";
                        else if (ScanInserted.why === "Already scanned twice") // updateCarte function
                            errorMessage = "La carte a déjà été scannée deux fois.";
                        else if (ScanInserted.why === "Carte not found") // updateCarte function
                            errorMessage = "La carte n’existe pas dans la base de données.";
                        else if (ScanInserted.why === "Unknown error") // updateCarte function
                            errorMessage = "";
                        else if (ScanInserted.prevOpe === undefined) // insertScan function
                            errorMessage = `Le poste « ${this.postActuel} » n'existe pas dans la gamme.`; // error message
                        else // insertScan function
                            errorMessage = "L'opération précédente « " + ScanInserted.prevOpe + " » n'a pas encore été scannée.";
                        this.clear(); // clear the post if the insertion failed
                    }
                }
                else if (nofExist === 0) { // if the nof does not exist in the database
                    throw new Error("Unexpected state: NOF does not exist in the database, but logic should prevent reaching this point.");
                } else if (nofExist === -1) { // if the Nof exist in the database but scan is corrupted!
                    throw new Error(`Impossible state: Le NOF « ${scan.nof} » existe déjà avec une référence produit ou une quantité différente, but logic should prevent reaching this point.`);
                }
            }
            else {
                const nofExist = await TrackingDB.isNofExist(scan); // check if the nof exists in the database
                if (nofExist === -1) throw new Error(`Impossible state: Le NOF « ${scan.nof} » a déjà été complété avec une référence produit ou une quantité différente, but logic should prevent reaching this point.`);
                else errorMessage = "Le NOF « " + scan.nof + " » est déjà terminé."; // error message
            }


        }



        
        if (!this.isEmpty())
            if (this.isQaCompleted()) {
                //store.delete(this.postActuel); // delete the post from the store if the qa is equal to the qt
                this.clear(); // if the post is not empty and if the qa is equal to the qt, clear the post
            }


        // return information about the update (scan rejected?, scan initial or final?)
        return {scanRejected: scanRejected, errorMessage: errorMessage};


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