const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron')
const glob = require('glob')
const fs = require('fs');
const Datastore = require('nedb')
const path = require('path')

const pptFileName = "fourbifoto.properties"
const pptFileNamePath = path.join(app.getAppPath("home"), pptFileName);
const emptyAppProperties = {folders: []}

const menuDetails = [
    {
      label: 'Fichier',
      submenu: [
        {
          label: 'Ajouter un dossier',
          click () { dialog.showOpenDialog({properties: ['openDirectory', 'multiSelections']}, addPhotoFolder) }
        },
        {
          label: 'Quitter',
          click () { app.quit() }
        }
      ]
    }]


// Database to store a copy of all photos properties (name, path, album, persons, categories...)
var db

// Json object to store photo folders and preferences.
// Persisted in fourbifoto.properties
var appProperties;

let win;
let photosFolders = []
let photosURIs = []
let photosPaths = []


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
  
  
  win.loadURL(`file://${__dirname}/dist/index.html`)
  //win.loadURL(`http://localhost:4200`)
  
  // Open the DevTools.
  win.webContents.openDevTools()
  
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
    savePhotoFolder(folder[0])
    
    win.webContents.send('new-photo-folder', folder)
    
    var pattern = folder + "/**/*.+(jpg|png|tiff|nef)"
    glob(pattern, function(err, photoFilesPaths) {
        console.log("GetPhotoPaths : " + photoFilesPaths)
        if(err) return reject(err)
        photosPaths.concat(photoFilesPaths)
        win.webContents.send('new-photos', photoFilesPaths)
    })
}

function getPhotoPathFromFolder(folder) {
  var pattern = folder + "/**/*.+(jpg|png|tiff|nef)"
  glob(pattern, function(err, photoFilesPaths) {
      console.log("GetPhotoPaths : " + photoFilesPaths)
      if(err) return reject(err)
      //photosPaths.concat(photoFilesPaths)
      win.webContents.send('display-folder-photos', photoFilesPaths)
  })
}

ipcMain.on('get-photo-ppt', (event, photoPath) => {
  console.log("get-photo-path");
  let i = photoPath.lastIndexOf('/');
  let pptFileName = photoPath.substr(i) + '.json';
  var photoPpt = JSON.parse(fs.readFileSync(photoPath.substring(0,i)+pptFileName, 'utf8'));

  win.webContents.send('show-photo-ppt', photoPpt);
})

ipcMain.on('ready-to-init-data', () => {
  InitDbAndPropertiesAndData()
  win.webContents.send('init-data', appProperties)
})

ipcMain.on('get-photos-uri-from-folder', (event, folder) => {
  console.log('User aked for displayong photo of a folder')
  getPhotoPathFromFolder(folder)
})

function InitDbAndPropertiesAndData() {
  console.log("InitDbAndPropertiesAndData")
  appProperties = loadAppProperties()
  db = new Datastore({ filename: path.join(app.getAppPath("home"),"fourbifoto"), autoload: true }) 
}

function loadAppProperties() {
  var resAppPpt = emptyAppProperties;

  if(fs.existsSync(pptFileNamePath)) {
    resAppPpt = JSON.parse(fs.readFileSync(pptFileNamePath));
  } 

  return resAppPpt
}

function savePhotoFolder(folder) {
  photosFolders.push(folder)
  appProperties.folders.push(folder)
  fs.writeFileSync(pptFileNamePath, JSON.stringify(appProperties))
}