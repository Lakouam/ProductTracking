const MyConfig = require('./MyConfig.js');

class TrackingDB {

    // Import the mysql module
    static mysql = require('mysql2');

    // Database connection details
    static host = "localhost";
    static user = "root"; 
    static password = "muslim1997";
    static database = "trackingdb";
    

    // Create a pool to the database
    static pool = this.createPool();

    // create a pool to the database
    static createPool() {
        return this.mysql.createPool({
            host: MyConfig.host, //this.host,
            user: MyConfig.user, //this.user,
            password: MyConfig.password, //this.password,
            database: MyConfig.database, //this.database,
            waitForConnections: true,
            connectionLimit: 3, // or higher if needed (1 if you want to perform only one query at a time)
            queueLimit: 0 // queue limit (0 for no limit)
            /*
                    connectionLimit: x,
                    queueLimit: 0
                This means only x queries can be processed at the same time from that app instance.
                If more than x queries are started at once, the extra queries will be queued 
            */
        });
    }

    // refresh the pool
    static refreshPool() {
        this.pool.end((err) => {
            if (err) {
                console.error('Error ending the pool:', err);
            } else {
                console.log('Pool ended successfully.');
            }
        });

        this.pool = this.createPool();
    }


    // Helper to promisify pool.query (function to await querie) used for operations (createTables, dropTables, ...)
    static queryAsync = (sql, values) => {
        return new Promise((resolve, reject) => {
            this.pool.query(sql, [values], (err, result) => {
                if (err) return reject(err); //throw err //return reject(err);
                resolve(result);
            });
        });
    };


    // Function to create the database if they do not exist
    static async createDatabase() {

        // Create the database if it doesn't exist
        let sql = `CREATE DATABASE IF NOT EXISTS ${this.database}`;
        await this.queryAsync(sql);
        console.log("Database created or already exists!");
    
    }


    // Function to create the tables if it doesn't exist
    static async createTables() {

        // create table gamme (ref_gamme)
        let sqlGamme = `CREATE TABLE IF NOT EXISTS gamme (
            ref_gamme VARCHAR(255) NOT NULL,
            PRIMARY KEY (ref_gamme)
        )`;

        await this.queryAsync(sqlGamme);
        console.log("Table gamme created or already exists!");




        // create table operation (num_ope)
        let sqlOperation = `CREATE TABLE IF NOT EXISTS operation (
            num_ope INT NOT NULL,
            PRIMARY KEY (num_ope)
        )`;

        await this.queryAsync(sqlOperation);
        console.log("Table operation created or already exists!");




        // create table gamme_operations (ref_gamme, post_machine, num_ope)
        let sqlGammeOperations = `CREATE TABLE IF NOT EXISTS gamme_operations (
            ref_gamme VARCHAR(255) NOT NULL,
            num_ope INT NOT NULL,
            post_machine VARCHAR(255) NOT NULL,
            PRIMARY KEY (ref_gamme, num_ope),
            FOREIGN KEY (ref_gamme) REFERENCES gamme(ref_gamme),
            FOREIGN KEY (num_ope) REFERENCES operation(num_ope)
        )`;

        await this.queryAsync(sqlGammeOperations);
        console.log("Table gamme_operations created or already exists!");




        // create table marque fix (nof, refProduit, qt)
        let sqlMarque = `CREATE TABLE IF NOT EXISTS marque (
            nof VARCHAR(255) NOT NULL,
            ref_produit VARCHAR(255) NOT NULL,
            qt INT NOT NULL,
            ref_gamme VARCHAR(255) NOT NULL,
            PRIMARY KEY (nof),
            FOREIGN KEY (ref_gamme) REFERENCES gamme(ref_gamme)
        )`;

        await this.queryAsync(sqlMarque);
        console.log("Table marque created or already exists!");




        // create table scan (nof, num_ope, qa, moytempspasser, etat, commentaire, tempsDebut, tempsFin, scanCount, tempsDernierScan)
        let sqlScan = `CREATE TABLE IF NOT EXISTS scan (
            nof VARCHAR(255) NOT NULL,
            num_ope INT NOT NULL,
            qa INT NOT NULL,
            moy_temps_passer INT NOT NULL,
            etat BOOLEAN NOT NULL,
            commentaire VARCHAR(255) NOT NULL,
            temps_debut DATETIME NOT NULL,
            temps_fin DATETIME,
            scan_count INT NOT NULL,
            temps_dernier_scan DATETIME NOT NULL,
            PRIMARY KEY (nof, num_ope),
            FOREIGN KEY (nof) REFERENCES marque(nof),
            FOREIGN KEY (num_ope) REFERENCES operation(num_ope)
        )`;

        await this.queryAsync(sqlScan);
        console.log("Table scan created or already exists!");

        
    }


