var $ = require('jquery'),
    Backbone = require('backbone'),
    Artist = require('./artist'),
    TrackFetcher = require('./track_fetcher');

module.exports = Backbone.Model.extend({
  initialize: function(){
    self = this;
  },

  findSimilar: function(options){
    self = this;
    var fm = new LastFM({
      apiKey    : 'b26bc1d28ac087bd6ee4bbaa4fe186ee',
      apiSecret : '4b9340fc31f703706649cc8f617a9939'
    });
    var artist;
    
    options.limit = options.limit || 10;
    options.page  = options.page  || 1;

    fm.artist.getSimilar({
      artist: options.artist, limit: options.limit, page: options.page
    },{success: function(data){
      trackFetcher = new TrackFetcher();
      data.similarartists.artist.forEach(function(dataArtist){
        artist = new Artist({
          fm: fm,
          trackFetcher: trackFetcher
        });
        artist.topTracks({mbid: dataArtist.mbid, limit: 2});
      });
      options.callback();
    }, error: function(code, message){
      console.log(message);
    }});
  }
});
