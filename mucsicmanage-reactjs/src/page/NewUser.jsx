import React, { useRef, useState, useEffect } from "react";
import { Container, Row, Button, Form } from "react-bootstrap";
import userService from "../services/UserService";
import { useNavigate } from "react-router-dom";
import { AiFillSave } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import NavbarComponent from "../components/NavbarComponent";
function NewUser() {
  const navigate = useNavigate();
  const firstName = useRef();
  const lastName = useRef();
  const email = useRef();
  const file = useRef();
  const [rolesCheck, setRolesCheck] = useState([]);
  const [firstNameIsFilled, setFirstNameIsFilled] = useState("");
  const [lastNameIsFilled, setLastNameIsFilled] = useState("");
  const [emailIsFilled, setEmailIsFilled] = useState("");
  const [rolesCheckIsFilled, setRolesCheckIsFilled] = useState("");
  const [roles, setRoles] = useState([]);
  const [status, setStatus] = useState(1);
  const [statusInsert, setStatusInsert] = useState("");
  const [check, setCheck] = useState(true);
  useEffect(() => {
    userService.getRoles({}).then((data) => setRoles(data.data.content));
  }, []);
  function handleSubmit() {
    console.log("check");
    console.log({
      user: {
        firstName: firstName.current.value,
        lastName: lastName.current.value,
        email: email.current.value,
        status: status,
      },
      listRoleId: rolesCheck,
    });
    if (!firstName.current.value) {
      setFirstNameIsFilled(
        `The first name field cannot be blank, please enter first name`
      );
      setCheck(false);
    } else {
      setFirstNameIsFilled();
      setCheck(true);
    }
    if (!lastName.current.value) {
      setLastNameIsFilled(
        `The last name field cannot be blank, please enter last name`
      );
      setCheck(false);
    } else {
      setLastNameIsFilled();
      setCheck(true);
    }
    if (!email.current.value) {
      setEmailIsFilled("Vui lòng nhập email để tiếp tục");
      setCheck(false);
    } else {
      setEmailIsFilled();
      setCheck(true);
    }
    if (rolesCheck.length === 0) {
      setRolesCheckIsFilled("Vui lòng chọn role cho user để tiếp tục");
      setCheck(false);
    } else {
      setRolesCheckIsFilled();
      setCheck(true);
    }
    if (!check) setStatusInsert();
    else {
      userService.getRoles({ _role_ids: rolesCheck }).then((data) =>
        userService
          .insertUser({
            firstName: firstName.current.value,
            lastName: lastName.current.value,
            email: email.current.value,
            status: status,
            roles: data.data.content,
          })
          .then((res) => {
            if (res.status === "ok") {
              alert("Add new User successful!");
              navigate("/users");
            } else {
              setStatusInsert("Create new User failed, try again.");
            }
          })
      );
    }
  }
  function handleRolesCheckChange(event, role) {
    const isChecked = event.target.checked;
    if (isChecked) {
      setRolesCheck([...rolesCheck, role.id]);
    } else {
      setRolesCheck(Array.from(rolesCheck).filter((id) => id !== role.id));
    }
  }
  return (
    <>
      <NavbarComponent />
      <Container>
        <Row
          className="col-md-8 offset-md-2"
          style={{
            margin: "50px auto",
            border: "3px solid purple",
            backgroundColor: "white",
            maxWidth: 500,
          }}
        >
          <div className="card">
            <h1 className="text-center">Add User</h1>
            <div className="card-body">
              <Form>
                <Form.Group className="mb-3" controlId="firstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    ref={firstName}
                    placeholder="Enter first name"
                    required
                  />
                  {firstNameIsFilled && (
                    <p style={{ marginBottom: "0px" }}>{firstNameIsFilled}</p>
                  )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="lastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    ref={lastName}
                    placeholder="Enter last name"
                    required
                  />
                  {lastNameIsFilled && (
                    <p style={{ marginBottom: "0px" }}>{lastNameIsFilled}</p>
                  )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    ref={email}
                    required
                    placeholder="Enter email address"
                  />
                  {emailIsFilled && (
                    <p style={{ marginBottom: "0px" }}>{emailIsFilled}</p>
                  )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="status">
                  <Form.Label>Status</Form.Label>
                  <Form.Switch
                    type="radio"
                    label={status == 1 ? "Enabled" : "Disabled"}
                    name="status"
                    value={status}
                    defaultChecked={true}
                    onChange={() => {
                      setStatus(!status);
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="status">
                  <Form.Label>Status</Form.Label>
                  {Array.from(roles).map((role) => (
                    <Form.Check
                      key={role.id}
                      type="checkbox"
                      label={role.name}
                      name={role.name}
                      value={role.id}
                      checked={rolesCheck.includes(role.id)}
                      onChange={(event) => handleRolesCheckChange(event, role)}
                    />
                  ))}
                  {rolesCheckIsFilled && (
                    <p style={{ marginBottom: "0px" }}>{rolesCheckIsFilled}</p>
                  )}
                </Form.Group>
                <div className="box-footer">
                  <Button
                    onClick={() => handleSubmit()}
                    style={{
                      backgroundColor: "#e9ecef",
                      border: "none",
                      color: "black",
                      marginTop: 20,
                    }}
                    title="Save"
                  >
                    <AiFillSave size={30}></AiFillSave>Save
                  </Button>
                  <Button
                    variant="danger"
                    href="/songs"
                    style={{
                      backgroundColor: "#e9ecef",
                      border: "none",
                      color: "black",
                      marginTop: 20,
                      marginLeft: 20,
                    }}
                  >
                    <MdCancel size={30}></MdCancel>Cancel
                  </Button>
                </div>{" "}
                <p style={{ marginBottom: "0px" }}>{statusInsert}</p>
              </Form>
            </div>
          </div>
        </Row>
      </Container>
    </>
  );
}

export default NewUser;
