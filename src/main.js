var app = require('app'); 
var dialog = require('dialog');
var BrowserWindow = require('browser-window');
var Menu = require('menu');  

// Globals
var settings = {
  defaultWidth: 1024,
  defaultHeight: 1024,
  windowDelay: 0,
};

var win = null;
var config = null;

function setupWindow(isKiosk) {
  var size = require('screen').getPrimaryDisplay().size;

  win = new BrowserWindow({
    width: isKiosk ? size.width : settings.defaultWidth,
    height: isKiosk ? size.height : settings.defaultHeight,
    fullscreen: isKiosk, // hmm, should be `false` due to https://github.com/atom/electron/issues/1054
    frame: !isKiosk,
    kiosk: isKiosk,
    resizable: !isKiosk,
    'always-on-top': isKiosk,
  });
  
  //win.openDevTools();

  // Document is loaded
  win.webContents.on('dom-ready', function() {
    if (config.hideCursor) {
      hideMouseCursor();    
    }

   //setTimeout(sendInput, 2000);
  });

  // Load content
  win.loadURL(config.url);
  //win.loadURL('file://' + __dirname + '/index.html');

  // Create menus
  var menuTemplate = require('./menu')(app, win);
  var menu = Menu.buildFromTemplate(menuTemplate);

  Menu.setApplicationMenu(menu);

  // Emitted when the window is closed.
  win.on('closed', function() {
    win = null;
  });
}

// Just trying out engagement gesture - not working
function sendInput() {
  var inputEvent = {
    type: 'keyUp',
    keyCode: 'p', // 'p'
  };

  win.webContents.sendInputEvent(inputEvent);
  win.webContents.executeJavaScript('document.getElementById("main").requestPointerLock()', true);
}

// Inject cursor hiding CSS and, hrrm, force focus
// by programmatically clicking on the document
function hideMouseCursor() {
    win.webContents.insertCSS('html {cursor: none}');

    win.webContents.sendInputEvent({
      type: 'mouseDown',
      x: 200,
      y: 200
    });
}

app.toggleKiosk = function() {
  var isKiosk = !win.isKiosk();

  // We need to tear down and reload the window to change it
  win.destroy();
  setupWindow(isKiosk);
}

// Entry point
app.on('ready', function() {
  // Load config file, fail if not found.
  try {
    config = require(app.getPath('appData') + '/Tjollen/config.js');
  } catch(err) {
    dialog.showMessageBox({message: 'Failed to load config.js file!\n\n' + err, buttons:['OK']});
    app.quit();
  }

  var isKiosk = (typeof config.kiosk === 'boolean') ? config.kiosk : true;
  
  // Maybe wait a bit before opening the window
  setTimeout(
    setupWindow,
    config.windowDelay || settings.windowDelay || 0,
    isKiosk
  );
});

app.on('window-all-closed', function() {
  //app.quit();
});
