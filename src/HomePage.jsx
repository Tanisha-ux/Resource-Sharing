import React from "react";
import { Link } from "react-router-dom";
import  axios from "axios";
import { useState, useEffect } from "react";
import './index.css';
import SearchBar from "./SearchBar";
import "./SearchBar.css";
import API from "./api/axios";



// import products from './seed.js';

function HomePage(){
    
    const [products, setProducts] = useState([]);

     useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("http://localhost:5000/api/resources"); // GET all resources
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);
    

    const handleSearch=async(query)=>{
      try{
      
        const res=await axios.get(
          `http://localhost:5000/api/resources/filter?q=${query}`
        );

        setProducts(res.data);
      }catch(error){
        console.log(error);
      }
      
    };

    return(
    <>
      <div className="search-wrapper">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className='shop-section'>
        
         
            {products.map((product)=>{
                return(
                <div className='product-card' key={product._id}>
                    <img src={product.image} alt={product.name}></img>
                    <h3>{product.name}</h3>
                    <p className='price'>Rs.{product.price}</p>
                    <p className='description'>{product.desc}</p>

                    <Link to={`/resources/${product._id}`}>
                    <button>View Details</button>
                    </Link>


                    <button>Add to cart</button>
                </div>
                );
            })}
        </div>

      </>
    );
}

export default HomePage;