    // drop tables
    static async dropTables() {

        let sqlScan = `DROP TABLE IF EXISTS scan`;
        await this.queryAsync(sqlScan);
        console.log("Table scan dropped!");
        

        let sqlMarque = `DROP TABLE IF EXISTS marque`;
        await this.queryAsync(sqlMarque);
        console.log("Table marque dropped!");


        let sqlGammeOperations = `DROP TABLE IF EXISTS gamme_operations`;
        await this.queryAsync(sqlGammeOperations);
        console.log("Table gamme_operations dropped!");


        let sqlOperation = `DROP TABLE IF EXISTS operation`;
        await this.queryAsync(sqlOperation);
        console.log("Table operation dropped!");


        let sqlGamme = `DROP TABLE IF EXISTS gamme`;
        await this.queryAsync(sqlGamme);
        console.log("Table gamme dropped!");
        
    }




    static async insertGamme(gamme, post, gammeOperations, operation) {
        // insert gamme into the table gamme if it doesn't exist
        let sqlGamme = `INSERT IGNORE INTO gamme (ref_gamme) VALUES ?`;
        await this.queryAsync(sqlGamme, gamme);
        //console.log("Gamme inserted into table gamme if not existed!");


        /*
        // insert post into the table post if it doesn't exist
        let sqlPost = `INSERT IGNORE INTO post (name) VALUES ?`;
        await this.queryAsync(sqlPost, post);
        //console.log("Post inserted into table post if not existed!");
        */

        // insert operation into the table operation if it doesn't exist
        let sqlOperation = `INSERT IGNORE INTO operation (num_ope) VALUES ?`;
        await this.queryAsync(sqlOperation, operation);
        //console.log("Operation inserted into table operation if not existed!");


        // insert ope into the table gamme_operations if it doesn't exist
        let sqlGammeOperations = `INSERT IGNORE INTO gamme_operations (ref_gamme, num_ope, post_machine) VALUES ?`;
        await this.queryAsync(sqlGammeOperations, gammeOperations);
        //console.log("Ope inserted into table ope if not existed!");
    }




    // Function to insert values into the tables if they don't exist
    static async insertValuesInitial() {
        /*
        // Insert a value into the table post if it doesn't exist
        let values = [
            //['Post 1'],
            //['Post 2'],
            //['Post 3'],
            //['Post 4'],
            //['Post 5'],
            ['Admin']
        ];
        let sql = `INSERT IGNORE INTO post (name) VALUES ?`;
        await this.queryAsync(sql, values);
        console.log("Values inserted into table post if not existed!");
        */



        /*
        // Insert a value into the table marque if it doesn't exist
        let values2 = [
            ['2533024', 'AEG661', 3],
            ['2533100', '0EMS15', 4]
        ];
        let sql2 = `INSERT IGNORE INTO marque (nof, ref_produit, qt) VALUES ?`;
       await this.queryAsync(sql2, values2);
        console.log("Values inserted into table marque if not existed!");
        


        // Insert a value into the table scan if it doesn't exist
        let values3 = [
            ['2533024', 'Post 1', 0, 0, 0, '', new Date(), null, 1, new Date()],
            ['2533100', 'Post 2', 0, 0, 0, '', new Date(), null, 1, new Date()]
        ];
        let sql3 = `INSERT IGNORE INTO scan (nof, post_actuel, qa, moy_temps_passer, etat, commentaire, temps_debut, temps_fin, scan_count, temps_dernier_scan) VALUES ?`;
        await this.queryAsync(sql3, values3);
        console.log("Values inserted into table scan if not existed!");
        */
        
    }



    // clear all the tables
    static async clearTables() {


        let sqlScan = `DELETE FROM scan`;
        await this.queryAsync(sqlScan);
        console.log("Table scan cleared!");
        

        let sqlMarque = `DELETE FROM marque`;
        await this.queryAsync(sqlMarque);
        console.log("Table marque cleared!");


        let sqlGammeOperations = `DELETE FROM gamme_operations`;
        await this.queryAsync(sqlGammeOperations);
        console.log("Table gamme_operations cleared!");


        let sqlOperation = `DELETE FROM operation`;
        await this.queryAsync(sqlOperation);
        console.log("Table operation cleared!");


        let sqlGamme = `DELETE FROM gamme`;
        await this.queryAsync(sqlGamme);
        console.log("Table gamme cleared!");


    }






