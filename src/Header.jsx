import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartArrowDown, faHeart, faHome } from "@fortawesome/free-solid-svg-icons";
import "./index.css";

function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  // ✅ Handle login/logout state dynamically
  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkLogin();

    window.addEventListener("login", checkLogin);

    return () => {
      window.removeEventListener("login", checkLogin);
    };
  }, []);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-menu")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    window.dispatchEvent(new Event("login")); // update UI

    setShowDropdown(false);
    navigate("/");
  };

  return (
    <header className="header">
      {/* Logo */}
      <div className="logo">
        <img src="/sharify.png" alt="sharify" />
      </div>

      {/* Upload */}
      <Link to="/upload" className="upload">
        Upload Resource
      </Link>

      {/* Navigation */}
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/">
              <FontAwesomeIcon icon={faHome} size="2x" style={{ color: "white" }} />
              Home
            </Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/wishlist">
              <FontAwesomeIcon icon={faHeart} size="2x" style={{ color: "white" }} />
            </Link>
          </li>
          <li>
            <Link to="/cart">
              <FontAwesomeIcon icon={faCartArrowDown} size="2x" style={{ color: "white" }} />
              Cart
            </Link>
          </li>
        </ul>
      </nav>

      {/* Auth Section */}
      {isLoggedIn ? (
        <div className="profile-menu">
          <div
            className="profile-icon"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            👤
          </div>

          {showDropdown && (
            <div className="dropdown">
              <button onClick={() => navigate("/profile")}>Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      ) : (
        <Link to="/signup">
          <button
            className="btn"
            style={{ backgroundColor: "gray", color: "black" }}
          >
            Get Started
          </button>
        </Link>
      )}
    </header>
  );
}

export default Header;












// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCartArrowDown } from '@fortawesome/free-solid-svg-icons';
// import { faHeart } from '@fortawesome/free-solid-svg-icons';
// import { faHome } from '@fortawesome/free-solid-svg-icons';




// import "./index.css";

// function Header() {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const[isLoggedIn,setIsLoggedIn]=useState(!!localStorage.getItem("token"));
//   const navigate = useNavigate();

//   useEffect(() => {
  
//   const checkLogin = () => {
//     const token = localStorage.getItem("token");
//     setIsLoggedIn(!!token);
//   };

//   checkLogin(); // run on mount

//   window.addEventListener("storage", checkLogin);

//   return () => {
//     window.removeEventListener("storage", checkLogin);
//   };
// }, []);

// useEffect(() => {
//   const handleClickOutside = (e) => {
//     if (!e.target.closest(".profile-menu")) {
//       setShowDropdown(false);
//     }
//   };
//   document.addEventListener("click", handleClickOutside);
//   return () => document.removeEventListener("click", handleClickOutside);
// }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     setIsLoggedIn(false);
//     setShowDropdown(false);
//     navigate("/");
//   };
  
//   return (
//     <header className="header">
//       <div className="logo">
//         <img src="/sharify.png" alt="sharify"></img>
//       </div>

//       <Link to="/upload" className="upload">
//         Upload Resource
//       </Link>
      

//       <nav>
//         <ul className="nav-links">
//           <li><a href="/"><FontAwesomeIcon icon={faHome} size="2x" style={{ color: "white" }}/>Home</a></li>
//           <li><a href="#">About</a></li>
//           <li><a href="#"><FontAwesomeIcon icon={faHeart} size="2x" style={{ color: "white" }}/></a></li>
//           <li><a href="#"><FontAwesomeIcon icon={faCartArrowDown} size="2x" style={{ color: "white" }} />Cart</a></li>
//         </ul>
//       </nav>

//       {isLoggedIn ? (
//         <div className="profile-menu">
//           <div
//             className="profile-icon"
//             onClick={() => setShowDropdown(!showDropdown)}
//           >
//             👤
//           </div>

//           {showDropdown && (
//             <div className="dropdown">
//               <button onClick={handleLogout}>Logout</button>
//             </div>
//           )}
//         </div>
//       ) : (
//         <Link to="/signup">
//           <button 
//           className="btn" 
//           style={{ backgroundColor: "gray", color: "black" }}
//           >
//           Get Started</button>
//         </Link>
//       )}

      

      
//     </header>
//   );
// }

// export default Header;
