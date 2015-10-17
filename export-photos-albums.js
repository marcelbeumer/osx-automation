// const photosLib = Library('Photos');
const photos = Application('photos');
const albums = photos.albums();

albums.forEach(album => {
  const name = album.name();
  const items = album.mediaItems();
  const path = Path('./export/' + name);
  items.forEach(item => {
    const filename = item.filename();
    console.log(filename + ' => ' + path + '/'  + filename);
    photos.export([item], {to: path});
  });
});
