// import Electron properties
const {app, BrowserWindow, nativeImage, Menu, ipcMain} = require('electron');

// to use path
const path = require('path');


// import our classes
const ScanData = require('./src/code/js/mainprocess/ScanData.js'); 
const TrackingDB = require('./src/code/js/mainprocess/TrackingDB.js');
const Post = require('./src/code/js/mainprocess/Post.js');
const PageUI = require('./src/code/js/mainprocess/PageUI.js');
const MyConfig = require('./src/code/js/mainprocess/MyConfig.js');

const Gamme = require('./src/code/js/mainprocess/Gamme.js');



// Gets the path of the icon to use in the tray and taskbar
//const iconPath = path.join(__dirname, "src", "icons", "applogo.ico");
const iconPath = path.join(__dirname, "src", "icons", "applogo2.png");

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


    win.loadFile(appropriateFile(MyConfig.postActuel)); // load the appropriate file

    // load page.html in src/code/html
    win.loadFile(path.join(__dirname, "src", "code", "html", "scans.html"));
    //win.loadFile(path.join(__dirname, "src", "code", "test", "html", "show.html"));


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
                label: 'File',
                submenu: [
                    {
                        label: 'Settings',
                        submenu: [
                            {
                                label: 'Database',
                                click: () => openSettingsWindow()
                            }
                        ]
                    },
                    { role: 'quit' }
                ]
            },
            {
                label: 'Edit',
                submenu: [
                    { role: 'undo' },
                    { role: 'redo' },
                    { type: 'separator' },
                    { role: 'cut' },
                    { role: 'copy' },
                    { role: 'paste' },
                    { type: 'separator' },
                    { role: 'selectAll' }
                ]
            },
            {
                label: 'View',
                submenu: [
                    { role: 'reload', label: 'Reload' },
                    { role: 'forceReload', label: 'Force Reload' },
                    { role: 'toggleDevTools', label: 'Toggle Developer Tools' },
                    { type: 'separator' },
                    { role: 'resetZoom', label: 'Reset Zoom' },
                    { role: 'zoomIn', label: 'Zoom In' },
                    { role: 'zoomOut', label: 'Zoom Out' },
                    { type: 'separator' },
                    { role: 'togglefullscreen', label: 'Toggle Fullscreen' }
                ]
            },
            {
                label: 'Window',
                submenu: [
                    { role: 'minimize', label: 'Minimize' },
                    { role: 'close', label: 'Close Window' }
                ]
            },
            {
                label: 'Help',
                submenu: [
                    {
                        label: 'Learn More',
                        click: async () => {
                            const { shell } = require('electron');
                            await shell.openExternal('https://github.com/Lakouam/ProductTracking'); // app's site or repo
                        }
                    },
                    {
                        label: 'About',
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
            {label: 'Cut', role: 'cut'},
            {label: 'Copy', role: 'copy'},
            {label: 'Paste', role: 'paste'},
            {type: 'separator'},
            {label: 'Reload', role: 'reload'},
            {label: 'Toggle Developer Tools', role: 'toggleDevTools'}
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






    // Post Render.js
    {

        // receive data from Database
        {
            // receive active row (qa < qt) of the post from database whenever we change the post
            {
                ipcMain.on("Post Select", async (event, postName) => {

                    try {

                        PageUI.disable(); // disable UI


                        let data = await TrackingDB.getActiveRow(postName) 
                            
                        post.fillPostName(postName); // fill the post name

                        MyConfig.postActuel = postName;
                        MyConfig.save(); // save the post actuel in the config file

                        post.fillFromDB(data); // fill the post with the data from the database
                        
                        //setTimeout(async function() { // to wait for one sec (For test: DB Delay)

                            //win.loadFile(appropriateFile(postName)); // load the appropriate file

                            PageUI.enable(); // enable UI

                        //}, 1000); // to wait for one sec

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
            // send the post Actuel to the render process (postRender.js) whenever it request it, (the event that fill our post is not trigered first time when we get post name from local storage, so triger it)
            ipcMain.handle('Post Actuel', async () => {
                return {name: MyConfig.postActuel, isnull: (post.postActuel === null)};
            });
        }


    }








    // page.js
    {


        // receive data from render process
        let scanRejected = false; // is the scan rejected?
        let errorMessage = ""; // error message
        {
            // receive scan input data amd update it in the database
            {
                // Read Scanner data that we send from the render process (page.html) (update it in the database)
                ipcMain.on("Scan Input", async (event, data) => {

                    try {

                        PageUI.disable(); // disable UI

                        const scanData = new ScanData(data); // create a new ScanData object with the data received from the render process
                        
                        // check if the scan is valid
                        if(scanData.isValide()){
                            console.warn("Scan valide: " + scanData.toString()); // print the scan data in the console

                            // update the post with the scan data
                            let updateInformations = await post.update(scanData); // update the post with the scan data
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



    
    




    // ShowData.js (page Admin.js & modifynof.js & modifypost.js & gammesrender.js)
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






    // dashboard.js
    {
        // receive data from render process
        {
            ipcMain.on('open-show-data', async (event, data) => {
                win.loadFile(appropriateFile(MyConfig.postActuel, 'open-show-data'));
            });
            ipcMain.on('open-modify-nof', async (event, data) => {
                win.loadFile(appropriateFile(MyConfig.postActuel, 'open-modify-nof'));
            });
            ipcMain.on('open-modify-posts', async (event, data) => {
                win.loadFile(appropriateFile(MyConfig.postActuel, 'open-modify-posts'));
            });
            ipcMain.on('open-show-gammes', async (event, data) => {
                win.loadFile(appropriateFile(MyConfig.postActuel, 'open-show-gammes'));
            });
            ipcMain.on('open-show-operations', async (event, data) => {
                win.loadFile(appropriateFile(MyConfig.postActuel, 'open-show-operations'));
            });
        }
    }





    // navigation.js
    {
        // receive data from render process
        {
            ipcMain.on('open-dashboard', async (event, data) => {
                win.loadFile(appropriateFile(MyConfig.postActuel, 'open-dashboard'));
            });

            ipcMain.on('open-gammes', async (event, data) => {
                win.loadFile(appropriateFile(MyConfig.postActuel, 'open-show-gammes'));
            });
        }
    }



    // modifypost.js & modifynof.js
    {
        // receive data from render process
        {
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



            // receive add post request from render process (modifynof.js)
            ipcMain.handle('add-nof', async (event, nofscan) => {

                try {

                    PageUI.disable(); // disable UI

                    let success = false;
                    if(nofscan !== null) 
                        success = await TrackingDB.addNof(nofscan.nof, nofscan.refProduit, nofscan.qt); // add the post to the database

                    win.reload(); // reload the page to refresh the table

                    PageUI.enable(); // enable UI

                    return success; // send the success status to the render process

                } catch (err) {
                    console.error("Database error in add-nof event:", err.message);
                    // close the app
                    app.quit();
                }

            });


        }
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
    if(postName === "Admin") {
        if (dashboard === 'open-show-data') return 'pageAdmin.html';
        if (dashboard === 'open-dashboard') return 'dashboard.html';
        if (dashboard === 'open-modify-nof') return 'modifynof.html';
        if (dashboard === 'open-modify-posts') return 'modifypost.html';
        if (dashboard === 'open-show-gammes') return 'gammes.html';
        if (dashboard === 'open-gamme-detail') return 'gammedetail.html';
        if (dashboard === 'open-show-operations') return 'operations.html';
        return 'dashboard.html'; // load the dashboard page
    }
    else return 'page.html'; // load the page
}




// when app is ready open this window "createWindow"
app.whenReady().then(() => {
    createWindow();
});






