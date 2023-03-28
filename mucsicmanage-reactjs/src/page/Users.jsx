import "../css/users.css";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Form, Table, FormSelect } from "react-bootstrap";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import {
  BsPlayCircleFill,
  BsPauseCircleFill,
  BsSortNumericUpAlt,
  BsSortAlphaUpAlt,
  BsSortNumericDownAlt,
  BsSortAlphaDownAlt,
  BsSkipEndCircleFill,
  BsSkipStartCircleFill,
  BsPersonFillLock,
  BsPersonFillCheck,
} from "react-icons/bs";
import { RiHeartAddFill } from "react-icons/ri";
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
    page: 0,
    limit: 10,
    field: "id",
    type_sort: "asc",
    totalPages: 0,
    currentUsers: [],
    roles: [],
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
      "page",
      "limit",
      "field",
      "type_sort",
    ].forEach((prop) => {
      const value = searchParams.get(prop);
      if (value !== null)
        search[prop] = prop === "page" ? parseInt(value) - 1 : value;
      params[`_${prop}`] =
        prop === "id" ? (get(prop) > 0 ? get(prop) : -1) : get(prop);
    });
    userService.getRoles().then((data) => {
      set("roles", data.data);
      console.log(data.data);
    });
    userService.get(params).then((data) => {
      set("totalPages", data.data.totalPages);
      set("currentUsers", data.data.content);
    });
  }, [path]);
  const getStatus = (id) => {
    return get("currentUsers").find((user) => user.id === id).status;
  };
  const changeStatus = (id) => {
    userService.changeStatusUser(id);
  };
  const handleResetPassword = (id) => {
    userService.resetPasswordUser(id);
  };
  const handleSearch = () => {
    const search = [];

    ["id", "email", "name", "role_ids"].forEach((field) => {
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
      ? ["id", "email", "name", "role_ids"]
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
    // Kiểm tra xem role đã được chọn hay chưa
    const isChecked = event.target.checked;

    // Nếu đã được chọn, thêm role vào state
    if (isChecked) {
      set("role_ids", [...get("role_ids"), role.id]);
    } else {
      // Nếu không được chọn, xóa role khỏi state
      set(
        "role_ids",
        Array.from(get("role_ids")).filter((id) => id !== role.id)
      );
    }
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
            {/* {" "}
            <FormSelect
              multiple
              value={get("role_ids")}
              onChange={(event) => {
                set(
                  "role_ids",
                  Array.from(
                    event.target.selectedOptions,
                    (option) => option.value
                  )
                );
                console.log(
                  Array.from(
                    event.target.selectedOptions,
                    (option) => option.value
                  )
                );
              }}
            >
              {get("roles").forEach((role) => {
                return (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                );
              })}
              <option value="value1">Option 1</option>
              <option value="value2">Option 2</option>
              <option value="value3">Option 3</option>
            </FormSelect> */}

            {get("roles").map((role) => (
              <div key={role.id}>
                <Form.Check
                  type="checkbox"
                  label={role.name}
                  name="roles"
                  value={role.id}
                  checked={get("role_ids").includes(role.id)}
                  onChange={(event) => handleRoleChange(event, role)}
                />
              </div>
            ))}
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
                IconButton={RiHeartAddFill}
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
          marginTop: 320,
          // position: 'fixed',
          // top: 280,
          // left: 10,
          // right: 10,
          // zIndex: 10,
          // padding: 5,
          // overflow: 'hidden',
          // overflowY: 'scroll',
        }}
      >
        <Table
          striped
          bordered
          style={{
            borderWidth: "0px 0",
          }}
        >
          <colgroup>
            <col width="auto" span="5" />
            <col width="110" span="1" />
          </colgroup>
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
                  field: "Name",
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
                <td style={{ textAlign: "left" }}>
                  {user.firstName} {user.lastName}
                </td>
                <td>{get("role_names")}</td>
                {/* ////////////////////////////////////////////////////////// */}
                <td>
                  {getStatus(user.id) ? (
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
          {/* <div style={{ visibility: "hidden", height: 40 }} /> */}
        </Table>
      </Container>

      <Row>
        <PaginationComponent
          currentPage={get("page")}
          totalPages={get("totalPages")}
          usersPerPage={get("limit")}
        />
      </Row>
    </div>
  );
}

export default Users;
