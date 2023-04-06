import callApi from './Request';

const userService = {
	get: async (params, navigate) => {
		return await callApi(navigate, 'users', 'get', null, params);
	},
	insertUser: async (user, navigate) => {
		return await callApi(navigate, 'users', 'post', user);
	},
	updateUser: async (id, user, navigate) => {
		return await callApi(navigate, `users/${id}`, 'put', user);
	},

	changeStatusUser: async (id, navigate) => {
		return await callApi(navigate, `users/change_status/${id}`, 'put');
	},
	resetPasswordUser: async (id, navigate) => {
		return await callApi(navigate, `users/reset_password/${id}`, 'put');
	},
	updateEmailToMyUser: async (id, email, navigate) => {
		return await callApi(navigate, `users/update_email/${id}`, 'put', email);
	},
	updatePasswordToMyUser: async (id, listPassword, navigate) => {
		return await callApi(
			navigate,
			`users/update_password/${id}`,
			'put',
			listPassword,
		);
	},
	getRoles: async (params, navigate) => {
		return await callApi(navigate, `roles`, 'get', null, params);
	},
	// getRolesByListRoleId: async (params,navigate)=> {
	// 	return await callApi(navigate,`roles/load_roles_by_list_role_id`, 'get', params);
	// },
};
export default userService;
