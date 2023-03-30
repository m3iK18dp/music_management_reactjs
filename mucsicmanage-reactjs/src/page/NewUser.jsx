import React, { useRef, useState, useEffect } from "react";
import { Container, Row, Button, Form } from "react-bootstrap";
import userService from "../services/UserService";
import { useNavigate } from "react-router-dom";
import { AiFillSave } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import NavbarComponent from "../components/NavbarComponent";
function NewUser() {
  const navigate = useNavigate();
  const [firstNameIsFilled, setFirstNameIsFilled] = useState("");
  const [lastNameIsFilled, setLastNameIsFilled] = useState("");
  const [emailIsFilled, setEmailIsFilled] = useState("");
  const [rolesCheckIsFilled, setRolesCheckIsFilled] = useState("");
  const [roles, setRoles] = useState([]);
  const [status, setStatus] = useState("");
  const [user, setUser] = useState({ status: 1, roles: [] });
  useEffect(() => {
    userService.getRoles({}).then((data) => setRoles(data.data.content));
  }, []);
  const set = (prop, value) => {
    setUser({ ...user, [prop]: value });
  };
  function handleSubmit() {
    setFirstNameIsFilled(
      !user.firstName || user.firstName === ""
        ? `The first name field cannot be blank, please enter first name`
        : ""
    );

    setLastNameIsFilled(
      !user.lastName || user.lastName === ""
        ? `The last name field cannot be blank, please enter last name`
        : ""
    );

    setEmailIsFilled(
      !user.lastName || user.email === ""
        ? "Vui lòng nhập email để tiếp tục"
        : ""
    );

    setRolesCheckIsFilled(
      !user.roles || user.roles.length === 0
        ? "Vui lòng chọn role cho user để tiếp tục"
        : ""
    );

    if (
      user.firstName === "" ||
      user.lastName === "" ||
      user.email === "" ||
      user.roles.length === 0
    )
      setStatus("");
    else {
      userService.insertUser(user).then((res) => {
        if (res.status === "ok") {
          alert("Add new User successful!");
          navigate("/users");
        } else {
          setStatus("Create new User failed, try again.");
        }
      });
    }
  }
  return (
    <>
      <NavbarComponent />
      <div className="background-container" />
      <Container>
        <Row
          className="col-md-8 offset-md-2"
          style={{
            margin: "15px auto",
            border: "3px solid purple",
            backgroundColor: "white",
            maxWidth: 500,
            borderRadius: 10,
          }}
        >
          <div className="card">
            <h1
              className="text-center"
              style={{
                borderBottom: "2px solid purple",
                padding: "20px",
                marginBottom: "0",
              }}
            >
              Add User
            </h1>
            <div className="card-body">
              <Form>
                <Form.Group className="mb-3" controlId="firstName">
                  <Form.Label>
                    <strong>First Name</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(event) => set("firstName", event.target.value)}
                    placeholder="Enter first name"
                    required
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
                      {firstNameIsFilled}
                    </p>
                  </div>
                </Form.Group>
                <Form.Group className="mb-3" controlId="lastName">
                  <Form.Label>
                    <strong>Last Name</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(event) => set("lastName", event.target.value)}
                    placeholder="Enter last name"
                    required
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
                      {lastNameIsFilled}
                    </p>
                  </div>
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>
                    <strong>Email</strong>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    onChange={(event) => set("email", event.target.value)}
                    required
                    placeholder="Enter email address"
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
                      {emailIsFilled}
                    </p>
                  </div>
                </Form.Group>
                <Form.Group className="mb-3" controlId="status">
                  <Form.Label>
                    <strong>Status</strong>
                  </Form.Label>
                  <Form.Switch
                    color={user.status == 1 ? "green" : "red"}
                    type="radio"
                    label={user.status == 1 ? "Enabled" : "Disabled"}
                    name="status"
                    value={user.status}
                    defaultChecked={true}
                    onChange={() => {
                      set("status", !user.status);
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="roles">
                  <Form.Label>
                    <strong>Roles</strong>
                  </Form.Label>
                  {Array.from(roles).map((role) => (
                    <Form.Check
                      key={role.id}
                      type="checkbox"
                      label={role.name}
                      name={role.name}
                      value={role.id}
                      checked={Array.from(user.roles ? user.roles : []).find(
                        (userRole) => userRole.id === role.id
                      )}
                      onChange={(event) => {
                        const isChecked = event.target.checked;
                        if (isChecked) {
                          set("roles", [...user.roles, role]);
                        } else {
                          set(
                            "roles",
                            Array.from(user.roles).filter(
                              (userRole) => userRole.id !== role.id
                            )
                          );
                        }
                      }}
                    />
                  ))}
                  <div style={{ height: 5 }}>
                    <p
                      style={{
                        fontStyle: "italic",
                        color: "red",
                        margin: 0,
                        fontSize: 12,
                      }}
                    >
                      {rolesCheckIsFilled}
                    </p>
                  </div>
                </Form.Group>
                <div className="box-footer">
                  <Button
                    onClick={() => handleSubmit()}
                    style={{
                      backgroundColor: "#e9ecef",
                      border: "none",
                      color: "black",
                    }}
                    title="Save"
                  >
                    <AiFillSave size={30}></AiFillSave>Save
                  </Button>
                  <Button
                    variant="danger"
                    href="/users"
                    style={{
                      backgroundColor: "#e9ecef",
                      border: "none",
                      color: "black",
                      marginLeft: 20,
                    }}
                  >
                    <MdCancel size={30}></MdCancel>Cancel
                  </Button>
                </div>{" "}
                <p style={{ marginBottom: "0px" }}>{status}</p>
              </Form>
            </div>
          </div>
        </Row>
      </Container>
    </>
  );
}

export default NewUser;
