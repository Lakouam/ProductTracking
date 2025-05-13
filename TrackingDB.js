class TrackingDB {

    // Import the mysql module
    static mysql = require('mysql2');

    // Database connection details
    static host = "localhost";
    static user = "root"; 
    static password = "muslim1997";
    static database = "trackingdb";

    // Create a connection to the database
    static connection = this.mysql.createConnection({
        host: this.host,
        user: this.user,
        password: this.password,
        database: this.database
    });


    // Function to create the database if they do not exist
    static createDatabase() {
        this.connection.connect((err) => {
            if (err) throw err;
            console.log("Connected to the database!");

            // Create the database if it doesn't exist
            this.connection.query(`CREATE DATABASE IF NOT EXISTS ${this.database}`, (err, result) => {
                if (err) throw err;
                console.log("Database created or already exists!");

                
            });
        });
    }


    // Function to create the tables if it doesn't exist
    static createTables() {


        // create table post (id, name)
        let sql = `CREATE TABLE IF NOT EXISTS post (
            name VARCHAR(255) PRIMARY KEY
        )`;

        this.connection.query(sql , (err, result) => {
            if (err) throw err;
            console.log("Table post created or already exists!");
        });


        // create table marque fix (nof, refProduit, qt)
        let sql2 = `CREATE TABLE IF NOT EXISTS marque (
            nof VARCHAR(255) NOT NULL,
            ref_produit VARCHAR(255) NOT NULL,
            qt INT NOT NULL,
            PRIMARY KEY (nof)
        )`;

        this.connection.query(sql2 , (err, result) => {
            if (err) throw err;
            console.log("Table marque created or already exists!");
        });


        // create table scan (nof, postActuel, qa, moytempspasser, etat, commentaire, tempsDebut, tempsFin, scanCount, tempsDernierScan)
        let sql3 = `CREATE TABLE IF NOT EXISTS scan (
            nof VARCHAR(255) NOT NULL,
            post_actuel VARCHAR(255) NOT NULL,
            qa INT NOT NULL,
            moy_temps_passer INT NOT NULL,
            etat BOOLEAN NOT NULL,
            commentaire VARCHAR(255) NOT NULL,
            temps_debut DATETIME NOT NULL,
            temps_fin DATETIME NOT NULL,
            scan_count INT NOT NULL,
            temps_dernier_scan DATETIME NOT NULL,
            PRIMARY KEY (nof, post_actuel),
            FOREIGN KEY (nof) REFERENCES marque(nof),
            FOREIGN KEY (post_actuel) REFERENCES post(name)
        )`;

        this.connection.query(sql3 , (err, result) => {
            if (err) throw err;
            console.log("Table scan created or already exists!");
        });
    }





    // Function to insert values into the tables if they don't exist
    static insertValuesInitial() {
        // Insert a value into the table post if it doesn't exist
        let values = [
            ['Post 1'],
            ['Post 2'],
            ['Post 3'],
            ['Post 4'],
            ['Post 5']
        ];
        let sql = `INSERT IGNORE INTO post (name) VALUES ?`;
        this.connection.query(sql, [values], (err, result) => {
            if (err) throw err;
            console.log("Values inserted into table post if not existed!");
        });


        // Insert a value into the table marque if it doesn't exist
        let values2 = [
            ['2533024', 'AEG661', 3],
            ['2533100', '0EMS15', 4]
        ];
        let sql2 = `INSERT IGNORE INTO marque (nof, ref_produit, qt) VALUES ?`;
        this.connection.query(sql2, [values2], (err, result) => {
            if (err) throw err;
            console.log("Values inserted into table marque if not existed!");
        });


        // Insert a value into the table scan if it doesn't exist
        let values3 = [
            ['2533024', 'Post 1', 0, 0, 0, '', '2023-10-01 00:00:00', null, 1, '2023-10-01 00:00:00'],
            ['2533100', 'Post 2', 0, 0, 0, '', '2023-10-01 00:00:00', null, 1, '2023-10-01 00:00:00']
        ];
        let sql3 = `INSERT IGNORE INTO scan (nof, post_actuel, qa, moy_temps_passer, etat, commentaire, temps_debut, temps_fin, scan_count, temps_dernier_scan) VALUES ?`;
        this.connection.query(sql3, [values3], (err, result) => {
            if (err) throw err;
            console.log("Values inserted into table scan if not existed!");
        });
        
    }



    // clear all the tables
    static clearTables() {

        let sql3 = `DELETE FROM scan`;
        this.connection.query(sql3, (err, result) => {
            if (err) throw err;
            console.log("Table scan cleared!");
        });

        let sql = `DELETE FROM post`;
        this.connection.query(sql, (err, result) => {
            if (err) throw err;
            console.log("Table post cleared!");
        });

        let sql2 = `DELETE FROM marque`;
        this.connection.query(sql2, (err, result) => {
            if (err) throw err;
            console.log("Table marque cleared!");
        });
    }




    // get data from the database (temps_debut, temps_fin, nof, ref_produit, qt, post_actuel, qa, moy_temps_passer, etat, commentaire)
    static getData() {


        return new Promise((resolve, reject) => {
            let sql = `SELECT temps_debut, temps_fin, scan.nof AS nof, ref_produit, qt, post_actuel, qa, moy_temps_passer, etat, commentaire FROM scan INNER JOIN marque ON scan.nof = marque.nof`;

            this.connection.query(sql, (err, result, fields) => {
                if (err) {
                    reject(err); // Reject the promise if there's an error
                    return;
                }

                console.log("Data retrieved from the database!");

                // Map the result to a two-dimensional array
                let rows = result.map(row => [
                    row.temps_debut,
                    row.temps_fin,
                    row.nof,
                    row.ref_produit,
                    row.qt,
                    row.post_actuel,
                    row.qa,
                    row.moy_temps_passer,
                    row.etat,
                    row.commentaire
                ]);

                // Add the column names as the first row
                let columns = fields.map(field => field.name);
                rows.unshift(columns);

                resolve(rows); // Resolve the promise with the data
            });
        });
        
        
    }




    // get Active row (qa < qt) of a post
    static getActiveRow(post) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT temps_debut, temps_fin, scan.nof AS nof, ref_produit, qt, post_actuel, qa, moy_temps_passer, etat, commentaire, scan_count, temps_dernier_scan FROM scan INNER JOIN marque ON scan.nof = marque.nof WHERE post_actuel = ? AND qa < qt`;
            this.connection.query(sql, [post], (err, result, fields) => {
                if (err) {
                    reject(err); // Reject the promise if there's an error
                    return;
                }

                console.log("Active row retrieved from the database!");

                // Map the result to a two-dimensional array
                let rows = result.map(row => [
                    row.temps_debut,
                    row.temps_fin,
                    row.nof,
                    row.ref_produit,
                    row.qt,
                    row.post_actuel,
                    row.qa,
                    row.moy_temps_passer,
                    row.etat,
                    row.commentaire,
                    row.scan_count,
                    row.temps_dernier_scan
                ]);
                
                // resolve an object {column name: first row of that column}
                let columns = fields.map(field => field.name);


                let obj = {};
                for (let i = 0; i < columns.length; i++) {
                    if(rows.length === 0)
                        obj[columns[i]] = null;
                    else obj[columns[i]] = rows[0][i];
                }


                resolve(obj); // Resolve the promise with the data
                
            });
        });
    }




}

module.exports = TrackingDB;