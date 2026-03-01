import './ResourceDetails.css';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

const ResourceDetails=()=>{
  const { id } = useParams();
  const navigate = useNavigate();

  const [resource, setResource] = useState(null);

  useEffect(() => {
    console.log("Resource ID:", id);
    fetchResource();
  }, [id]);

  const fetchResource = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/resources/${id}`);
      console.log(response.data);
      setResource(response.data);
    } catch (error) {
      console.error("Error fetching resource:", error);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    // await fetch(`http://localhost:5000/api/resources/${id}`, {
    //   method: "DELETE",
    // });
    try{
    await axios.delete(`http://localhost:5000/api/resources/${id}`);
    alert("Resource deleted successfully!");
    navigate("/");
    }
    catch(e){
      console.log("Error deleting resource:", e);
    } 
  };

  const handleEdit = () => {
    navigate(`/update/${id}`);
  };

  if (!resource) return <h2>Loading...</h2>;


    return(
        <div className="details-container">
  <div className="details-card">
    <img
      src={resource.image}
      alt={resource.name}
      className="details-image"
    />

    <h1 className="details-title">{resource.name}</h1>
    <p className="details-description">{resource.desc}</p>

    <p><strong>Price:</strong> Rs.{resource.price}</p>
    <p><strong>Warranty:</strong> {resource.warranty}</p>
    <p><strong>Available:</strong> {resource.isAvailable ? "Yes" : "No"}</p>
    <p><strong>Date Created:</strong> {new Date(resource.dateCreated).toLocaleDateString()}</p>

    {resource.reviews && resource.reviews.length > 0 && (
      <div className="reviews-section">
        <h3>Reviews:</h3>
        <ul>
          {resource.reviews.map((review, index) => (
            <li key={index}>
              <strong>{review.user}:</strong> {review.comment} ({review.rating}/5)
            </li>
          ))}
        </ul>
      </div>
    )}

    <div className="details-buttons">
      <button className="edit-btn" onClick={handleEdit}>
        Edit
      </button>

      <button className="delete-btn" onClick={handleDelete}>
        Delete
      </button>
    </div>
  </div>
</div>

    );
} 

export default ResourceDetails;