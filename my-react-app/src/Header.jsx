import React from "react";

import { Link } from "react-router-dom";
import "./index.css";

function Header() {
  return (
    <header className="header">
      <div className="logo">MyWebsite</div>

      <Link to="/upload" className="upload">
        Upload Resource
      </Link>
      <Link to="/admin" className="admin">
        Admin Login
      </Link>

      <nav>
        <ul className="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>

      <button className="btn">Login</button>
    </header>
  );
}

export default Header;
