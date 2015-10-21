var app = require('app');  // Module to control application life.
var dialog = require('dialog');
var BrowserWindow = require('browser-window');
var Menu = require('menu');  

// Report crashes to our server.
//require('crash-reporter').start();

// Globals
var settings = {
  defaultWidth: 800,
  defaultHeight: 600,
};

var win = null;
var config = null;

function setupWindow(isKiosk) {
  var size = require('screen').getPrimaryDisplay().size;

  win = new BrowserWindow({
    width: isKiosk ? size.width : settings.defaultWidth,
    height: isKiosk ? size.height : settings.defaultHeight,
    fullscreen: false, // Must be `false` due to https://github.com/atom/electron/issues/1054
    frame: !isKiosk,
    kiosk: isKiosk,
    transparent: isKiosk,
    resizable: !isKiosk,
  });

  // Load content
  win.loadUrl(config.url);

  // Create menus
  var menuTemplate = require('./menu')(app, win);
  var menu = Menu.buildFromTemplate(menuTemplate);

  Menu.setApplicationMenu(menu);

  // Emitted when the window is closed.
  win.on('closed', function() {
    win = null;
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

  setupWindow(isKiosk);
});

app.on('window-all-closed', function() {
  //app.quit();
});
