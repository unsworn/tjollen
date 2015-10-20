var app = require('app');  // Module to control application life.
var dialog = require('dialog');
var BrowserWindow = require('browser-window');
var Menu = require('menu');  

// Report crashes to our server.
//require('crash-reporter').start();

var settings = {
  defaultWidth: 800,
  defaultHeight: 600,
};

// Load config file, fail if not found.
var quit = false;
try {
  var config = require(app.getPath('appData') + '/Tjollen/config.js');
} catch(err) {
  console.log('err', err);
  dialog.showMessageBox({message: err, buttons:['ok']});
  quit = true;
}

var win = null;

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

app.on('ready', function() {
  if (quit) {
    app.quit();
  }

  var isKiosk = (typeof config.kiosk === 'boolean') ? config.kiosk : true;

  setupWindow(isKiosk);
});

app.on('window-all-closed', function() {
  //app.quit();
});
