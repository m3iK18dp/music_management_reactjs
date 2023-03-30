import "../css/MusicLogin.css";
import authenticationService from "../services/AuthenticationService";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AuthNavbarComponent from "../components/AuthNavbarComponent";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      authenticationService
        .login({
          username: username,
          password: password,
        })
        .then((data) => {
          console.log(data);
          if (data.status === "ok") {
            alert("Login successful!");
            navigate("/songs");
          } else {
            alert("Login failed.");
          }
        });
    } catch (error) {
      alert("Login failed.");
      console.log(error);
    }
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
          <div className="card-header">
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
          </div>
          <div
            className="card-body"
            style={{
              with: "80%",
              minWidth: 400,
              maxWidth: 900,
            }}
          >
            <Form className="card-body" onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicUsername">
                <Form.Label style={{ marginTop: 10 }}>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label style={{ marginTop: 30 }}>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                block="true"
                style={{ marginTop: 20 }}
              >
                Login
              </Button>{" "}
              <div className="mt-4">
                <p className="text-center">
                  Don't have an account? <Link to="/register">Register</Link>
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
