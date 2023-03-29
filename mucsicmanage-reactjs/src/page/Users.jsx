import "../css/users.css";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Form, Table } from "react-bootstrap";
import { AiFillEdit } from "react-icons/ai";
import {
  BsSortNumericUpAlt,
  BsSortAlphaUpAlt,
  BsSortNumericDownAlt,
  BsSortAlphaDownAlt,
  BsPersonFillLock,
  BsPersonFillAdd,
  BsPersonFillCheck,
} from "react-icons/bs";
import { MdCancel, MdPersonSearch, MdLockReset } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";
import PaginationComponent from "../components/PaginationComponent";
import NavbarComponent from "../components/NavbarComponent";
import userService from "../services/UserService";
import convertPathSearchUrl from "../services/ConvertPathSearchUrl";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import CustomTableHeaderWithSort from "../components/CustomTableHeaderWithSort";
function Users() {
  const navigate = useNavigate();
  const path = useLocation().search;
  const [search, setSearch] = useState({
    id: Number,
    email: "",
    name: "",
    role_ids: [],
    status: "-1",
    page: 0,
    limit: 10,
    field: "id",
    type_sort: "asc",
    totalPages: 0,
    currentUsers: [],
    roles: [],
    rolesOfUser: {},
  });
  const get = (field) => {
    return search[field];
  };
  const set = (field, value) => {
    setSearch((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const params = {};
    [
      "id",
      "email",
      "name",
      "role_ids",
      "status",
      "page",
      "limit",
      "field",
      "type_sort",
    ].forEach((prop) => {
      const value = searchParams.get(prop);
      if (value !== null) {
        if (!(prop === "id" && value < 1))
          search[prop] = prop === "page" ? parseInt(value) - 1 : value;
      }
      params[`_${prop}`] =
        prop === "id" ? (get(prop) > 0 ? get(prop) : -1) : get(prop);
    });

    userService.getRoles({}).then((data) => {
      set("roles", data.data.content);
    });

    userService.get(params).then((data) => {
      set("totalPages", data.data.totalPages);
      set("currentUsers", data.data.content);
      Array.from(data.data.content).forEach((user) => {
        userService.getRoles({ _userId: user.id }).then((data) => {
          get("rolesOfUser")[user.id] = data.data.content;
          console.log(get("rolesOfUser"));
        });
      });
      console.log(search);
    });
  }, [path]);
  const covertArrayObjectToString = (roles) => {
    if (roles) return roles.map((role) => (role ? role.name : null)).join(", ");
  };
  const changeStatus = (id) => {
    const user = get("currentUsers").find((user) => user.id === id);
    // console.log(user);
    userService.changeStatusUser(id).then((res) => {
      if (res.status === "ok") {
        user.status = !user.status;
        console.log(get("currentUsers").find((user) => user.id === id));
        navigate(convertPathSearchUrl());
      }
    });
  };
  const handleResetPassword = (id) => {
    userService.resetPasswordUser(id);
  };
  const handleSearch = () => {
    const search = [];
    ["id", "email", "name", "role_ids", "status"].forEach((field) => {
      search.push({
        property: field,
        value: get(field),
      });
    });
    navigate(convertPathSearchUrl(search));
  };
  const handleCancelSearch = (searchField) => {
    const search = [];
    (searchField === "all"
      ? ["id", "email", "name", "role_ids", "status"]
      : [searchField]
    ).forEach((field) => {
      set(field, "");
      search.push({ property: field, value: "" });
    });
    navigate(convertPathSearchUrl(search));
  };
  const handleNewUser = () => {
    navigate("/users/new");
  };
  const handleUpdateUser = (id) => {
    navigate(`/users/${id}`);
  };
  // const handleDeleteUser = (id) => {
  // 	if (window.confirm('Do you want to delete this User?')) {
  // 		UserService.deleteUser(id);
  // 		set(
  // 			'currentUsers',
  // 			get('currentUsers').filter((User) => User.id !== id),
  // 		);
  // 	}
  // };
  const handleSort = (field) => {
    navigate(
      convertPathSearchUrl([
        { property: "field", value: field },
        {
          property: "type_sort",
          value:
            get("field") !== field
              ? "asc"
              : get("type_sort") === "asc"
              ? "desc"
              : "asc",
        },
      ])
    );
  };
  function handleRoleChange(event, role) {
    const isChecked = event.target.checked;
    if (isChecked) {
      set("role_ids", [...get("role_ids"), role.id]);
    } else {
      set(
        "role_ids",
        Array.from(get("role_ids")).filter((id) => id !== role.id)
      );
    }
    navigate(
      convertPathSearchUrl({ property: "role_ids", value: get("role_ids") })
    );
  }
  return (
    <div style={{ overflow: "hidden" }}>
      <NavbarComponent />
      <Container
        fluid
        style={{
          position: "fixed",
          top: 55,
          left: 0,
          right: 0,
          zIndex: 9,
          padding: 5,
          backgroundColor: "#f8f9fa",
        }}
      >
        <Form>
          <Row>
            {["Id", "Email", "Name"].map((field) => (
              <React.Fragment key={field}>
                <CustomInput
                  set={set}
                  get={get}
                  field={field}
                  type={field === "Id" ? "number" : "text"}
                  min={field === "Id" ? 1 : "none"}
                  func={handleSearch}
                  size={2}
                />
                <Col className="col" xl={1}>
                  <CustomButton
                    field={field}
                    IconButton={MdCancel}
                    func={handleCancelSearch}
                    title={`Cancel Search with ${field}`}
                  />
                </Col>
              </React.Fragment>
            ))}
          </Row>
          <Row>
            <Col sm={1}></Col>

            <Col sm={1}>
              <Form.Label>Role</Form.Label>
            </Col>
            <Col sm={4}>
              {Array.from(get("roles")).map((role) => (
                <div key={role.id}>
                  <Form.Check
                    type="checkbox"
                    label={role.name}
                    name={role.name}
                    value={role.id}
                    checked={get("role_ids").includes(role.id)}
                    onChange={(event) => handleRoleChange(event, role)}
                  />
                </div>
              ))}
            </Col>
            <Col sm={1}></Col>
            <Col sm={1}>
              <Form.Label>Role</Form.Label>
            </Col>
            <Col sm={4}>
              {[1, 0, -1].map((status) => (
                <div key={`status_${status}`}>
                  <Form.Check
                    type="radio"
                    label={
                      status === 1
                        ? "Enabled"
                        : status === 0
                        ? "Disabled"
                        : "None"
                    }
                    name="status"
                    value={status}
                    checked={status == get("status")}
                    onChange={(event) => {
                      console.log(event.target.checked);
                      console.log(event.target.value);
                      if (event.target.checked)
                        navigate(
                          convertPathSearchUrl([
                            {
                              property: "status",
                              value: event.target.value,
                            },
                          ])
                        );
                    }}
                  />
                </div>
              ))}
            </Col>
          </Row>
          <Row />
          <Row>
            <Col />
            <Col />
            <Col>
              <CustomButton
                IconButton={MdPersonSearch}
                func={handleSearch}
                title={"Search User"}
              />
            </Col>
            <Col>
              <CustomButton
                field="all"
                IconButton={ImCancelCircle}
                func={handleCancelSearch}
                title={"Cancel Search All filter"}
              />
            </Col>
            <Col>
              <CustomButton
                IconButton={BsPersonFillAdd}
                func={handleNewUser}
                title={"Add new User"}
              />
            </Col>
            <Col />
            <Col />
          </Row>
        </Form>
      </Container>
      <Container
        style={{
          marginTop: "220px",
          overflow: "hidden",
          overflowX: "scroll",
        }}
      >
        <Table striped bordered>
          <thead className="table-dark">
            <tr>
              <th>STT</th>
              {[
                {
                  field: "ID",
                  icon: [BsSortNumericUpAlt, BsSortNumericDownAlt],
                },
                {
                  field: "Email",
                  icon: [BsSortAlphaUpAlt, BsSortAlphaDownAlt],
                },
                {
                  field: "FirstName",
                  icon: [BsSortAlphaUpAlt, BsSortAlphaDownAlt],
                },
                {
                  field: "LastName",
                  icon: [BsSortAlphaUpAlt, BsSortAlphaDownAlt],
                },
              ].map((row) => {
                return (
                  <CustomTableHeaderWithSort
                    get={get}
                    key={row.field}
                    field={row.field}
                    func={handleSort}
                    IconAsc={row.icon[0]}
                    IconDesc={row.icon[1]}
                  />
                );
              })}
              <th className="column-">Roles</th>
              <th className="column-">Status</th>
              <th className="column-">Actions</th>
            </tr>
          </thead>
          <tbody>
            {get("currentUsers").map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.id}</td>
                <td style={{ textAlign: "left" }}>{user.email}</td>
                <td style={{ textAlign: "left" }}>{user.firstName}</td>
                <td style={{ textAlign: "left" }}>{user.lastName}</td>
                <td>
                  {covertArrayObjectToString(get("rolesOfUser")[user.id])}
                </td>
                <td>
                  {user.status ? (
                    <CustomButton
                      field={user.id}
                      IconButton={BsPersonFillCheck}
                      size={30}
                      func={changeStatus}
                      title={"Disable User"}
                    />
                  ) : (
                    <CustomButton
                      field={user.id}
                      IconButton={BsPersonFillLock}
                      size={30}
                      func={changeStatus}
                      title={"Enable User"}
                    />
                  )}
                </td>
                <td>
                  <CustomButton
                    field={user.id}
                    IconButton={MdLockReset}
                    size={30}
                    func={handleResetPassword}
                    title={"Reset Password for User"}
                  />
                  <CustomButton
                    field={user.id}
                    IconButton={AiFillEdit}
                    size={30}
                    func={handleUpdateUser}
                    title={"Edit User"}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
      <div style={{ visibility: "hidden", height: 50 }} />
      <Row>
        <PaginationComponent
          currentPage={get("page")}
          totalPages={get("totalPages")}
          objectsPerPage={get("limit")}
        />
      </Row>
    </div>
  );
}

export default Users;
