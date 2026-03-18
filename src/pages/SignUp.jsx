import React from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './SignUp.css';
import { Link } from "react-router-dom";
import axios from "axios";
import API from "../api/axios";

function SignUp(){
    const navigate = useNavigate();

    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");


    const handleSubmit=async(e)=>{
        e.preventDefault();

        const formData={
            name,
            email,
            password
        };
        try{
            const res=await API.post("http://localhost:5000/api/signup",formData);
            console.log(res.data);
            alert("Signup successful!");
            navigate("/login");
        }catch(e){
            console.log(e.response.data);
        }
    }

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <button type="submit">Create Account</button>
        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp