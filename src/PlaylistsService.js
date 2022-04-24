const { Pool } = require('pg');

class PlaylistsService {
    constructor() {
        this._pool = new Pool();
    }

    async getPlaylistFromId(playlistId) {
        const query = {
            text: `SELECT playlists.id, playlists.name
            FROM playlists
            LEFT JOIN collaborations ON playlists.id = collaborations.playlist_id
            WHERE playlists.id = $1`,
            values: [playlistId]
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        return result.rows[0];
    }

    async getSongsFromPlaylist(playlistId) {
        const query = {
            text: `SELECT songs.id, songs.title, songs.performer
            FROM songs
            JOIN playlist_songs ON songs.id = playlist_songs.song_id 
            WHERE playlist_songs.playlist_id = $1`,
            values: [playlistId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Lagu tidak ditemukan');
        }

        return result.rows;
    }
}

module.exports = PlaylistsService;