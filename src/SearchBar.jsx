import React from 'react'
import { useState } from "react";
import "./SearchBar.css";
import "./index.css";


const SearchBar = ({onSearch}) => {
  const[query,setQuery]=useState("");

  const handleSubmit=(e)=>{
    e.preventDefault();
    onSearch(query);
    
  };

  return (
    <form className="search" onSubmit={handleSubmit}>

      <input
        type="text"
        placeholder="Search by category..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button type="submit">
        Search
      </button>

    </form>
  )
}

export default SearchBar;