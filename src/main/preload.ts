import { contextBridge, ipcRenderer,  } from 'electron';
// import { SerialPort } from 'serialport'


// White-listed channels.
const ipc = {
  'render': {
      // From render to main.
      'send': [],
      // From main to render.
      'once': [],
      // From render to main and back again.
      'sendReceive': [],
      'on': ['doPrint', 'consoleInVue', 'getPrinterList']
  }
};

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {...ipcRenderer, 
    once: (channel, listener) => {
      let validChannels: string[] = ipc.render.once;
      if (validChannels.includes(channel)) {

          // Show me the prototype (use DevTools in the render thread)
          console.log(ipcRenderer);

          // Deliberately strip event as it includes `sender`.
          ipcRenderer.once(channel, (event, ...args) => listener(event, ...args));
      }
      else console.log('channel not valid: '+channel)
    },
    on: (channel, listener) => {
      let validChannels: string[] = ipc.render.on;
      if (validChannels.includes(channel)) {

          // Show me the prototype (use DevTools in the render thread)
          console.log(ipcRenderer);

          // Deliberately strip event as it includes `sender`.
          ipcRenderer.on(channel, (event, ...args) => listener(event, ...args));
      }
      else console.log('channel not valid: '+channel)
    }
  }
 

})
 

import { SerialPort } from 'serialport';

contextBridge.exposeInMainWorld('serialport', {
  serialport: SerialPort.list(),
  // serialport: list,

})
