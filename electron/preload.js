const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  minimize: () => {
    console.log("minimize");
    ipcRenderer.send("window:minimize")
  },
  toggleMaximize: () => ipcRenderer.send("window:toggle-maximize"),
  close: () => ipcRenderer.send("window:close"),
  toggleDevTools: () => ipcRenderer.send("window:toggle-dev-tools"),
  isDevToolsOpen: () => ipcRenderer.invoke("window:is-dev-tools-open"),
  onMaximize: (callback) => {
    ipcRenderer.on("window:maximized", callback);
  },
  onUnmaximize: (callback) => {
    ipcRenderer.on("window:unmaximized", callback);
  },
});
