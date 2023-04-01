// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Button, Form } from "react-bootstrap";
// import userService from "../services/UserService";
// import { useParams, useNavigate } from "react-router-dom";
// import { AiFillSave } from "react-icons/ai";
// import { MdCancel } from "react-icons/md";
// import NavbarComponent from "../components/NavbarComponent";
// import LastUpdateTimeComponent from "../components/LastUpdateTimeComponent";
// import CustomFormGroup from "../components/CustomFormGroup";
// function UpdateUser() {
//   const navigate = useNavigate();
//   const [firstNameIsFilled, setFirstNameIsFilled] = useState("");
//   const [lastNameIsFilled, setLastNameIsFilled] = useState("");
//   const [emailIsFilled, setEmailIsFilled] = useState("");
//   const [rolesCheckIsFilled, setRolesCheckIsFilled] = useState("");
//   const [status, setStatus] = useState("");
//   const [roles, setRoles] = useState([]);
//   const [user, setUser] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     status: 1,
//     roles: [],
//   });
//   const set = (prop, value) => {
//     setUser({ ...user, [prop]: value });
//   };
//   const [isFirst, setIsFirst] = useState(true);

//   const id = useParams();
//   useEffect(() => {
//     userService.getRoles({}).then((data) => setRoles(data.data.content));
//     userService.get({ _id: id.id }).then((data) => {
//       console.log(data.data);
//       setUser(data.data.content[0]);
//     });
//   }, []);
//   useEffect(() => {
//     if (!isFirst) {
//       setFirstNameIsFilled(
//         user.firstName === "" ? `Please enter first name` : ""
//       );
//       setLastNameIsFilled(user.lastName === "" ? `Please enter last name` : "");
//       setEmailIsFilled(user.email === "" ? "Please enter email" : "");
//       setRolesCheckIsFilled(
//         user.roles.length === 0 ? "Please select roles" : ""
//       );
//     }
//   }, [user, isFirst, status]);
//   useEffect(() => {
//     setStatus("");
//   }, [user]);

//   function handleSubmit() {
//     setIsFirst(false);
//     if (
//       !(
//         user.firstName === "" ||
//         user.lastName === "" ||
//         user.email === "" ||
//         user.roles.length === 0
//       )
//     ) {
//       setStatus("Please wait...Updating user is in progress");
//       userService.updateUser(user.id, user).then((res) => {
//         if (res.status === "ok") {
//           setStatus("");
//           alert("Update User successful!");
//           navigate("/users");
//         } else if (res.status === "failed") {
//           setStatus("Update User failed, try again.");
//         } else if (res.status === "error") {
//           setStatus("An error occurred during the update, please try again");
//         }
//       });
//     }
//   }
//   return (
//     <>
//       <NavbarComponent />
//       <div className="background-container" />
//       <Container>
//         <Row
//           className="col-md-8 offset-md-2"
//           style={{
//             margin: "50px auto",
//             border: "3px solid purple",
//             backgroundColor: "white",
//             maxWidth: 500,
//             borderRadius: 10,
//           }}
//         >
//           <div className="card">
//             <h1
//               className="text-center"
//               style={{
//                 borderBottom: "2px solid purple",
//                 padding: "20px",
//                 marginBottom: "0",
//               }}
//             >
//               Update User
//             </h1>
//             <div className="card-body">
//               <Form>
//                 <CustomFormGroup
//                   funcEnter={handleSubmit}
//                   controlId="id"
//                   label="ID"
//                   value={user.id}
//                 />
//                 <Col>
//                   <CustomFormGroup
//                     funcEnter={handleSubmit}
//                     controlId="firstName"
//                     func={set}
//                     placeholder="Enter first name"
//                     label="First Name"
//                     value={user.firstName}
//                     warning={firstNameIsFilled}
//                   />
//                   <CustomFormGroup
//                     funcEnter={handleSubmit}
//                     controlId="lastName"
//                     func={set}
//                     placeholder="Enter last name"
//                     label="Last Name"
//                     value={user.lastName}
//                     warning={lastNameIsFilled}
//                   />
//                 </Col>
//                 <CustomFormGroup
//                   funcEnter={handleSubmit}
//                   controlId="email"
//                   func={set}
//                   placeholder="Enter email"
//                   label="Email"
//                   value={user.email}
//                   warning={emailIsFilled}
//                 />
//                 <Form.Group className="mb-3" controlId="status">
//                   <Form.Label>
//                     <strong>Status</strong>
//                   </Form.Label>
//                   <Form.Switch
//                     style={{
//                       color: user.status == 1 ? "green" : "red",
//                       fontStyle: "italic",
//                       fontWeight: "bold",
//                     }}
//                     label={user.status == 1 ? "Enabled" : "Disabled"}
//                     name="status"
//                     defaultChecked={user.status}
//                     onChange={() => {
//                       set("status", !user.status);
//                     }}
//                   />
//                 </Form.Group>
//                 <Form.Group className="mb-3" controlId="roles">
//                   <Form.Label>
//                     <strong>Roles</strong>
//                   </Form.Label>

//                   {roles.map((role) => (
//                     <Form.Check
//                       key={role.id}
//                       type="checkbox"
//                       label={role.name}
//                       name={role.name}
//                       value={role.id}
//                       checked={Array.from(user.roles ? user.roles : []).find(
//                         (userRole) => userRole.id === role.id
//                       )}
//                       onChange={(event) => {
//                         const isChecked = event.target.checked;
//                         if (isChecked) {
//                           set("roles", [...user.roles, role]);
//                         } else {
//                           set(
//                             "roles",
//                             Array.from(user.roles).filter(
//                               (userRole) => userRole.id !== role.id
//                             )
//                           );
//                         }
//                       }}
//                     />
//                   ))}
//                   <div style={{ height: 5 }}>
//                     <p
//                       style={{
//                         fontStyle: "italic",
//                         color: "red",
//                         margin: 0,
//                         fontSize: 12,
//                       }}
//                     >
//                       {rolesCheckIsFilled}
//                     </p>
//                   </div>
//                 </Form.Group>
//                 <div className="box-footer">
//                   <Button
//                     onClick={() => handleSubmit()}
//                     style={{
//                       backgroundColor: "#e9ecef",
//                       border: "none",
//                       color: "black",
//                     }}
//                     title="Save"
//                   >
//                     <AiFillSave size={30}></AiFillSave>Save
//                   </Button>
//                   <Button
//                     variant="danger"
//                     href="/users"
//                     style={{
//                       backgroundColor: "#e9ecef",
//                       border: "none",
//                       color: "black",
//                       marginLeft: 20,
//                     }}
//                   >
//                     <MdCancel size={30}></MdCancel>Cancel
//                   </Button>
//                   <LastUpdateTimeComponent date={user.lastUpdate} />
//                 </div>{" "}
//                 <p>{status}</p>
//               </Form>
//             </div>
//           </div>
//         </Row>
//       </Container>
//     </>
//   );
// }

// export default UpdateUser;
