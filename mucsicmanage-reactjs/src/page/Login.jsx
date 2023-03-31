import "../css/MusicLogin.css";
import authenticationService from "../services/AuthenticationService";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AuthNavbarComponent from "../components/AuthNavbarComponent";
import CustomFormGroup from "../components/CustomFormGroup";

const Login = () => {
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

  const navigate = useNavigate();
  useEffect(() => {
    setUsernameIsFilled(
      authLogin.username === "" && !isFirst ? "Please enter email" : ""
    );
    setPasswordIsFilled(
      authLogin.password === "" && !isFirst ? "Please enter Password" : ""
    );
    setStatus("");
    setIsFirst(false);
  }, [authLogin]);

  const handleSubmit = () => {
    if (!(authLogin.username === "" || authLogin.password === ""))
      setStatus("Please wait...Login in progress");
    authenticationService.login(authLogin).then((data) => {
      console.log(data);
      if (data.status === "ok") {
        alert("Login successful!");
        navigate("/songs");
      } else {
        setStatus("Login failed. Username or Password incorrect.");
      }
    });
  };

  return (
    <div>
      <AuthNavbarComponent />
      <div className="background-container" />
      <div
        fluid
        style={{
          with: "80%",
          minWidth: 500,
          maxWidth: 1000,
          margin: "80px auto",
        }}
      >
        <Col
          className="card"
          style={{
            border: "3px solid purple",
            backgroundColor: "white",
          }}
        >
          <h1
            className="text-center"
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
                funcEnter={handleSubmit}
                controlId="formBasicPassword"
                prop="password"
                func={set}
                placeholder="Enter password"
                label="Password"
                value={authLogin.password}
                warning={passwordIsFilled}
              />
              <Button
                variant="primary"
                block="true"
                style={{ marginTop: 40 }}
                onClick={() => handleSubmit()}
              >
                Login
              </Button>{" "}
              <div className="mt-4">
                <p className="text-center">
                  Don't have an account? <Link to="/register">Register</Link>
                </p>
              </div>
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
            </Form>
          </div>
        </Col>
      </div>
    </div>
  );
};

export default Login;
