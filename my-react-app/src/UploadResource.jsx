import { useState } from "react";
import axios from "axios";
import "./index.css";

function UploadResource(){

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [dateCreated, setDateCreated] = useState("");
  const [warranty, setWarranty] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [image, setImage] = useState(null);

   const handleSubmit=async (e)=>{
    e.preventDefault();

    const formData=new FormData();
    formData.append("name", name);
    formData.append("desc", desc);
    formData.append("price", price);
    formData.append("dateCreated", dateCreated);
    formData.append("warranty", warranty);
    formData.append("isAvailable", isAvailable);
    

    if (image) {
    formData.append("image", image);
  }

    try{
      await axios.post(
        "http://localhost:5000/api/resources/upload",
        formData
      );

       alert("Resource Uploaded Successfully ✅");

      setName("");
      setDesc("");
      setPrice("");
      setDateCreated("");
      setWarranty("");
      setIsAvailable(false);
      setImage(null);
    }

    catch(e){
      console.error(e);
      alert("Upload Failed ❌");
    }

       
   };




  return (
    <div className="upload-container">
  <h2>Upload Product</h2>

  <form className="upload-form" onSubmit={handleSubmit}>

    <input
      type="text"
      placeholder="Product Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      required
    />

    <textarea
      placeholder="Product Description"
      value={desc}
      onChange={(e) => setDesc(e.target.value)}
      required
    />

    <input
      type="number"
      placeholder="Price"
      value={price}
      onChange={(e) => setPrice(e.target.value)}
      required
    />

    <input
      type="number"
      placeholder="Year Created (e.g. 2024)"
      value={dateCreated}
      onChange={(e) => setDateCreated(e.target.value)}
      required
    />

    <input
      type="number"
      placeholder="Warranty (in months)"
      value={warranty}
      onChange={(e) => setWarranty(e.target.value)}
      required
    />

    <label>
      Available:
      <input
        type="checkbox"
        checked={isAvailable}
        onChange={(e) => setIsAvailable(e.target.checked)}
      />
    </label>

    <label>Upload Product Image</label>
    <input
      type="file"
      onChange={(e) => setImage(e.target.files[0])}
    />

    <button type="submit">
      Upload Product
    </button>

  </form>
</div>
  );
}

export default UploadResource;