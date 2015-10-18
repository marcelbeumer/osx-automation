/*
 * Compile with babel to ES5 and run with osascript -l JavaScript
 * Requires CLI tools: SetFile, jpegoptim
 * Limitations:
 * - May not be able to use CLI tools when filenames are not unique within album
*/
const photos = Application('photos');
const albums = photos.albums();

const pad = (val) => String(val).length < 2 ? '0' + val : String(val);
const app = Application.currentApplication()
const fileRegex = /(.*)\.[0-9A-Za-z]+$/;
app.includeStandardAdditions = true;

function fixCreationDate(filePath, date) {
  const formattedDate = pad(date.getMonth() + 1) + '/' +
    pad(date.getDate()) + '/' +
    date.getFullYear() + ' ' +
    pad(date.getHours()) + ':' +
    pad(date.getMinutes()) + ':' +
    pad(date.getSeconds());

  [
    filePath.replace(fileRegex, '$1.m4v'),
    filePath.replace(fileRegex, '$1.jpg')
  ].forEach((file) => {
    const cmd = 'ls "' + file + '" && ' +
      'SetFile -d "' + formattedDate + '" "' + file + '"';

    try {
      app.doShellScript(cmd);
    } catch (e) {
    }
  });
}

function recompressImage(filePath) {
  const file = filePath.replace(fileRegex, '$1.jpg')
  const cmd = 'ls "' + file + '" && ' + 'jpegoptim -m90 "' + file + '"';

  try {
    app.doShellScript(cmd);
  } catch (e) {
  }
}

albums.forEach(album => {
  const name = album.name();
  const items = album.mediaItems();
  const path = Path('./export/' + name);

  items.forEach(item => {
    console.log(item.filename() + ' => ' + path);
    photos.export([item], {to: path});

    const filePath = (path + '/' + item.filename());
    recompressImage(filePath);
    fixCreationDate(filePath, item.date());
  });
});
