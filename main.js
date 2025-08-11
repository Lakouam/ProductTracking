// import Electron properties
const {app, BrowserWindow, nativeImage, Menu, ipcMain} = require('electron');

// to use path
const path = require('path');

// to use electron-store for local storage
const Store = require('electron-store').default;
const store = new Store();


// import our classes
const ScanData = require('./src/code/js/mainprocess/ScanData.js'); 
const TrackingDB = require('./src/code/js/mainprocess/TrackingDB.js');
const Post = require('./src/code/js/mainprocess/Post.js');
const PageUI = require('./src/code/js/mainprocess/PageUI.js');
const MyConfig = require('./src/code/js/mainprocess/MyConfig.js');

const Gamme = require('./src/code/js/mainprocess/Gamme.js');

let user;



// Gets the path of the icon to use in the taskbar
const iconPath = path.join(__dirname, "src", "icons", "applogo2.ico");

// function to create a window
function createWindow() {
    const win = new BrowserWindow({
        width: 1050, // width of the app
        height: 700, // hight of the app

        icon: nativeImage.createFromPath(iconPath), // set the image as the icon of the application.
        
        show: false, // Don't show until maximized

        webPreferences: {
            // to use node in the render process (page.html)
            nodeIntegration: true,
            contextIsolation: false, 
        }
    });

    win.maximize(); // Add this line to maximize the window
    win.show();     // Now show the maximized window


    win.loadFile(appropriateFile(MyConfig.postActuel, 'open-login')); // load the login page first


    // when loading the page
    {
        // Notification in the prompt 
        win.webContents.on("did-finish-load", () => {
            console.warn("app loading is finished!");
        });

    }





    // Menu
    let contextMenuRightClick;
    let menu;
    {
        // remove the Application menu (disable all the menu shortcuts like F11 for toggling fullscreen etc.)
        //Menu.setApplicationMenu(null);



        // Application menu with Settings
        const templateMenu = [
            {
                label: 'Fichier',
                submenu: [
                    {
                        label: 'Paramètres',
                        submenu: [
                            {
                                label: 'Base de données',
                                click: () => openSettingsWindow()
                            }
                        ]
                    },
                    { role: 'quit', label: 'Quitter' }
                ]
            },
            {
                label: 'Édition',
                submenu: [
                    { role: 'undo', label: 'Annuler' },
                    { role: 'redo', label: 'Rétablir' },
                    { type: 'separator' },
                    { role: 'cut', label: 'Couper' },
                    { role: 'copy', label: 'Copier' },
                    { role: 'paste', label: 'Coller' },
                    { type: 'separator' },
                    { role: 'selectAll', label: 'Tout sélectionner' }
                ]
            },
            {
                label: 'Affichage',
                submenu: [
                    { role: 'reload', label: 'Recharger' },
                    { role: 'forceReload', label: 'Recharger (forcer)' },
                    //{ role: 'toggleDevTools', label: 'Outils de développement' },
                    { type: 'separator' },
                    { role: 'resetZoom', label: 'Réinitialiser le zoom' },
                    { role: 'zoomIn', label: 'Zoomer' },
                    { role: 'zoomOut', label: 'Dézoomer' },
                    { type: 'separator' },
                    { role: 'togglefullscreen', label: 'Plein écran' }
                ]
            },
            {
                label: 'Fenêtre',
                submenu: [
                    { role: 'minimize', label: 'Minimiser' },
                    { role: 'close', label: 'Fermer la fenêtre' }
                ]
            },
            {
                label: 'Aide',
                submenu: [
                    {
                        label: 'En savoir plus',
                        click: async () => {
                            const { shell } = require('electron');
                            await shell.openExternal('https://github.com/Lakouam/ProductTracking'); // app's site or repo
                        }
                    },
                    {
                        label: 'À propos',
                        click: () => {
                            // show an about dialog here
                        }
                    }
                ]
            }
        ];

        menu = Menu.buildFromTemplate(templateMenu);
        Menu.setApplicationMenu(menu);





        // a menu that pop up when we right click
        let templateRightClick = [
            {label: 'Couper', role: 'cut'},
            {label: 'Copier', role: 'copy'},
            {label: 'Coller', role: 'paste'},
            {type: 'separator'},
            {label: 'Recharger', role: 'reload'},
            {label: 'Outils de développement', role: 'toggleDevTools'}
        ];
        contextMenuRightClick = Menu.buildFromTemplate(templateRightClick);

        win.webContents.on('context-menu', () =>{
            contextMenuRightClick.popup();
        });
    }
    





    // some Database operations
    {
        (async () => {
            //await TrackingDB.createDatabase();      // create the database if not exist
            //await TrackingDB.dropTables();          // drop the tables if exist

            //await TrackingDB.createTables();        // create the tables if they do not exist
            //await TrackingDB.clearTables();         // clear the tables
            //await TrackingDB.insertValuesInitial(); // insert initial values in the tables if they do not exist



            // insert Gammes
            /*
            (async () => {
                try {
                    const gammefilePath = path.join(__dirname, "src", "gamme", "GAMMES DE FABRICATION X3.xls");
                    await Gamme.fileToDB(gammefilePath);
                } catch (err) {
                    console.error("Error while inserting Gammes:", err.message);
                    // close the app
                    app.quit();
                }
            }) ();
            */



        }) ();
    }




    


    // Create our post (nof, refProduit, qt, ...) of the active row (qa < qt) of the post
    let post = new Post(); // create a new Post object


    PageUI.connect(win, contextMenuRightClick, menu); // connect the pageUI to the window and contextMenuRightClick






    // poste select.js
    {

        // receive data from Database
        {
            // receive active row (qa < qt) of the post from database whenever we change the post
            {
                ipcMain.on("Post Select", async (event, postName) => {

                    try {

                        PageUI.disable(); // disable UI


                        //let data = await TrackingDB.getActiveRow(postName);
                            
                        post.fillPostName(postName); // fill the post name

                        MyConfig.postActuel = postName;
                        MyConfig.save(); // save the post actuel in the config file

                        //post.fillFromDB(data); // fill the post with the data from the database

                        win.reload();

                        PageUI.enable(); // enable UI

                    } catch (err) {
                        console.error("Database error in Post Select event:", err.message);
                        // close the app
                        app.quit();
                    }
                        
                });
            }
            


            // receive the posts names from database whenever we load the page and send it to the render process
            {
                ipcMain.handle('Posts Names', async () => {

                    try {

                        PageUI.disable(); // disable UI

                        let postsName = await TrackingDB.getPostsName();

                        PageUI.enable(); // enable UI

                        return postsName; // send the post name to the render process

                    } catch (err) {
                        console.error("Database error in Posts Names event:", err.message);
                        // close the app
                        app.quit();
                    }

                });
            }
        }




        // local storage JSON file (settings)
        {
            // send the post Actuel to the render process (posteselect.js) whenever it request it, (the event that fill our post is not trigered first time when we get post name from local storage, so triger it)
            ipcMain.handle('Post Actuel', async () => {
                return {name: MyConfig.postActuel, isnull: (post.postActuel === null), 
                        saved: store.get(MyConfig.postActuel)};
            });
        }


    }








    // scanner.js
    {


        // receive data from render process
        let scanRejected = false; // is the scan rejected?
        let errorMessage = ""; // error message
        {
            // receive scan input data amd update it in the database
            {
                // Read Scanner data that we send from the render process (scanner.html) (update it in the database)
                ipcMain.on("Scan Input", async (event, data) => {

                    try {

                        PageUI.disable(); // disable UI

                        const scanData = new ScanData(data); // create a new ScanData object with the data received from the render process
                        
                        // check if the scan is valid
                        if(scanData.isValide()){
                            console.warn("Scan valide: " + scanData.toString()); // print the scan data in the console

                            // update the post with the scan data
                            let updateInformations = await post.update(scanData, store, { nom: user.nom, matricule: user.matricule }); // update the post with the scan data
                            scanRejected = updateInformations.scanRejected; // get the scan rejected information
                            errorMessage = updateInformations.errorMessage; // get the error message

                        }
                        else {
                            console.warn("Scan invalide: " + scanData.toString()); // print the scan data in the console
                            scanRejected = true;
                            errorMessage = scanData.errorMessage(); // get the error message
                        }


                        //setTimeout(async function() { // to wait for one second (to solve: concurrent scan issue)

                            win.reload(); // reload the page to clear the input fields

                            PageUI.enable(); // enable UI

                        //}, 1000); // to wait for one second

                    } catch (err) {
                        console.error("Database error in Scan Input event:", err.message);
                        // close the app
                        app.quit();
                    }

                })
            }

        }





        // send data to render process
        {

            // send a message about the scan whenever we load the page
            {
                ipcMain.handle('Message About Scan', async () => {

                    let noteMessage = " (Quantité: " + post.qa + "/" + post.qt + ")"; // informations about the post (qa and qt)
                    if (post.nof === null) noteMessage = " (Nouveau produit)"

                    let isRejected = scanRejected; // get the scan rejected information
                    let errorMsg = errorMessage; // get the error message

                    scanRejected = false // initialize scanRejected
                    errorMessage = ""; // initialize errorMessage

                    if (!post.isSecondScan()) {
                        if (isRejected) return {message: "Scan Initial a été rejeté" + noteMessage, errorMessage: errorMsg};
                        else return {message: "Scan Initial" + noteMessage, errorMessage: ""};
                    }
                    else {
                        if (isRejected) return {message: "Scan Finale a été rejeté" + noteMessage, errorMessage: errorMsg};
                        else return {message: "Scan Finale" + noteMessage, errorMessage: ""};
                    }
                });
            }
            

        }


    }



    
    




    // ShowData.js (page scans.js & marque.js & post.js & gamme.js & operations.js)
    {
        // receive data from Database
        {   
            // receive data from database then send it to the render process whenever we load the page
            {
                ipcMain.handle('Table Data', async (event, who, value) => {

                    try {

                        PageUI.disable(); // disable UI

                        let data = await TrackingDB.getData(who, value); // get the data from the database

                        PageUI.enable(); // enable UI
                        
                        return {columns: data[0], rows: data.slice(1)}; // send the columns and rows to the render process

                    } catch (err) {
                        console.error("Database error in Table Data event:", err.message);
                        // close the app
                        app.quit();
                    }
                    
                });
            }

        }



        // receive data from render process
        {
            // receive data from render process (ShowData.js) to remove a row from the database
            ipcMain.handle('remove-row', async (event, value, who) => {

                try {

                    PageUI.disable(); // disable UI

                    let success = await TrackingDB.removeRow(value, who); // remove the row from the database

                    win.reload(); // reload the page to refresh the table

                    PageUI.enable(); // enable UI

                    return success; // send the success status to the render process

                } catch (err) {
                    console.error("Database error in remove-row event:", err.message);
                    // close the app
                    app.quit();
                }

            });



            // open gammedetail.html
            ipcMain.on('open-gamme-detail', (event, gamme) => {
                win.loadFile(appropriateFile(MyConfig.postActuel, 'open-gamme-detail'), { query: { gamme } });
            });



            // open carte.html
            ipcMain.on('open-nof-detail', (event, nof, gamme, qt) => {
                win.loadFile(appropriateFile(MyConfig.postActuel, 'open-nof-detail'), { query: { nof, gamme, qt } });
            });



            // open userdetail.html
            ipcMain.on('open-user-detail', (event, nom, matricule, role) => {
                win.loadFile(appropriateFile(MyConfig.postActuel, 'open-user-detail'), { query: { nom, matricule, role } });
            });



            // open poste-detail.html
            ipcMain.on('open-poste-detail', (event, poste) => {
                win.loadFile(appropriateFile(MyConfig.postActuel, 'open-poste-detail'), { query: { poste } });
            });
        }
    }








    // settings.js
    {
        // local storage JSON file (settings)
        {
            // send the config file to the render process (settings.html) whenever we load the page
            ipcMain.handle('get-db-config', async () => {
                return MyConfig.toObject(); // send the config file to the render process
            });

            // save the config file whenever we change it (settings.html)
            ipcMain.handle('save-db-config', async (event, config) => {
                MyConfig.host = config.host;
                MyConfig.user = config.user;
                MyConfig.password = config.password;
                MyConfig.database = config.database;
                let success = MyConfig.save(); // save JSON file
                TrackingDB.refreshPool(); // refresh the database connection pool
                return {success: success};
            });


        }
    }






    // navigation.js
    {
        // receive data from render process
        {
            ipcMain.on('open-scans', async (event, data) => {
                win.loadFile(appropriateFile(MyConfig.postActuel, 'open-scans'));
            });
            ipcMain.on('open-nof', async (event, data) => {
                win.loadFile(appropriateFile(MyConfig.postActuel, 'open-nof'));
            });
            ipcMain.on('open-post', async (event, data) => {
                win.loadFile(appropriateFile(MyConfig.postActuel, 'open-post'));
            });
            ipcMain.on('open-gamme', async (event, data) => {
                win.loadFile(appropriateFile(MyConfig.postActuel, 'open-gamme'));
            });
            ipcMain.on('open-operations', async (event, data) => {
                win.loadFile(appropriateFile(MyConfig.postActuel, 'open-operations'));
            });
            ipcMain.on('open-scanner', async (event, data) => {
                win.loadFile(appropriateFile(MyConfig.postActuel, 'open-scanner'));
            });
            ipcMain.on('open-user', async (event, data) => {
                win.loadFile(appropriateFile(MyConfig.postActuel, 'open-user'));
            });
        }
    }


    


    // Add (user.js)
    {
        // receive data from render process
        {
            /*
            // receive add post request from render process (modifypost.js)
            ipcMain.handle('add-post', async (event, postName) => {

                try {

                    PageUI.disable(); // disable UI

                    let success = await TrackingDB.addPost(postName); // add the post to the database

                    win.reload(); // reload the page to refresh the table

                    PageUI.enable(); // enable UI

                    return success; // send the success status to the render process

                } catch (err) {
                    console.error("Database error in add-post event:", err.message);
                    // close the app
                    app.quit();
                }

            });
            */



            
            // receive add nof request from render process (modifynof.js)
            ipcMain.handle('add-nof', async (event, nofscan) => {

                try {

                    PageUI.disable(); // disable UI

                    let success = false;
                    if(nofscan !== null && ScanData.isValidNof(nofscan.nof, nofscan.ref, nofscan.qt)) 
                        success = await TrackingDB.addNof(nofscan.nof, nofscan.ref, parseInt(nofscan.qt)); // add the post to the database
                    else console.warn("Invalid NOF data:", nofscan);


                    if (success) 
                        win.reload(); // reload the page to refresh the table

                    PageUI.enable(); // enable UI

                    return success; // send the success status to the render process

                } catch (err) {
                    console.error("Database error in add-nof event:", err.message);
                    // close the app
                    app.quit();
                }

            });
            




            // receive add user request from render process (user.js)
            ipcMain.handle('add-user', async (event, userData) => {

                try {

                    PageUI.disable(); // disable UI

                    console.log("Adding user:", userData);

                    let success = false;
                    if(userData !== null) 
                        success = await TrackingDB.addUser(userData.nom, userData.matricule, userData.role); // add the user to the database

                    if (success) 
                        win.reload(); // reload the page to refresh the table

                    PageUI.enable(); // enable UI

                    return success; // send the success status to the render process

                } catch (err) {
                    console.error("Database error in add-user event:", err.message);
                    // close the app
                    app.quit();
                }

            });

        }
    }





    // login.js & userinfo.js
    {
        // receive login request from render process (login.js)
        ipcMain.handle('login-user', async (event, { nom, matricule }) => {
            
            try {
                PageUI.disable(); // disable UI

                user = await TrackingDB.findUser([nom, matricule]);
                console.log("User found:", user);

                PageUI.enable(); // enable UI

                if (user) {
                    // go to scanner.html
                    win.loadFile(appropriateFile(MyConfig.postActuel, 'open-scanner'));

                    return { success: true};
                } else {
                    return { success: false, message: "Nom ou matricule incorrect." };
                }

            } catch (err) {
                console.error("Database error in login-user event:", err.message);
                return { success: false, message: "Erreur de connexion à la base de données." };
            }
        });



        // send the current user information to the render process (userinfo.js) whenever it request it
        ipcMain.handle('get-current-user', async () => {
            return{ nom: user.nom, role: user.role };
        });
        
    }




    // insert gammes (gamme.js)
    {
        ipcMain.on('insert-gamme', async (event) => {
            try {
                PageUI.disable(); // disable UI

                const gammefilePath = path.join(__dirname, "src", "gamme", "GAMMES DE FABRICATION X3.xls");
                await Gamme.fileToDB(gammefilePath);

                win.reload(); // reload the page to refresh the table

                PageUI.enable(); // enable UI

            } catch (err) {
                console.error("Error while inserting Gammes:", err.message);
                // close the app
                app.quit();
            }
        });
                
    }


};






