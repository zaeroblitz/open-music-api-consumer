class Listener {
  constructor(playlistsService, mailSender) {
    this._playlistsService = playlistsService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
      try {
          const { playlistId, targetEmail } = JSON.parse(message.content.toString());

          const playlist = await this._playlistsService.getPlaylistFromId(playlistId);
          const songs = await this._playlistsService.getSongsFromPlaylist(playlistId);
          const playlist_songs = { "playlist": { ...playlist, songs } };

          const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(playlist_songs));
          console.log(result);
      } catch (error) {
          console.error(error);
      }
  }
}

module.exports = Listener;