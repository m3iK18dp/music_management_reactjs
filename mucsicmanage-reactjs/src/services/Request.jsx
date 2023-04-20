import axios from 'axios';
import queryString from 'query-string';
const API_BASE_URL = 'http://localhost:8080/api';

const callApi = async (
	navigate,
	endpoint,
	method = 'get',
	data = null,
	params = {},
	headers = {},
) => {
	// Kiểm tra thời gian hết hạn của token và xóa token nếu đã hết hạn
	const options = {
		url: `${API_BASE_URL}/${endpoint}`,
		method,
		headers,
		timeout:
			endpoint.includes('songs') &&
			['post', 'put'].includes(method.toLowerCase())
				? 30000
				: 10000,
	};
	if (
		!(
			(endpoint.includes('auth') && method === 'post') ||
			(endpoint.includes('songs') &&
				method === 'get' &&
				!localStorage.getItem('token'))
		)
	) {
		options.headers = {
			...headers,
			Authorization: 'Bearer ' + localStorage.getItem('token'),
		};
	}
	if (method.toLowerCase() === 'get') {
		if (Object.keys(params).length !== 0)
			options.url = options.url + '?' + queryString.stringify(params);
	} else {
		options.data = data;
	}
	try {
		return await axios(options).then((res) => {
			// console.log(res.data.data);
			return res.data;
		});
	} catch (error) {
		if (error.code === 'ECONNABORTED') {
			// Lỗi timeout
			navigate('/error/408');
		} else if (error.response) {
			// Lỗi xử lý response
			const { status, data } = error.response;
			if (status === 404) {
				navigate('/error/404');
			} else if (status === 401) {
				navigate('/error/401');
			} else {
				console.log(
					`Server responded with error code ${status} and message: ${data}`,
				);
			}
		} else if (error.request) {
			// Lỗi kết nối
			navigate('/error/500');
		} else {
			// Lỗi xử lý request
			console.log('Request processing error:', error);
		}
	}
};
export default callApi;
