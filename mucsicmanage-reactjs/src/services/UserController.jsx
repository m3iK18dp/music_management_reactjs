import axios from "axios";
const USER_API_URL = "http://localhost:8080/api/auth";
const headers = {
  Authorization:
    "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2Nzg4NjE3MjAsImV4cCI6MTY4MDA3MTMyMH0.U9uJcpQsw9e1OIwDVCnOkvHS3gY81PUtCX8Np56wKP2E62q0rL1ptENGkFIvvDkvhvIr9nb87hUtirX1FbiTHw",
};
const authenticationService = {
  // getToken: (authenticationRequest) => {
  // 	return axios.get(`${USER_API_URL}`, authenticationRequest, { headers });
  // },
  // register: (user) => {
  // 	return axios.post(`${USER_API_URL}`, user, { headers });
  // },
};
export default authenticationService;
