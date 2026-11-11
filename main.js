const { app, BrowserWindow, shell, session, Menu } = require('electron');
const path = require('path');

// Let ambience audio and wallpaper videos start without a click.
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  let win;
  app.on('second-instance', () => {
    if (win) { if (win.isMinimized()) win.restore(); win.focus(); }
  });

  function createWindow() {
    win = new BrowserWindow({
      width: 1100,
      height: 800,
      minWidth: 380,
      minHeight: 560,
      backgroundColor: '#0b0907',
      title: 'The Brazils Cave',
      icon: path.join(__dirname, 'build', 'icon.png'),
      autoHideMenuBar: true,
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
        backgroundThrottling: false // keep audio / timers steady when minimised
      }
    });
    Menu.setApplicationMenu(null);
    win.loadFile(path.join(__dirname, 'app', 'index.html'));

    // Links / window.open go to the default browser, never a new Electron window.
    win.webContents.setWindowOpenHandler(({ url }) => {
      if (/^https?:\/\//i.test(url)) shell.openExternal(url);
      return { action: 'deny' };
    });
    // The main window only ever shows the bundled app.
    win.webContents.on('will-navigate', (e, url) => {
      if (!url.startsWith('file://')) { e.preventDefault(); if (/^https?:\/\//i.test(url)) shell.openExternal(url); }
    });
    win.on('closed', () => { win = null; });
  }

  app.whenReady().then(() => {
    // The in-app browser embeds sites in an iframe. Many sites forbid that;
    // strip those headers for embedded frames only so the browser room works.
    session.defaultSession.webRequest.onHeadersReceived(
      { urls: ['http://*/*', 'https://*/*'] },
      (details, cb) => {
        if (details.resourceType !== 'subFrame') return cb({ responseHeaders: details.responseHeaders });
        const h = { ...details.responseHeaders };
        for (const k of Object.keys(h)) {
          const l = k.toLowerCase();
          if (l === 'x-frame-options') delete h[k];
          else if (l === 'content-security-policy') {
            h[k] = h[k].map(v => v.replace(/frame-ancestors[^;]*;?/gi, ''));
          }
        }
        cb({ responseHeaders: h });
      }
    );
    createWindow();
    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
  });

  app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
}
