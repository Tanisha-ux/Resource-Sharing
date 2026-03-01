import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./UpdateResource.css";

const UpdateResource = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    price: "",
    dateCreated: "",
    warranty: "",
    isAvailable: false,
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchResource();
  }, [id]);

  const fetchResource = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/resources/${id}`
      );

      const data = res.data;

      setFormData({
        ...data,
        dateCreated: data.dateCreated
          ? data.dateCreated.split("T")[0]
          : "",
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedForm = new FormData();
    for (let key in formData) {
      updatedForm.append(key, formData[key]);
    }

    if (image) {
      updatedForm.append("image", image);
    }

    try {
      await axios.put(
        `http://localhost:5000/api/resources/${id}`,
        updatedForm
      );

      alert("Resource updated successfully!");
      navigate(`/resources/${id}`);
    } catch (e) {
      console.error("Update failed:", e);
    }
  };

  return (
    <div className="edit-container">
      <div className="edit-card">
        <h2>Edit Resource</h2>

        <form onSubmit={handleSubmit}>
          <label>Resource Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Description</label>
          <textarea
            name="desc"
            value={formData.desc}
            onChange={handleChange}
            required
          ></textarea>

          <label>Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <label>Date Created</label>
          <input
            type="text"
            name="dateCreated"
            value={formData.dateCreated}
            onChange={handleChange}
            required
          />

          <label>Warranty (Months)</label>
          <input
            type="number"
            name="warranty"
            value={formData.warranty}
            onChange={handleChange}
            required
          />

          <div className="checkbox-group">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              id="available"
            />
            <label htmlFor="available">Available</label>
          </div>

          <label>Update Image</label>
          <input
            type="file"
            name="image"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <button type="submit" className="update-btn">
            Update Resource
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateResource;