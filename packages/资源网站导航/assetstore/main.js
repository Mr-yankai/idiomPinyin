'use strict';

module.exports = {
  load () {
    // execute when package loaded
  },

  unload () {
    // execute when package unloaded
  },

  // register your ipc messages here
  messages: {
    'open' () {
      Editor.Panel.open('assetstore');
    },
    'load' (event, url) {
      const http = require("./lib/http");
      http(url).then(d => Editor.Ipc.sendToPanel('assetstore', 'assetstore:complete', d)).catch(e => Editor.log(e.message));
    }
  },
};