import callApi from "./Request";

const userService = {
  get: async (params) => {
    return await callApi("users", "get", null, params);
  },

  insertUser: async (user) => {
    return await callApi("users", "post", user);
  },
  updateUser: async (id, user) => {
    return await callApi(`users/${id}`, "put", user);
  },

  changeStatusUser: async (id) => {
    return await callApi(`users/change_status/${id}`, "put");
  },
  resetPasswordUser: async (id) => {
    return await callApi(`users/reset_password/${id}`, "put");
  },
  updateEmailToMyUser: async (id, email) => {
    return await callApi(`users/update_email/${id}`, "put", email);
  },
  updatePasswordToMyUser: async (id, listPassword) => {
    return await callApi(`users/update_password/${id}`, "put", listPassword);
  },
  getRoles: async (params) => {
    return await callApi(`roles`, "get", null, params);
  },
  // getRolesByListRoleId: async (params) => {
  // 	return await callApi(`roles/load_roles_by_list_role_id`, 'get', params);
  // },
};
export default userService;
