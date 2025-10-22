const Store = require('electron-store').default;
const store = new Store();

// Set default values if not present
if (!store.get('host')) store.set('host', 'localhost');
if (!store.get('user')) store.set('user', 'tracking');
if (!store.get('password')) store.set('password', 'Tracking2025!');
if (!store.get('database')) store.set('database', 'trackingdb');

class TrackingDB {

    // Import the mysql module
    static mysql = require('mysql2');
    static mysqlpromise = require('mysql2/promise');


    // Database connection details
    static host = "localhost";
    static user = "tracking"; 
    static password = "Tracking2025!";
    static database = "trackingdb";
    
    

    // Create a pool to the database
    static pool = this.createPool();

    // create a pool to the database
    static createPool() {
        return this.mysql.createPool({
            /*
            host: MyConfig.host, //this.host,
            user: MyConfig.user, //this.user,
            password: MyConfig.password, //this.password,
            database: MyConfig.database, //this.database,
            */
            host: store.get('host'),
            user: store.get('user'),
            password: store.get('password'),
            database: store.get('database'),
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




    // Test DB connection
    static async testConnection(config) {

        const connection = await this.mysqlpromise.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database,
            connectTimeout: 3000
        });
        await connection.end();

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




        // create table operation (ref_gamme, num_ope, poste_machine, tps_oper (ex: 0.0002))
        let sqlGammeOperations = `CREATE TABLE IF NOT EXISTS operation (
            ref_gamme VARCHAR(255) NOT NULL,
            num_ope INT NOT NULL,
            poste_machine VARCHAR(255) NOT NULL,
            tps_oper FLOAT NOT NULL,
            PRIMARY KEY (ref_gamme, num_ope),
            FOREIGN KEY (ref_gamme) REFERENCES gamme(ref_gamme)
        )`;

        await this.queryAsync(sqlGammeOperations);
        console.log("Table operation created or already exists!");




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
            ref_gamme VARCHAR(255) NOT NULL,
            num_ope INT NOT NULL,
            qa INT NOT NULL,
            moy_temps_passer INT NOT NULL,
            etat BOOLEAN NOT NULL,
            commentaire VARCHAR(255) NOT NULL,
            temps_debut DATETIME NOT NULL,
            temps_fin DATETIME,
            scan_count INT NOT NULL,
            temps_dernier_scan DATETIME NOT NULL,
            PRIMARY KEY (nof, ref_gamme, num_ope),
            FOREIGN KEY (nof) REFERENCES marque(nof),
            FOREIGN KEY (ref_gamme, num_ope) REFERENCES operation(ref_gamme, num_ope)
        )`;

        await this.queryAsync(sqlScan);
        console.log("Table scan created or already exists!");




        // create table carte (nof, n_serie, num_ope, temps_debut, temps_fin, commentaire, scan_count)
        let sqlCarte = `CREATE TABLE IF NOT EXISTS carte (
            nof VARCHAR(255) NOT NULL,
            n_serie VARCHAR(255) NOT NULL,
            PRIMARY KEY (nof, n_serie),
            FOREIGN KEY (nof) REFERENCES marque(nof)
        )`;

        await this.queryAsync(sqlCarte);
        console.log("Table carte created or already exists!");




        // Create table user (nom, matricule, role)
        let sqlUser = `CREATE TABLE IF NOT EXISTS user (
                nom VARCHAR(255) NOT NULL,
                matricule VARCHAR(255) NOT NULL,
                role ENUM('Admin', 'Opérateur', 'Superviseur') NOT NULL,
                PRIMARY KEY (nom, matricule)
        )`;

        await this.queryAsync(sqlUser);
        console.log("Table user created or already exists!");

        

        // create table scan_carte (ref_gamme, num_ope, nof, n_serie, nom, matricule, temps_debut, temps_fin, commentaire, scan_count)
        let sqlScanCarte = `CREATE TABLE IF NOT EXISTS scan_carte (
            ref_gamme VARCHAR(255) NOT NULL,
            num_ope INT NOT NULL,
            nof VARCHAR(255) NOT NULL,
            n_serie VARCHAR(255) NOT NULL,
            nom VARCHAR(255),
            matricule VARCHAR(255),
            temps_debut DATETIME,
            temps_fin DATETIME,
            commentaire VARCHAR(255) NOT NULL,
            scan_count INT NOT NULL,
            PRIMARY KEY (ref_gamme, num_ope, nof, n_serie),
            FOREIGN KEY (ref_gamme, num_ope) REFERENCES operation(ref_gamme, num_ope),
            FOREIGN KEY (nof, n_serie) REFERENCES carte(nof, n_serie),
            FOREIGN KEY (nom, matricule) REFERENCES user(nom, matricule)
        )`;

        await this.queryAsync(sqlScanCarte);
        console.log("Table scan_carte created or already exists!");
    }


    // drop tables
    static async dropTables() {

        let sqlScanCarte = `DROP TABLE IF EXISTS scan_carte`;
        await this.queryAsync(sqlScanCarte);
        console.log("Table scan_carte dropped!");

        let sqlCarte = `DROP TABLE IF EXISTS carte`;
        await this.queryAsync(sqlCarte);
        console.log("Table carte dropped!");

        let sqlScan = `DROP TABLE IF EXISTS scan`;
        await this.queryAsync(sqlScan);
        console.log("Table scan dropped!");
        

        let sqlMarque = `DROP TABLE IF EXISTS marque`;
        await this.queryAsync(sqlMarque);
        console.log("Table marque dropped!");


        let sqlOperation = `DROP TABLE IF EXISTS operation`;
        await this.queryAsync(sqlOperation);
        console.log("Table operation dropped!");


        let sqlGamme = `DROP TABLE IF EXISTS gamme`;
        await this.queryAsync(sqlGamme);
        console.log("Table gamme dropped!");


        let sqlUser = `DROP TABLE IF EXISTS user`;
        await this.queryAsync(sqlUser);
        console.log("Table user dropped!");
        
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




        // Insert Mohammed Mojahid as Admin to the user table if it doesn't exist
        let valuesUser = [
            ['Mohammed Mojahid', '0000', 'Admin']
        ];
        let sqlUser = `INSERT IGNORE INTO user (nom, matricule, role) VALUES ?`;
        await this.queryAsync(sqlUser, valuesUser);
        console.log("User inserted into table user if not existed!");

    }



    // clear all the tables
    static async clearTables() {


        let sqlScanCarte = `DELETE FROM scan_carte`;
        await this.queryAsync(sqlScanCarte);
        console.log("Table scan_carte cleared!");
        
        
        let sqlCarte = `DELETE FROM carte`;
        await this.queryAsync(sqlCarte);
        console.log("Table carte cleared!");


        let sqlScan = `DELETE FROM scan`;
        await this.queryAsync(sqlScan);
        console.log("Table scan cleared!");
        

        let sqlMarque = `DELETE FROM marque`;
        await this.queryAsync(sqlMarque);
        console.log("Table marque cleared!");


        let sqlOperation = `DELETE FROM operation`;
        await this.queryAsync(sqlOperation);
        console.log("Table operation cleared!");


        let sqlGamme = `DELETE FROM gamme`;
        await this.queryAsync(sqlGamme);
        console.log("Table gamme cleared!");


        let sqlUser = `DELETE FROM user`;
        await this.queryAsync(sqlUser);
        console.log("Table user cleared!");


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







    // clear the tables scan_carte, carte, scan, marque, operation, gamme
    static async clearGammes() {
        
        // Delete all rows from scan_carte
        let sqlScanCarte = `DELETE FROM scan_carte`;
        await this.runQueryWithRetry(sqlScanCarte);
        console.log("Table scan_carte cleared!");

        // Delete all rows from carte
        let sqlCarte = `DELETE FROM carte`;
        await this.runQueryWithRetry(sqlCarte);
        console.log("Table carte cleared!");

        // Delete all rows from scan
        let sqlScan = `DELETE FROM scan`;
        await this.runQueryWithRetry(sqlScan);
        console.log("Table scan cleared!");

        // Delete all rows from marque
        let sqlMarque = `DELETE FROM marque`;
        await this.runQueryWithRetry(sqlMarque);
        console.log("Table marque cleared!");

        // Delete all rows from operation
        let sqlOperation = `DELETE FROM operation`;
        await this.runQueryWithRetry(sqlOperation);
        console.log("Table operation cleared!");

        // Delete all rows from gamme
        let sqlGamme = `DELETE FROM gamme`;
        await this.runQueryWithRetry(sqlGamme);
        console.log("Table gamme cleared!");

    }








    static async insertGamme(gamme, post, gammeOperations, operation) {
        // insert gamme into the table gamme if it doesn't exist
        let sqlGamme = `INSERT IGNORE INTO gamme (ref_gamme) VALUES ?`;
        await this.runQueryWithRetry(sqlGamme, [gamme]);
        //console.log("Gamme inserted into table gamme if not existed!");


        /*
        // insert post into the table post if it doesn't exist
        let sqlPost = `INSERT IGNORE INTO post (name) VALUES ?`;
        await this.runQueryWithRetry(sqlPost, [post]);
        //console.log("Post inserted into table post if not existed!");
        */


        // insert ope into the table gamme_operations if it doesn't exist
        let sqlOperation = `INSERT IGNORE INTO operation (ref_gamme, num_ope, poste_machine, tps_oper) VALUES ?`;
        await this.runQueryWithRetry(sqlOperation, [gammeOperations]);
        //console.log("Ope inserted into table ope if not existed!");
    }







    // get data from the database
    static async getData(who, value, role) {

        // get data from the database (temps_debut, temps_fin, nof, num_ope, ref_gamme, ref_produit, qt, post_actuel, qa, moy_temps_passer, etat, commentaire)
        let sql = `SELECT temps_debut, temps_fin, scan.nof AS nof, scan.num_ope, operation.ref_gamme, qt, poste_machine AS post_actuel, qa, moy_temps_passer / 60 AS moy_temps_passer, commentaire 
                        FROM scan 
                        INNER JOIN marque ON scan.nof = marque.nof
                        INNER JOIN operation
                            ON scan.num_ope = operation.num_ope 
                            AND marque.ref_gamme = operation.ref_gamme
                        ORDER BY temps_debut DESC, scan.nof ASC, scan.num_ope DESC`;

        if (who === 'nof') // get data from marque (nof, ref_produit, qt, ref_gamme)
            sql = `SELECT nof, ref_gamme, qt, ref_produit FROM marque`;

        if (who === 'post') // get data from operation (poste_machine)
            sql = `SELECT DISTINCT poste_machine FROM operation ORDER BY poste_machine`;

        if (who === 'gammes') // get data from gamme (ref_gamme)
            sql = `SELECT ref_gamme FROM gamme`;

        if (who === 'gamme-detail') // get data from gamme_operations (num_ope, post_machine) where ref_gamme = value and sort by num_ope
            sql = `SELECT num_ope, poste_machine, tps_oper FROM operation WHERE ref_gamme = ? ORDER BY num_ope`;

        if (who === 'operations') 
            sql = `
                SELECT
                    m.nof,
                    m.ref_gamme,
                    o.num_ope,
                    CASE
                        WHEN s.qa = m.qt THEN 'Soldee'
                        ELSE 'En cours'
                    END AS status_ligne,
                    o.poste_machine AS poste,
                    s.temps_debut,
                    s.temps_fin,
                    CASE 
                        WHEN s.temps_debut IS NOT NULL AND o.tps_oper > 0 THEN
                            DATE_ADD(s.temps_debut, INTERVAL (o.tps_oper * m.qt * 3600) SECOND)
                        ELSE NULL
                    END AS temps_prevu,
                    m.qt,
                    s.qa,
                    s.moy_temps_passer / 60 AS moy_temps_passer,
                    s.commentaire
                FROM marque m
                JOIN operation o ON o.ref_gamme = m.ref_gamme
                LEFT JOIN scan s ON s.nof = m.nof AND s.num_ope = o.num_ope
                WHERE m.nof = ?
                ORDER BY m.nof, o.num_ope
            `;

        if (who === 'scanner') // get data (nof, ref_gamme, num_ope, post_machine, qa, qt, n_serie, scan_count(dial n_serie)) where post_machine = value && qt > qa
            sql = `
                SELECT m.nof, m.ref_gamme, o.num_ope, o.poste_machine, s.qa, m.qt, sc.n_serie, sc.scan_count
                FROM scan s
                INNER JOIN marque m ON s.nof = m.nof
                INNER JOIN operation o ON s.num_ope = o.num_ope AND m.ref_gamme = o.ref_gamme
                LEFT JOIN scan_carte sc
                    ON sc.nof = m.nof AND sc.num_ope = o.num_ope AND sc.n_serie = ?
                WHERE o.poste_machine = ? AND m.qt > s.qa AND o.num_ope >= ? AND s.nof = ?
            `;

        if (who === 'nof-detail') // get data from carte (n_serie, num_ope, temps_debut, temps_fin, commentaire) where nof = value
            sql = `
                SELECT
                    c.n_serie,
                    COALESCE(sc.num_ope, NULL) AS num_ope,
                    CASE 
                        WHEN sc.scan_count = 1 THEN 'En cours'
                        WHEN sc.scan_count = 2 THEN 'En attente'
                        WHEN sc.scan_count = 0 OR sc.scan_count IS NULL THEN 'En attente'
                    END AS statut,
                    sc.temps_debut,
                    CASE
                        WHEN sc.scan_count = 1 THEN sc2.temps_fin
                        ELSE sc.temps_fin
                    END AS temps_fin,
                    CASE 
                        WHEN sc.scan_count = 1 THEN TIMESTAMPDIFF(SECOND, sc2.temps_fin, sc.temps_debut) / 60
                        WHEN sc.scan_count = 2 THEN TIMESTAMPDIFF(SECOND, sc.temps_debut, sc.temps_fin) / 60
                        ELSE NULL
                    END AS temps_realise,
                    sc.matricule,
                    sc.nom,
                    sc.commentaire
                FROM carte c
                LEFT JOIN (
                    SELECT sc1.*
                    FROM scan_carte sc1
                    INNER JOIN (
                        SELECT n_serie, MAX(num_ope) AS max_num_ope
                        FROM scan_carte
                        WHERE nof = ? AND scan_count > 0
                        GROUP BY n_serie
                    ) last_sc
                    ON sc1.n_serie = last_sc.n_serie AND sc1.num_ope = last_sc.max_num_ope
                    WHERE sc1.nof = ?
                ) sc
                ON c.n_serie = sc.n_serie AND c.nof = sc.nof
                LEFT JOIN scan_carte sc2
                    ON sc2.nof = sc.nof AND sc2.n_serie = sc.n_serie AND sc2.num_ope = (
                        SELECT MAX(num_ope)
                        FROM scan_carte
                        WHERE nof = sc.nof AND n_serie = sc.n_serie AND num_ope < sc.num_ope
                    )
                WHERE c.nof = ?
                ORDER BY c.n_serie ASC
            `;
        
        if (who === 'user') { 
            if (role !== 'Admin') // get data from user (nom, matricule, role) where role = 'Opérateur'
                sql = `SELECT nom, matricule, role FROM user WHERE role = 'Opérateur' ORDER BY nom ASC`;
            else // get data from user (nom, matricule, role) where role = 'Opérateur' or 'Superviseur'
                sql = `SELECT nom, matricule, role FROM user WHERE role != 'Admin' ORDER BY nom ASC`;
        }

        if (who === 'user-detail') // get data (the total quantity and total time) from scan_carte for a specific user, grouped by day, nof, num_ope
            sql = `
                SELECT
                    date,
                    nof,
                    num_ope,
                    SUM(completed) AS qte_total,
                    ROUND(
                        SUM(
                            CASE
                                WHEN nof = prev_nof AND num_ope = prev_num_ope THEN TIMESTAMPDIFF(SECOND, prev_temps, temps)
                                ELSE 0
                            END
                        ) / 3600, 2
                    ) AS temps_total
                FROM (
                    SELECT
                        DATE(temps) AS date,
                        nof,
                        num_ope,
                        temps,
                        LAG(temps) OVER (PARTITION BY DATE(temps) ORDER BY temps) AS prev_temps,
                        LAG(nof) OVER (PARTITION BY DATE(temps) ORDER BY temps) AS prev_nof,
                        LAG(num_ope) OVER (PARTITION BY DATE(temps) ORDER BY temps) AS prev_num_ope,
                        CASE WHEN source = 'fin' THEN 1 ELSE 0 END AS completed
                    FROM (
                        SELECT
                            nof,
                            num_ope,
                            temps_debut AS temps,
                            'debut' AS source
                        FROM scan_carte
                        WHERE nom = ? AND matricule = ? AND scan_count IN (1,2) AND temps_debut IS NOT NULL

                        UNION ALL

                        SELECT
                            nof,
                            num_ope,
                            temps_fin AS temps,
                            'fin' AS source
                        FROM scan_carte
                        WHERE nom = ? AND matricule = ? AND scan_count = 2 AND temps_fin IS NOT NULL
                    ) AS combined
                ) AS diffs
                GROUP BY date, nof, num_ope
                ORDER BY date DESC, nof, num_ope DESC
            `;
        
        if (who === 'poste-detail') // get data (the total quantity) from scan_carte for a specific poste, grouped by day, nof, num_ope
            sql = `
                SELECT
                    DATE(sc.temps_fin) AS date,
                    sc.nof,
                    sc.num_ope,
                    COUNT(*) AS qte_total
                FROM scan_carte sc
                INNER JOIN operation o ON sc.ref_gamme = o.ref_gamme AND sc.num_ope = o.num_ope
                WHERE o.poste_machine = ? AND sc.scan_count = 2 AND sc.temps_fin IS NOT NULL
                GROUP BY DATE(sc.temps_fin), sc.nof, sc.num_ope
                ORDER BY date DESC, sc.nof, sc.num_ope DESC
            `;

        let [result, fields]  = await this.runQueryWithRetry(sql, value);

        console.log("Data retrieved from the database!");

        // Each row is an object: [{field1: value1, field2: value2, ...}]
        let rows = result;

        // Add the column names as the first row
        let columns = fields.map(field => field.name);
        rows.unshift(columns);
        

        return rows; // Resolve the promise with the data  
        
    }




    // get the first Active row (qa < qt) of a post that has a num_ope more or equal to the num_ope
    static async getActiveRow(post, num_ope = 0, nof = null) {

        let sql = `SELECT temps_debut, temps_fin, scan.nof AS nof, ref_produit, qt, poste_machine AS post_actuel, qa, moy_temps_passer, etat, commentaire, scan_count, temps_dernier_scan 
            FROM scan 
            INNER JOIN marque ON scan.nof = marque.nof
            INNER JOIN operation 
                ON scan.num_ope = operation.num_ope 
                AND marque.ref_gamme = operation.ref_gamme
            WHERE operation.poste_machine = ? AND scan.qa < marque.qt AND scan.num_ope >= ? AND scan.nof = ?
        `;
        
        let [result, fields]  = await this.runQueryWithRetry(sql, [post, num_ope, nof]);

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



    // Get the first num_ope of the postActuel that is more or equal to the num_ope of the n_serie
    static async currentNumopeFromPost(nof, postActuel, n_serie) {

        /*
            -- 1. Get the first num_ope for this nof, postActuel, and n_serie in operation
            -- where scan_carte is missing or scan_count < 2 (not completed)

             -- 2. If nothing found, get the last num_ope for this nof and postActuel (poste_machine)
        */

        // Try to get the first not completed num_ope
        const sql = `
            (SELECT o.num_ope
            FROM marque m
            INNER JOIN operation o ON m.ref_gamme = o.ref_gamme
            LEFT JOIN scan_carte sc
                ON sc.nof = m.nof AND sc.num_ope = o.num_ope
            WHERE m.nof = ? AND o.poste_machine = ? AND sc.n_serie = ? 
            AND (sc.scan_count IS NULL OR sc.scan_count < 2)
            ORDER BY o.num_ope ASC
            LIMIT 1)
            UNION ALL
            (SELECT o.num_ope
            FROM marque m
            INNER JOIN operation o ON m.ref_gamme = o.ref_gamme
            WHERE m.nof = ? AND o.poste_machine = ?
            ORDER BY o.num_ope DESC
            LIMIT 1)
        `;
        let [rows] = await this.runQueryWithRetry(sql, [nof, postActuel, n_serie, nof, postActuel]);
        if (!rows.length) { // No num_ope found for this nof and post_machine
            return -1;
        }
        return rows[0].num_ope;

    }



    // update the table scan by a post
    static async updateScan(post, num_ope, user) {
        
        const carteUpdated = await this.updateCarte(post, num_ope, user); // Update the carte table with the updated scan
        if (!carteUpdated.is) {
            console.log("Failed to update carte table for post: " + post.postActuel + ", the carteUpdated object: ", carteUpdated);
            return carteUpdated; // If the carte update failed, return false
        }

        // update moytempspasser, etat, commentaire, scanCount, qa, tempsFin, tempsDernierScan of the row where nof = post.nof and postActuel = post.postActuel
        
        // Get num_ope for this nof and postActuel (post_machine)
        /*
        let sqlGetNumOpe = `
            SELECT num_ope FROM gamme_operations go
            INNER JOIN marque m ON m.ref_gamme = go.ref_gamme
            WHERE nof = ? AND post_machine = ?
        `;
        let [numOpeRows] = await this.runQueryWithRetry(sqlGetNumOpe, [post.nof, post.postActuel]);
        if (!numOpeRows.length) {
            throw new Error("No num_ope found for this nof and post_machine");
        }
        const num_ope = numOpeRows[0].num_ope;
        */
        
        console.log("num_ope value: " + num_ope);

        let sql = `
            UPDATE scan SET moy_temps_passer = ?, etat = ?, commentaire = ?, scan_count = ?, qa = ?, temps_fin = ?, temps_dernier_scan = ? 
            WHERE nof = ? AND num_ope = ?
        `;

        let [result, fields]  = await this.runQueryWithRetry(sql, [post.moytempspasser, post.etat, post.commentaire, post.scanCount, post.qa, post.tempsFin, post.tempsDernierScan, post.nof, num_ope]);

        console.log("Table scan updated!: " + result.affectedRows + " row(s) updated");

        return {is: true}; // Return true if the update was successful

    }


    // check if the scan is exist in the database
    static async isScanNotExist(scan, num_ope) {

        // check if the scan is not in the database
        let sql = `
            SELECT s.*
            FROM scan s
            INNER JOIN marque m ON s.nof = m.nof
            INNER JOIN operation o ON s.num_ope = o.num_ope AND m.ref_gamme = o.ref_gamme
            WHERE s.nof = ? AND o.num_ope = ?
        `;

        let [result, fields]  = await this.runQueryWithRetry(sql, [scan.nof, num_ope]);
            
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



    // get ref_produit & qt from marque table for a specifique nof ("" value if NOF not exist in the database)
    static async getNof(nof) {
        let sql = `SELECT ref_produit, qt FROM marque WHERE nof = ?`;

        let [result, fields]  = await this.runQueryWithRetry(sql, [nof]);

        // If the nof is not in the database
        if (result.length === 0) {
            console.log("Nof Not exist in the database!");
            return {ref_produit: "", qt: 0};
        } else {
            console.log("Nof exist in the database!");
            return {ref_produit: result[0].ref_produit, qt: result[0].qt};
        }

    }



    // insert a row into the table scan
    static async insertScan(post, num_ope, user) {
        
        // check if the post.postActuel exists on the ope table where ref_gamme of the ref_produit on the reference table is equal to the ref_gamme of ope
        let sqlCheckPost = `
            SELECT COUNT(*) AS count
            FROM marque m
            INNER JOIN operation o ON m.ref_gamme = o.ref_gamme
            WHERE o.poste_machine = ? AND m.ref_produit = ?
        `;
        let [checkResult, fieldsCheck] = await this.runQueryWithRetry(sqlCheckPost, [post.postActuel, post.refProduit]);
        if (checkResult[0].count === 0) {
            console.log("Post " + post.postActuel + " does not exist in the ope table for the given ref_produit: " + post.refProduit);
            return {is: false}; // Post does not exist in the ope table for the given ref_produit (post not in the gamme)
        }
        console.log("Post " + post.postActuel + " exists in the ope table for the given ref_produit: " + post.refProduit + ", Counting: " + checkResult[0].count);


        const carteUpdate = await this.updateCarte(post, num_ope, user); // Update the carte table with the new scan
        if (!carteUpdate.is)
            return carteUpdate; // If the carte update failed, return false


        // num_ope that we want to scan
        let num_ope_to_scan = null;
        let ref_gamme_to_scan = null;

        // check if the previous operation (num_ope just before the current one for the same gamme) is already present in the scan table for the same NOF.
        {
            // Step 1: Get current num_ope and ref_gamme for this postActuel/refProduit
            let sqlOpe = `
                SELECT o.ref_gamme
                FROM marque m
                INNER JOIN operation o ON m.ref_gamme = o.ref_gamme
                WHERE o.poste_machine = ? AND m.ref_produit = ?
                LIMIT 1
            `;
            let [opeRows] = await this.runQueryWithRetry(sqlOpe, [post.postActuel, post.refProduit]);
            if (!opeRows.length) {
                // No operation found, should not happen if previous check passed
                console.log("No operation found, should not happen if previous check passed");
                return {is: false};
            }
            const { ref_gamme } = opeRows[0];

            if (num_ope === -1) {  
                // No num_ope found for this nof and post_machine
                console.log("No num_ope found for this nof and post_machine");
                return {is: false};
            }

            num_ope_to_scan = num_ope; // to put it in the scan table
            ref_gamme_to_scan = ref_gamme; // to put it in the scan table

            // Step 2: Find the previous num_ope for this gamme
            let sqlPrevNumOpe = `
                SELECT num_ope, poste_machine
                FROM operation
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
                    SELECT 1 FROM scan WHERE nof = ? AND num_ope = ? LIMIT 1
                `;
                let [prevScanRows] = await this.runQueryWithRetry(sqlPrevScan, [post.nof, prevNumOpe]);
                if (!prevScanRows.length) {
                    // Previous operation not yet scanned
                    console.log("Previous operation " + prevNumOpe + " not yet scanned");
                    return {is: false, prevOpe: prevNumOpe};
                }
            }
        }


        // insert a row into the table scan
        let sql = `INSERT INTO scan (nof, ref_gamme, num_ope, qa, moy_temps_passer, etat, commentaire, temps_debut, temps_fin, scan_count, temps_dernier_scan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        let [result, fields]  = await this.runQueryWithRetry(sql, [post.nof, ref_gamme_to_scan, num_ope_to_scan, post.qa, post.moytempspasser, post.etat, post.commentaire, post.tempsDebut, post.tempsFin, post.scanCount, post.tempsDernierScan]);
                            
        console.log("Table scan inserted!: " + result.affectedRows + " row(s) inserted");

        return {is: true}; // Return true if the insert was successful

    }


    // update a carte
    static async updateCarte(post, num_ope, user) {

        // check if the carte exists for this nof and n_serie
        let sqlCheckCarte = `SELECT * FROM carte WHERE nof = ? AND n_serie = ?`;
        let [checkCarteRows] = await this.runQueryWithRetry(sqlCheckCarte, [post.nof, post.nSerie]);

        // If carte found, update it
        if (checkCarteRows.length) {

            // get carte current scan_count and num_ope
            let sqlScanCount = `
                SELECT scan_count, num_ope 
                FROM scan_carte
                WHERE nof = ? AND n_serie = ? AND scan_count > 0
                ORDER BY num_ope DESC
                LIMIT 1
            `;

            let [scanCountRows] = await this.runQueryWithRetry(sqlScanCount, [post.nof, post.nSerie]);
            let currentScanCount = 0; // Default scan_count to 0
            let current_num_ope = 0; // Default num_ope to 0
            // If scan_count and num_ope found, set them
            if (scanCountRows.length) {
                currentScanCount = scanCountRows[0].scan_count;
                current_num_ope = scanCountRows[0].num_ope;
            }


            /*
            // check if is there an active carte on this operation (num_ope), if so, and this carte is not the same as the current one, return false
            {
                let sqlCheckActiveCarte = `
                    SELECT n_serie FROM scan_carte WHERE nof = ? AND num_ope = ? AND n_serie != ? AND scan_count = 1
                `;
                let [activeCarteRows] = await this.runQueryWithRetry(sqlCheckActiveCarte, [post.nof, num_ope, post.nSerie]);
                if (activeCarteRows.length) {
                    console.log("updateCarte: There is an active carte on this operation (num_ope): " + num_ope + ", return false");
                    return {is: false, why: "There is an active carte on this operation", carte: activeCarteRows[0].n_serie};
                }
            }
            */


            // update the carte
            if (current_num_ope !== num_ope) { // If num_ope is different

                // if scan_count is 1, return false
                if (currentScanCount === 1) 
                    return {is: false, why: "Carte not completed yet", ope: current_num_ope}; // Carte not completed yet, return false

                // check if the next operation (num_ope just after the current one for the same gamme) is the same as num_ope
                {
                    // Get the next num_ope for this gamme
                    let sqlNextNumOpe = `
                        SELECT num_ope, poste_machine
                        FROM operation
                        WHERE ref_gamme = (SELECT ref_gamme FROM marque WHERE nof = ?)
                        AND num_ope > ?
                        ORDER BY num_ope ASC
                        LIMIT 1
                    `;

                    let [nextOpeRows] = await this.runQueryWithRetry(sqlNextNumOpe, [post.nof, current_num_ope]);

                    if (nextOpeRows.length) {
                        // There is a next operation, check if it matches the current num_ope
                        const nextNumOpe = nextOpeRows[0].num_ope;
                        if (nextNumOpe !== num_ope) {
                            console.log("Next operation " + nextNumOpe + " does not match current num_ope " + num_ope);
                            return {is: false, why: "Next operation does not match current num_ope", ope: nextNumOpe};
                        }
                    } else // No next operation found, which means we are at the last operation for this gamme
                        return {is: false, why: "Carte completed"};

                }

                // If we reach here, it means we can update the carte
                let sqlUpdateCarte = `UPDATE scan_carte SET nom = ?, matricule = ?, temps_debut = ?, commentaire = ?, scan_count = ? WHERE nof = ? AND n_serie = ? AND num_ope = ?`;
                let valuesUpdateCarte = [user.nom, user.matricule, post.tempsDernierScan, '', 1, post.nof, post.nSerie, num_ope];

                let [result] = await this.runQueryWithRetry(sqlUpdateCarte, valuesUpdateCarte);
                console.log("Table scan_carte updated!: " + result.affectedRows + " row(s) updated");

                return {is: true}; // Return true if the update was successful

            } else {
                if (currentScanCount === 1) { // If scan_count is 1
                    let sqlUpdateCarte = `UPDATE scan_carte SET nom = ?, matricule = ?, temps_fin = ?, commentaire = ?, scan_count = ? WHERE nof = ? AND n_serie = ? AND num_ope = ?`;
                    let valuesUpdateCarte = [user.nom, user.matricule, post.tempsDernierScan, '', 2, post.nof, post.nSerie, current_num_ope];

                    let [result] = await this.runQueryWithRetry(sqlUpdateCarte, valuesUpdateCarte);
                    console.log("Table scan_carte updated!: " + result.affectedRows + " row(s) updated");

                    return {is: true}; // Return true if the update was successful

                } else if (currentScanCount === 2) { // If scan_count is 2
                    return {is: false, why: "Already scanned twice"}; // Already scanned twice, return false
                } else
                    console.error("Unexpected scan_count value on updateCarte function: " + currentScanCount);
            }
            
        }
        else return {is: false, why: "Carte not found"}; // Carte not found, return false

        return {is: false, why: "Unknown error"}; // Unknown error, return false

    }

    
    // insert a row (a new nof) into the table marque
    static async insertMarque(post) {
        
        return this.addNof(post.nof, post.refProduit, post.qt);    
            
    }
    

    // get the post name from the database
    static async getPostsName() {

        let sql = `SELECT DISTINCT poste_machine FROM operation ORDER BY poste_machine`;

        let [result, fields]  = await this.runQueryWithRetry(sql);

        console.log("Posts names retrieved from the database!");

        // Map the result to a one-dimensional array
        let rows = result.map(row => row.poste_machine);

        // Add post Admin
        //rows.unshift("Admin");
        
        return rows; // Resolve the promise with the data
        
    }


    static async removeRow(value, who) {
        if (who === 'nof') {
            // First, delete from scan table where nof = value
            let sqlScan = `DELETE FROM scan WHERE nof = ?`;
            await this.runQueryWithRetry(sqlScan, [value]);

            // Then, delete from carte table where nof = value
            await this.removeCartes(value);

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


        if (who === 'user') {
            // Delete from user table where nom = value[0] and matricule = value[1]
            let sqlUser = `DELETE FROM user WHERE nom = ? AND matricule = ?`;
            let [result] = await this.runQueryWithRetry(sqlUser, value);
            // result.affectedRows > 0 means a row was deleted from user
            if (result && result.affectedRows > 0) {
                return true;
            }
            else {
                return false;
            }
        }

        return false;
        
    }


    // remove cartes for the nof
    static async removeCartes(nof) {

        // First, delete from scan_carte table where nof = value
        let sqlScanCarte = `DELETE FROM scan_carte WHERE nof = ?`;
        let [resultScanCarte] = await this.runQueryWithRetry(sqlScanCarte, [nof]);

        // Delete cartes from the carte table where nof = value
        let sql = `DELETE FROM carte WHERE nof = ?`;
        let [result] = await this.runQueryWithRetry(sql, [nof]);
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

            await this.addCartes(nof, qt); // Add cartes for the new nof

            return true; // Nof added successfully
        } else {
            return false; // Nof already exists or failed to add
        }
        
    }



    // add cartes for the new nof
    static async addCartes(nof, qt) {
        // Insert cartes into the carte table for the new nof
        let values = [];
        let nb_digit = 4; // number of digits for the n_serie (String(qt).length; // number of digits on the qt number)
        for (let i = 1; i <= qt; i++) {
            // n_serie is a string of lenght 4 (ex: 0001)
            let n_serie = String(i).padStart(nb_digit, '0'); // Pad with leading zeros to make it 4 digits
            values.push([nof, n_serie]); // n_serie starts from 1 to qt
        }

        let sql = `INSERT INTO carte (nof, n_serie) VALUES ?`;
        let [result] = await this.runQueryWithRetry(sql, [values]);

        console.log("Cartes added for nof: " + nof + ", " + result.affectedRows + " cartes inserted.");


        // Insert a new rows into the scan_carte table for each carte
        {
            // get ref_gamme, num_ope for this nof from operation table
            let sqlOpe = `
                SELECT o.ref_gamme, o.num_ope
                FROM marque m
                INNER JOIN operation o ON m.ref_gamme = o.ref_gamme
                WHERE m.nof = ?
            `;
            let [opeRows] = await this.runQueryWithRetry(sqlOpe, [nof]);

            // iterate over the opeRows and insert a row into scan_carte for each n_serie
            let valuesScanCarte = [];
            for (let i = 0; i < opeRows.length; i++) {
                let ref_gamme = opeRows[i].ref_gamme;
                let num_ope = opeRows[i].num_ope;

                for (let j = 1; j <= qt; j++) {
                    let n_serie = String(j).padStart(nb_digit, '0'); // Pad with leading zeros to make it 4 digits
                    valuesScanCarte.push([ref_gamme, num_ope, nof, n_serie, null, null, null, null, '', 0]); // scan_count starts from 0
                }
            }

            let sqlScanCarte = `INSERT INTO scan_carte (ref_gamme, num_ope, nof, n_serie, nom, matricule, temps_debut, temps_fin, commentaire, scan_count) VALUES ?`;
            let [resultScanCarte] = await this.runQueryWithRetry(sqlScanCarte, [valuesScanCarte]);

            console.log("Scan cartes added for nof: " + nof + ", " + resultScanCarte.affectedRows + " scan cartes inserted."); 

        }
    }



    // add user to the database
    static async addUser(nom, matricule, role) {

        // Insert a new user into the user table if it doesn't already exist
        let sql = `INSERT IGNORE INTO user (nom, matricule, role) VALUES (?, ?, ?)`;

        let [result] = await this.runQueryWithRetry(sql, [nom, matricule, role]);
        
        // Check if the insert was successful
        if (result && result.affectedRows > 0) {
            return true; // User added successfully
        } else {
            return false; // User already exists or failed to add
        }
        
    }



    // find a user by nom and matricule and return it
    static async findUser(value) {

        // Find a user by nom and matricule
        let sql = `SELECT * FROM user WHERE LOWER(nom) = LOWER(?) AND matricule = ?`;

        let [result, fields]  = await this.runQueryWithRetry(sql, value);

        // If the user is found, return it
        if (result.length > 0) {
            return result[0]; // Return the first user found
        } else {
            return null; // User not found
        }
        
    }




    // Skip operations for a nof up to a specific operation number
    static async skipOperations(nof, num_ope) {

        console.log("Request to skip rows for NOF:", nof, "up to operation number:", num_ope);

        const now = new Date();

        // 1. Update rows where scan_count = 0
        let sqlUpdate0 = `
            UPDATE scan_carte
            SET temps_debut = ?, temps_fin = ?, scan_count = 2
            WHERE nof = ? AND num_ope <= ? AND scan_count = 0
        `;
        await this.runQueryWithRetry(sqlUpdate0, [now, now, nof, num_ope]);

        // 2. Update rows where scan_count = 1
        let sqlUpdate1 = `
            UPDATE scan_carte
            SET nom = NULL, matricule = NULL, temps_fin = ?, scan_count = 2
            WHERE nof = ? AND num_ope <= ? AND scan_count = 1
        `;
        await this.runQueryWithRetry(sqlUpdate1, [now, nof, num_ope]);

        this.skipScan(nof, num_ope, now); // Call skipScan function to skip scan table as well

        console.log("Operations skipped up to num_ope:", num_ope, "for NOF:", nof);

    }




    // Skip scan table for a nof up to a specific operation number
    static async skipScan(nof, num_ope, now) {

        // Get qt and ref_gamme from marque table for this nof
        let sqlQt = `SELECT qt, ref_gamme FROM marque WHERE nof = ?`;
        let [result] = await this.runQueryWithRetry(sqlQt, [nof]);
        
        if (!result.length) {
            console.log("No qt or ref_gamme found for NOF:", nof, "Skipping scan update aborted.");
            return; // No qt found for this nof, abort
        }
        
        const qt = result[0].qt;
        const ref_gamme = result[0].ref_gamme;

        // Update scan table where qa < qt and num_ope <= given num_ope
        let sqlUpdate = `
            UPDATE scan
            SET qa = ?, moy_temps_passer = 0, temps_fin = ?, scan_count = ?, temps_dernier_scan = ?
            WHERE nof = ? AND num_ope <= ? AND qa < ?
        `;
        await this.runQueryWithRetry(sqlUpdate, [qt, now, qt * 2, now, nof, num_ope, qt]);


        // get the other num_ope for this ref_gamme that are not in the scan table for this nof and less than or equal to the given num_ope
        let sqlMissingNumOpe = `
            SELECT o.num_ope
            FROM operation o
            WHERE o.ref_gamme = ? AND o.num_ope <= ?
            AND o.num_ope NOT IN (
                SELECT s.num_ope FROM scan s WHERE s.nof = ? AND s.num_ope <= ?
            )
            ORDER BY o.num_ope ASC
        `;
        let [missingRows] = await this.runQueryWithRetry(sqlMissingNumOpe, [ref_gamme, num_ope, nof, num_ope]);

        if (missingRows.length) {
            let valuesToInsert = missingRows.map(row => [
                nof,
                ref_gamme,
                row.num_ope,
                qt,
                0, // moy_temps_passer
                0, // etat
                "", // commentaire
                now, // temps_debut
                now, // temps_fin
                qt * 2, // scan_count
                now  // temps_dernier_scan
            ]);
            let sqlInsert = `
                INSERT INTO scan (nof, ref_gamme, num_ope, qa, moy_temps_passer, etat, commentaire, temps_debut, temps_fin, scan_count, temps_dernier_scan)
                VALUES ?
            `;
            await this.runQueryWithRetry(sqlInsert, [valuesToInsert]);
            console.log("Inserted missing scan rows for NOF:", nof, "up to num_ope:", num_ope);
        }

    }



    // check if the last operation (with scan_count > 0) of the n_serie is initial (scan_count = 1)
    static async isNserieInitial(nof, n_serie) {

        // Get the last operation (highest num_ope) with scan_count > 0 for this nof and n_serie
        let sql = `
            SELECT scan_count
            FROM scan_carte
            WHERE nof = ? AND n_serie = ? AND scan_count > 0
            ORDER BY num_ope DESC
            LIMIT 1
        `;
        let [rows] = await this.runQueryWithRetry(sql, [nof, n_serie]);
        if (rows.length && rows[0].scan_count === 1) {
            return true;
        }
        return false;

    }


}

module.exports = TrackingDB;