    // run a query (Retry with Exponential Backoff & Limit the Number of Retries)
    static runQueryWithRetry(query, params = [], maxRetries = 7, baseDelay = 1000) {

        return new Promise((resolve, reject) => {

            let tryCount = 0;
            const attempt = () => {
                
                this.pool.query(query, params, (err, result, fields) => {
                    if (!err) return resolve([result, fields]); // return is important to avoid executing the next lines
                    tryCount++;
                    
                    if (tryCount < maxRetries) {
                        
                        const delay = Math.min(baseDelay * Math.pow(2, tryCount - 1), 30000); // max 30s

                        console.error("Query error, retrying in " + delay/1000 + "s:", err.message);
                        setTimeout(attempt, delay);
                        return;
                    }
                    else {
                        console.error("Max retries reached. Query failed: " + err.message);
                        return reject(err); // or throw err;
                        //throw err;
                    }
                });

            }

            attempt();

        });
    }







    // get data from the database
    static async getData(who, value) {

        // get data from the database (temps_debut, temps_fin, nof, num_ope, ref_gamme, ref_produit, qt, post_actuel, qa, moy_temps_passer, etat, commentaire)
        let sql = `SELECT temps_debut, temps_fin, scan.nof AS nof, scan.num_ope, gamme_operations.ref_gamme, marque.ref_produit, qt, post_machine AS post_actuel, qa, moy_temps_passer, etat, commentaire 
                        FROM scan 
                        INNER JOIN marque ON scan.nof = marque.nof
                        INNER JOIN gamme_operations 
                            ON scan.num_ope = gamme_operations.num_ope 
                            AND marque.ref_gamme = gamme_operations.ref_gamme
                        ORDER BY temps_debut DESC, scan.nof ASC, scan.num_ope ASC`;

        if (who === 'nof') // get data from marque (nof, ref_produit, qt, ref_gamme)
            sql = `SELECT nof, ref_produit, qt, ref_gamme FROM marque`;

        if (who === 'post') // get data from gamme_operations (post_machine)
            sql = `SELECT DISTINCT post_machine FROM gamme_operations ORDER BY post_machine`;

        if (who === 'gammes') // get data from gamme (ref_gamme)
            sql = `SELECT ref_gamme FROM gamme`;

        if (who === 'gamme-detail') // get data from gamme_operations (num_ope, post_machine) where ref_gamme = value and sort by num_ope
            sql = `SELECT num_ope, post_machine FROM gamme_operations WHERE ref_gamme = ? ORDER BY num_ope`;

        if (who === 'operations') 
            sql = `
                SELECT
                    m.nof,
                    go.num_ope,
                    CASE
                        WHEN s.qa = m.qt THEN 'Soldee'
                        ELSE 'En cours'
                    END AS status_ligne,
                    go.post_machine AS poste,
                    s.temps_debut,
                    s.temps_fin,
                    m.ref_produit,
                    m.qt,
                    s.qa,
                    s.moy_temps_passer,
                    s.etat,
                    s.commentaire
                FROM marque m
                JOIN gamme_operations go ON go.ref_gamme = m.ref_gamme
                LEFT JOIN scan s ON s.nof = m.nof AND s.num_ope = go.num_ope
                ORDER BY m.nof, go.num_ope
            `;

        let [result, fields]  = await this.runQueryWithRetry(sql, [value]);

        console.log("Data retrieved from the database!");

        // Each row is an object: [{field1: value1, field2: value2, ...}]
        let rows = result;

        // Add the column names as the first row
        let columns = fields.map(field => field.name);
        rows.unshift(columns);
        

        return rows; // Resolve the promise with the data  
        
    }




    // get Active row (qa < qt) of a post
    static async getActiveRow(post) {

        let sql = `SELECT temps_debut, temps_fin, scan.nof AS nof, ref_produit, qt, post_machine AS post_actuel, qa, moy_temps_passer, etat, commentaire, scan_count, temps_dernier_scan 
            FROM scan 
            INNER JOIN marque ON scan.nof = marque.nof
            INNER JOIN gamme_operations 
                ON scan.num_ope = gamme_operations.num_ope 
                AND marque.ref_gamme = gamme_operations.ref_gamme
            WHERE gamme_operations.post_machine = ? AND scan.qa < marque.qt
        `;
        
        let [result, fields]  = await this.runQueryWithRetry(sql, [post]);

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


        return obj; // Resolve the promise with the data
        
    }


