import React from "react";
import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import API from "../api/axios";

import axios from "axios";
import "./Login.css";

function Login() {
  const navigate=useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin=async(e)=>{
    e.preventDefault();
    try{

      const res=await API.post("/api/login",{email,password});
      
      localStorage.setItem("token", res.data.token);

      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
      console.log(res.data);

      // if(res.data.user=="admin"){
      //   navigate("/admin");
      // }else{
      //   navigate("/homepage");
      // }

    }catch(e){
      console.log(e);
    }

  }
  return (
    <div className="login-container">
      <div className="login-box">

        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <button type="submit">Login</button>
          

        </form>

        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;