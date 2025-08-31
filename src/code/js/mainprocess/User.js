class User {

    static ROLES = ['Admin', 'Opérateur', 'Superviseur']; // define the roles

    constructor() {
        this._nom = null;
        this._matricule = null;
        this._role = null;
    }


    // getters and setters
        // getter and setter for nom
        get nom() {
            return this._nom;
        }
        set nom(value) {
            this._nom = value;
        }

        // getter and setter for matricule
        get matricule() {
            return this._matricule;
        }
        set matricule(value) {
            this._matricule = value;
        }

        // getter and setter for role
        get role() {
            return this._role;
        }
        set role(value) {
            this._role = value;
        }

    

    // fill user
    fillUser(userInfo) {
        this.nom = userInfo.nom;
        this.matricule = userInfo.matricule;
        this.role = userInfo.role;
    }
    

    // reset user
    resetUser() {
        this.nom = null;
        this.matricule = null;
        this.role = null;
    }


    // check user before adding it to the database
    static isUserValid(nom, matricule, role) {
        if (nom && matricule && role) {
            // check if nom is a string and not empty
            if (typeof nom !== 'string' || nom.trim() === '') 
                return false;
            
            // check if matricule is a string and not empty
            if (typeof matricule !== 'string' || matricule.trim() === '') 
                return false;
            
            // check if role is a string and is one of the defined roles and not 'Admin'
            if (typeof role !== 'string' || !User.ROLES.includes(role) || role === 'Admin') 
                return false;

            // if all checks passed, return true
            return true;
        }
        return false;
    }



    // Verify action of user
    static isActionValid(action, role, value = "") {
        // Check if action is a string and not empty
        if (typeof action !== 'string' || action.trim() === '') 
            return false;

        // Check if role is a string and is one of the defined roles
        if (typeof role !== 'string' || !User.ROLES.includes(role))
            return false;
        

        if (action === 'access-other-pages') { // any page except the login & scanner pages
            if (role === 'Opérateur') 
                return false; // Opérateur cannot access other pages
        }
        

        if (action === 'remove-row') { // remove a row from the database
            if (role === 'Opérateur' || role === 'Superviseur')
                return false; // Opérateur and Superviseur cannot remove a row
        }


        if (action === 'right-click-menu' || action === 'menu') { // right click menu
            if (role === 'Opérateur') 
                return false; // Opérateur cannot use right click menu
        }

        if (action === 'add-user') { // add a user to the database
            if (role === 'Opérateur') 
                return false; // Opérateur cannot add a user
            if (role === 'Superviseur')
                if (value !== 'Opérateur')
                    return false; // Superviseur can only add Opérateur
        }

        if (action === 'import-gammes') { // import gammes
            if (role === 'Opérateur' || role === 'Superviseur')
                return false; // Opérateur and Superviseur cannot import gammes
        }


        return true; // if all checks passed, return true
    }




}

module.exports = User;