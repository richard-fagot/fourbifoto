const { app, BrowserWindow, Menu, dialog } = require('electron')
const glob = require('glob')

const menuDetails = [
    {
      label: 'Fichier',
      submenu: [
        {
          label: 'Ajouter un dossier',
          click () { dialog.showOpenDialog({properties: ['openDirectory', 'multiSelections']}, addPhotoFolder) }
        }
      ]
    }]

let win;
let photosFolders = []
let photosURIs = []

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 600, 
    height: 600,
    backgroundColor: '#ffffff',
    icon: `file://${__dirname}/dist/assets/logo.png`
  })
  win.maximize()
  let menu = Menu.buildFromTemplate(menuDetails)
  Menu.setApplicationMenu(menu)

  // Open the DevTools.
  win.webContents.openDevTools()

  win.loadURL(`file://${__dirname}/dist/index.html`)
  //win.loadURL(`http://localhost:4200`)
  //// uncomment below to open the DevTools.
  // win.webContents.openDevTools()

  // Event when the window is closed.
  win.on('closed', function () {
    win = null
  })
}

// Create window on electron intialization
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {

  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // macOS specific close process
  if (win === null) {
    createWindow()
  }
})

function addPhotoFolder(folder) {
    photosFolders.push(folder)
    win.webContents.send('new-photo-folder', folder)
    
    var pattern = folder + "/**/*.+(jpg|JPG|png|tiff|nef)"
    glob(pattern, {nocase: false}, function(err, photosPaths) {
        console.log("GetPhotoPaths : " + photosPaths)
        if(err) return reject(err)
    })
}