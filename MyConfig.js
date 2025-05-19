// to use file system
const fs = require('fs');

// to use path
const path = require('path');

class MyConfig {

     // path to the config file
    static configPath = path.join(__dirname, "src", "config", "config.json");

    // read the config file
    static config = this.loadConfig();
    
    

    // load the config file
    static loadConfig() {
        return JSON.parse(fs.readFileSync(this.configPath, 'utf-8')); // readFileSync is synchronous, which means that your code pauses and waits until the file is read before continuing
    }

    // refresh the config file
    static refresh() {
        this.config = this.loadConfig(); 
    }

    // save the config file
    static save() {
        fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2)); // writeFileSync is synchronous, which means that your code pauses and waits 
                                                                                 // until the file is written before continuing
    }


    
    // getter and setter for the config
        // getter and setter for host
        static get host() {
            return this.config.db.host;
        }

        static set host(value) {
            this.config.db.host = value;
        }

        // getter and setter for user
        static get user() {
            return this.config.db.user;
        }

        static set user(value) {
            this.config.db.user = value;
        }

        // getter and setter for password
        static get password() {
            return this.config.db.password;
        }

        static set password(value) {
            this.config.db.password = value;
        }

        // getter and setter for database
        static get database() {
            return this.config.db.database;
        }

        static set database(value) {
            this.config.db.database = value;
        }

        // getter and setter for post name
        static get postActuel() {
            return this.config.post.name;
        }

        static set postActuel(value) {
            this.config.post.name = value;
        }



    static toObject() {
        return {host: MyConfig.host, user: MyConfig.user, password: MyConfig.password, database: MyConfig.database};
    }

}

module.exports = MyConfig;