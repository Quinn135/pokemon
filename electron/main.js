import { app, BrowserWindow, ipcMain } from "electron";
import isDev from 'electron-is-dev';
import path from "path";
import { fileURLToPath } from "url";

import squirrelStartup from 'electron-squirrel-startup';
if (squirrelStartup) app.quit();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        icon: path.join(__dirname, "../icons/icon.ico"),
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    win.on("maximize", () => {
        win.webContents.send("window:maximized");
    });

    win.on("unmaximize", () => {
        win.webContents.send("window:unmaximized");
    });

    if (isDev) {
        win.loadURL("http://localhost:5173");
    } else {
        win.loadFile(path.join(__dirname, "../dist/index.html"));
    }
};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});


// the menubar stuff
ipcMain.on("window:minimize", (event) => {
    const window = BrowserWindow.fromWebContents(event.sender); // get window
    window?.minimize();
});

ipcMain.on("window:toggle-maximize", (event) => {
    const window = BrowserWindow.fromWebContents(event.sender); // get window
    if (!window) return;
    if (window.isMaximized()) {
        window.unmaximize();
    } else {
        window.maximize();
    }
});

ipcMain.on("window:close", (event) => {
    const window = BrowserWindow.fromWebContents(event.sender); // get window
    window?.close();
});

var devToolsOpen = false;
ipcMain.on("window:toggle-dev-tools", (event) => {
    const window = BrowserWindow.fromWebContents(event.sender); // get window
    if (window?.isDevToolsOpened()) {
        window.closeDevTools();
    } else {
        window?.openDevTools();
    }
});