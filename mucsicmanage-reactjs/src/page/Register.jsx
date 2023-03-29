import { Form, Button, Col, Row } from "react-bootstrap";
import "../css/MusicLogin.css";
import { useRef } from "react";
import authenticationService from "../services/AuthenticationService";
import { useNavigate } from "react-router-dom";
import AuthNavbarComponent from "../components/AuthNavbarComponent";
function Register() {
  const navigate = useNavigate();
  // const [user, setUser] = useState({});
  const inputFirstName = useRef();
  const inputLastName = useRef();
  const inputEmail = useRef();
  const inputPassword = useRef();
  function handleSubmit() {
    try {
      authenticationService
        .register({
          firstName: inputFirstName.current.value,
          lastName: inputLastName.current.value,
          email: inputEmail.current.value,
          password: inputPassword.current.value,
        })
        .then((res) => {
          if (res.status === "ok") {
            alert("Registration successful!");
            navigate("/login");
          } else {
            alert("Registration failed.");
          }
        });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <AuthNavbarComponent />
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
            <h2 className="text-center">Registration</h2>
          </div>
          <div
            className="card-body"
            style={{
              with: "80%",
              minWidth: 400,
              maxWidth: 900,
            }}
          >
            <Form>
              <Form.Group className="mb-3" controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  ref={inputFirstName}
                  placeholder="Enter first name"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  ref={inputLastName}
                  placeholder="Enter last name"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  ref={inputEmail}
                  required
                  placeholder="Enter email address"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  ref={inputPassword}
                  placeholder="Enter password"
                  required
                />
              </Form.Group>
              <Button onClick={handleSubmit} variant="primary">
                Register
              </Button>
              <div className="mt-4">
                <p className="text-center">
                  You have account? <a href="/login">Login here</a>
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
