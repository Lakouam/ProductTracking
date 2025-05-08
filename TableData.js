class TableData {

    // our table
    constructor(){
        this.nof = [];
        this.refProduit = [];
        this.qt = [];
        this.postActuel = [];
        this.qa = [];
        this.moytempspasser = [];
        this.etat = [];
        this.commentaire = [];

        this.scanCount = []; // number of scans done to the product (qt = scanCount / 2)
    }


    // update table
    updateTable(scan) {

    }


    // test class
    testTableDataClass() {
        return "TableData Class is working!";
    }


}

module.exports = TableData;