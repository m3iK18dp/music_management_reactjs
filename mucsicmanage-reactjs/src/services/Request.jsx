import axios from 'axios';
const API_BASE_URL = 'http://localhost:8080/api';
const callApi = async (
	endpoint,
	method = 'get',
	data = null,
	params = {},
	headers = {},
) => {
	const options = {
		url: `${API_BASE_URL}/${endpoint}`,
		method,
		headers,
	};
	if (!endpoint.includes('auth')) {
		options.headers = {
			...headers,
			Authorization: 'Bearer ' + localStorage.getItem('token'),
		};
	}
	if (method.toLowerCase() === 'get' && !endpoint.includes('auth')) {
		options.params =
			params != null
				? params._id
					? params
					: {
							...params,
							_field: params._field || 'id',
							_page: params._page || 0,
							_limit: params._limit || 10,
					  }
				: {
						_field: 'id',
						_page: 0,
						_limit: 10,
				  };
	} else {
		options.data = data;
	}

	try {
		return await axios(options).then((res) => res.data);
	} catch (error) {
		throw new Error(error);
	}
};
export default callApi;
