class ScanData {


    static NOFSIZE = 7; // size of nof
    static REFPSIZE = 6; // size of refProduit



    // if there is a problem in the data continue with the default values
    constructor(data) {
        
        // default values like if the data is empty
        this.nof = "";
        this.refProduit = "";
        this.qt = 0;
        this.postActuel = "";
        this.etat = false;
        this.commentaire = "";
        this.tempsActuel = new Date(); // the current date and time


        // if data is a string
        if(typeof data === "string"){
            // split the string into an array of strings by the character "/"
            let dataArray = data.split("/");

            // the array should contain 4 elements
            if(dataArray.length === 4) {
                // the first element is the nof (7 letters), refProduit (6 letters), qt (the rest of the string if is a number)
                // test if the first element has no space
                if(dataArray[0].indexOf(" ") === -1) {
                        // test if the first element is a string of length 14 (7 + 6 + 1) or more
                    if(dataArray[0].length >= ScanData.NOFSIZE + ScanData.REFPSIZE + 1) {
                        this.nof = dataArray[0].substring(0, ScanData.NOFSIZE); // the first 7 letters
                        this.refProduit = dataArray[0].substring(ScanData.NOFSIZE, ScanData.NOFSIZE + ScanData.REFPSIZE); // the next 6 letters
                        // test if the rest of the string is a number
                        if(!isNaN(dataArray[0].substring(ScanData.NOFSIZE + ScanData.REFPSIZE))) {
                            this.qt = parseInt(dataArray[0].substring(ScanData.NOFSIZE + ScanData.REFPSIZE)); // the rest of the string is a number
                        } else {
                            this.qt = 0; // if not, set qt to 0
                        }
                    }
                }
                
                // the second element is the postActuel
                this.postActuel = dataArray[1]; 
                // if the value is "true", convert it to a boolean
                if(dataArray[2] === "true") this.etat = true; 
                // the fourth element is the commentaire
                this.commentaire = dataArray[3]; 
            } 
        }
        
        
    }


    // true if the scan is valid, false otherwise
    isValide(){
        // by default 
            // nof is empty or has 7 letters
            // refProduit is empty or has 6 letters
            // qt is 0 or a number
            // postActual is empty or a string
            // etat is false or true
            // commentaire is empty or a string



        if(this.nof === "") return false; // nof is empty

        if(this.refProduit === "") return false; // refProduit is empty

        if(this.qt === 0) return false; // qt is equal to 0

        if(this.postActuel === "") return false; // postActuel is empty

        return true;
    }

    // return the scan data as a string
    toString(){
        return "NOF: " + this.nof + ", refProduit: " + this.refProduit + ", QT: " + this.qt +", Post Actual: " + this.postActuel + ", etat: " + this.etat + ", commentaire: " + 
            this.commentaire + ", tempsActuel: " + this.tempsActuel.toLocaleString();
    }

    // return and error message if the scan is not valid
    errorMessage(){
        let message = "La syntaxe du scan est incorrecte";
        return message;
    }



    // turn data in table
    static scanToObject(data) {
        // if data is a string
        if(typeof data === "string"){
            // if data is a string of length 14 (7 + 6 + 1) or more
            if (data.length >= ScanData.NOFSIZE + ScanData.REFPSIZE + 1) {
                return {
                    nof: data.substring(0, ScanData.NOFSIZE), // the first 7 letters
                    refProduit: data.substring(ScanData.NOFSIZE, ScanData.NOFSIZE + ScanData.REFPSIZE), // the next 6 letters
                    // test if the rest of the string is a number
                    qt: isNaN(data.substring(ScanData.NOFSIZE + ScanData.REFPSIZE)) ? 0 : parseInt(data.substring(ScanData.NOFSIZE + ScanData.REFPSIZE)), // the rest of the string is a number
                };
            }

        }

        return null;
    }

}

module.exports = ScanData;