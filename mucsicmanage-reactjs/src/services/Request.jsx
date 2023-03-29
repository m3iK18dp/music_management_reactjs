import axios from 'axios';
import queryString from 'query-string';
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
		options.url = options.url + '?' + queryString.stringify(params);
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