// Function to Open the Settings Window
function openSettingsWindow() {
    const settingsWin = new BrowserWindow({
        width: 450,
        height: 500,
        icon: nativeImage.createFromPath(iconPath), // set the image as the icon of the application.
        title: "Settings",
        parent: BrowserWindow.getFocusedWindow(),
        modal: true, // prevent interaction with the main window until this window is closed
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    settingsWin.setMenu(null); // Optional: remove menu from settings window
    settingsWin.loadFile('settings.html');
}





// load the appropriate file
function appropriateFile(postName, dashboard = "") {
    // what content that we want to load in this window

    if (dashboard === 'open-scans') return 'src/code/html/scans.html';
    if (dashboard === 'open-nof') return 'src/code/html/marque.html';
    if (dashboard === 'open-post') return 'src/code/html/post.html';
    if (dashboard === 'open-gamme') return 'src/code/html/gamme.html';
    if (dashboard === 'open-gamme-detail') return 'src/code/html/gammedetail.html';
    if (dashboard === 'open-operations') return 'src/code/html/operations.html';
    if (dashboard === 'open-scanner') return 'src/code/html/scanner.html';
    if (dashboard === 'open-nof-detail') return 'src/code/html/carte.html';
    if (dashboard === 'open-user') return 'src/code/html/user.html';
    if (dashboard === 'open-user-detail') return 'src/code/html/userdetail.html';
    if (dashboard === 'open-login') return 'src/code/html/login.html';
    if (dashboard === 'open-poste-detail') return 'src/code/html/postedetail.html';
    return 'src/code/html/scans.html'; // load the nof page by default
}




// when app is ready open this window "createWindow"
app.whenReady().then(() => {
    createWindow();
});






