import { useState,useEffect } from "react";
import axios from "axios";
import "./index.css";
import API from "./api/axios";



function UploadResource(){

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [dateCreated, setDateCreated] = useState("");
  const [warranty, setWarranty] = useState("");
  const [isAvailable, setIsAvailable] = useState("");
  const [categories, setCategories] = useState([]);
  const [category,setCategory]= useState("");
  const [image, setImage] = useState(null);


  useEffect(() => {
  axios
    .get("http://localhost:5000/api/categories")
    .then((res) => setCategories(res.data))
    .catch((err) => console.log(err));
  }, []);


   const handleSubmit=async (e)=>{
    e.preventDefault();

    const formData=new FormData();
    formData.append("name", name);
    formData.append("desc", desc);
    formData.append("price", price);
    formData.append("dateCreated", dateCreated);
    formData.append("warranty", warranty);
    formData.append("isAvailable", isAvailable);
    formData.append("category",category);
    

    if (image) {
    formData.append("image", image);
  }

    try{
      await API.post(
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
      setCategory("");
      setImage(null);
    }

    catch(e){
      console.error(e);
      alert("Upload Failed ❌");
    }

       
   };




  return (
    <div className="upload-container">
    {/* <h2>Upload Product</h2> */}

  <form className="upload-form" onSubmit={handleSubmit}>
  <h2 className="upload-title">
      Upload <span>Product</span>
    </h2>

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
      type="date"
      placeholder="Year Created "
      value={dateCreated}
      onChange={(e) => setDateCreated(e.target.value)}
      required
    />

    

    <select value={category} onChange={(e)=>setCategory(e.target.value)} required>

      <option value="">Select Category</option>

        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
          {cat.name}
      </option>
      ))}

    </select>



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