    // update the table scan by a post
    static async updateScan(post) {
        // update moytempspasser, etat, commentaire, scanCount, qa, tempsFin, tempsDernierScan of the row where nof = post.nof and postActuel = post.postActuel
            
        let sql = `UPDATE scan SET moy_temps_passer = ?, etat = ?, commentaire = ?, scan_count = ?, qa = ?, temps_fin = ?, temps_dernier_scan = ? WHERE nof = ? AND post_actuel = ?`;

        let [result, fields]  = await this.runQueryWithRetry(sql, [post.moytempspasser, post.etat, post.commentaire, post.scanCount, post.qa, post.tempsFin, post.tempsDernierScan, post.nof, post.postActuel]);

        console.log("Table scan updated!: " + result.affectedRows + " row(s) updated");
        return result; 

    }


    // check if the scan is exist in the database
    static async isScanNotExist(scan) {
            
        // check if the scan is not in the database
        let sql = `SELECT * FROM scan WHERE nof = ? AND post_actuel = ?`;

        let [result, fields]  = await this.runQueryWithRetry(sql, [scan.nof, scan.postActuel]);
            
        // If the scan is not in the database, resolve with true
        if (result.length === 0) {
            console.log("Scan Not exist in the database!");
            return true;
        } else {
            console.log("Scan exist in the database!");
            return false;
        }
        
    }


    // check if the nof exists in the database (1: exist, 0: not exist, -1: Corrupted)
    static async isNofExist(scan) {
            
        // check if the nof is not in the database
        let sql = `SELECT * FROM marque WHERE nof = ?`;

        let [result, fields]  = await this.runQueryWithRetry(sql, [scan.nof]);

        // If the nof is not in the database, resolve with 1
        if (result.length === 0) {
            console.log("Nof Not exist in the database!");
            return 0;
        } else {
            if(scan.refProduit === result[0].ref_produit && scan.qt === result[0].qt){ // nof has same ref_produit AND qt
                console.log("Nof exist in the database!");
                return 1;
            }
            else {
                console.log("Nof exist in the database but scan is corrupted!");
                return -1;
            }
                
        }
        
    }



