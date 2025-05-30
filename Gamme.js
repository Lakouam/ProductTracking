const XLSX = require('xlsx');  // Use the xlsx package for reading Excel files (supports .xls and .xlsx).
const TrackingDB = require('./TrackingDB');

class Gamme {

    static async fileToDB(filePath) {
        const workbook = XLSX.readFile(filePath);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]; // or loop through all sheets
        const data = XLSX.utils.sheet_to_json(worksheet, {raw:true}); // Array of objects, {raw:true} for better performance.

        console.log('Read file done, starting to insert gammes in database');

        // a two dimentional arrays
        let gamme = []; // add [column 1]
        let post = []; // add [column 2]
        let ope = []; // add [gamme[0][0], column 2, column 1]

        let nbRows = 1; // the first row is the column row, and the second one we don't need it

        // iterate through the data
        for (const row of data) {
            nbRows++; // increment rowId
            // column 1 is 'Gammes de fabrication' and column 2 is 'Gammes'

            if (nbRows < 3) continue; // skip second row in excel
            
            // if the first column is not a number, it is a new gamme (send the gamme precedent to the database) (the last gamme is sent from here because the last row in excel column 1 is 'Page -1 sur 1')
            if (isNaN(row['Gammes de fabrication'])) {
                /*
                if(nbRows >= 35481) {
                    // show in consol gamme, post, ope tables
                    console.log(`Gamme: ${gamme}`);
                    console.log(`    ${post.length} === ${ope.length}`);
                    for (let i = 0; i < post.length; i++) {
                        console.log(`     Post: ${post[i]}, Ope: ${ope[i]}`);
                    }
                }
                */

                // send gamme, post and ope to DB
                if (gamme.length !== 0) 
                    await TrackingDB.insertGamme(gamme, post, ope);


                // clear gamme, post, ope
                gamme = [];
                post = [];
                ope = [];

                gamme.push([row['Gammes de fabrication']]); // add to gamme
            } else { // if the first column is a number, it is an operation
                // add column 2 to post
                post.push([row['Gammes']]);

                // add [gamme[0][0], column 2, column 1] to ope
                ope.push([gamme[0][0], row['Gammes'], row['Gammes de fabrication']]);
            }
        }

        console.log('insertion of gammes in database finished');
    }


}

module.exports = Gamme;