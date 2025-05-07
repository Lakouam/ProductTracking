class ScanData {
    // if there is a problem in the data continue with the default values
    constructor(data) {
        
        // default values like if the data is empty
        this.nof = "";
        this.refProduit = "";
        this.qt = 0;
        this.postActuel = "";
        this.etat = false;
        this.commentaire = "";


        // if data is a string
        if(typeof data === "string"){
            // split the string into an array of strings by the character "/"
            let dataArray = data.split("/");

            // the array should contain 4 elements
            if(dataArray.length === 4) {
                // the first element is the nof (7 letters), refProduit (6 letters), qt (the rest of the string if is a number)
                // test if the first element has no space
                if(dataArray[0].indexOf(" ") === -1) {
                        // test if the first element is a string of length 14 or more
                    if(dataArray[0].length >= 14) {
                        this.nof = dataArray[0].substring(0, 7); // the first 7 letters
                        this.refProduit = dataArray[0].substring(7, 13); // the next 6 letters
                        // test if the rest of the string is a number
                        if(!isNaN(dataArray[0].substring(13))) {
                            this.qt = parseInt(dataArray[0].substring(13)); // the rest of the string is a number
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
        if(this.nof === "") return false;
        else return true;
    }

    // return the scan data as a string
    toString(){
        return "NOF: " + this.nof + ", refProduit: " + this.refProduit + ", QT: " + this.qt +", Post Actual: " + this.postActuel + ", etat: " + this.etat + ", commentaire: " + this.commentaire;
    }

}

module.exports = ScanData;