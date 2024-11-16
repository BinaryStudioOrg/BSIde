const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL("http://localhost:5173/");

  // هنا نضيف الدالة التي تقرأ محتوى الملف
  ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    });
    const folderPath = result.filePaths[0];
    if (folderPath) {
      const files = fs.readdirSync(folderPath).map(file => ({
        name: file,
        path: path.join(folderPath, file),
        isDirectory: fs.lstatSync(path.join(folderPath, file)).isDirectory(),
      }));
      return { path: folderPath, files };
    }
  });

  ipcMain.handle('read-file', async (event, filePath) => {
    return fs.promises.readFile(filePath, 'utf-8');
  });

  ipcMain.handle("save-file", async (event, fileName, content) => {
    const filePath = await dialog.showSaveDialog({
      defaultPath: path.join(app.getPath("documents"), fileName),
    });

    if (!filePath.canceled) {
      fs.writeFileSync(filePath.filePath, content);
    }
  });
});
