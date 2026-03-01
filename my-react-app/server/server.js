import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import Product from "../models/productModel.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================
// MIDDLEWARE
// =====================
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// =====================
// MONGODB CONNECTION
// =====================
mongoose.connect("mongodb://127.0.0.1:27017/resourceDB")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ DB Error:", err));

// =====================
// MULTER CONFIG
// =====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// POST upload resource
app.post("/api/resources/upload", upload.single("image"),
   async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.file);

    // const file = req.files?.file ? req.files.file[0] : null;
    // const image = req.files?.image ? req.files.image[0] : null;


    const newProduct = new Product({
      name: req.body.name,
      desc: req.body.desc,
      price: Number(req.body.price),
      dateCreated: req.body.dateCreated,
      warranty: Number(req.body.warranty),
      isAvailable: req.body.isAvailable,
      image: req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : null,
    });

    await newProduct.save();
    res.json({ message: "Resource uploaded successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
});

//GET RESOURCE
app.get("/api/resources/:id",
  async(req,res)=>{
    try{
    const resource =await Product.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    res.json(resource);
    }
    catch(e){
      console.error(e);
      res.status(500).json({message:"Resource not found"});
    }
  }
);

//GET ALL RESOURCES 
app.get("/api/resources",
  async(req,res)=>{
    try{
    const resources=await Product.find();
    res.json(resources);
    }
    catch(e){
      console.log(e);
      res.status(500).json({ message: "Failed to fetch resources" });
    }
   
});

// UPDATE RESOURCES
app.put("/api/resources/:id",upload.single("image"), async(req,res)=>{
  const {id}=req.params;

  try{
    const updatedData={
      name:req.body.name,
      desc: req.body.desc,
      price: Number(req.body.price),
      dateCreated: req.body.dateCreated,
      warranty: Number(req.body.warranty),
      isAvailable: req.body.isAvailable === "true" || req.body.isAvailable === true
    };

    if(req.file){
      updatedData.image =`http://localhost:5000/uploads/${req.file.filename}`;
    }

    const updatedResource = await Product.findByIdAndUpdate(
      id,
      updatedData,
      { returnDocument: "after" }
    );

    if (!updatedResource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.status(200).json({
      message: "Resource updated successfully",
      resource: updatedResource
    });



  }
  catch(e){
    console.error("Update error:", e);
    res.status(500).json({message:"Server error"});
  }

});

// DELETE RESOURCE
app.delete("/api/resources/:id", async (req, res) =>{
  try{
    const deletedResource= await Product.findByIdAndDelete(req.params.id);
    if(!deletedResource)
      return res.status(400).json({message: "Resource not found" });
    res.status(200).json({ message:"Resource deleted successfully"});

  }
  catch(e){
    console.log(e);
    res.status(500).json({message: "Server error"});
  }
});


app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});