    // insert a row into the table scan
    static async insertScan(post) {
        
        // check if the post.postActuel exists on the ope table where ref_gamme of the ref_produit on the reference table is equal to the ref_gamme of ope
        let sqlCheckPost = `SELECT COUNT(*) AS count FROM ope INNER JOIN reference ON ope.ref_gamme = reference.ref_gamme WHERE ope.post_machine = ? AND reference.ref_produit = ?`;
        let [checkResult, fieldsCheck] = await this.runQueryWithRetry(sqlCheckPost, [post.postActuel, post.refProduit]);
        if (checkResult[0].count === 0) {
            console.log("Post " + post.postActuel + " does not exist in the ope table for the given ref_produit: " + post.refProduit);
            return {is: false}; // Post does not exist in the ope table for the given ref_produit (post not in the gamme)
        }
        console.log("Post " + post.postActuel + " exists in the ope table for the given ref_produit: " + post.refProduit + ", Counting: " + checkResult[0].count);


        // check if the previous operation (num_ope just before the current one for the same gamme) is already present in the scan table for the same NOF.
        {
            // Step 1: Get current num_ope and ref_gamme for this postActuel/refProduit
            let sqlOpe = `
                SELECT o.num_ope, o.ref_gamme
                FROM ope o
                INNER JOIN reference r ON o.ref_gamme = r.ref_gamme
                WHERE o.post_machine = ? AND r.ref_produit = ?
                LIMIT 1
            `;
            let [opeRows] = await this.runQueryWithRetry(sqlOpe, [post.postActuel, post.refProduit]);
            if (!opeRows.length) {
                // No operation found, should not happen if previous check passed
                console.log("No operation found, should not happen if previous check passed");
                return {is: false};
            }
            const { num_ope, ref_gamme } = opeRows[0];

            // Step 2: Find the previous num_ope for this gamme
            let sqlPrevNumOpe = `
                SELECT num_ope, post_machine
                FROM ope
                WHERE ref_gamme = ? AND num_ope < ?
                ORDER BY num_ope DESC
                LIMIT 1
            `;
            let [prevOpeRows] = await this.runQueryWithRetry(sqlPrevNumOpe, [ref_gamme, num_ope]);
            if (prevOpeRows.length) {
                // There is a previous operation, check if it exists in scan
                const prevNumOpe = prevOpeRows[0].num_ope;
                const prevPostMachine = prevOpeRows[0].post_machine;

                let sqlPrevScan = `
                    SELECT 1 FROM scan WHERE nof = ? AND post_actuel = ? LIMIT 1
                `;
                let [prevScanRows] = await this.runQueryWithRetry(sqlPrevScan, [post.nof, prevPostMachine]);
                if (!prevScanRows.length) {
                    // Previous operation not yet scanned
                    console.log("Previous operation " + prevNumOpe + " not yet scanned");
                    return {is: false, prevOpe: prevNumOpe};
                }
            }
        }


        // insert a row into the table scan
        let sql = `INSERT INTO scan (nof, post_actuel, qa, moy_temps_passer, etat, commentaire, temps_debut, temps_fin, scan_count, temps_dernier_scan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        let [result, fields]  = await this.runQueryWithRetry(sql, [post.nof, post.postActuel, post.qa, post.moytempspasser, post.etat, post.commentaire, post.tempsDebut, post.tempsFin, post.scanCount, post.tempsDernierScan]);
                            
        console.log("Table scan inserted!: " + result.affectedRows + " row(s) inserted");
        return {is: true}; // Return true if the insert was successful

    }

    
    // insert a row (a new nof) into the table marque
    static async insertMarque(post) {
        
        return this.addNof(post.nof, post.refProduit, post.qt);    
            
    }
    

    // get the post name from the database
    static async getPostsName() {

        let sql = `SELECT DISTINCT post_machine FROM gamme_operations ORDER BY post_machine`;

        let [result, fields]  = await this.runQueryWithRetry(sql);

        console.log("Posts names retrieved from the database!");

        // Map the result to a one-dimensional array
        let rows = result.map(row => row.post_machine);

        // Add post Admin
        rows.unshift("Admin");
        
        return rows; // Resolve the promise with the data
        
    }


    static async removeRow(value, who) {
        if (who === 'nof') {
            // First, delete from scan table where nof = value
            let sqlScan = `DELETE FROM scan WHERE nof = ?`;
            await this.runQueryWithRetry(sqlScan, [value]);

            // Then, delete from marque table where nof = value
            let sqlMarque = `DELETE FROM marque WHERE nof = ?`;
            let [result] = await this.runQueryWithRetry(sqlMarque, [value]);

            // result.affectedRows > 0 means a row was deleted from marque
            if (result && result.affectedRows > 0) {
                return true;
            } else {
                return false;
            }
        }

        /*
        if (who === 'post') {
            // First, delete from scan table where post_actuel = value
            let sqlScan = `DELETE FROM scan WHERE post_actuel = ?`;
            await this.runQueryWithRetry(sqlScan, [value]);

            // Then, delete from post table where name = value
            let sqlPost = `DELETE FROM post WHERE name = ?`;
            let [result] = await this.runQueryWithRetry(sqlPost, [value]);

            // result.affectedRows > 0 means a row was deleted from post
            if (result && result.affectedRows > 0) {
                return true;
            } else {
                return false;
            }
        }
        */

        return false;
        
    }


    // add post to the database
    static async addPost(postName) {

        /*
        // Insert a new post into the post table if it doesn't already exist
        let sql = `INSERT IGNORE INTO post (name) VALUES (?)`;

        let [result] = await this.runQueryWithRetry(sql, [postName]);
        
        // Check if the insert was successful
        if (result && result.affectedRows > 0) {
            return true; // Post added successfully
        } else {
            return false; // Post already exists or failed to add
        }
        */

        return false;
        
    }


    // add nof to the database
    static async addNof(nof, refProduit, qt) {

        // search for the gammes where the post.refProduit is a prefix of them
        let sqlGamme = `SELECT ref_gamme FROM gamme WHERE ref_gamme LIKE CONCAT(?, '%')`;
        let [gammes, fieldsGamme]  = await this.runQueryWithRetry(sqlGamme, [refProduit]);

        
        
        // if no gammes found, return false
        if (gammes.length === 0) {
            console.log("No gammes found for ref_produit: " + refProduit);
            return false; // No gammes found
        }


        console.log("Reference " + refProduit + " found in gamme: " + gammes[0].ref_gamme);


        // Insert a new nof into the marque table if it doesn't already exist
        let sql = `INSERT IGNORE INTO marque (nof, ref_produit, qt, ref_gamme) VALUES (?, ?, ?, ?)`;
        let [result] = await this.runQueryWithRetry(sql, [nof, refProduit, qt, gammes[0].ref_gamme]);
        
        
        // Check if the insert was successful
        if (result && result.affectedRows > 0) {
            return true; // Nof added successfully
        } else {
            return false; // Nof already exists or failed to add
        }
        
    }


}

module.exports = TrackingDB;