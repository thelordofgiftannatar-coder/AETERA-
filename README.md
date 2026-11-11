# The Brazils Cave — Windows edition

Desktop version of the Android app (audiobooks, PDF reader, ambience, in-app browser,
theme studio and the **wallpaper library** that stores thousands of wallpapers).
It is the same HTML app, wrapped in Electron.

## Get the .exe (no local setup)

1. Create a new GitHub repository and upload everything in this folder (keep the `.github` folder).
2. Open the **Actions** tab → **Build Windows app** → it runs on every push to `main`
   (or press **Run workflow**).
3. When it finishes (~3 min), open the run and download the **TheBrazilsCave-windows** artifact.
   It contains:
   - `TheBrazilsCave-1.0.0-x64-nsis.exe` — normal installer
   - `TheBrazilsCave-1.0.0-x64-portable.exe` — runs without installing

To publish a downloadable release instead, push a tag such as `v1.0.0`.

## Build locally (optional)

Requires Node.js 18+ on Windows.

```
npm install
npm start        # run the app
npm run dist     # build installer + portable into dist/
```

## Notes

- Your library, progress and wallpapers are stored on the PC inside the app's data folder
  (`%APPDATA%\The Brazils Cave`). They are separate from your phone — use
  **Settings & backup → Export / Import** to move progress and bookmarks.
  Audio files and wallpapers must be added again on the PC.
- The PDF reader loads its engine (PDF.js) from the internet the first time you open a PDF.
- The Windows build is unsigned, so SmartScreen may say "Windows protected your PC":
  choose **More info → Run anyway**.
- To update the app, replace `app/index.html` and push.
