var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/spotify');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  spotifyId: { type: Number, required: true },

  playedTracks: { type: [String] }
});

userSchema.statics.findOrCreate = function(id, cb) {
  var self = this; 
  this.findOne({ spotifyId: id }, function (err, user) {
    if (err) { cb(err) }
    if (!user) { 
      var user = new self({ spotifyId: id, playedTracks: [] });
      user.save(cb);
    }
    if (user) {
      cb(null, user);
    }
  });
}

userSchema.statics.addFavoriteSong = function(userId, songId, cb) {
  var self = this;
  this.findOne({ spotifyId: userId }, function(err, user) {
    if (err) { cb(err) }
    if (!user) { cb('no user found'); }
    if (user) {
      var idx = user.playedTracks.indexOf(songId);
      if (idx === -1) {
        user.playedTracks.push(songId);
        user.save(cb);
      } else {
        user.playedTracks.splice(idx, 1);
        user.save(cb);
      }
    };
  });
};

userSchema.statics.getFavoriteTracks = function(userId, cb) {
  var self = this;
  this.findOne({ spotifyId: userId }, function(err, user) {
    if (err) { cb(err) }
    if (!user) { cb('no user found'); }
    if (user) {
      cb(null, user.playedTracks);
    };
  });
};
module.exports = mongoose.model('User', userSchema);
