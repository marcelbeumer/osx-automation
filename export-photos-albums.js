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

    const fileRegex = /(.*)\.[0-9A-Za-z]+$/;
    const target = (path + '/' + filename);
    [
      target.replace(fileRegex, '$1.m4v'),
      target.replace(fileRegex, '$1.jpg')
    ].forEach((file) => {
      const cmd = 'ls "' + file + '" && ' +
        'SetFile -d "' + formattedDate + '" "' + file + '"';

      try {
        app.doShellScript(cmd);
      } catch (e) {
      }
    });
  });
});
