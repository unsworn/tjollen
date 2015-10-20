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
          type: 'separator'
        },
        {
          label: 'About tjollen',
          click: function() {
            dialog.showMessageBox({message: 'Tjollen v' + app.getVersion() + '\n by Unsworn', buttons:['ok']});
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
