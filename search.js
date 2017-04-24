var spapi = require('spotify-web-api-node');

var api = new spapi();

var searchForSong = function(searchTerm, cb) {
  api.searchTracks(searchTerm)
    .then(function(data) {
      cb(null, helpFormat(data.body.tracks.items));
    }, function(err) {
      cb(err);
    });
}

var getTracks = function(tracks, cb) {
  api.getTracks(tracks)
    .then(function(data) {
      cb(null, helpFormat(data.body.tracks));
    }, function(err) {
      cb(err);
    });
}

function helpFormat(data) {
  var results = [];
  for(var i in data) {
    var item = data[i];
    var res = {
      name: item.name,
      id: item.id,
      preview_url: item.preview_url,
      image: item.album.images[0].url,
      isFavorite: false
    }
    results.push(res);
  }
  return results;
}
module.exports = { searchForSong: searchForSong, getTracks: getTracks };
