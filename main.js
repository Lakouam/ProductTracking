// import Electron properties
const {app, BrowserWindow, nativeImage, Menu, ipcMain} = require('electron');

// to use path
const path = require('path');


// import our classes
const ScanData = require('./ScanData.js'); 
const TrackingDB = require('./TrackingDB.js');
const Post = require('./Post.js');



// Gets the path of the icon to use in the tray and taskbar
const iconPath = path.join(__dirname, "src", "icons", "applogo.ico");


// function to create a window
function createWindow() {
    const win = new BrowserWindow({
        width: 900, // width of the app
        height: 600, // hight of the app

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
    {
        // remove the Application menu (disable all the menu shortcuts like F11 for toggling fullscreen etc.)
        Menu.setApplicationMenu(null);




        // a menu that pop up when we right click
        let templateRightClick = [
            {label: 'Reload', role: 'reload'},
            {label: 'Toggle Developer Tools', role: 'toggleDevTools'}
        ];
        let contextMenuRightClick = Menu.buildFromTemplate(templateRightClick);

        win.webContents.on('context-menu', () =>{
            contextMenuRightClick.popup();
        });
    }
    


    


    // Create our post (nof, refProduit, qt, ...) of the active row (qa < qt) of the post
    let post = new Post(); // create a new Post object




    
    // receive data from render process
    //let postActuel = null;
    let scanRejected = false; // is the scan rejected?
    let secondScan = false   // is the next scan, the second scan?
    {
        // receive scan input data
        {
            // Read Scanner data that we send from the render process (page.html) (write it in command prompt)
            ipcMain.on("Scan Input", async (event, data) => {

                const scanData = new ScanData(data); // create a new ScanData object with the data received from the render process
                
                // check if the scan is valid
                if(scanData.isValide()){
                    console.warn("Scan valide: " + scanData.toString()); // print the scan data in the console

                    // update the post with the scan data
                    let updateTableInformations = await post.update(scanData); // update the post with the scan data
                    scanRejected = updateTableInformations.scanRejected; // get the scan rejected information
                    secondScan = updateTableInformations.secondScan; // get the second scan information

                }
                else {
                    console.warn("Scan invalide: " + scanData.toString()); // print the scan data in the console
                    scanRejected = true;
                }



                win.reload(); // reload the page to clear the input fields

            })
        }

    }




    // send data to render process
    {
        // send the post actuel whenever we load the page
        win.webContents.on("did-finish-load", () => {
            //win.webContents.send("Post Actuel", postActuel);
            win.webContents.send("Post Actuel", post.postActuel);
        });


        // send a message about the scan whenever we load the page
        win.webContents.on("did-finish-load", () => {
            if (!secondScan) {
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





    // Database
    {
        // create the database and the tables if they do not exist
        //TrackingDB.createDatabase();
        //TrackingDB.dropTables(); // drop the tables if exist
        //TrackingDB.createTables();
        TrackingDB.clearTables(); // clear the tables
        TrackingDB.insertValuesInitial(); // insert initial values in the tables if they do not exist

        
        // get the data from the database then send it to the render process whenever we load the page
        win.webContents.on("did-finish-load", () => {
            TrackingDB.getData()
                .then(data => {
                    win.webContents.send("Table Data Columns", data[0]); // send first row of the data to the render process (column names)
                    win.webContents.send("Table Data Rows", data.slice(1)); // send the rest of the data to the render process (rows)
                })
                .catch(error => {
                    console.error("Error retrieving data from the database:", error);
                });
        });
        
        

        
        // get active row (qa < qt) of the post from the database whenever we change the post
        ipcMain.on("Post Select", (event, postName) => {
            TrackingDB.getActiveRow(postName) 
                .then(data => {

                    post.fillPostName(postName); // fill the post name
                    post.fillFromDB(data); // fill the post with the data from the database
                    //post.show(); // show the post in the console

                
                    secondScan = post.isSecondScan(); // check if the next scan of the post is the second scan (initial: false or final: true)

                    win.reload(); // reload the page to clear the input fields
                })
                .catch(error => {
                    console.error("Error retrieving data from the database:", error);
                });
        });

    }





};



// when app is ready open this window "createWindow"
app.whenReady().then(() => {
    createWindow();
});






