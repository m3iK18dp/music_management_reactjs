import callApi from './Request';

const songService = {
	get: async (params, navigate) => {
		return await callApi(navigate, 'songs', 'get', null, params);
	},
	insertSong: async (song, file, navigate) => {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('song', JSON.stringify(song));
		const headers = { 'Content-Type': 'multipart/form-data' };
		return await callApi(navigate, 'songs', 'post', formData, {}, headers);
	},
	updateSongWithFile: async (id, song, file, navigate) => {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('song', JSON.stringify(song));
		const headers = { 'Content-Type': 'multipart/form-data' };
		return await callApi(
			navigate,
			`songs/withf/${id}`,
			'put',
			formData,
			{},
			headers,
		);
	},
	updateSongWithoutFile: async (id, song, navigate) => {
		const formData = new FormData();
		formData.append('song', JSON.stringify(song));
		const headers = { 'Content-Type': 'multipart/form-data' };
		return await callApi(
			navigate,
			`songs/withoutf/${id}`,
			'put',
			formData,
			{},
			headers,
		);
	},
	deleteSong: async (id, navigate) => {
		return await callApi(navigate, `songs/${id}`, 'delete');
	},
	deleteAllSong: async (navigate) => {
		return await callApi(navigate, 'songs', 'delete');
	},
};

export default songService;
