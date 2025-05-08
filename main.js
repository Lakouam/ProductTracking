// import Electron properties
const {app, BrowserWindow, nativeImage, Menu, ipcMain, } = require('electron');

// to use path
const path = require('path');


// import our classes
const ScanData = require('./ScanData.js'); 
const TableData = require('./TableData.js');



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





    // Notification in the prompt when loading the page
    {
        // you can use this event whenever our complete html and dom is ready 
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
    


    

    // Create our table (nof, refProduit, qt, ...)
    const tableData = new TableData(); 




    
    // receive data from render process
    let postActuel = null;
    let scanRejected = false; // is the scan rejected?
    let secondScan = false   // is the next scan, the second scan?
    {
        // receive scan input data
        {
            // Read Scanner data that we send from the render process (page.html) (write it in command prompt)
            ipcMain.on("Scan Input", (event, data) => {

                const scanData = new ScanData(data); // create a new ScanData object with the data received from the render process
                
                // check if the scan is valid
                if(scanData.isValide()){
                    console.warn("Scan valide: " + scanData.toString()); // print the scan data in the console

                    // update TableData with the scan data
                    let updateTableInformations = tableData.updateTable(scanData); // update the table with the scan data (and get the information about the scan)
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


        // receive post select data
        {
            ipcMain.on("Post Select", (event, data) => {
                // Read the selected post that we send from the render process (page.html) (and load the page)
                postActuel = data;
                win.reload(); // reload the page to clear the input fields


                secondScan = tableData.postNextScanIsSecond(postActuel); // check if the next scan of the post is the second scan (initial: false or final: true)

            });
        }
    }




    // send data to render process
    {
        // send the post actuel whenever we load the page
        win.webContents.on("did-finish-load", () => {
            win.webContents.send("Post Actuel", postActuel);
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


        // send the table data rows whenever we load the page
        win.webContents.on("did-finish-load", () => {
            win.webContents.send("Table Data Rows", tableData.getRows());
        });
    }



};



// when app is ready open this window "createWindow"
app.whenReady().then(() => {
    createWindow();
});






