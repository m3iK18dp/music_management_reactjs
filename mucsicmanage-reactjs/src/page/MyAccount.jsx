import React, { useRef, useState, useEffect } from "react";
import { Container, Col, Row, Button, Form } from "react-bootstrap";
import userService from "../services/UserService";
import { useParams, useNavigate } from "react-router-dom";
import { AiFillSave } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import NavbarComponent from "../components/NavbarComponent";
import CustomButton from "../components/CustomButton";
import LastUpdateTimeComponent from "../components/LastUpdateTimeComponent";
function MyAccount() {
  const navigate = useNavigate();
  const [firstNameIsFilled, setFirstNameIsFilled] = useState("");
  const [lastNameIsFilled, setLastNameIsFilled] = useState("");
  const [emailIsFilled, setEmailIsFilled] = useState("");
  const [rolesCheckIsFilled, setRolesCheckIsFilled] = useState("");
  const [status, setStatus] = useState("");

  const [roles, setRoles] = useState([]);
  const [user, setUser] = useState({});

  const [readOnly, setReadOnly] = useState(true);
  const email = useParams();
  useEffect(() => {
    userService.getRoles({}).then((data) => setRoles(data.data.content));
    userService.get({ _email: email.email }).then((data) => {
      console.log(data.data);
      setUser(data.data.content[0]);
    });
  }, [email]);
  const set = (prop, value) => {
    setUser({ ...user, [prop]: value });
  };
  const covertArrayObjectToString = (roles) => {
    if (roles) return roles.map((role) => (role ? role.name : null)).join(", ");
    return "";
  };
  function changeReadOnly() {
    setReadOnly(!readOnly);
  }
  function handleSubmit() {
    setFirstNameIsFilled(
      user.firstName === "" ? `Please enter first name` : ""
    );

    setLastNameIsFilled(user.lastName === "" ? `Please enter last name` : "");

    setEmailIsFilled(user.email === "" ? "Please enter email" : "");

    setRolesCheckIsFilled(user.roles.length === 0 ? "Please select roles" : "");

    if (
      user.firstName === "" ||
      user.lastName === "" ||
      user.email === "" ||
      user.roles.length === 0
    )
      setStatus("");
    else {
      //   user.roles = [{ id: 2, name: "ROLE_USER" }];
      userService.updateUser(user.id, user).then((res) => {
        if (res.status === "ok") {
          alert("Update User successful!");
          changeReadOnly();
        } else {
          setStatus("Update User failed, try again.");
          console.log(res);
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
            margin: "50px auto",
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
              {(readOnly ? "" : "Update ") + "Account Information"}
            </h1>
            <div className="card-body">
              <Form>
                <Col>
                  <Form.Group className="mb-3" controlId="firstName">
                    <Form.Label>
                      <strong>First Name</strong>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      onChange={(event) => set("firstName", event.target.value)}
                      placeholder="Enter first name"
                      required
                      value={user.firstName}
                      readOnly={readOnly}
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
                      value={user.lastName}
                      readOnly={readOnly}
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
                </Col>
                <Col style={{ justifyContent: "left" }}>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>
                      <strong>Email</strong>
                    </Form.Label>
                    <Form.Control
                      type="email"
                      onChange={(event) => set("email", event.target.value)}
                      required
                      placeholder="Enter email address"
                      value={user.email}
                      readOnly={readOnly}
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
                </Col>
                <Col style={{ justifyContent: "left" }}>
                  <Form.Group className="mb-3" controlId="status">
                    <Form.Label>
                      <strong>Status</strong>
                    </Form.Label>
                    {readOnly ? (
                      <Form.Control
                        style={{
                          color: user.status ? "green" : "red",
                          fontStyle: "italic",
                          fontWeight: "bold",
                        }}
                        type="email"
                        onChange={(event) => set("email", event.target.value)}
                        required
                        value={user.status ? "ENABLED" : "DISABLED"}
                        readOnly={readOnly}
                      />
                    ) : (
                      <Form.Switch
                        style={{
                          color: user.status == 1 ? "green" : "red",
                          fontStyle: "italic",
                          fontWeight: "bold",
                        }}
                        label={user.status == 1 ? "Enabled" : "Disabled"}
                        name="status"
                        defaultChecked={user.status}
                        onChange={() => {
                          if (!readOnly) set("status", !user.status);
                        }}
                        readOnly={readOnly}
                      />
                    )}
                  </Form.Group>
                </Col>
                <Form.Group className="mb-3" controlId="roles">
                  <Form.Label>
                    <strong>Roles</strong>
                  </Form.Label>
                  {readOnly ? (
                    <Form.Control
                      style={{
                        fontStyle: "italic",
                        fontWeight: "bold",
                      }}
                      type="email"
                      onChange={(event) => set("email", event.target.value)}
                      required
                      value={covertArrayObjectToString(user.roles)}
                      readOnly={readOnly}
                    />
                  ) : (
                    roles.map((role) => (
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
                          if (!readOnly) {
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
                          }
                        }}
                        readOnly={readOnly}
                      />
                    ))
                  )}
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
                {/* <Form.Group className="mb-3" controlId="roles">
                  <Form.Label>
                    <strong>Roles</strong>
                  </Form.Label>
                  {readOnly ? (
                    <Form.Control
                      style={{
                        fontStyle: "italic",
                        fontWeight: "bold",
                      }}
                      type="email"
                      onChange={(event) => set("email", event.target.value)}
                      required
                      value={covertArrayObjectToString(user.roles)}
                      readOnly={readOnly}
                    />
                  ) : (
                    roles.map((role) => (
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
                          if (!readOnly) {
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
                          }
                        }}
                        readOnly={readOnly}
                      />
                    ))
                  )}
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
                </Form.Group> */}
                {readOnly ? (
                  <Form.Group className="mb-3" controlId="change">
                    <CustomButton
                      id="change"
                      field={user.id}
                      IconButton={FaUserEdit}
                      size={30}
                      func={changeReadOnly}
                      title={"Enable User"}
                    />
                    <div
                      style={{
                        display: "inline-block",
                        marginLeft: 20,
                        color: "purple",
                      }}
                      onClick={changeReadOnly}
                    >
                      <Form.Text>
                        <strong>Change User Information</strong>
                      </Form.Text>
                    </div>
                  </Form.Group>
                ) : (
                  <>
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
                        onClick={() => changeReadOnly()}
                        style={{
                          backgroundColor: "#e9ecef",
                          border: "none",
                          color: "black",
                          marginLeft: 20,
                        }}
                      >
                        <MdCancel size={30}></MdCancel>Cancel
                      </Button>
                      <LastUpdateTimeComponent date={user.lastUpdate} />
                    </div>{" "}
                    <p>{status}</p>
                  </>
                )}
              </Form>
            </div>
          </div>
        </Row>
      </Container>
    </>
  );
}

export default MyAccount;
