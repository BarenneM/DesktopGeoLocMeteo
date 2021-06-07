const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const template = require("./src/assets/js/menu");
const saisie = null;

let win = null;

const createWindow = () => {

    //On crée la fenetre 
    win = new BrowserWindow({
        width: 1300,
        height: 900,
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });

    //Dans cette fenetre là on charge ce fichier
    win.loadFile("./view/index.html");
}

ipcMain.on("datasFromForm",(event, arg, temp) => {
    win.webContents.send("datasFromForm", arg, temp);
});

//Quand l'application est prête on crée la fenetre
app.whenReady()
.then(()=> {
    createWindow();
})

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

