import callApi from './Request';

const songService = {
	get: async (params) => {
		return await callApi('songs', 'get', null, params);
	},
	getAllSongs: async (params) => {
		return await callApi('songs', 'get', null, params);
	},
	getSongById: async (id) => {
		return await callApi('songs', 'get', null, {
			_id: id,
		});
	},
	searchSongByTitle: async (title, page = 0, limit = 10, field = 'id') => {
		return await callApi('songs', 'get', null, {
			_title: title,
			_page: page,
			_limit: limit,
			_field: field,
		});
	},
	searchSongByMusician: async (
		musician,
		page = 0,
		limit = 10,
		field = 'id',
	) => {
		return await callApi('songs', 'get', null, {
			_musician: musician,
			_page: page,
			_limit: limit,
			_field: field,
		});
	},
	insertSong: async (song, file) => {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('song', JSON.stringify(song));
		console.log(formData);
		const headers = { 'Content-Type': 'multipart/form-data' };
		return await callApi('songs', 'post', formData, {}, headers);
	},
	updateSong: async (id, song, file) => {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('song', JSON.stringify(song));
		const headers = { 'Content-Type': 'multipart/form-data' };
		return await callApi(`songs/${id}`, 'put', formData, {}, headers);
	},
	deleteSong: async (id) => {
		return await callApi(`songs/${id}`, 'delete');
	},
	deleteAllSong: async () => {
		return await callApi('songs', 'delete');
	},
};

export default songService;
