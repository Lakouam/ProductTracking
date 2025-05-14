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
            temps_fin DATETIME,
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


    // drop tables
    static dropTables() {
        let sql3 = `DROP TABLE IF EXISTS scan`;
        this.connection.query(sql3, (err, result) => {
            if (err) throw err;
            console.log("Table scan dropped!");
        });

        let sql = `DROP TABLE IF EXISTS post`;
        this.connection.query(sql, (err, result) => {
            if (err) throw err;
            console.log("Table post dropped!");
        });

        let sql2 = `DROP TABLE IF EXISTS marque`;
        this.connection.query(sql2, (err, result) => {
            if (err) throw err;
            console.log("Table marque dropped!");
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
            ['2533024', 'Post 1', 0, 0, 0, '', new Date(), null, 1, new Date()],
            ['2533100', 'Post 2', 0, 0, 0, '', new Date(), null, 1, new Date()]
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


    // update the table scan by a post
    static updateScan(post) {
        // update moytempspasser, etat, commentaire, scanCount, qa, tempsFin, tempsDernierScan of the row where nof = post.nof and postActuel = post.postActuel
        let sql = `UPDATE scan SET moy_temps_passer = ?, etat = ?, commentaire = ?, scan_count = ?, qa = ?, temps_fin = ?, temps_dernier_scan = ? WHERE nof = ? AND post_actuel = ?`;
        this.connection.query(sql, [post.moytempspasser, post.etat, post.commentaire, post.scanCount, post.qa, post.tempsFin, post.tempsDernierScan, post.nof, post.postActuel]
                            , (err, result) => {
            if (err) throw err;
            console.log("Table scan updated!: " + result.affectedRows + " row(s) updated");
        });

    }


    // check if the scan is exist in the database
    static isScanNotExist(scan) {
        return new Promise((resolve, reject) => {
            // check if the scan is not in the database
            let sql = `SELECT * FROM scan WHERE nof = ? AND post_actuel = ?`;
            this.connection.query(sql, [scan.nof, scan.postActuel], (err, result) => {
                if (err) {
                    reject(err); // Reject the promise if there's an error
                    return;
                }

                

                // If the scan is not in the database, resolve with true
                if (result.length === 0) {
                    console.log("Scan Not exist in the database!");
                    resolve(true);
                } else {
                    console.log("Scan exist in the database!");
                    resolve(false);
                }
            });
        });
    }


    // check if the nof exists in the database (1: exist, 0: not exist, -1: Corrupted)
    static isNofExist(scan) {
        return new Promise((resolve, reject) => {
            // check if the nof is not in the database
            let sql = `SELECT * FROM marque WHERE nof = ?`;
            this.connection.query(sql, [nof], (err, result) => {
                if (err) {
                    reject(err); // Reject the promise if there's an error
                    return;
                }

                // If the nof is not in the database, resolve with 1
                if (result.length === 0) {
                    console.log("Nof Not exist in the database!");
                    resolve(1);
                } else {
                    if(scan.refProduit === result[0].ref_produit && scan.qt === result[0].qt){ // nof has same ref_produit AND qt
                        console.log("Nof exist in the database!");
                        resolve(0);
                    }
                    else {
                        console.log("Nof exist in the database but scan is corrupted!");
                        resolve(-1);
                    }
                        
                }
            });
        });
    }



    // insert a row into the table scan
    static insertScan(post) {
        // insert a row into the table scan
        let sql = `INSERT INTO scan (nof, post_actuel, qa, moy_temps_passer, etat, commentaire, temps_debut, temps_fin, scan_count, temps_dernier_scan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        this.connection.query(sql, [post.nof, post.postActuel, post.qa, post.moytempspasser, post.etat, post.commentaire, post.tempsDebut, post.tempsFin, post.scanCount, post.tempsDernierScan]
                            , (err, result) => {
            if (err) throw err;
            console.log("Table scan inserted!: " + result.affectedRows + " row(s) inserted");
        });
    }

    
    



}

module.exports = TrackingDB;