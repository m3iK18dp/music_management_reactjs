import { Navbar, Nav } from "react-bootstrap";
import { SiApplemusic } from "react-icons/si";
import React, { useState } from "react";
import { TbLogout } from "react-icons/tb";
import { HiOutlineUser } from "react-icons/hi";
import authenticationService from "../services/AuthenticationService";
import { useNavigate, useLocation } from "react-router-dom";
function NavbarComponent() {
  const location = useLocation();

  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const handleToggle = () => {
    setExpanded(!expanded);
  };
  const handleLogout = () => {
    authenticationService.logout().then((data) => {
      console.log(data);
      if (data.status === "ok") {
        navigate("/");
      } else alert("Logout Failed");
    });
  };
  const isLoggedIn =
    localStorage.getItem("token") &&
    !JSON.parse(localStorage.getItem("isRevoked"));
  const roles = localStorage.getItem("roles");
  const isAdmin = roles !== null ? roles.includes("ADMIN") : false;
  return (
    <Navbar
      // expanded={expanded}
      // expand='sm'
      variant="light"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        padding: 5,
        height: 55,
        minWidth: 400,
      }}
      className="background-color"
    >
      <Nav.Link href="/" disabled={location.pathname === "/"}>
        <SiApplemusic size={50} color={"black"}></SiApplemusic>
      </Nav.Link>
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav>
          <Nav.Link href="/songs" disabled={location.pathname === "/songs"}>
            Song Management
          </Nav.Link>
          {(JSON.parse(localStorage.getItem("isRevoked")) || isLoggedIn) &&
            isAdmin && (
              <Nav.Link
                href={
                  JSON.parse(localStorage.getItem("isRevoked"))
                    ? false
                    : "/users"
                }
                onClick={() => {
                  if (JSON.parse(localStorage.getItem("isRevoked"))) {
                    alert(
                      "Your account has been revoked, login with another account or contact Administrator to unlock your account to use more features."
                    );
                  }
                }}
                disabled={location.pathname === "/users"}
              >
                Users Management
              </Nav.Link>
            )}
        </Nav>
      </Navbar.Collapse>
      {(JSON.parse(localStorage.getItem("isRevoked")) || isLoggedIn) && (
        <Nav.Link
          href={
            JSON.parse(localStorage.getItem("isRevoked"))
              ? false
              : `/account/${encodeURIComponent(
                  localStorage.getItem("username")
                )}`
          }
          onClick={() => {
            if (JSON.parse(localStorage.getItem("isRevoked"))) {
              alert(
                "Your account has been revoked, login with another account or contact Administrator to unlock your account to use more features."
              );
            }
          }}
          title="Your Account Information"
        >
          <HiOutlineUser
            size={40}
            style={{
              width: 45,
              height: 45,
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: "50%",
              padding: 5,
              filter: "blur(0.5px)",
            }}
          ></HiOutlineUser>
        </Nav.Link>
      )}
      {JSON.parse(localStorage.getItem("isRevoked")) || isLoggedIn ? (
        <Nav.Link
          onClick={() => handleLogout()}
          title="Logout"
          style={{ border: "sold 1 black", marginLeft: 20 }}
        >
          Logout
          <TbLogout size={40}></TbLogout>
        </Nav.Link>
      ) : (
        <Nav>
          <Nav.Link
            onClick={() => navigate("/login")}
            title="Login"
            style={{ border: "sold 1 black", marginLeft: 20 }}
            disabled={location.pathname === "/login"}
          >
            Login
          </Nav.Link>
          <Nav.Link
            onClick={() => navigate("/register")}
            title="Register"
            style={{ border: "sold 1 black", marginLeft: 20 }}
            disabled={location.pathname === "/register"}
          >
            Register
          </Nav.Link>
        </Nav>
      )}
    </Navbar>
  );
}
export default NavbarComponent;
