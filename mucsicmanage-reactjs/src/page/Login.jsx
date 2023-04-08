import "../css/MusicLogin.css";
import authenticationService from "../services/AuthenticationService";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Col, Form, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../components/NavbarComponent";
import CustomFormGroup from "../components/CustomFormGroup";
import CustomButton from "../components/CustomButton";

const Login = () => {
  const navigate = useNavigate();
  if (localStorage.getItem("token")) navigate("/songs");
  const [authLogin, setAuthLogin] = useState({
    username: "",
    password: "",
  });
  const [isFirst, setIsFirst] = useState(true);
  const set = (prop, value) => {
    setAuthLogin({ ...authLogin, [prop]: value });
  };
  const [usernameIsFilled, setUsernameIsFilled] = useState(" ");
  const [passwordIsFilled, setPasswordIsFilled] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    setUsernameIsFilled(
      authLogin.username === "" && !isFirst ? "Please enter username" : ""
    );
    setPasswordIsFilled(
      authLogin.password === "" && !isFirst ? "Please enter Password" : ""
    );
  }, [authLogin, isFirst, status]);
  useEffect(() => {
    setStatus("");
  }, [authLogin]);
  const handleSubmit = () => {
    setIsFirst(false);
    if (!(authLogin.username === "" || authLogin.password === "")) {
      setStatus("Please wait...Login in progress");
      authenticationService.login(authLogin, navigate).then((data) => {
        console.log(data);
        if (data.status === "ok") {
          setStatus("");
          alert("Login successful!");
          navigate("/songs");
        } else {
          setStatus("Login failed. " + data.message);
        }
      });
    } else setStatus("Please enter username and password.");
  };

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
          className="card "
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
            Login
          </h1>
          <div
            className="card-body"
            style={{
              with: "80%",
              minWidth: 400,
              maxWidth: 900,
            }}
          >
            <Form className="card-body">
              <CustomFormGroup
                funcEnter={handleSubmit}
                controlId="formBasicUsername"
                prop="username"
                func={set}
                placeholder="Enter username"
                label="Username"
                value={authLogin.username}
                warning={usernameIsFilled}
              />
              <CustomFormGroup
                type="password"
                funcEnter={handleSubmit}
                controlId="formBasicPassword"
                prop="password"
                func={set}
                placeholder="Enter password"
                label="Password"
                value={authLogin.password}
                warning={passwordIsFilled}
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
                func={handleSubmit}
                text="Login"
              />
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
                  Don't have an account?{" "}
                  <Link to={"/register"} className="neon">
                    Register
                  </Link>
                </p>
              </div>
            </Form>
          </div>
        </Col>
      </div>
    </div>
  );
};

export default Login;
