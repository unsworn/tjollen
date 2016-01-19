var dialog = require('dialog');

module.exports = function(app, win) {
  return [
    {
      label: 'tjollen',
      submenu: [                                
        {
          label: 'Toggle kiosk mode',
          accelerator: 'Command+Shift+F',
          click: function() {
            app.toggleKiosk();
          }
        },
        {
          label: 'Toggle dev tools',
          accelerator: 'Command+Alt+J',
          click: function() {
            win.toggleDevTools();
          }
        },
        {
          label: 'Reload page',
          accelerator: 'Command+R',
          click: function() {
            win.webContents.reload();
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'About tjollen',
          click: function() {
            dialog.showMessageBox({message: 'Tjollen v' + app.getVersion() + '\nby Unsworn', buttons:['OK']});
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: function() {
            app.quit();
          }
        },
      ]
    }
  ];
};
