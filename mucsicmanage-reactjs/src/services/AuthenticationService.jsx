import callApi from "./Request";
const authenticationService = {
  login: async (authenticationRequest, navigate) => {
    try {
      const res = await callApi(
        navigate,
        "auth/authenticate",
        "post",
        authenticationRequest
      );
      if (res.status === "ok") {
        localStorage.setItem("token", res.data[0]);
        localStorage.setItem("username", authenticationRequest.username);
        localStorage.setItem("roles", res.data[1]);
        localStorage.setItem("isRevoked", false);
      }
      return res;
    } catch (err) {
      throw new Error(err);
    }
  },
  register: async (user, navigate) => {
    try {
      const res = await callApi(navigate, "auth", "post", user);
      if (res.status === "ok") {
        localStorage.setItem("token", res.data[0]);
        localStorage.setItem("username", user.email);
        localStorage.setItem("roles", res.data[1]);
        localStorage.setItem("isRevoked", false);
      }
      return res;
    } catch (err) {
      throw new Error(err);
    }
  },
  logout: async (navigate) => {
    const res = await callApi(navigate, "auth/logout");
    if (res.status === "ok") localStorage.clear();
    return res;
  },
  getAccountInformation: async (navigate, token) => {
    return await callApi(navigate, "auth/account_information", "post", token);
  },
};
export default authenticationService;
