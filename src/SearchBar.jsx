import React from 'react'
import { useState } from "react";
import "./SearchBar.css";
import "./index.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';


const SearchBar = ({onSearch}) => {
  const[query,setQuery]=useState("");

  const handleSubmit=(e)=>{
    e.preventDefault();
    onSearch(query);
    
  };

  return (
    <div className="search-div">
    <form className="search" onSubmit={handleSubmit}>

      <input
        type="text"
        placeholder="Search by category..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button type="submit">
      <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" style={{ color: "white" }}/>
        
      </button>

    </form>
    </div>
  )
}

export default SearchBar;