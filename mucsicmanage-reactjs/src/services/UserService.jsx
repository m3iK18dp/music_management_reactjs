import callApi from './Request';

const userService = {
	get: async (params) => {
		return await callApi('users', 'get', null, params);
	},

	insertUser: async (user) => {
		return await callApi('users', 'post', user);
	},
	updateUser: async (id, user) => {
		return await callApi(`users/${id}`, 'put', user);
	},

	changeStatusUser: async (id) => {
		return await callApi(`users/${id}/change_status`, 'put');
	},
	resetPasswordUser: async (id) => {
		return await callApi(`users/${id}/reset_password`, 'put');
	},
	getRoles: async (params) => {
		return await callApi(`roles`, 'get', null, params);
	},
	// getRolesByListRoleId: async (params) => {
	// 	return await callApi(`roles/load_roles_by_list_role_id`, 'get', params);
	// },
};
export default userService;
