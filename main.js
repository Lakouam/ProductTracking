// import Electron properties
const {app, BrowserWindow} = require('electron');


// function to create a window
function createWindow() {
    const win = new BrowserWindow({
        width: 900, // width of the app
        height: 600, // hight of the app
        
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