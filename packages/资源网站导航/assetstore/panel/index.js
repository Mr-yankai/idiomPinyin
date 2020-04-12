// panel/index.js, this filename needs to match the one registered in package.json
Editor.Panel.extend({
  // css style for panel
  style: `
    :host {
      display: flex;
      flex-direction: column;
      padding: 10px;
    }
    .top {
      height: 30px;
    }
    .middle {
      flex: 1;
      overflow: auto;
    }
    .bottom {
      height: 30px;
    }                  
  `,

  // html template for panel
  template: `
    <ui-loader>Loading...</ui-loader>
    <div class="top"></div>
    <div class="middle layout vertical">
      <ui-markdown class="flex-1"></ui-markdown>
    </div>
    <div class="bottom layout horizontal end-justified">
      <ui-button id="refresh" class="green">刷新</ui-button>
    </div>    
  `,

  // element and variable binding
  $: {
    mkd: 'ui-markdown',
    btn: 'ui-button',
    loader: 'ui-loader'    
  },

  fileUrl: "https://miniasset.moonbear.cn/doc/index.md",

  // method executed when template and styles are successfully loaded and initialized
  ready () {
    this.$btn.addEventListener('confirm', this.load.bind(this));
    this.load();    
  },

  load () {
    this.$loader.hidden = false;
    Editor.Ipc.sendToMain('assetstore:load', this.fileUrl);
  },

  // register your ipc messages here
  messages: {
    'assetstore:complete' (event, data) {
      this.$loader.hidden = true;
      this.$mkd.value = data;
    }
  }
});