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



}

module.exports = TrackingDB;