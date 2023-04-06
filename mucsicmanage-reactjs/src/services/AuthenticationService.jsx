import callApi from './Request';

// import { useState } from "react";
const authenticationService = {
	login: async (authenticationRequest, navigate) => {
		try {
			const res = await callApi(
				navigate,
				'auth/authenticate',
				'post',
				authenticationRequest,
			);
			if (res.status === 'ok') {
				localStorage.setItem('username', authenticationRequest.username);
				localStorage.setItem('token', res.data[0]);
				localStorage.setItem('roles', res.data[1]);
			}
			return res;
		} catch (err) {
			throw new Error(err);
		}
	},
	register: async (user, navigate) => {
		return await callApi(navigate, 'auth', 'post', user);
	},
	logout: async (navigate) => {
		const res = await callApi(navigate, 'auth/logout');
		if (res.status === 'ok') {
			localStorage.removeItem('username');
			localStorage.removeItem('token');
			localStorage.removeItem('roles');
		}
		return res;
	},
	// getRoles: async () => {
	// 	const token = localStorage.getItem('token');
	// 	return await callApi('auth/get_roles', 'post', token);
	// },
};
export default authenticationService;
