// import Electron properties
const {app, BrowserWindow, nativeImage, Menu, ipcMain} = require('electron');

// to use path
const path = require('path');



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
    



    
    // receive scan input data
    {
        ipcMain.on("Scan Input", (event, data) => {
            // Read Scanner data that we send from the render process (page.html) (write it in command prompt)
            console.warn(data);
        })
    }




};



// when app is ready open this window "createWindow"
app.whenReady().then(() => {
    createWindow();
});






