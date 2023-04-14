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
        sessionStorage.setItem("username", authenticationRequest.username);
        sessionStorage.setItem("roles", res.data[1]);
        sessionStorage.setItem("isRevoked", false);
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
        sessionStorage.setItem("username", user.email);
        sessionStorage.setItem("roles", res.data[1]);
        sessionStorage.setItem("isRevoked", false);
      }
      return res;
    } catch (err) {
      throw new Error(err);
    }
  },
  logout: async (navigate) => {
    const res = await callApi(navigate, "auth/logout");
    if (res.status === "ok") {
      localStorage.clear();
      sessionStorage.clear();
    }
    return res;
  },
  getAccountInformation: async (navigate, token) => {
    return await callApi(navigate, "auth/account_information", "post", token);
  },
};
export default authenticationService;
