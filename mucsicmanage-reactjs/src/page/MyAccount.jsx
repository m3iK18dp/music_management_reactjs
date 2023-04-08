import React, { useState, useEffect } from "react";
import { Container, Col, Row, Button, Form } from "react-bootstrap";
import userService from "../services/UserService";
import { useNavigate, useParams } from "react-router-dom";
import { AiFillSave } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import { FaUserEdit, FaUserLock } from "react-icons/fa";
import NavbarComponent from "../components/NavbarComponent";
import CustomButton from "../components/CustomButton";
import LastUpdateTimeComponent from "../components/LastUpdateTimeComponent";
import CustomFormGroup from "../components/CustomFormGroup";
import { checkToken } from "../services/CheckToken";
function MyAccount() {
  const navigate = useNavigate();

  const [firstNameIsFilled, setFirstNameIsFilled] = useState("");
  const [lastNameIsFilled, setLastNameIsFilled] = useState("");
  const [emailIsFilled, setEmailIsFilled] = useState("");
  const [rolesCheckIsFilled, setRolesCheckIsFilled] = useState("");
  const [oldPasswordIsFilled, setOldPasswordIsFilled] = useState("");
  const [newPasswordIsFilled, setNewPasswordIsFilled] = useState("");
  const [confirmPasswordIsFilled, setConfirmPasswordIsFilled] = useState("");
  const [status, setStatus] = useState("");
  const [listPassword, setListPassword] = useState(["", "", ""]);
  const [check, setCheck] = useState(true);
  const [user, setUser] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    status: 1,
    roles: [],
  });

  const [readOnly, setReadOnly] = useState(true);
  const [changePassword, setChangePassword] = useState(false);
  const [isFirst, setIsFirst] = useState(true);

  const username = useParams();

  useEffect(() => {
    checkToken(navigate);
    userService.get({ _email: username.username }, navigate).then((data) => {
      console.log(data.data);
      if (data.data.content.length === 0) navigate("/error/404");
      setUser(data.data.content[0]);
    });
  }, [navigate, username]);
  useEffect(() => {
    if (!isFirst) {
      setFirstNameIsFilled(
        user.firstName === "" && !readOnly ? `Please enter first name` : ""
      );
      setLastNameIsFilled(
        user.lastName === "" && !readOnly ? `Please enter last name` : ""
      );
      setEmailIsFilled(
        user.email === "" && !readOnly ? "Please enter email" : ""
      );
      setRolesCheckIsFilled(
        user.roles.length === 0 && !readOnly ? "Please select roles" : ""
      );
      setOldPasswordIsFilled(
        listPassword[0] === "" && changePassword ? "Please enter Password" : ""
      );
      setNewPasswordIsFilled(
        listPassword[1] === "" && changePassword
          ? "Please enter new Password"
          : ""
      );
      setConfirmPasswordIsFilled(
        listPassword[2] === "" && changePassword
          ? "Please enter Confirm Password"
          : listPassword[1] !== listPassword[2]
          ? "Password and Confirm password do not match"
          : ""
      );
    }
  }, [user, listPassword, readOnly, changePassword, status, check, isFirst]);
  useEffect(() => {
    setStatus("");
  }, [user, listPassword]);
  const setLstPassword = (index, value) => {
    setListPassword((prevList) =>
      prevList.map((item, i) => (i === index ? value : item))
    );
  };
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
  function changeChangePassword() {
    setChangePassword(!changePassword);
  }
  function handleSubmit() {
    setIsFirst(false);

    if (
      !(
        user.firstName === "" ||
        user.lastName === "" ||
        user.email === "" ||
        user.roles.length === 0 ||
        (changePassword &&
          (listPassword.includes("") || listPassword[1] !== listPassword[2]))
      )
    ) {
      if (changePassword) {
        userService
          .updatePasswordToMyUser(
            user.id,
            listPassword.filter((value, index) => index !== 2),
            navigate
          )
          .then((res) => {
            if (res.status !== "ok") {
              setCheck(false);
              setOldPasswordIsFilled(
                "Password incorrect! Please try again with different Password"
              );
            }
          });
      }
      if (check)
        userService.updateUser(user.id, user, navigate).then((res) => {
          if (res.status !== "ok") {
            setCheck(false);
          }
        });
      if (check) {
        alert("Update User successful!");
        setChangePassword(false);
        setReadOnly(true);
      }
    } else setStatus("Update failed! Check your information.");
  }
  return (
    <>
      <NavbarComponent />
      <div className="background-container" />
      <div className=" background-container-opacity-low" />
      <Container>
        <Row
          className="col-md-8 offset-md-2"
          style={{
            margin: "50px auto",
            border: "3px solid purple",
            width: "60%",
            minWidth: 400,
            maxWidth: 500,
            borderRadius: 10,
          }}
        >
          <div
            className="card"
            style={{
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
              {(readOnly ? "" : "Update \n") + "Account Information"}
            </h1>
            <div className="card-body">
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
                    readonly={readOnly}
                  />
                  <CustomFormGroup
                    funcEnter={handleSubmit}
                    controlId="lastName"
                    func={set}
                    placeholder="Enter last name"
                    label="Last Name"
                    value={user.lastName}
                    warning={lastNameIsFilled}
                    readonly={readOnly}
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
                  readonly={readOnly}
                />
                {readOnly ? (
                  localStorage.getItem("username") === username.username && (
                    <CustomFormGroup
                      funcEnter={handleSubmit}
                      controlId="status"
                      func={set}
                      placeholder="Enter status"
                      label="Status"
                      value={user.status ? "ENABLED" : "DISABLED"}
                      formControlStyle={{
                        color: user.status ? "green" : "red",
                        fontStyle: "italic",
                        fontWeight: "bold",
                      }}
                      readonly={readOnly}
                    />
                  )
                ) : (
                  <Form.Group className="mb-3" controlId="status">
                    <Form.Label>Status</Form.Label>
                    <Form.Switch
                      style={{
                        color: user.status ? "green" : "red",
                        fontStyle: "italic",
                        fontWeight: "bold",
                      }}
                      label={user.status ? "Enabled" : "Disabled"}
                      name="status"
                      defaultChecked={user.status}
                      onChange={() => {
                        if (!readOnly) set("status", !user.status);
                      }}
                    />
                  </Form.Group>
                )}
                {readOnly &&
                  localStorage.getItem("username") === username.username && (
                    <CustomFormGroup
                      funcEnter={handleSubmit}
                      controlId="roles"
                      func={set}
                      placeholder="Enter roles"
                      label="Roles"
                      value={covertArrayObjectToString(user.roles)}
                      warning={rolesCheckIsFilled}
                      formControlStyle={{
                        fontStyle: "italic",
                        fontWeight: "bold",
                      }}
                      readonly={readOnly}
                    />
                  )}
                {readOnly ? (
                  localStorage.getItem("username") === username.username && (
                    <Form.Group className="mb-3" controlId="change">
                      <CustomButton
                        field={user.id}
                        IconButton={FaUserEdit}
                        size={30}
                        func={changeReadOnly}
                        title={"Enable User"}
                        id="change"
                      />
                      <div
                        style={{
                          display: "inline-block",
                          marginLeft: 20,
                        }}
                        onMouseOver={(e) => {
                          e.target.style.color = "rgb(40, 144, 144)";
                          e.target.style.cursor = "pointer";
                        }}
                        onMouseOut={(e) => (e.target.style.color = "black")}
                        onClick={changeReadOnly}
                      >
                        <Form.Text className="neon">
                          Change User Information
                        </Form.Text>
                      </div>
                    </Form.Group>
                  )
                ) : (
                  <>
                    <Form.Group className="mb-3" controlId="changePassword">
                      <CustomButton
                        id="changePassword"
                        IconButton={FaUserLock}
                        size={30}
                        func={changeChangePassword}
                        title={"Change Password"}
                      />
                      <div
                        style={{
                          display: "inline-block",
                          marginLeft: 20,
                        }}
                        onMouseOver={(e) => {
                          e.target.style.color = "rgb(40, 144, 144)";
                          e.target.style.cursor = "pointer";
                        }}
                        onMouseOut={(e) => (e.target.style.color = "black")}
                        onClick={changeChangePassword}
                      >
                        <Form.Text className="neon">
                          {!changePassword
                            ? "Click here if you want change password"
                            : "Click here if you do not want change password"}
                        </Form.Text>
                      </div>
                    </Form.Group>
                    {changePassword && (
                      <>
                        <CustomFormGroup
                          funcEnter={handleSubmit}
                          prop={0}
                          type="password"
                          controlId="old"
                          func={setLstPassword}
                          placeholder="Enter password"
                          label="Password"
                          value={listPassword[0]}
                          warning={oldPasswordIsFilled}
                        />
                        <CustomFormGroup
                          funcEnter={handleSubmit}
                          prop={1}
                          type="password"
                          controlId="new"
                          func={setLstPassword}
                          placeholder="Enter new password"
                          label="New Password"
                          value={listPassword[1]}
                          warning={newPasswordIsFilled}
                        />
                        <CustomFormGroup
                          funcEnter={handleSubmit}
                          prop={2}
                          type="password"
                          controlId="confirm"
                          func={setLstPassword}
                          placeholder="Enter confirm password"
                          label="Confirm Password"
                          value={listPassword[2]}
                          warning={confirmPasswordIsFilled}
                        />
                      </>
                    )}
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
