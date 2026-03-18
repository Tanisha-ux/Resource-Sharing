import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import Product from "../models/productModel.js";
import Category from "../models/CategoryModel.js";
import User from "../models/UserModel.js";
const JWT_SECRET = process.env.JWT_SECRET;

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
mongoose.connect(process.env.MONGO_URI)
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



const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach user data
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};



const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};

// POST upload resource
app.post("/api/resources/upload",verifyToken,upload.single("image"),
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
      
      dateCreated: new Date(req.body.dateCreated),
      warranty: Number(req.body.warranty),
      isAvailable: req.body.isAvailable,
      category: req.body.category,
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


// FILTERING 
app.get("/api/resources/filter",
  async(req,res)=>{
    try {

    const { q } = req.query;

    // find category by name
    const category = await Category.findOne({
      name: { $regex: q, $options: "i" }
    });

    if (!category) {
      return res.json([]);
    }

    // find products with that category id
    const products = await Product.find({
      category: category._id
    }).populate("category");

    res.json(products);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Search failed" });
  }
  }
);

//GET RESOURCE
app.get("/api/resources/:id",
  async(req,res)=>{
    try{
    const resource =await Product.findById(req.params.id).populate("category");
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


app.get("/api/categories", async (req,res)=>{
  try{
    const categories = await Category.find();
    res.json(categories);
  }
  catch(e){
    console.error(e);
    res.status(500).json({message:"Error fetching categories"});
  }
});

// DELETE RESOURCE
app.delete("/api/resources/:id",verifyToken,isAdmin, async (req, res) =>{
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

// =====================
// USER SIGNUP
// =====================

app.post("/api/signup",async(req,res)=>{
  try{
    const{name,email,password}=req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

     const user=new User({
      name,
      email,
      password,
      role:"user",
      status:"active"
     });

     await user.save();
     res.json({Message:"User registered successfully"});
  }catch(e){
    console.log(e);
    res.status(500).json({Message:"Signup failed"});
  }
});

app.post("/api/login",async(req,res)=>{
  try{
    const{email,password}=req.body;

    const user=await User.findOne({email});

    if(!user){
      
      return res.status(400).json({ message: "User not found" });
    }

    

    if(user.password!=password){
      
      return res.status(400).json({ message: "Invalid password" });
    }



    if (user.status === "blocked") {
      
      return res.status(403).json({ message: "Account blocked by admin" });
    }

    const token=jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message:"Login successful",
      token,
      role: user.role,
      // userId: user._id
    });

  }catch(e){
    console.log(e);
    res.status(500).json({Message:"Login failed"});
  }
})


app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});