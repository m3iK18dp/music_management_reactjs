import { Navbar, Nav } from "react-bootstrap";
import { SiApplemusic } from "react-icons/si";
import React, { useState } from "react";
import { TbLogout } from "react-icons/tb";
import { FaUserCircle } from "react-icons/fa";
function NavbarComponent() {
  const [expanded, setExpanded] = useState(false);
  const handleToggle = () => {
    setExpanded(!expanded);
  };
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
      }}
      className="background-color"
    >
      <Navbar.Toggle
        onClick={handleToggle}
        aria-controls="basic-navbar-nav"
        style={{ border: "none" }}
      >
        <SiApplemusic size={45} color={"black"} />
      </Navbar.Toggle>
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav>
          <Nav.Link
            href="/songs"
            // disabled={useLocation().pathname === "/songs"}
          >
            <strong color="black">Song Management</strong>
          </Nav.Link>
          <Nav.Link
            href="/users"
            // disabled={useLocation().pathname === "/users"}
          >
            <strong color="black">Users Management</strong>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
      <Nav.Link
        href={`/account/${encodeURIComponent(
          localStorage.getItem("username")
        )}`}
        title="Your Account Information"
      >
        <FaUserCircle size={40}></FaUserCircle>
      </Nav.Link>
      <Nav.Link
        href="/logout"
        title="Logout"
        style={{ border: "sold 1 black", marginLeft: 20 }}
      >
        Logout
        <TbLogout size={40}></TbLogout>
      </Nav.Link>
    </Navbar>
  );
}
export default NavbarComponent;
