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

        // getter and setter for tempsDernierScan
        get tempsDernierScan() {
            return this._tempsDernierScan;
        }
        set tempsDernierScan(value) {
            this._tempsDernierScan = value;
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
        this.tempsFin = row.temps_fin;
        this.qa = row.qa;
        this.moytempspasser = row.moy_temps_passer;
        this.etat = row.etat;
        this.commentaire = row.commentaire;
        this.scanCount = row.scan_count;
        this.tempsDernierScan = row.temps_dernier_scan;
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