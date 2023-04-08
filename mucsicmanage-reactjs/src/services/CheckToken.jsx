import authenticationService from "./AuthenticationService";
import jwt_decode from "jwt-decode";
export function checkToken(navigate, check = 1) {
  // const decodedToken = jwt_decode(localStorage.getItem("token"), {
  //   algorithms: ["HS512"],
  // });
  // console.log(decodedToken);
  if (localStorage.getItem("token")) {
    authenticationService.getAccountInformation(navigate).then((res) => {
      console.log(res.data);
      if (res.status === "error") {
        alert(res.message);
        localStorage.clear();
        navigate("/login");
      } else {
        if (!res.data[1]) {
          if (
            localStorage.getItem("username") &&
            localStorage.getItem("username") !== res.data[2]
          ) {
            localStorage.clear();
            alert("Your email has changed, please login again to continue.");
          } else {
            localStorage.setItem("username", res.data[2]);
            localStorage.setItem("roles", res.data[3]);
            localStorage.setItem("isRevoked", res.data[0]);
            if (res.data[0] && check) {
              alert(
                "Your account has been revoked, login with another account or contact Administrator to unlock your account to use more features."
              );
              // navigate("/songs");
            }
          }
        } else {
          alert(
            "Your token has expired, please login again to use the features for logged in."
          );
          localStorage.clear();
          navigate("/login");
        }
      }
    });
  } else if (check) navigate("/error/403");
}
