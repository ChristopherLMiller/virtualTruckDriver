const { contextBridge } = require('electron');
const Store = require('electron-store');
const config = new Store();

// this allows us to pass configuration to the renderer process
contextBridge.exposeInMainWorld('config', {
  port: config.get('port'),
  password: config.get('password'),
});

// once dom content is loaded, we can populate the versions for debug info
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector: string, text: string) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type] as string);
  }
});
