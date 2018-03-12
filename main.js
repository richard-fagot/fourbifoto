const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron')
const glob = require('glob')
const fs = require('fs');
const Datastore = require('nedb')
const path = require('path')
const exif = require('fast-exif')

const pptFileName = "fourbifoto.properties"
const pptFileNamePath = path.join(app.getAppPath("home"), pptFileName);
const emptyAppProperties = {folders: []}
// Photo class to persist
// { filename: photoFilename: string
// , path: string
// , date: string
// , persons: arrayOfPersons
// , albums: arrayOfStrings
// , categories: arrayOfStrings }





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
var appProperties

var win
var photosFolders = []
var photosURIs = []
var photosPaths = []


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
  let folderPath = folder[0]//path.win32.normalize(folder[0])
  savePhotoFolder(folderPath)
  createPhotosPropertiesFiles(folderPath);
  win.webContents.send('new-photo-folder', folderPath)
}

function createPhotosPropertiesFiles(folder) {
  var pattern = folder + "/**/*.+(jpg|png|tiff|nef)"
  glob(pattern, function(err, photoFilesPaths) {
      if(err) return reject(err)
      photoFilesPaths.forEach(function(photoPath) {
        var p = photoPath
        // As glob function deal only with "/" we need to
        // Normalize to the win32 os when needed.
        if(process.platform === "win32") {
          p = path.win32.normalize(photoPath)
        }

        exif.read(p)
          .then(exifData => initAndSavePhotoPptFile(p, exifData))
          .catch(console.error)
      });
  })
}

function initAndSavePhotoPptFile(photoPath, exifData) {
  if(!fs.existsSync(photoPptFilePath)) {
    var photoFilename = path.basename(photoPath)
    var photoFolder = path.dirname(photoPath)
    
    var photoPptFileName = photoFilename + '.fourbifoto'
    var photoPptFilePath = path.join(photoFolder, photoPptFileName)
    
    var ppt = {filename: photoFilename, path: photoFolder, date: exifData.exif.DateTimeOriginal, persons: [], albums: [], categories: []}
    console.log(JSON.stringify(ppt))
    db.insert(ppt, function(err, doc) {
      console.log('Inserted', doc.name, 'with ID', doc._id);
    })

    fs.writeFile(photoPptFilePath, JSON.stringify(ppt), 'utf8', (err) => {
      if(err) throw err
    })
  }
}

function getPhotoPathFromFolder(folder) {
  console.log('::getPhotoPathFromFolder() ' + folder)
  db.find({ path: folder}).sort({date: 1}).exec(function (err, docs) {
    console.log(docs)
    var paths = {}
    docs.forEach(function(photo) {
      var dateString = (new Date(photo.date)).toDateString()
      if(!(dateString in paths)) {
        paths[dateString] = []
      }
      paths[dateString].push(path.join(photo.path, photo.filename))
    })
    win.webContents.send('display-folder-photos', paths)
  })
}

ipcMain.on('get-photo-ppt', (event, photoPath) => {
  let i = photoPath.lastIndexOf('/');
  let pptFileName = photoPath.substr(i) + '.fourbifoto';
  var photoPpt = JSON.parse(fs.readFileSync(photoPath.substring(0,i)+pptFileName, 'utf8'));

  win.webContents.send('show-photo-ppt', photoPpt);
})

ipcMain.on('ready-to-init-data', () => {
  InitDbAndPropertiesAndData()
  win.webContents.send('init-data', appProperties)
})

ipcMain.on('get-photos-uri-from-folder', (event, folder) => {
  console.log('Event ' + 'get-photos-uri-from-folder');
  getPhotoPathFromFolder(folder)
})

function InitDbAndPropertiesAndData() {
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
  //photosFolders.push(folder)
  appProperties.folders.push(folder)
  fs.writeFileSync(pptFileNamePath, JSON.stringify(appProperties))
}