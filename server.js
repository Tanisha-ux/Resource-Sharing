import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import Product from "./models/productModel.js";
import Category from "./models/CategoryModel.js";
import User from "./models/UserModel.js";
import crypto from "crypto"; 
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
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



const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    if (user.status === "blocked") {
      return res.status(403).json({ message: "Account blocked by admin" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role,
    });

  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Login failed" });
  }
});



// FORGOT PASSWORD
app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;

  console.log("📩 Request received for:", email);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ No user found");
      return res.status(200).json({ message: "Reset link sent if email exists" });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${token}`;
    console.log("🔗 Reset URL:", resetUrl);

    // 🔍 CHECK ENV
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

    console.log("⚙️ Creating transporter...");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log("✅ Transporter created");

    // 🔍 VERIFY CONNECTION
    await transporter.verify();
    console.log("✅ SMTP server is ready");

    console.log("📤 Sending email...");

    const info = await transporter.sendMail({
      from: `"ResoShare" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset",
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`
    });

    console.log("🎉 EMAIL SENT:", info);

    res.status(200).json({ message: "Reset link sent if email exists" });

  } catch (err) {
    console.log("❌ ERROR OCCURRED:");
    console.log(err);
    console.log("MESSAGE:", err.message);
  }
});



//Reset password
app.post("/api/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Token invalid or expired" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    // Clear token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});