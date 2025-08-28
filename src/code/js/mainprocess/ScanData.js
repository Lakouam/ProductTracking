const TrackingDB = require('./TrackingDB.js');

class ScanData {


    static NOFSIZE = 9; // size of nof



    // if there is a problem in the data continue with the default values
    constructor() {
        
        // default values like if the data is empty
        this.n_serie = "";
        this.nof = "";
        this.refProduit = "";
        this.qt = 0;
        this.postActuel = "";
        this.etat = false;
        this.commentaire = "";
        this.tempsActuel = new Date(); // the current date and time
        this.message = "";

    }


    static async create(data) {
        const scan = new ScanData();

        if (typeof data === "string") {
            let dataArray = data.split("/");
            if (dataArray.length === 4) {
                if (dataArray[0].indexOf(" ") === -1) {
                    if (dataArray[0].length >= ScanData.NOFSIZE + 1) {
                        scan.nof = dataArray[0].substring(0, ScanData.NOFSIZE);
                        scan.n_serie = dataArray[0].substring(ScanData.NOFSIZE);

                        // Await the database call here
                        try {
                            const { ref_produit, qt } = await TrackingDB.getNof(scan.nof);
                            scan.refProduit = ref_produit;
                            scan.qt = qt;
                        } catch (err) {
                            scan.refProduit = "";
                            scan.qt = 0;
                        }
                    }
                }
                scan.postActuel = dataArray[1];
                if (dataArray[2] === "true") scan.etat = true;
                scan.commentaire = dataArray[3];
            }
        }

        return scan;
    }


    // true if the scan is valid, false otherwise
    isValide(){
        // by default 
            // n_serie is empty or has more than 1 letter
            // nof is empty or has 9 letters
            // refProduit is empty or has more than 1 letter
            // qt is 0 or a number
            // postActual is empty or a string
            // etat is false or true
            // commentaire is empty or a string



        if(this.n_serie === "" || this.nof === "" || this.postActuel === "") {
            this.message = "La syntaxe du scan est incorrecte.";
            return false;
        }

        if(this.refProduit === "" || this.qt === 0) {
            this.message = "Le NOF « " + this.nof + " » n'existe pas dans la base de données.";
            return false;
        }

        return true;
    }

    // return the scan data as a string
    toString(){
        return "n_serie: " + this.n_serie + ", NOF: " + this.nof + ", refProduit: " + this.refProduit + ", QT: " + this.qt +", Post Actual: " + this.postActuel + ", etat: " + this.etat + ", commentaire: " + 
            this.commentaire + ", tempsActuel: " + this.tempsActuel.toLocaleString();
    }

    // return and error message if the scan is not valid
    errorMessage(){
        if(this.message === "") return "La syntaxe du scan est incorrecte.";
        else return this.message;
    }



    // turn data in table
    static scanToObject(data) {
        // if data is a string
        if(typeof data === "string"){
            // if data is a string of length 10 (9 + 1) or more
            if (data.length >= ScanData.NOFSIZE + 1) {
                return {
                    nof: data.substring(0, ScanData.NOFSIZE), // the first 9 letters
                    n_serie: data.substring(ScanData.NOFSIZE), // the rest of the string
                };
            }

        }

        return null;
    }



    // check if the nof is valid
    static isValidNof(nof, refProduit, qt) {
        // if nof is a string of length 7
        if (typeof nof === "string" && nof.length === ScanData.NOFSIZE) {
            // if refProduit is a string of length 6
            if (typeof refProduit === "string" && refProduit.length > 0) {
                // if qt is a number
                if (!isNaN(qt) && parseInt(qt) > 0) {
                    return true; // all conditions are met
                }
            }
        }

        return false; // one or more conditions are not met
    }

}

module.exports = ScanData;