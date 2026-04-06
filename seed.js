import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/CategoryModel.js";
import Product from "./models/productModel.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

// 🔹 6 Categories
const categoryData = [
  { name: "Books", description: "Educational books", slug: "books" },
  { name: "Electronics", description: "Devices and gadgets", slug: "electronics" },
  { name: "Furniture", description: "Home and office furniture", slug: "furniture" },
  { name: "Clothing", description: "Fashion and wearables", slug: "clothing" },
  { name: "Courses", description: "Online learning resources", slug: "courses" },
  { name: "Tools", description: "Utility tools and equipment", slug: "tools" },
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected");

    // ❗ Clear old data (optional)
    await Category.deleteMany({});
    await Product.deleteMany({});

    // ✅ Insert categories
    const insertedCategories = await Category.insertMany(categoryData);

    // 🔹 Map slug → _id
    const catMap = {};
    insertedCategories.forEach((cat) => {
      catMap[cat.slug] = cat._id;
    });

    // 🔹 10 Products
    const productData = [
  {
    name: "DSA Notes",
    warranty: 6,
    price: 1500,
    availabilityType: ["rent"], // ✅ FIXED
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=300&fit=crop",
    desc: "Complete handwritten DSA notes",
    category: catMap["books"],
  },
  {
    name: "Operating Systems Book",
    warranty: 7,
    price: 150,
    availabilityType: ["buy"],
    image: "https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?w=400&h=300&fit=crop",
    desc: "Detailed OS concepts book",
    category: catMap["books"],
  },
  {
    name: "Laptop for Rent",
    warranty: 12,
    price: 500,
    availabilityType: ["rent"],
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
    desc: "i5 laptop for short-term usage",
    category: catMap["electronics"],
  },
  {
    name: "Bluetooth Speaker",
    warranty: 6,
    price: 800,
    availabilityType: ["buy"],
    image: "https://images.unsplash.com/photo-1531104985437-603d6490e6d4?w=400&h=300&fit=crop",
    desc: "Portable speaker with good bass",
    category: catMap["electronics"],
  },
  {
    name: "Study Table",
    warranty: 24,
    price: 2000,
    availabilityType: ["rent"],
    image: "https://images.unsplash.com/photo-1603025832572-c5ba1fb6be8b?w=400&h=300&fit=crop",
    desc: "Wooden study table",
    category: catMap["furniture"],
  },
  {
    name: "Office Chair",
    warranty: 18,
    price: 1500,
    availabilityType: ["rent"],
    image: "https://images.unsplash.com/photo-1688578735427-994ecdea3ea4?w=400&h=300&fit=crop",
    desc: "Ergonomic chair for long sitting",
    category: catMap["furniture"],
  },
  {
    name: "Winter Jacket",
    warranty: 3,
    price: 1200,
    availabilityType: ["buy"],
    image: "https://images.unsplash.com/photo-1706765779494-2705542ebe74?w=400&h=300&fit=crop",
    desc: "Warm and stylish jacket",
    category: catMap["clothing"],
  },
  {
    name: "React Course",
    warranty: 0,
    price: 199,
    availabilityType: ["buy"],
    image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400&h=300&fit=crop",
    desc: "Complete React course",
    category: catMap["courses"],
  },
  {
    name: "Java DSA Course",
    warranty: 0,
    price: 299,
    availabilityType: ["buy"],
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=300&fit=crop",
    desc: "Master DSA in Java",
    category: catMap["courses"],
  },
  {
    name: "Tool Kit",
    warranty: 12,
    price: 700,
    availabilityType: ["rent", "buy"], // ✅ BOTH
    image: "https://images.unsplash.com/photo-1454988501794-2992f706932e?w=400&h=300&fit=crop",
    desc: "Complete home repair toolkit",
    category: catMap["tools"],
  },
];

    // ✅ Insert products
    await Product.insertMany(productData);

    console.log("🎉 Seed data inserted successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    process.exit(1);
  }
};

seedDB();