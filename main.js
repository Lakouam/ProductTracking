// import Electron properties
const {app, BrowserWindow, nativeImage, Menu, ipcMain} = require('electron');

// to use path
const path = require('path');


// import our classes
const ScanData = require('./ScanData.js'); 
const TrackingDB = require('./TrackingDB.js');
const Post = require('./Post.js');
const PageUI = require('./PageUI.js');
const MyConfig = require('./MyConfig.js');



// Gets the path of the icon to use in the tray and taskbar
const iconPath = path.join(__dirname, "src", "icons", "applogo.ico");


// function to create a window
function createWindow() {
    const win = new BrowserWindow({
        width: 1050, // width of the app
        height: 700, // hight of the app

        icon: nativeImage.createFromPath(iconPath), // set the image as the icon of the application.
        
        webPreferences: {
            // to use node in the render process (page.html)
            nodeIntegration: true,
            contextIsolation: false, 
        }
    });


    // what content that we want to load in this window
    win.loadFile('page.html');





    // when loading the page
    {
        // Notification in the prompt 
        win.webContents.on("did-finish-load", () => {
            console.warn("app loading is finished!");
        });

    }





    // Menu
    let contextMenuRightClick;
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
            }
        ];

        const menu = Menu.buildFromTemplate(templateMenu);
        Menu.setApplicationMenu(menu);





        // a menu that pop up when we right click
        let templateRightClick = [
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
            
        }) ();

    }




    


    // Create our post (nof, refProduit, qt, ...) of the active row (qa < qt) of the post
    let post = new Post(); // create a new Post object


    PageUI.connect(win, contextMenuRightClick); // connect the pageUI to the window and contextMenuRightClick




    
    // receive data from render process
    let scanRejected = false; // is the scan rejected?
    {
        // receive scan input data amd update it in the database
        {
            // Read Scanner data that we send from the render process (page.html) (update it in the database)
            ipcMain.on("Scan Input", async (event, data) => {

                PageUI.disable(); // disable UI

                const scanData = new ScanData(data); // create a new ScanData object with the data received from the render process
                
                // check if the scan is valid
                if(scanData.isValide()){
                    console.warn("Scan valide: " + scanData.toString()); // print the scan data in the console

                    // update the post with the scan data
                    let updateInformations = await post.update(scanData); // update the post with the scan data
                    scanRejected = updateInformations.scanRejected; // get the scan rejected information

                }
                else {
                    console.warn("Scan invalide: " + scanData.toString()); // print the scan data in the console
                    scanRejected = true;
                }


                setTimeout(async function() { // to wait for one second (to solve: concurrent scan issue)

                    win.reload(); // reload the page to clear the input fields

                    PageUI.enable(); // enable UI

                }, 1000); // to wait for one second
            })
        }

    }






    // receive data from Database
    {   
        // receive data from database then send it to the render process whenever we load the page
        {
            win.webContents.on("did-finish-load", async () => {
                let data = await TrackingDB.getData();
                    
                win.webContents.send("Table Data Columns", data[0]); // send first row of the data to the render process (column names)
                win.webContents.send("Table Data Rows", data.slice(1)); // send the rest of the data to the render process (rows)
                    
            });
        }
        
        
        

        
        // receive active row (qa < qt) of the post from database whenever we change the post
        {
            ipcMain.on("Post Select", async (event, postName) => {

                PageUI.disable(); // disable UI


                let data = await TrackingDB.getActiveRow(postName) 
                    
                post.fillPostName(postName); // fill the post name
                post.fillFromDB(data); // fill the post with the data from the database
                
                //setTimeout(async function() { // to wait for one sec (For test: DB Delay)

                    win.reload(); // reload the page to clear the input fields

                    PageUI.enable(); // enable UI

                //}, 1000); // to wait for one sec
                    
            });
        }
        

    }






    // send data to render process
    {
        // send the post actuel whenever we load the page
        {
            win.webContents.on("did-finish-load", () => {
                win.webContents.send("Post Actuel", post.postActuel);
            });
        }
        


        // send a message about the scan whenever we load the page
        {
            win.webContents.on("did-finish-load", () => {
                if (!post.isSecondScan()) {
                    if (scanRejected) win.webContents.send("Message About Scan", "Scan Initial a été rejeté");
                    else win.webContents.send("Message About Scan", "Scan Initial");
                }
                else {
                    if (scanRejected) win.webContents.send("Message About Scan", "Scan Finale a été rejeté");
                    else win.webContents.send("Message About Scan", "Scan Finale");
                }
                scanRejected = false // initialize scanRejected
            });
        }
        

    }





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
            MyConfig.save(); // save JSON file
            TrackingDB.refreshPool(); // refresh the database connection pool
            return {success: true};
        });

    }


};






// Function to Open the Settings Window
function openSettingsWindow() {
    const settingsWin = new BrowserWindow({
        width: 400,
        height: 400,
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






// when app is ready open this window "createWindow"
app.whenReady().then(() => {
    createWindow();
});






