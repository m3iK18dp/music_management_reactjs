import { Form, Col } from "react-bootstrap";
import "../css/MusicLogin.css";
import { useState, useEffect } from "react";
import authenticationService from "../services/AuthenticationService";
import { Link, useNavigate } from "react-router-dom";
import NavbarComponent from "../components/NavbarComponent";
import CustomFormGroup from "../components/CustomFormGroup";
import CustomButton from "../components/CustomButton";
import { checkToken } from "../services/CheckToken";
function Register() {
  const navigate = useNavigate();
  useEffect(() => {
    checkToken(navigate, 0);
    if (localStorage.getItem("token")) navigate("/songs");
  });
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const set = (prop, value) => {
    setUser({ ...user, [prop]: value });
  };
  const [firstNameIsFilled, setFirstNameIsFilled] = useState("");
  const [lastNameIsFilled, setLastNameIsFilled] = useState("");
  const [emailIsFilled, setEmailIsFilled] = useState("");
  const [passwordIsFilled, setPasswordIsFilled] = useState("");
  const [confirmPasswordIsFilled, setConfirmPasswordIsFilled] = useState("");
  const [status, setStatus] = useState("");
  const [isFirst, setIsFirst] = useState(true);

  useEffect(() => {
    if (!isFirst) {
      setFirstNameIsFilled(
        user.firstName === "" ? "Please enter First name" : ""
      );
      setLastNameIsFilled(user.lastName === "" ? "Please enter Lase name" : "");
      setEmailIsFilled(user.email === "" ? "Please enter email" : "");
      setPasswordIsFilled(user.password === "" ? "Please enter Password" : "");
      setConfirmPasswordIsFilled(
        user.confirmPassword === ""
          ? "Please enter Confirm Password"
          : user.password !== user.confirmPassword
          ? "Password and Confirm password do not match"
          : ""
      );
    }
  }, [isFirst, user]);
  useEffect(() => {
    if (!isFirst) {
      setFirstNameIsFilled(
        user.firstName === "" ? "Please enter First name" : firstNameIsFilled
      );
      setLastNameIsFilled(
        user.lastName === "" ? "Please enter Lase name" : lastNameIsFilled
      );
      setEmailIsFilled(
        user.email === "" ? "Please enter email" : emailIsFilled
      );
      setPasswordIsFilled(
        user.password === "" ? "Please enter Password" : passwordIsFilled
      );
      setConfirmPasswordIsFilled(
        user.confirmPassword === ""
          ? "Please enter Confirm Password"
          : user.password !== user.confirmPassword
          ? "Password and Confirm password do not match"
          : confirmPasswordIsFilled
      );
    }
  }, [status]);
  useEffect(() => {
    setStatus("");
  }, [user]);
  function handleSubmit() {
    setIsFirst(false);
    if (
      !(
        user.firstName === "" ||
        user.lastName === "" ||
        user.email === "" ||
        user.password === "" ||
        user.confirmPassword === ""
      )
    )
      try {
        setStatus("Please wait...Saving is in progress");
        authenticationService.register(user, navigate).then((res) => {
          if (res.status === "ok") {
            setStatus("");
            alert("Registration successful!");
            navigate("/songs");
          } else {
            setEmailIsFilled(res.message);
            setStatus("Registration failed.");
          }
        });
      } catch (error) {
        console.log(error);
      }
    else setStatus("Register failed. Please enter full information.");
  }
  return (
    <div>
      <NavbarComponent />
      <div className="background-container" />
      <div className=" background-container-opacity-low" />

      <div
        fluid="true"
        style={{
          with: "50%",
          minWidth: 300,
          maxWidth: 400,
          margin: "100px auto",
        }}
      >
        <Col
          className="card"
          style={{
            border: "3px solid purple",
            backgroundColor: "rgba(255,255,255,0.2)",
          }}
        >
          <h1
            className="text-center neon"
            style={{
              borderBottom: "2px solid purple",
              padding: "20px",
              marginBottom: "0",
            }}
          >
            Registration
          </h1>

          <div
            className="card-body"
            style={{
              with: "80%",
              minWidth: 400,
              maxWidth: 900,
            }}
          >
            <Form>
              <Col>
                <CustomFormGroup
                  funcEnter={handleSubmit}
                  controlId="firstName"
                  func={set}
                  placeholder="Enter first name"
                  label="First Name"
                  value={user.firstName}
                  warning={firstNameIsFilled}
                />
                <CustomFormGroup
                  funcEnter={handleSubmit}
                  controlId="lastName"
                  func={set}
                  placeholder="Enter last name"
                  label="Last Name"
                  value={user.lastName}
                  warning={lastNameIsFilled}
                />
              </Col>
              <CustomFormGroup
                funcEnter={handleSubmit}
                controlId="email"
                func={set}
                placeholder="Enter email"
                label="Email"
                value={user.email}
                warning={emailIsFilled}
              />
              <CustomFormGroup
                funcEnter={handleSubmit}
                controlId="password"
                func={set}
                placeholder="Enter password"
                label="Password"
                value={user.password}
                type="password"
                warning={passwordIsFilled}
              />
              <CustomFormGroup
                funcEnter={handleSubmit}
                controlId="confirmPassword"
                func={set}
                placeholder="Enter confirm password"
                label="Confirm Password"
                value={user.confirmPassword}
                type="password"
                warning={confirmPasswordIsFilled}
              />

              <CustomButton
                className="text-center "
                style={{
                  width: 90,
                  height: 40,
                  margin: "0 auto",
                  textAlign: "center",
                  backgroundColor: "rgba(255,255,255,0.4)",
                  borderRadius: 15,
                  border: "1px solid white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                size={20}
                color="white"
                variant="primary"
                func={handleSubmit}
                text="Register"
              ></CustomButton>
              <div style={{ height: 5 }}>
                <p
                  style={{
                    fontStyle: "italic",
                    color: "red",
                    margin: 0,
                    fontSize: 12,
                  }}
                >
                  {status}
                </p>
              </div>
              <div className="mt-4">
                <p className="text-center">
                  You have account?{" "}
                  <Link to="/login" className=" neon">
                    Login here
                  </Link>
                </p>
              </div>
            </Form>
          </div>
        </Col>
      </div>
    </div>
  );
}
export default Register;
