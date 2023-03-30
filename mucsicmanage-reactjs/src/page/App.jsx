import React from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

import AuthNavbarComponent from "../components/AuthNavbarComponent";
function App() {
  return (
    <>
      <div className="background-container" />
      <AuthNavbarComponent />
      <Container fluid style={{ marginTop: 80 }}>
        <h1 className="text-center">Welcome to the Login System</h1>
        <p className="text-center">
          Please <Link to="/register">register</Link> or{" "}
          <Link to="/login">login</Link> to continue.
        </p>
      </Container>
    </>
  );
}

export default App;
