const fs = require('fs').promises;

class TextTocsv {


    static async texttocsv(textfilePath, csvFilePath) {

        
        console.log('text to csv class working');

        const data = await fs.readFile(textfilePath, 'utf-8');
        const lines = data.split(/\r?\n/);

        let rows = [];
        let currentRow = null;
        let currentCol = 0;
        
        


        for (let line of lines) {
            line = line.trim();
            if (line.toLowerCase().startsWith('numero de serie:')) {
                // Start a new row
                if (currentRow) rows.push(currentRow);
                currentRow = [];
                currentCol = 0;
                currentRow[0] = line.substring('numero de serie:'.length).trim();
            } else if (line.toLowerCase().startsWith('recu    :')) {
                // Go to next column and fill it
                if (currentRow) {
                    currentCol++;
                    currentRow[currentCol] = line.substring('recu    :'.length).trim();
                }
            }
        }
        // Push the last row if exists
        if (currentRow) rows.push(currentRow);

        



        // Convert rows to CSV string
        const csv = rows.map(row =>
            row.map(cell =>
                cell === undefined ? '' : `"${String(cell).replace(/"/g, '""')}"`
            ).join(',')
        ).join('\n');

        // Write CSV to file
        await fs.writeFile(csvFilePath, csv, 'utf-8');
        console.log(`CSV file written to ${csvFilePath}`);
        

    }


}

module.exports = TextTocsv;