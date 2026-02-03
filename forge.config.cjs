const path = require('path');

module.exports = {
  packagerConfig: {
    icon: path.join(__dirname, "icons/icon"),
    asar: true,
    ignore: [
      "^/src$",
      // "^/public$",
      "^/components.json$",
      "^/eslint.config.js$",
      "^/tsconfig.*$",
      "^/vite.config.ts$",
      // "^/index.html$",
      "^/README.md$",
      "^/.git$",
      "^/.gitignore$"
    ]
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        iconUrl: path.join(__dirname, "icons/icon.ico"),
        setupIcon: path.join(__dirname, "icons/icon.ico")
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'win32']
    },
    {
      name: '@electron-forge/maker-deb',
      config: {}
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {}
    }
  ]
};