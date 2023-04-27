import callApi from './Request';

const playlistService = {
	get: async (params, navigate) => {
		return await callApi(navigate, 'playlists', 'get', null, params);
	},
	insertPlaylist: async (playlist, navigate) => {
		return await callApi(navigate, 'playlists', 'post', playlist);
	},
	updatePlayList: async (id, playlist, navigate) => {
		return await callApi(navigate, `playlists/${id}`, 'put', playlist);
	},
	deletePlaylist: async (id, navigate) => {
		return await callApi(navigate, `playlists/${id}`, 'delete');
	},
	addSongToPlayList: async (playlistId, songId, navigate) => {
		return await callApi(
			navigate,
			`playlists/add_song_to_playlist/${playlistId}`,
			'post',
			songId,
		);
	},
	deleteSongInPlaylist: async (playlistId, songId, navigate) => {
		return await callApi(
			navigate,
			`playlists/delete_song_in_playlist/${playlistId}`,
			'delete',
			songId,
		);
	},
};

export default playlistService;
