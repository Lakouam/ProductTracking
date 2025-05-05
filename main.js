// import Electron properties
const {app, BrowserWindow, nativeImage} = require('electron');

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





    // use webContents as wc
    let wc = win.webContents;


    // you can use this event whenever our complete html and dom is ready 
    wc.on("did-finish-load", () => {
        console.warn("app loading is finished!");
    });



};


// when app is ready open this window "createWindow"
app.whenReady().then(() => {
    createWindow();
});