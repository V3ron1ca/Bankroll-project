import { Link } from "react-router-dom";
import "./navbarStyle.css";
import { removeToken, isAuthrozied } from "../authorization/Token";
import { useNavigate } from "react-router-dom";
import { postAuthorized } from "../authorization/AuthRequests";
import Logo from "./logo";
import { useAuth } from "./AuthContext";
import NavbarBootstrap from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import "./Navbar.css"
import { useState } from "react";



function Navbar() {
const navigate = useNavigate();
const { isLoggedIn, setIsLoggedIn } = useAuth();
const linksWeb = {
  marginTop: "5px",
  marginleft: "5px",
};

const links = {
  "/view-clients": "View Clients",
  "/add-client": "Add Client",
  "/add-service": "Add service",
  "/view-service": "View services",
  "/add-payment": "Add payment",
  "/view-payments": "View payments",
  "/view-reports-clients": "Reports Clients",
  "/view-reports-cash": "Reports Cash",
  "/view-add-taxes": "Taxes",
};


const [isHover, setIsHover] = useState(Array(Object.keys(links).length).fill(false));
const [loginHover, setLoginHover] = useState(false);
const [logoutHover, setLogoutHover] = useState(false);

const handleMouseEnter = (index) => () => {
  setIsHover((prev) => prev.map((value, i) => (i === index ? true : value)));
};

const handleMouseLeave = (index) => () => {
  setIsHover((prev) => prev.map((value, i) => (i === index ? false : value)));
};

const handleLoginMouseEnter = () => {
  setLoginHover(true);
};

const handleLoginMouseLeave = () => {
  setLoginHover(false);
};

const handleLogoutMouseEnter = () => {
  setLogoutHover(true);
};

const handleLogoutMouseLeave = () => {
  setLogoutHover(false);
};


const linkView = {
  fontfamily: "Poppins, sans-serif",
  fontsize: "18px",
  marginleft: "5px",
  textDecoration: "none",
  color: (index) => (isHover[index] ? "white" : "rgba(0, 225, 255, 0.54)"),
};

const navbarS = {
  height: "90px",
 
}

const logout = async () => {
  await postAuthorized("/api/logout", null, () => {});
  removeToken();
  setIsLoggedIn(isAuthrozied());
  navigate("/");
};

return (
  <NavbarBootstrap style={navbarS} bg="dark" expand="lg" variant="dark">
    <Container>
    <NavbarBootstrap.Brand>
    <Logo/>
    </NavbarBootstrap.Brand>
    <NavbarBootstrap.Toggle aria-controls="basic-navbar-nav" />
    <NavbarBootstrap.Collapse id="basic-navbar-nav">
    <Nav style={linksWeb} className="me-auto">
      {isLoggedIn
        ? Object.entries(links).map(([link, title], index) => (
            <Link
              key={link}
              style={{ ...linkView, color: linkView.color(index) }}
              onMouseEnter={handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave(index)}
              className="nav-link2"
              to={link}
            >
              {title}
            </Link>
          ))
          : <Link
          style={{ ...linkView, color: loginHover ? "white" : "rgba(0, 225, 255, 0.54)" }}
          onMouseEnter={handleLoginMouseEnter}
          onMouseLeave={handleLoginMouseLeave}
          className="nav-link2"
          to="/"
        >
          Login <span className="sr-only">Login</span>
        </Link>
    }

    {isLoggedIn ? (
      <Link
        style={{ ...linkView, color: logoutHover ? "white" : "rgba(0, 225, 255, 0.54)" }}
        onMouseEnter={handleLogoutMouseEnter}
        onMouseLeave={handleLogoutMouseLeave}
        className="nav-link2"
        onClick={logout}
      >
        Logout <span className="sr-only">Logout</span>
      </Link>
    ) : null}
    </Nav>
    </NavbarBootstrap.Collapse>
    </Container>
    </NavbarBootstrap>

);
}


export default Navbar;
