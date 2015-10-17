const photos = Application('photos');
const terminal = Application('terminal');
const albums = photos.albums();

const pad = (val) => String(val).length < 2 ? '0' + val : String(val);
const app = Application.currentApplication()
app.includeStandardAdditions = true;

albums.forEach(album => {
  const name = album.name();
  const items = album.mediaItems();
  const path = Path('./export/' + name);

  // Export items one by one to prevent timeout
  // Set creation data becausse photos might not set them for videos
  items.forEach(item => {
    const filename = item.filename();
    const date = item.date();
    const formattedDate = pad(date.getMonth() + 1) + '/' +
      pad(date.getDate()) + '/' +
      date.getFullYear() + ' ' +
      pad(date.getHours()) + ':' +
      pad(date.getMinutes()) + ':' +
      pad(date.getSeconds());

    console.log(filename + ' => ' + path);
    photos.export([item], {to: path});

    const videoPath = (path + '/' + filename).replace(/(.*)\.[0-9A-Za-z]+$/, '$1.m4v');
    const cmd = 'ls "' + videoPath + '" && ' +
      'SetFile -d "' + formattedDate + '" "' + videoPath + '"';

    try {
      app.doShellScript(cmd);
      console.log('Set creation date for video file');
    } catch (e) {
    }
  });
});
