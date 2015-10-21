# Tjollen

:fries: Simple kiosk app for running feta och salta web apps. *Work in Progress!*

## Usage

- Download the latest version from the Releases page.
- Create the file `~/Library/Application Suppport/tjollen/config.js`. It should look like this: 

```js
module.exports = {
  // The url to run on startup
  url: 'http://www.unsworn.org',

  // Start in fullscreen or not
  kiosk: true,

  // Show or hide mouse cursor
  hideCursor: true,
};
```

## Develop

### Get started

```sh
$ git clone ...
$ npm install
$ npm start
```

### Development builds

```sh
$ npm run build
$ open dist/Tjollen-darwin-x64/Tjollen.app
```

### Deploy a new version

1. Commit your changes
2. `npm run build` to build the app
2. `npm run deploy` will bump npm version, create git tag and push to git
3. Manually upload the file in the `dist` folder to create a new Github release
