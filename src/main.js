var app = require('app');  // Module to control application life.
var dialog = require('dialog');
var BrowserWindow = require('browser-window');
var Menu = require('menu');  

// Report crashes to our server.
//require('crash-reporter').start();

// Globals
var settings = {
  defaultWidth: 800,
  defaultHeight: 3600,
  windowDelay: 0,
};

var win = null;
var config = null;

function setupWindow(isKiosk) {
  var size = require('screen').getPrimaryDisplay().size;

  win = new BrowserWindow({
    width: isKiosk ? size.width : settings.defaultWidth,
    height: isKiosk ? size.height : settings.defaultHeight,
    fullscreen: isKiosk, // Must be `false` due to https://github.com/atom/electron/issues/1054
    frame: !isKiosk,
    kiosk: isKiosk,
    resizable: !isKiosk,
    'always-on-top': isKiosk,
  });
  
  //win.openDevTools();

  win.webContents.on('dom-ready', function() {
    if (config.hideCursor) {
      hideMouseCursor();    
    }
  });

  // Load content
  win.loadURL(config.url);
  //win.loadUrl('file://' + __dirname + '/index.html');

  // Create menus
  var menuTemplate = require('./menu')(app, win);
  var menu = Menu.buildFromTemplate(menuTemplate);

  Menu.setApplicationMenu(menu);


  // Emitted when the window is closed.
  win.on('closed', function() {
    win = null;
  });
}

// Inject cursor hiding CSS and, hrrm, force focus
// by programmatically clicking on the document
function hideMouseCursor() {
    win.webContents.insertCSS('html {cursor: none}');

    win.webContents.sendInputEvent({
      type: 'mouseDown',
      x: 0,
      y: 0
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
