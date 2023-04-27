import { useNavigate } from 'react-router-dom';
import authenticationService from './AuthenticationService';
// import jwt_decode from "jwt-decode";
export function checkToken(navigate = useNavigate, check = 1) {
	// navigate("/login");

	if (localStorage.getItem('token')) {
		// try {
		//   const decodedToken = jwt_decode(localStorage.getItem("token"), {
		//     algorithms: ["HS512"],
		//   });
		//   console.log(decodedToken);
		// } catch (error) {
		//   alert("Your token is invalid, please login again to continue.");
		//   localStorage.clear()
		// sessionStorage.clear();
		//   navigate("/login");
		// }
		authenticationService
			.getAccountInformation(navigate, localStorage.getItem('token'))
			.then((res) => {
				// console.log(res.data);
				if (res.status === 'error') {
					alert(res.message);
					localStorage.clear();
					sessionStorage.clear();
					// authenticationService.logout(navigate);
					navigate('/login');
				} else {
					if (!res.data[1]) {
						// if (
						//   sessionStorage.getItem("username") &&
						//   sessionStorage.getItem("username") !== res.data[2]
						// ) {
						//   localStorage.clear()
						// sessionStorage.clear();
						//   alert("Your email has changed, please login again to continue.");
						//   navigate("/login");
						// } else {
						sessionStorage.setItem('username', res.data[2]);
						sessionStorage.setItem('roles', res.data[3]);
						sessionStorage.setItem('isRevoked', res.data[0]);
						if (res.data[0] === -1) {
							alert(
								'Your token has expired, please login again to use the features for logged in.',
							);
							localStorage.clear();
							sessionStorage.clear();
							navigate('/login');
						} else if (res.data[0] && check) {
							alert(
								'Your account has been revoked, login with another account or contact Administrator to unlock your account to use more features.',
							);
							navigate('/songs');
						}
						// }
					} else {
						alert(
							'Your token has expired, please login again to use the features for logged in.',
						);
						localStorage.clear();
						sessionStorage.clear();
						navigate('/login');
					}
				}
			});
	} else if (check) navigate('/error/403');
}
