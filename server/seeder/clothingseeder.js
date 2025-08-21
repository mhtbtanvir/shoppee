// server/seeder/clothingSeeder.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/Product");

dotenv.config({ path: __dirname + "/../.env" }); // ensure correct path

const products = [
  {
    name: "Classic Leather Jacket",
    category: "Men",
    type: "Formal",
    description: "Timeless black leather jacket with premium stitching and comfort fit.",
    price: 249.99,
    discount: 20,
    stock: 15,
    images: ["/uploads/jacket1.jpg", "/uploads/jacket2.jpg"],
    like: 0,
    likedBy: [],
    ratings: { average: 4.5, count: 10 },
    isFeatured: true,
    size: ["M", "L", "XL"],
    color: ["Black"],
    brand: "LeatherCo"
  },
  {
    name: "Denim Blue Jeans",
    category: "Men",
    type: "Casual",
    description: "Slim-fit denim jeans with stretchable material for comfort and style.",
    price: 79.99,
    discount: 10,
    stock: 40,
    images: ["/uploads/jeans1.jpg", "/uploads/jeans2.jpg"],
    like: 0,
    likedBy: [],
    ratings: { average: 4.3, count: 18 },
    isFeatured: true,
    size: ["S", "M", "L", "XL"],
    color: ["Blue"],
    brand: "DenimPro"
  },
  {
    name: "Cotton White T-Shirt",
    category: "Men",
    type: "Casual",
    description: "Soft, breathable cotton t-shirt with a classic fit. Ideal for daily wear.",
    price: 29.99,
    discount: 0,
    stock: 100,
    images: ["/uploads/tshirt1.jpg", "/uploads/tshirt2.jpg"],
    like: 0,
    likedBy: [],
    ratings: { average: 4.6, count: 25 },
    isFeatured: false,
    size: ["S", "M", "L", "XL"],
    color: ["White"],
    brand: "CottonWorld"
  },
  {
    name: "Hooded Sweatshirt",
    category: "Men",
    type: "Casual",
    description: "Cozy hooded sweatshirt with front pocket and adjustable drawstring.",
    price: 59.99,
    discount: 15,
    stock: 50,
    images: ["/uploads/hoodie1.jpg", "/uploads/hoodie2.jpg"],
    like: 0,
    likedBy: [],
    ratings: { average: 4.7, count: 30 },
    isFeatured: false,
    size: ["M", "L", "XL"],
    color: ["Gray", "Black"],
    brand: "SweatCo"
  },
  {
    name: "Summer Dress",
    category: "Women",
    type: "Casual",
    description: "Lightweight summer dress with floral print and comfortable fit.",
    price: 89.99,
    discount: 5,
    stock: 35,
    images: ["/uploads/dress1.jpg", "/uploads/dress2.jpg"],
    like: 0,
    likedBy: [],
    ratings: { average: 4.4, count: 22 },
    isFeatured: true,
    size: ["S", "M", "L"],
    color: ["Red", "Blue", "Yellow"],
    brand: "SunnyStyle"
  },
  {
    name: "Formal Blazer",
    category: "Men",
    type: "Formal",
    description: "Elegant blazer for office or formal events, tailored for a slim fit.",
    price: 199.99,
    discount: 10,
    stock: 20,
    images: ["/uploads/blazer1.jpg", "/uploads/blazer2.jpg"],
    like: 0,
    likedBy: [],
    ratings: { average: 4.5, count: 15 },
    isFeatured: true,
    size: ["M", "L", "XL"],
    color: ["Black", "Navy"],
    brand: "BlazerCorp"
  },
  {
    name: "Casual Polo Shirt",
    category: "Men",
    type: "Casual",
    description: "Comfortable casual polo shirt in multiple colors with classic collar.",
    price: 39.99,
    discount: 0,
    stock: 60,
    images: ["/uploads/polo1.jpg", "/uploads/polo2.jpg"],
    like: 0,
    likedBy: [],
    ratings: { average: 4.2, count: 20 },
    isFeatured: true,
    size: ["S", "M", "L", "XL"],
    color: ["Blue", "Green", "White"],
    brand: "PoloWear"
  },
  {
    name: "Chinos Pants",
    category: "Men",
    type: "Formal",
    description: "Versatile chino pants, perfect for casual and semi-formal outfits.",
    price: 69.99,
    discount: 15,
    stock: 45,
    images: ["/uploads/chinos1.jpg", "/uploads/chinos2.jpg"],
    like: 0,
    likedBy: [],
    ratings: { average: 4.3, count: 18 },
    isFeatured: false,
    size: ["M", "L", "XL"],
    color: ["Khaki", "Beige"],
    brand: "ChinoMasters"
  },
  {
    name: "Black Jacket",
    category: "Men",
    type: "Formal",
    description: "Stylish black jacket, perfect for winter.",
    price: 199.99,
    discount: 10,
    stock: 20,
    images: ["/uploads/black jacket.jpg", "/uploads/jacket.jpg"],
    like: 0,
    likedBy: [],
    ratings: { average: 4.5, count: 12 },
    isFeatured: true,
    size: ["M", "L", "XL"],
    color: ["Black"],
    brand: "WinterWear"
  },
  {
    name: "Jeans 3",
    category: "Men",
    type: "Casual",
    description: "Casual denim jeans, comfortable for daily wear.",
    price: 59.99,
    discount: 0,
    stock: 40,
    images: ["/uploads/jeans3.jpg", "/uploads/jeans4.jpg"],
    like: 0,
    likedBy: [],
    ratings: { average: 4.3, count: 14 },
    isFeatured: false,
    size: ["S", "M", "L"],
    color: ["Blue", "Light Blue"],
    brand: "DenimPro"
  },
  {
    name: "Polo Shirt 3",
    category: "Men",
    type: "Casual",
    description: "Trendy polo shirt in various colors.",
    price: 45.99,
    discount: 5,
    stock: 30,
    images: ["/uploads/polo3.jpg", "/uploads/polo4.jpg"],
    like: 0,
    likedBy: [],
    ratings: { average: 4.4, count: 10 },
    isFeatured: false,
    size: ["S", "M", "L", "XL"],
    color: ["Red", "Blue", "White"],
    brand: "PoloWear"
  },
  {
    name: "Sweater",
    category: "Men",
    type: "Casual",
    description: "Warm knitted sweater, perfect for chilly days.",
    price: 59.99,
    discount: 15,
    stock: 25,
    images: ["/uploads/sweter.jpg"],
    like: 0,
    likedBy: [],
    ratings: { average: 4.5, count: 18 },
    isFeatured: true,
    size: ["M", "L", "XL"],
    color: ["Gray", "Navy"],
    brand: "KnitsCo"
  }
];




const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected for seeding...");

    await Product.deleteMany(); // Clear existing products
    await Product.insertMany(products);

    console.log("✅ Clothing products imported successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error importing products:", err);
    process.exit(1);
  }
};

importData();
