import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';



import { Link } from "react-router-dom";
import "./index.css";

function Header() {


  
  return (
    <header className="header">
      <div className="logo">
        <img src="/sharify.png" alt="sharify"></img>
      </div>

      <Link to="/upload" className="upload">
        Upload Resource
      </Link>
      {/* <Link to="/admin" className="admin">
        Admin Login
      </Link> */}

      <nav>
        <ul className="nav-links">
          <li><a href="#"><FontAwesomeIcon icon={faHome} size="2x" style={{ color: "white" }}/>Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#"><FontAwesomeIcon icon={faHeart} size="2x" style={{ color: "white" }}/></a></li>
          <li><a href="#"><FontAwesomeIcon icon={faCartArrowDown} size="2x" style={{ color: "white" }} />Cart</a></li>
        </ul>
      </nav>

      <Link to="/signup" className="signup-link">
        <button className="btn ">Get Started</button>
      </Link>

      
    </header>
  );
}

export default Header;
