class TableData {

    // our table
    constructor(){
        this.nof = ["2533024", "2533100"];
        this.refProduit = ["AEG661", "0EMS15"];
        this.qt = [200, 200];
        this.postActuel = ["Post 2", "Post 1"];
        this.qa = [0, 0];
        this.moytempspasser = ["", ""];
        this.etat = ["false", "false"];
        this.commentaire = ["", ""];

        this.scanCount = [1, 1]; // number of scans done to the product (qt = scanCount / 2)
    }


    // update table
    updateTable(scan) {

    }


    // return a list of rows
    getRows() {
        let rows = [];

        for (let i = 0; i < this.nof.length; i++) {
            rows.push([
                this.nof[i],
                this.refProduit[i],
                this.qt[i],
                this.postActuel[i],
                this.qa[i],
                this.moytempspasser[i],
                this.etat[i],
                this.commentaire[i]
            ]);
        }

        return rows;
    }


}

module.exports = TableData;